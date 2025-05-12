import 'package:json_annotation/json_annotation.dart';

part 'dashboard_stats.g.dart';

@JsonSerializable()
class DashboardStats {
  final int totalWarranties;
  final int expiringSoon;
  final int activeWarranties;
  final int expiredWarranties;

  DashboardStats({
    required this.totalWarranties,
    required this.expiringSoon,
    required this.activeWarranties,
    required this.expiredWarranties,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) => _$DashboardStatsFromJson(json);
  Map<String, dynamic> toJson() => _$DashboardStatsToJson(this);
} 