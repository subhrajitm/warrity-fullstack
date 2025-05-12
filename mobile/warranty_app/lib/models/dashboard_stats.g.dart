// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_stats.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DashboardStats _$DashboardStatsFromJson(Map<String, dynamic> json) =>
    DashboardStats(
      totalWarranties: (json['total'] as num).toInt(),
      expiringSoon: (json['expiring'] as num).toInt(),
      activeWarranties: (json['active'] as num).toInt(),
      expiredWarranties: (json['expired'] as num).toInt(),
    );

Map<String, dynamic> _$DashboardStatsToJson(DashboardStats instance) =>
    <String, dynamic>{
      'total': instance.totalWarranties,
      'expiring': instance.expiringSoon,
      'active': instance.activeWarranties,
      'expired': instance.expiredWarranties,
    };
