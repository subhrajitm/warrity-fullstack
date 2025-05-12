import 'package:json_annotation/json_annotation.dart';

part 'warranty.g.dart';

@JsonSerializable()
class Warranty {
  @JsonKey(name: '_id')  // MongoDB uses _id
  final String id;
  
  @JsonKey(name: 'productName', defaultValue: 'Unknown Product')
  final String productName;
  
  @JsonKey(name: 'productBrand', defaultValue: 'Unknown Brand')
  final String productBrand;
  
  @JsonKey(name: 'productModel')
  final String? productModel;
  
  @JsonKey(name: 'serialNumber')
  final String? serialNumber;
  
  @JsonKey(name: 'purchaseDate')
  final DateTime purchaseDate;
  
  @JsonKey(name: 'expirationDate')  // API uses expirationDate instead of expiryDate
  final DateTime expiryDate;
  
  @JsonKey(name: 'purchaseProof')
  final String? purchaseProof;
  
  @JsonKey(name: 'warrantyDocument')
  final String? warrantyDocument;
  
  @JsonKey(name: 'notes')
  final String? notes;
  
  @JsonKey(name: 'createdAt')
  final DateTime createdAt;
  
  @JsonKey(name: 'updatedAt')
  final DateTime updatedAt;

  Warranty({
    required this.id,
    required this.productName,
    required this.productBrand,
    this.productModel,
    this.serialNumber,
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