import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../providers/application_provider.dart';
import '../utils/app_theme.dart';
import '../utils/formatters.dart';
import '../widgets/custom_button.dart';
import '../widgets/common_widgets.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    _loadApplicationData();
  }

  Future<void> _loadApplicationData() async {
    final appProvider = context.read<ApplicationProvider>();
    await appProvider.loadUserApplication();
  }

  Future<void> _handleLogout() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.logout();
    if (mounted) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/home',
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: Consumer2<AuthProvider, ApplicationProvider>(
        builder: (context, authProvider, appProvider, _) {
          if (appProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return RefreshIndicator(
            onRefresh: _loadApplicationData,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildWelcomeSection(authProvider),
                  const SizedBox(height: 24),
                  if (appProvider.error != null) ...[
                    ErrorMessage(
                      message: appProvider.error!,
                      onDismiss: appProvider.clearError,
                    ),
                    const SizedBox(height: 16),
                  ],
                  if (appProvider.hasApplication)
                    _buildApplicationStatus(appProvider)
                  else
                    _buildNoApplicationView(),
                  const SizedBox(height: 24),
                  _buildQuickActions(appProvider),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildWelcomeSection(AuthProvider authProvider) {
    final user = authProvider.user;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome back,',
              style: AppTheme.bodyMedium.copyWith(
                color: AppTheme.textSecondaryColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              user?.fullName ?? 'User',
              style: AppTheme.headingMedium,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.email,
                  size: 16,
                  color: AppTheme.textSecondaryColor,
                ),
                const SizedBox(width: 8),
                Text(
                  user?.email ?? '',
                  style: AppTheme.bodyMedium.copyWith(
                    color: AppTheme.textSecondaryColor,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildApplicationStatus(ApplicationProvider appProvider) {
    final application = appProvider.application!;
    final isSubmitted = application.status == 'submitted';
    final approvalStatus = application.approval;

    Color statusColor;
    IconData statusIcon;
    String statusText;

    if (approvalStatus == 'approved') {
      statusColor = AppTheme.secondaryColor;
      statusIcon = Icons.check_circle;
      statusText = 'Approved';
    } else if (approvalStatus == 'denied') {
      statusColor = AppTheme.errorColor;
      statusIcon = Icons.cancel;
      statusText = 'Denied';
    } else if (isSubmitted) {
      statusColor = AppTheme.warningColor;
      statusIcon = Icons.hourglass_empty;
      statusText = 'Under Review';
    } else {
      statusColor = AppTheme.textSecondaryColor;
      statusIcon = Icons.edit_document;
      statusText = 'Draft';
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(statusIcon, color: statusColor, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Application Status',
                        style: AppTheme.bodyMedium.copyWith(
                          color: AppTheme.textSecondaryColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        statusText,
                        style: AppTheme.headingSmall.copyWith(
                          color: statusColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 16),
            if (application.loanAmount != null) ...[
              _InfoRow(
                label: 'Loan Amount',
                value: Formatters.formatCurrency(application.loanAmount!),
              ),
              const SizedBox(height: 8),
            ],
            if (application.loanTerm != null) ...[
              _InfoRow(
                label: 'Loan Term',
                value: Formatters.formatLoanTerm(application.loanTerm!),
              ),
              const SizedBox(height: 8),
            ],
            if (application.propertyType != null) ...[
              _InfoRow(
                label: 'Property Type',
                value: Formatters.capitalize(application.propertyType!),
              ),
              const SizedBox(height: 8),
            ],
            if (application.createdAt != null) ...[
              _InfoRow(
                label: 'Applied On',
                value: Formatters.formatDate(application.createdAt!),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNoApplicationView() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.description_outlined,
              size: 64,
              color: AppTheme.textSecondaryColor.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No Application Yet',
              style: AppTheme.headingSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Start your mortgage application journey today',
              style: AppTheme.bodyMedium.copyWith(
                color: AppTheme.textSecondaryColor,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(ApplicationProvider appProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: AppTheme.headingSmall,
        ),
        const SizedBox(height: 16),
        if (!appProvider.hasApplication)
          PrimaryButton(
            text: 'Start New Application',
            icon: Icons.add,
            onPressed: () {
              Navigator.pushNamed(context, '/application/personal-info');
            },
          )
        else if (appProvider.application?.status == 'draft')
          PrimaryButton(
            text: 'Continue Application',
            icon: Icons.edit,
            onPressed: () {
              Navigator.pushNamed(context, '/application/personal-info');
            },
          )
        else
          PrimaryButton(
            text: 'View Application',
            icon: Icons.visibility,
            onPressed: () {
              Navigator.pushNamed(context, '/application/review');
            },
          ),
        const SizedBox(height: 12),
        SecondaryButton(
          text: 'Contact Support',
          icon: Icons.support_agent,
          onPressed: () {
            // TODO: Implement support contact
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Support contact coming soon!'),
              ),
            );
          },
        ),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTheme.bodyMedium.copyWith(
            color: AppTheme.textSecondaryColor,
          ),
        ),
        Text(
          value,
          style: AppTheme.bodyMedium.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
