import 'package:json_annotation/json_annotation.dart';

part 'dashboard_stats.g.dart';

@JsonSerializable()
class DashboardStats {
  @JsonKey(name: 'total')
  final int totalWarranties;
  
  @JsonKey(name: 'expiring')
  final int expiringSoon;
  
  @JsonKey(name: 'active')
  final int activeWarranties;
  
  @JsonKey(name: 'expired')
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