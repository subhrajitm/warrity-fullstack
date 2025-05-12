// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_stats.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DashboardStats _$DashboardStatsFromJson(Map<String, dynamic> json) =>
    DashboardStats(
      totalWarranties: (json['totalWarranties'] as num).toInt(),
      expiringSoon: (json['expiringSoon'] as num).toInt(),
      activeWarranties: (json['activeWarranties'] as num).toInt(),
      expiredWarranties: (json['expiredWarranties'] as num).toInt(),
    );

Map<String, dynamic> _$DashboardStatsToJson(DashboardStats instance) =>
    <String, dynamic>{
      'totalWarranties': instance.totalWarranties,
      'expiringSoon': instance.expiringSoon,
      'activeWarranties': instance.activeWarranties,
      'expiredWarranties': instance.expiredWarranties,
    };
