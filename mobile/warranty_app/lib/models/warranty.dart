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
  
  @JsonKey(name: 'warrantyType', defaultValue: 'Standard')
  final String warrantyType;

  @JsonKey(name: 'status', defaultValue: 'active')
  final String status;

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
    required this.warrantyType,
    required this.status,
  });

  factory Warranty.fromJson(Map<String, dynamic> json) {
    // Handle both MongoDB _id and regular id
    final id = json['_id'] ?? json['id'];
    if (id == null) {
      throw Exception('Warranty ID is required');
    }

    // Handle date fields with null safety
    DateTime parseDate(String? dateStr) {
      if (dateStr == null) {
        throw Exception('Date field is required');
      }
      try {
        return DateTime.parse(dateStr);
      } catch (e) {
        throw Exception('Invalid date format: $dateStr');
      }
    }

    return Warranty(
      id: id.toString(),
      productName: json['productName'] as String? ?? 'Unknown Product',
      productBrand: json['productBrand'] as String? ?? 'Unknown Brand',
      productModel: json['productModel'] as String?,
      serialNumber: json['serialNumber'] as String?,
      purchaseDate: parseDate(json['purchaseDate'] as String?),
      expiryDate: parseDate(json['expirationDate'] as String?),
      purchaseProof: json['purchaseProof'] as String?,
      warrantyDocument: json['warrantyDocument'] as String?,
      notes: json['notes'] as String?,
      createdAt: parseDate(json['createdAt'] as String?),
      updatedAt: parseDate(json['updatedAt'] as String?),
      warrantyType: json['warrantyType'] as String? ?? 'Standard',
      status: json['status'] as String? ?? 'active',
    );
  }

  Map<String, dynamic> toJson() => _$WarrantyToJson(this);

  Warranty copyWith({
    String? id,
    String? productName,
    String? productBrand,
    String? productModel,
    String? serialNumber,
    DateTime? purchaseDate,
    DateTime? expiryDate,
    String? purchaseProof,
    String? warrantyDocument,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? warrantyType,
    String? status,
  }) {
    return Warranty(
      id: id ?? this.id,
      productName: productName ?? this.productName,
      productBrand: productBrand ?? this.productBrand,
      productModel: productModel ?? this.productModel,
      serialNumber: serialNumber ?? this.serialNumber,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      expiryDate: expiryDate ?? this.expiryDate,
      purchaseProof: purchaseProof ?? this.purchaseProof,
      warrantyDocument: warrantyDocument ?? this.warrantyDocument,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      warrantyType: warrantyType ?? this.warrantyType,
      status: status ?? this.status,
    );
  }
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