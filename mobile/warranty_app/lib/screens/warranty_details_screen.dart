import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/warranty.dart';
import '../screens/submit_claim_screen.dart';

class WarrantyDetailsScreen extends StatefulWidget {
  final Warranty warranty;

  const WarrantyDetailsScreen({
    super.key,
    required this.warranty,
  });

  @override
  State<WarrantyDetailsScreen> createState() => _WarrantyDetailsScreenState();
}

class _WarrantyDetailsScreenState extends State<WarrantyDetailsScreen> {
  bool _isLoading = false;

  Future<void> _deleteWarranty() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Warranty'),
        content: const Text('Are you sure you want to delete this warranty?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() => _isLoading = true);

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      await apiService.deleteWarranty(widget.warranty.id);
      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error deleting warranty: ${e.toString()}'),
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

  Future<void> _submitClaim() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SubmitClaimScreen(warranty: widget.warranty),
      ),
    );

    if (result == true && mounted) {
      // Refresh the warranty details if claim was submitted successfully
      // TODO: Implement refresh functionality
    }
  }

  @override
  Widget build(BuildContext context) {
    final daysLeft = widget.warranty.expiryDate.difference(DateTime.now()).inDays;
    final isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;
    final isExpired = daysLeft < 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Warranty Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Navigate to edit warranty screen
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: _isLoading ? null : _deleteWarranty,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.warranty.productName,
                                    style: Theme.of(context).textTheme.titleLarge,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    widget.warranty.productBrand,
                                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                                        ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: isExpired
                                    ? Theme.of(context).colorScheme.error.withOpacity(0.1)
                                    : isExpiringSoon
                                        ? Colors.orange.withOpacity(0.1)
                                        : Theme.of(context).colorScheme.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                isExpired
                                    ? 'Expired'
                                    : isExpiringSoon
                                        ? '$daysLeft days left'
                                        : 'Active',
                                style: TextStyle(
                                  color: isExpired
                                      ? Theme.of(context).colorScheme.error
                                      : isExpiringSoon
                                          ? Colors.orange
                                          : Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Details',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 16),
                        _DetailItem(
                          icon: Icons.numbers,
                          label: 'Serial Number',
                          value: widget.warranty.serialNumber ?? 'N/A',
                        ),
                        const SizedBox(height: 12),
                        _DetailItem(
                          icon: Icons.calendar_today,
                          label: 'Purchase Date',
                          value: DateFormat('MMMM d, y').format(widget.warranty.purchaseDate),
                        ),
                        const SizedBox(height: 12),
                        _DetailItem(
                          icon: Icons.event,
                          label: 'Expiry Date',
                          value: DateFormat('MMMM d, y').format(widget.warranty.expiryDate),
                        ),
                        const SizedBox(height: 12),
                        _DetailItem(
                          icon: Icons.category,
                          label: 'Warranty Type',
                          value: widget.warranty.warrantyType,
                        ),
                      ],
                    ),
                  ),
                ),
                if (widget.warranty.notes?.isNotEmpty ?? false) ...[
                  const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Notes',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(widget.warranty.notes ?? ''),
                        ],
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                if (!isExpired)
                  FilledButton.icon(
                    onPressed: _submitClaim,
                    icon: const Icon(Icons.assignment),
                    label: const Text('Submit Claim'),
                  ),
              ],
            ),
    );
  }
}

class _DetailItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(
          icon,
          size: 20,
          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
              ),
              Text(
                value,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
              ),
            ],
          ),
        ),
      ],
    );
  }
} 