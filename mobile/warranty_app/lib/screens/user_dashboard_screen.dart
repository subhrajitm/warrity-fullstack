import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/warranty.dart';
import '../services/api_service.dart';
import '../widgets/warranty_card.dart';
import '../widgets/stats_card.dart';
import '../widgets/quick_actions_card.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  State<UserDashboardScreen> createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  late Future<void> _loadData;
  List<Warranty> _warranties = [];
  List<Warranty> _expiringWarranties = [];
  DashboardStats? _stats;

  @override
  void initState() {
    super.initState();
    _loadData = _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final warranties = await apiService.getAllWarranties();
      final expiringWarranties = await apiService.getExpiringWarranties();
      final stats = await apiService.getWarrantyStats();

      setState(() {
        _warranties = warranties;
        _expiringWarranties = expiringWarranties;
        _stats = stats;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading data: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _fetchData,
        child: FutureBuilder(
          future: _loadData,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(
                child: Text('Error: ${snapshot.error}'),
              );
            }

            return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Cards
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 16.0,
                    crossAxisSpacing: 16.0,
                    children: [
                      StatsCard(
                        title: 'Total Warranties',
                        value: _stats?.total.toString() ?? '0',
                        icon: Icons.inventory_2,
                        color: Colors.blue,
                      ),
                      StatsCard(
                        title: 'Expiring Soon',
                        value: _stats?.expiring.toString() ?? '0',
                        icon: Icons.timer,
                        color: Colors.orange,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24.0),

                  // Quick Actions
                  QuickActionsCard(
                    onAddWarranty: () {
                      Navigator.pushNamed(context, '/warranties/add');
                    },
                  ),
                  const SizedBox(height: 24.0),

                  // Expiring Warranties
                  Text(
                    'Expiring Soon',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16.0),
                  if (_expiringWarranties.isEmpty)
                    const Center(
                      child: Text('No warranties expiring soon'),
                    )
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _expiringWarranties.length,
                      itemBuilder: (context, index) {
                        final warranty = _expiringWarranties[index];
                        return WarrantyCard(
                          warranty: warranty,
                          onTap: () {
                            Navigator.pushNamed(
                              context,
                              '/warranties/${warranty.id}',
                            );
                          },
                        );
                      },
                    ),
                  const SizedBox(height: 24.0),

                  // Recent Warranties
                  Text(
                    'Recent Warranties',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16.0),
                  if (_warranties.isEmpty)
                    const Center(
                      child: Text('No warranties added yet'),
                    )
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _warranties.length > 5 ? 5 : _warranties.length,
                      itemBuilder: (context, index) {
                        final warranty = _warranties[index];
                        return WarrantyCard(
                          warranty: warranty,
                          onTap: () {
                            Navigator.pushNamed(
                              context,
                              '/warranties/${warranty.id}',
                            );
                          },
                        );
                      },
                    ),
                ],
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/warranties/add');
        },
        child: const Icon(Icons.add),
      ),
    );
  }
} 