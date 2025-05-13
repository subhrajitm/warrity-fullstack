import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/warranty.dart';

class WarrantyCard extends StatelessWidget {
  final Warranty warranty;
  final VoidCallback? onTap;

  const WarrantyCard({
    super.key,
    required this.warranty,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final daysLeft = warranty.expiryDate.difference(DateTime.now()).inDays;
    final isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;
    final isExpired = daysLeft < 0;

    // Use the status from the warranty model
    final status = warranty.status;
    final statusColor = status == 'active' 
        ? Colors.green 
        : status == 'expiring' 
            ? Colors.orange 
            : Colors.red;

    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      warranty.productName,
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: statusColor),
                    ),
                    child: Text(
                      status.toUpperCase(),
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                warranty.productBrand,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.secondary,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Expires: ${DateFormat('MMM d, y').format(warranty.expiryDate)}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  Text(
                    '${daysLeft.abs()} days ${isExpired ? 'overdue' : 'left'}',
                    style: TextStyle(
                      color: isExpired ? Colors.red : isExpiringSoon ? Colors.orange : Colors.green,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoItem({
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
          size: 16,
          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
        ),
        const SizedBox(width: 8),
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