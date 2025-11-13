import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/formatters.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';
import '../../models/loan_application.dart';

class ApplicationDetailScreen extends StatefulWidget {
  final String applicationId;

  const ApplicationDetailScreen({
    super.key,
    required this.applicationId,
  });

  @override
  State<ApplicationDetailScreen> createState() =>
      _ApplicationDetailScreenState();
}

class _ApplicationDetailScreenState extends State<ApplicationDetailScreen> {
  LoanApplication? _application;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadApplication();
  }

  Future<void> _loadApplication() async {
    setState(() {
      _isLoading = true;
    });

    final appProvider = context.read<ApplicationProvider>();
    final app = await appProvider.getApplicationById(widget.applicationId);

    if (mounted) {
      setState(() {
        _application = app;
        _isLoading = false;
      });
    }
  }

  Future<void> _handleApprove() async {
    final confirmed = await _showConfirmationDialog(
      title: 'Approve Application',
      message: 'Are you sure you want to approve this application?',
      confirmText: 'Approve',
      confirmColor: AppTheme.secondaryColor,
    );

    if (confirmed == true && mounted) {
      final appProvider = context.read<ApplicationProvider>();
      final success = await appProvider.updateApplicationStatus(
        applicationId: widget.applicationId,
        approval: 'approved',
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Application approved successfully'),
            backgroundColor: AppTheme.secondaryColor,
          ),
        );
        _loadApplication();
      }
    }
  }

  Future<void> _handleDeny() async {
    final confirmed = await _showConfirmationDialog(
      title: 'Deny Application',
      message: 'Are you sure you want to deny this application?',
      confirmText: 'Deny',
      confirmColor: AppTheme.errorColor,
    );

    if (confirmed == true && mounted) {
      final appProvider = context.read<ApplicationProvider>();
      final success = await appProvider.updateApplicationStatus(
        applicationId: widget.applicationId,
        approval: 'denied',
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Application denied'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
        _loadApplication();
      }
    }
  }

  Future<bool?> _showConfirmationDialog({
    required String title,
    required String message,
    required String confirmText,
    required Color confirmColor,
  }) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text(
              confirmText,
              style: TextStyle(color: confirmColor),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Application Details'),
      ),
      body: Consumer<ApplicationProvider>(
        builder: (context, appProvider, _) {
          if (_isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (_application == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppTheme.errorColor,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Application not found',
                    style: AppTheme.headingMedium,
                  ),
                  const SizedBox(height: 24),
                  PrimaryButton(
                    text: 'Go Back',
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            );
          }

          final app = _application!;

          return LoadingOverlay(
            isLoading: appProvider.isLoading,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildStatusCard(app),
                  const SizedBox(height: 16),
                  if (appProvider.error != null) ...[
                    ErrorMessage(
                      message: appProvider.error!,
                      onDismiss: appProvider.clearError,
                    ),
                    const SizedBox(height: 16),
                  ],
                  _buildSection(
                    title: 'Personal Information',
                    icon: Icons.person,
                    children: [
                      _InfoRow(
                        label: 'Name',
                        value:
                            '${app.borrowerFirstName ?? ''} ${app.borrowerLastName ?? ''}',
                      ),
                      _InfoRow(
                          label: 'Email', value: app.borrowerEmail ?? 'N/A'),
                      _InfoRow(
                          label: 'Phone', value: app.borrowerPhone ?? 'N/A'),
                      _InfoRow(label: 'SSN', value: app.borrowerSSN ?? 'N/A'),
                      _InfoRow(
                          label: 'Date of Birth',
                          value: app.borrowerDOB ?? 'N/A'),
                      _InfoRow(
                        label: 'Address',
                        value:
                            '${app.currentStreet ?? ''}, ${app.currentCity ?? ''}, ${app.currentState ?? ''} ${app.currentZip ?? ''}',
                      ),
                      _InfoRow(
                        label: 'Marital Status',
                        value: app.maritalStatus ?? 'N/A',
                      ),
                      _InfoRow(
                        label: 'Dependents',
                        value: app.dependents?.toString() ?? '0',
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildSection(
                    title: 'Employment Information',
                    icon: Icons.work,
                    children: [
                      _InfoRow(
                        label: 'Employment Type',
                        value: app.employmentType ?? 'N/A',
                      ),
                      _InfoRow(
                          label: 'Employer', value: app.employerName ?? 'N/A'),
                      _InfoRow(
                          label: 'Job Title', value: app.jobTitle ?? 'N/A'),
                      _InfoRow(
                        label: 'Years Employed',
                        value: app.yearsEmployed?.toString() ?? 'N/A',
                      ),
                      _InfoRow(
                        label: 'Monthly Income',
                        value: app.monthlyIncome != null
                            ? Formatters.formatCurrency(app.monthlyIncome!)
                            : 'N/A',
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildSection(
                    title: 'Financial Overview',
                    icon: Icons.account_balance,
                    children: [
                      _InfoRow(
                        label: 'Total Assets',
                        value: Formatters.formatCurrency(
                          (app.checkingBalance ?? 0) +
                              (app.savingsBalance ?? 0) +
                              (app.investmentsBalance ?? 0) +
                              (app.retirementBalance ?? 0) +
                              (app.otherAssetsBalance ?? 0),
                        ),
                      ),
                      _InfoRow(
                        label: 'Total Liabilities',
                        value: Formatters.formatCurrency(
                          (app.creditCardDebt ?? 0) +
                              (app.autoLoanDebt ?? 0) +
                              (app.studentLoanDebt ?? 0) +
                              (app.otherDebt ?? 0),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildSection(
                    title: 'Property & Loan Details',
                    icon: Icons.home,
                    children: [
                      _InfoRow(
                        label: 'Property Address',
                        value:
                            '${app.propertyStreet ?? ''}, ${app.propertyCity ?? ''}, ${app.propertyState ?? ''} ${app.propertyZip ?? ''}',
                      ),
                      _InfoRow(
                        label: 'Property Type',
                        value: app.propertyType ?? 'N/A',
                      ),
                      _InfoRow(
                        label: 'Estimated Value',
                        value: app.estimatedValue != null
                            ? Formatters.formatCurrency(app.estimatedValue!)
                            : 'N/A',
                      ),
                      _InfoRow(
                        label: 'Loan Amount',
                        value: app.loanAmount != null
                            ? Formatters.formatCurrency(app.loanAmount!)
                            : 'N/A',
                      ),
                      _InfoRow(
                        label: 'Loan Term',
                        value: app.loanTerm ?? 'N/A',
                      ),
                    ],
                  ),
                  if (app.realEstateOwned != null &&
                      app.realEstateOwned!.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    _buildSection(
                      title: 'Real Estate Owned',
                      icon: Icons.business,
                      children: app.realEstateOwned!
                          .asMap()
                          .entries
                          .map((entry) => Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (entry.key > 0) const Divider(height: 24),
                                  Text(
                                    'Property ${entry.key + 1}',
                                    style: AppTheme.bodyMedium.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  _InfoRow(
                                    label: 'Address',
                                    value: entry.value.address,
                                  ),
                                  _InfoRow(
                                    label: 'Value',
                                    value: Formatters.formatCurrency(
                                      entry.value.marketValue,
                                    ),
                                  ),
                                  _InfoRow(
                                    label: 'Mortgage',
                                    value: entry.value.mortgageBalance != null
                                        ? Formatters.formatCurrency(
                                            entry.value.mortgageBalance!)
                                        : 'N/A',
                                  ),
                                  _InfoRow(
                                    label: 'Monthly Payment',
                                    value: entry.value.monthlyPayment != null
                                        ? Formatters.formatCurrency(
                                            entry.value.monthlyPayment!)
                                        : 'N/A',
                                  ),
                                ],
                              ))
                          .toList(),
                    ),
                  ],
                  const SizedBox(height: 16),
                  _buildSection(
                    title: 'Declarations',
                    icon: Icons.gavel,
                    children: [
                      _InfoRow(
                        label: 'U.S. Citizen/Resident',
                        value: app.citizenshipStatus == true ? 'Yes' : 'No',
                      ),
                      _InfoRow(
                        label: 'Bankruptcy History',
                        value: app.bankruptcyHistory == true ? 'Yes' : 'No',
                      ),
                      _InfoRow(
                        label: 'Foreclosure History',
                        value: app.foreclosureHistory == true ? 'Yes' : 'No',
                      ),
                      _InfoRow(
                        label: 'Legal Issues',
                        value: app.lawsuitHistory == true ? 'Yes' : 'No',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  if (app.approval == 'pending') ...[
                    Row(
                      children: [
                        Expanded(
                          child: SecondaryButton(
                            text: 'Deny',
                            onPressed: _handleDeny,
                            icon: Icons.cancel,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: PrimaryButton(
                            text: 'Approve',
                            onPressed: _handleApprove,
                            icon: Icons.check_circle,
                          ),
                        ),
                      ],
                    ),
                  ] else ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: app.approval == 'approved'
                            ? AppTheme.secondaryColor.withOpacity(0.1)
                            : AppTheme.errorColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            app.approval == 'approved'
                                ? Icons.check_circle
                                : Icons.cancel,
                            color: app.approval == 'approved'
                                ? AppTheme.secondaryColor
                                : AppTheme.errorColor,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'This application has been ${app.approval}',
                              style: AppTheme.bodyMedium.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatusCard(LoanApplication app) {
    Color statusColor;
    IconData statusIcon;
    String statusText;

    if (app.approval == 'approved') {
      statusColor = AppTheme.secondaryColor;
      statusIcon = Icons.check_circle;
      statusText = 'Approved';
    } else if (app.approval == 'denied') {
      statusColor = AppTheme.errorColor;
      statusIcon = Icons.cancel;
      statusText = 'Denied';
    } else {
      statusColor = AppTheme.warningColor;
      statusIcon = Icons.hourglass_empty;
      statusText = 'Pending Review';
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Icon(statusIcon, color: statusColor, size: 32),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        statusText,
                        style: AppTheme.headingMedium.copyWith(
                          color: statusColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Application ID: ${app.id ?? 'N/A'}',
                        style: AppTheme.bodySmall.copyWith(
                          color: AppTheme.textSecondaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Submitted',
                      style: AppTheme.bodySmall.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      app.createdAt != null
                          ? Formatters.formatDate(app.createdAt!)
                          : 'N/A',
                      style: AppTheme.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'Status',
                      style: AppTheme.bodySmall.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 4),
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
                        Formatters.capitalize(app.status),
                        style: AppTheme.bodySmall.copyWith(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: AppTheme.primaryColor),
                const SizedBox(width: 12),
                Text(title, style: AppTheme.headingSmall),
              ],
            ),
            const Divider(height: 24),
            ...children,
          ],
        ),
      ),
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
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: AppTheme.bodyMedium.copyWith(
                color: AppTheme.textSecondaryColor,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value.isEmpty ? '-' : value,
              style: AppTheme.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
