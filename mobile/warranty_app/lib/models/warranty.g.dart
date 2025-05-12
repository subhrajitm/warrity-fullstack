// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'warranty.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Warranty _$WarrantyFromJson(Map<String, dynamic> json) => Warranty(
      id: json['id'] as String,
      productName: json['productName'] as String,
      productBrand: json['productBrand'] as String,
      productModel: json['productModel'] as String,
      serialNumber: json['serialNumber'] as String,
      purchaseDate: DateTime.parse(json['purchaseDate'] as String),
      expiryDate: DateTime.parse(json['expiryDate'] as String),
      purchaseProof: json['purchaseProof'] as String?,
      warrantyDocument: json['warrantyDocument'] as String?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$WarrantyToJson(Warranty instance) => <String, dynamic>{
      'id': instance.id,
      'productName': instance.productName,
      'productBrand': instance.productBrand,
      'productModel': instance.productModel,
      'serialNumber': instance.serialNumber,
      'purchaseDate': instance.purchaseDate.toIso8601String(),
      'expiryDate': instance.expiryDate.toIso8601String(),
      'purchaseProof': instance.purchaseProof,
      'warrantyDocument': instance.warrantyDocument,
      'notes': instance.notes,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
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
