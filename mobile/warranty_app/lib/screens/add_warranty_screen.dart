import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/warranty.dart';

class AddWarrantyScreen extends StatefulWidget {
  const AddWarrantyScreen({super.key});

  @override
  State<AddWarrantyScreen> createState() => _AddWarrantyScreenState();
}

class _AddWarrantyScreenState extends State<AddWarrantyScreen> {
  final _formKey = GlobalKey<FormState>();
  final _productNameController = TextEditingController();
  final _productBrandController = TextEditingController();
  final _serialNumberController = TextEditingController();
  final _purchaseDateController = TextEditingController();
  final _expiryDateController = TextEditingController();
  final _warrantyTypeController = TextEditingController();
  final _notesController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _productNameController.dispose();
    _productBrandController.dispose();
    _serialNumberController.dispose();
    _purchaseDateController.dispose();
    _expiryDateController.dispose();
    _warrantyTypeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      controller.text = DateFormat('yyyy-MM-dd').format(picked);
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final warranty = Warranty(
        id: '', // This will be set by the server
        productName: _productNameController.text,
        productBrand: _productBrandController.text,
        serialNumber: _serialNumberController.text,
        purchaseDate: DateFormat('yyyy-MM-dd').parse(_purchaseDateController.text),
        expiryDate: DateFormat('yyyy-MM-dd').parse(_expiryDateController.text),
        warrantyType: _warrantyTypeController.text,
        notes: _notesController.text,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        status: 'active',
      );

      await apiService.createWarranty(warranty);
      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error adding warranty: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Warranty'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _productNameController,
              decoration: const InputDecoration(
                labelText: 'Product Name',
                hintText: 'Enter product name',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter product name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _productBrandController,
              decoration: const InputDecoration(
                labelText: 'Brand',
                hintText: 'Enter brand name',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter brand name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _serialNumberController,
              decoration: const InputDecoration(
                labelText: 'Serial Number',
                hintText: 'Enter serial number',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter serial number';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _purchaseDateController,
              decoration: const InputDecoration(
                labelText: 'Purchase Date',
                hintText: 'Select purchase date',
                suffixIcon: Icon(Icons.calendar_today),
              ),
              readOnly: true,
              onTap: () => _selectDate(context, _purchaseDateController),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select purchase date';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _expiryDateController,
              decoration: const InputDecoration(
                labelText: 'Expiry Date',
                hintText: 'Select expiry date',
                suffixIcon: Icon(Icons.calendar_today),
              ),
              readOnly: true,
              onTap: () => _selectDate(context, _expiryDateController),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select expiry date';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _warrantyTypeController,
              decoration: const InputDecoration(
                labelText: 'Warranty Type',
                hintText: 'Enter warranty type',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter warranty type';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes',
                hintText: 'Enter any additional notes',
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _isLoading ? null : _submitForm,
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                      ),
                    )
                  : const Text('Add Warranty'),
            ),
          ],
        ),
      ),
    );
  }
} 