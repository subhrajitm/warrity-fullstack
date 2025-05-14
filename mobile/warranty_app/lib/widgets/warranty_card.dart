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
    final colorScheme = Theme.of(context).colorScheme;
    final daysLeft = warranty.expiryDate.difference(DateTime.now()).inDays;
    final isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;
    final isExpired = daysLeft < 0;

    // Use the status from the warranty model
    final status = warranty.status;
    final statusColor = status == 'active' 
        ? colorScheme.primary 
        : status == 'expiring' 
            ? colorScheme.tertiary 
            : colorScheme.error;

    return Card(
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
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
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: statusColor.withOpacity(0.5)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          status == 'active' 
                              ? Icons.check_circle_rounded
                              : status == 'expiring'
                                  ? Icons.warning_rounded
                                  : Icons.error_rounded,
                          size: 16,
                          color: statusColor,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          status.toUpperCase(),
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                warranty.productBrand,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today_rounded,
                        size: 16,
                        color: colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        DateFormat('MMM d, y').format(warranty.expiryDate),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isExpired 
                          ? colorScheme.errorContainer
                          : isExpiringSoon
                              ? colorScheme.tertiaryContainer
                              : colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isExpired
                              ? Icons.error_rounded
                              : isExpiringSoon
                                  ? Icons.warning_rounded
                                  : Icons.timer_rounded,
                          size: 16,
                          color: isExpired
                              ? colorScheme.error
                              : isExpiringSoon
                                  ? colorScheme.tertiary
                                  : colorScheme.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${daysLeft.abs()} days ${isExpired ? 'overdue' : 'left'}',
                          style: TextStyle(
                            color: isExpired
                                ? colorScheme.error
                                : isExpiringSoon
                                    ? colorScheme.tertiary
                                    : colorScheme.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
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
    final colorScheme = Theme.of(context).colorScheme;
    
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: colorScheme.onSurfaceVariant,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
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