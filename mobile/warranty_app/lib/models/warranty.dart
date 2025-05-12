import 'package:json_annotation/json_annotation.dart';

part 'warranty.g.dart';

@JsonSerializable()
class Warranty {
  final String id;
  final String productName;
  final String productBrand;
  final String productModel;
  final String serialNumber;
  final DateTime purchaseDate;
  final DateTime expiryDate;
  final String? purchaseProof;
  final String? warrantyDocument;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Warranty({
    required this.id,
    required this.productName,
    required this.productBrand,
    required this.productModel,
    required this.serialNumber,
    required this.purchaseDate,
    required this.expiryDate,
    this.purchaseProof,
    this.warrantyDocument,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Warranty.fromJson(Map<String, dynamic> json) => _$WarrantyFromJson(json);
  Map<String, dynamic> toJson() => _$WarrantyToJson(this);
}

@JsonSerializable()
class WarrantyDocument {
  final String name;
  final String url;

  WarrantyDocument({
    required this.name,
    required this.url,
  });

  factory WarrantyDocument.fromJson(Map<String, dynamic> json) => _$WarrantyDocumentFromJson(json);
  Map<String, dynamic> toJson() => _$WarrantyDocumentToJson(this);
} 