import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

export class WarrityStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'WarrityVPC', {
      maxAzs: 2,
      natGateways: 1
    });

    // S3 Bucket for uploads
    const uploadsBucket = new s3.Bucket(this, 'WarrityUploads', {
      bucketName: 'warrity-uploads',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [{
        allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
        allowedOrigins: ['https://warrity.com', 'https://api.warrity.com'],
        allowedHeaders: ['*']
      }]
    });

    // CloudFront distribution for uploads
    const uploadsDistribution = new cloudfront.Distribution(this, 'WarrityUploadsDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(uploadsBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD
      },
      domainNames: ['uploads.warrity.com']
    });

    // RDS Database
    const dbCluster = new rds.DatabaseCluster(this, 'WarrityDatabase', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_6
      }),
      instanceProps: {
        vpc,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)
      },
      instances: 2,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT
    });

    // Redis Cache
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'WarrityRedisSubnetGroup', {
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
      description: 'Subnet group for Warrity Redis cluster'
    });

    const redisCluster = new elasticache.CfnCacheCluster(this, 'WarrityRedis', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup]
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'WarrityCluster', {
      vpc,
      containerInsights: true
    });

    // API Service
    const apiService = new ecs.FargateService(this, 'WarrityApiService', {
      cluster,
      taskDefinition: new ecs.FargateTaskDefinition(this, 'ApiTaskDef', {
        memoryLimitMiB: 1024,
        cpu: 512
      }),
      desiredCount: 2,
      assignPublicIp: false
    });

    // Route 53 Records
    const zone = route53.HostedZone.fromLookup(this, 'WarrityZone', {
      domainName: 'warrity.com'
    });

    new route53.ARecord(this, 'WarrityApiRecord', {
      zone,
      recordName: 'api.warrity.com',
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(apiService.loadBalancer)
      )
    });

    new route53.ARecord(this, 'WarrityUploadsRecord', {
      zone,
      recordName: 'uploads.warrity.com',
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(uploadsDistribution)
      )
    });

    // Outputs
    new cdk.CfnOutput(this, 'UploadsBucketName', {
      value: uploadsBucket.bucketName
    });

    new cdk.CfnOutput(this, 'UploadsDistributionDomain', {
      value: uploadsDistribution.distributionDomainName
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: dbCluster.clusterEndpoint.hostname
    });

    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: redisCluster.attrRedisEndpointAddress
    });
  }
} 