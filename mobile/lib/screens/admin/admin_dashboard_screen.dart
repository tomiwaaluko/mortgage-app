import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/formatters.dart';
import '../../widgets/common_widgets.dart';
import '../../models/loan_application.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  String _filterStatus = 'all';
  String _filterApproval = 'all';

  @override
  void initState() {
    super.initState();
    _loadApplications();
  }

  Future<void> _loadApplications() async {
    final appProvider = context.read<ApplicationProvider>();
    await appProvider.loadAllApplications();
  }

  List<LoanApplication> _getFilteredApplications(List<LoanApplication> apps) {
    return apps.where((app) {
      bool statusMatch = _filterStatus == 'all' || app.status == _filterStatus;
      bool approvalMatch =
          _filterApproval == 'all' || app.approval == _filterApproval;
      return statusMatch && approvalMatch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadApplications,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final authProvider = context.read<AuthProvider>();
              await authProvider.logout();
              if (mounted) {
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  '/home',
                  (route) => false,
                );
              }
            },
          ),
        ],
      ),
      body: Consumer<ApplicationProvider>(
        builder: (context, appProvider, _) {
          if (appProvider.isLoading && appProvider.allApplications == null) {
            return const Center(child: CircularProgressIndicator());
          }

          final allApps = appProvider.allApplications ?? [];
          final filteredApps = _getFilteredApplications(allApps);

          return RefreshIndicator(
            onRefresh: _loadApplications,
            child: Column(
              children: [
                _buildStatsCards(allApps),
                _buildFilters(),
                if (appProvider.error != null) ...[
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: ErrorMessage(
                      message: appProvider.error!,
                      onDismiss: appProvider.clearError,
                    ),
                  ),
                ],
                Expanded(
                  child: filteredApps.isEmpty
                      ? _buildEmptyState()
                      : _buildApplicationsList(filteredApps),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsCards(List<LoanApplication> apps) {
    final totalApps = apps.length;
    final pendingApps = apps.where((a) => a.approval == 'pending').length;
    final approvedApps = apps.where((a) => a.approval == 'approved').length;
    final deniedApps = apps.where((a) => a.approval == 'denied').length;

    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: _StatCard(
              title: 'Total',
              count: totalApps,
              color: AppTheme.primaryColor,
              icon: Icons.description,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              title: 'Pending',
              count: pendingApps,
              color: AppTheme.warningColor,
              icon: Icons.hourglass_empty,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              title: 'Approved',
              count: approvedApps,
              color: AppTheme.secondaryColor,
              icon: Icons.check_circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              title: 'Denied',
              count: deniedApps,
              color: AppTheme.errorColor,
              icon: Icons.cancel,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: DropdownButtonFormField<String>(
              value: _filterStatus,
              decoration: InputDecoration(
                labelText: 'Status',
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              items: [
                const DropdownMenuItem(value: 'all', child: Text('All Status')),
                const DropdownMenuItem(value: 'draft', child: Text('Draft')),
                const DropdownMenuItem(
                    value: 'submitted', child: Text('Submitted')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _filterStatus = value;
                  });
                }
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: DropdownButtonFormField<String>(
              value: _filterApproval,
              decoration: InputDecoration(
                labelText: 'Approval',
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              items: [
                const DropdownMenuItem(
                    value: 'all', child: Text('All Approval')),
                const DropdownMenuItem(
                    value: 'pending', child: Text('Pending')),
                const DropdownMenuItem(
                    value: 'approved', child: Text('Approved')),
                const DropdownMenuItem(value: 'denied', child: Text('Denied')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _filterApproval = value;
                  });
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inbox,
            size: 64,
            color: AppTheme.textSecondaryColor.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'No applications found',
            style: AppTheme.headingSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your filters',
            style: AppTheme.bodyMedium.copyWith(
              color: AppTheme.textSecondaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildApplicationsList(List<LoanApplication> apps) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: apps.length,
      itemBuilder: (context, index) {
        final app = apps[index];
        return _ApplicationCard(
          application: app,
          onTap: () {
            Navigator.pushNamed(
              context,
              '/admin/application-detail',
              arguments: app.id,
            );
          },
        );
      },
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final int count;
  final Color color;
  final IconData icon;

  const _StatCard({
    required this.title,
    required this.count,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              count.toString(),
              style: AppTheme.headingMedium.copyWith(color: color),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.textSecondaryColor,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _ApplicationCard extends StatelessWidget {
  final LoanApplication application;
  final VoidCallback onTap;

  const _ApplicationCard({
    required this.application,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    IconData statusIcon;

    if (application.approval == 'approved') {
      statusColor = AppTheme.secondaryColor;
      statusIcon = Icons.check_circle;
    } else if (application.approval == 'denied') {
      statusColor = AppTheme.errorColor;
      statusIcon = Icons.cancel;
    } else {
      statusColor = AppTheme.warningColor;
      statusIcon = Icons.hourglass_empty;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
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
                      '${application.borrowerFirstName ?? 'N/A'} ${application.borrowerLastName ?? 'N/A'}',
                      style: AppTheme.bodyLarge.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(statusIcon, size: 16, color: statusColor),
                        const SizedBox(width: 4),
                        Text(
                          Formatters.capitalize(application.approval),
                          style: AppTheme.bodySmall.copyWith(
                            color: statusColor,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _InfoRow(
                icon: Icons.email,
                text: application.borrowerEmail ?? 'No email',
              ),
              const SizedBox(height: 8),
              _InfoRow(
                icon: Icons.phone,
                text: application.borrowerPhone ?? 'No phone',
              ),
              if (application.loanAmount != null) ...[
                const SizedBox(height: 8),
                _InfoRow(
                  icon: Icons.attach_money,
                  text: Formatters.formatCurrency(application.loanAmount!),
                ),
              ],
              const SizedBox(height: 8),
              _InfoRow(
                icon: Icons.calendar_today,
                text: application.createdAt != null
                    ? Formatters.formatDate(application.createdAt!)
                    : 'No date',
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      Formatters.capitalize(application.status),
                      style: AppTheme.bodySmall.copyWith(
                        color: AppTheme.primaryColor,
                      ),
                    ),
                  ),
                  Icon(
                    Icons.chevron_right,
                    color: AppTheme.textSecondaryColor,
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

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoRow({
    required this.icon,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: AppTheme.textSecondaryColor,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: AppTheme.bodyMedium.copyWith(
              color: AppTheme.textSecondaryColor,
            ),
          ),
        ),
      ],
    );
  }
}
