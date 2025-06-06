import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/warranty.dart';
import '../models/dashboard_stats.dart';
import '../widgets/stats_card.dart';
import '../widgets/quick_actions_card.dart';
import '../widgets/warranty_card.dart';
import '../screens/notifications_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with SingleTickerProviderStateMixin {
  bool _isLoading = true;
  String? _error;
  DashboardStats? _stats;
  List<Warranty> _expiringWarranties = [];
  List<Warranty> _recentWarranties = [];
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );
    _loadData();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
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
      _animationController.forward();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  void _showAddWarrantyModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.9,
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Add New Warranty',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ),
            // Add warranty form will go here
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const NotificationsScreen(),
                ),
              );
            },
          ),
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
              : FadeTransition(
                  opacity: _fadeAnimation,
                  child: RefreshIndicator(
                    onRefresh: _loadData,
                    child: CustomScrollView(
                      slivers: [
                        SliverPadding(
                          padding: const EdgeInsets.all(16),
                          sliver: SliverList(
                            delegate: SliverChildListDelegate([
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
                                      child: WarrantyCard(
                                        warranty: warranty,
                                        onTap: () {
                                          Navigator.pushNamed(
                                            context,
                                            '/warranty-details',
                                            arguments: {'warranty': warranty},
                                          );
                                        },
                                      ),
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
                                      child: WarrantyCard(
                                        warranty: warranty,
                                        onTap: () {
                                          Navigator.pushNamed(
                                            context,
                                            '/warranty-details',
                                            arguments: {'warranty': warranty},
                                          );
                                        },
                                      ),
                                    )),
                              ],
                            ]),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddWarrantyModal,
        icon: const Icon(Icons.add),
        label: const Text('Add Warranty'),
      ),
    );
  }
} 