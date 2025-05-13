import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/warranty.dart';
import '../models/dashboard_stats.dart';
import '../widgets/stats_card.dart';
import '../widgets/quick_actions_card.dart';
import '../widgets/warranty_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  String? _error;
  DashboardStats? _stats;
  List<Warranty> _expiringWarranties = [];
  List<Warranty> _recentWarranties = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final stats = await apiService.getDashboardStats();
      final expiring = await apiService.getExpiringWarranties();
      final recent = await apiService.getRecentWarranties();

      if (!mounted) return;

      setState(() {
        _stats = stats;
        _expiringWarranties = expiring;
        _recentWarranties = recent;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final apiService = Provider.of<ApiService>(context, listen: false);
              await apiService.logout();
              if (mounted) {
                Navigator.pushReplacementNamed(context, '/');
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _error!,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      FilledButton.icon(
                        onPressed: _loadData,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadData,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // Stats Section
                      if (_stats != null) ...[
                        Text(
                          'Overview',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: StatsCard(
                                title: 'Total Warranties',
                                value: _stats!.totalWarranties.toString(),
                                icon: Icons.inventory_2,
                                color: Colors.blue,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: StatsCard(
                                title: 'Expiring Soon',
                                value: _stats!.expiringSoon.toString(),
                                icon: Icons.warning,
                                color: Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Quick Actions
                      Text(
                        'Quick Actions',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      const QuickActionsCard(),
                      const SizedBox(height: 24),

                      // Expiring Warranties
                      if (_expiringWarranties.isNotEmpty) ...[
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Expiring Soon',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            TextButton(
                              onPressed: () {
                                // Navigate to all warranties screen
                              },
                              child: const Text('View All'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ..._expiringWarranties.map((warranty) => Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: WarrantyCard(warranty: warranty),
                            )),
                        const SizedBox(height: 24),
                      ],

                      // Recent Warranties
                      if (_recentWarranties.isNotEmpty) ...[
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Recent Warranties',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            TextButton(
                              onPressed: () {
                                // Navigate to all warranties screen
                              },
                              child: const Text('View All'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ..._recentWarranties.map((warranty) => Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: WarrantyCard(warranty: warranty),
                            )),
                      ],
                    ],
                  ),
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Navigate to add warranty screen
        },
        icon: const Icon(Icons.add),
        label: const Text('Add Warranty'),
      ),
    );
  }
} 