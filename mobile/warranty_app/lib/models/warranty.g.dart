// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'warranty.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Warranty _$WarrantyFromJson(Map<String, dynamic> json) => Warranty(
      id: json['_id'] as String,
      productName: json['productName'] as String? ?? 'Unknown Product',
      productBrand: json['productBrand'] as String? ?? 'Unknown Brand',
      productModel: json['productModel'] as String?,
      serialNumber: json['serialNumber'] as String?,
      purchaseDate: DateTime.parse(json['purchaseDate'] as String),
      expiryDate: DateTime.parse(json['expirationDate'] as String),
      purchaseProof: json['purchaseProof'] as String?,
      warrantyDocument: json['warrantyDocument'] as String?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      warrantyType: json['warrantyType'] as String? ?? 'Standard',
      status: json['status'] as String? ?? 'active',
    );

Map<String, dynamic> _$WarrantyToJson(Warranty instance) => <String, dynamic>{
      '_id': instance.id,
      'productName': instance.productName,
      'productBrand': instance.productBrand,
      'productModel': instance.productModel,
      'serialNumber': instance.serialNumber,
      'purchaseDate': instance.purchaseDate.toIso8601String(),
      'expirationDate': instance.expiryDate.toIso8601String(),
      'purchaseProof': instance.purchaseProof,
      'warrantyDocument': instance.warrantyDocument,
      'notes': instance.notes,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'warrantyType': instance.warrantyType,
      'status': instance.status,
    };

WarrantyDocument _$WarrantyDocumentFromJson(Map<String, dynamic> json) =>
    WarrantyDocument(
      name: json['name'] as String,
      url: json['url'] as String,
    );

Map<String, dynamic> _$WarrantyDocumentToJson(WarrantyDocument instance) =>
    <String, dynamic>{
      'name': instance.name,
      'url': instance.url,
    };
