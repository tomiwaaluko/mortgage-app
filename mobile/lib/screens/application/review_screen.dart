import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/formatters.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class ReviewScreen extends StatefulWidget {
  const ReviewScreen({super.key});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  bool _certifyAccuracy = false;

  Future<void> _handleSubmit() async {
    if (!_certifyAccuracy) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please certify that the information is accurate'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    final appProvider = context.read<ApplicationProvider>();
    if (appProvider.application == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No application data found'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    final success = await appProvider.submitApplication(
      appProvider.application!.copyWith(status: 'submitted'),
    );

    if (success && mounted) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/dashboard',
        (route) => false,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Application submitted successfully!'),
          backgroundColor: AppTheme.secondaryColor,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Review & Submit'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<ApplicationProvider>(
        builder: (context, appProvider, _) {
          final app = appProvider.application;

          if (app == null) {
            return const Center(
              child: Text('No application data found'),
            );
          }

          return LoadingOverlay(
            isLoading: appProvider.isLoading,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Step 7 of 7',
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.textSecondaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: 1.0,
                    backgroundColor: AppTheme.dividerColor,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Review Your Application',
                    style: AppTheme.headingMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Please review all information before submitting',
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.textSecondaryColor,
                    ),
                  ),
                  const SizedBox(height: 32),
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
                    onEdit: () => Navigator.pushNamed(
                      context,
                      '/application/personal-info',
                    ),
                    children: [
                      _InfoRow(
                        label: 'Name',
                        value:
                            '${app.borrowerFirstName ?? ''} ${app.borrowerLastName ?? ''}',
                      ),
                      _InfoRow(label: 'Email', value: app.borrowerEmail ?? ''),
                      _InfoRow(label: 'Phone', value: app.borrowerPhone ?? ''),
                      _InfoRow(label: 'SSN', value: app.borrowerSSN ?? ''),
                      _InfoRow(
                          label: 'Date of Birth', value: app.borrowerDOB ?? ''),
                      _InfoRow(
                        label: 'Address',
                        value:
                            '${app.currentStreet ?? ''}, ${app.currentCity ?? ''}, ${app.currentState ?? ''} ${app.currentZip ?? ''}',
                      ),
                      _InfoRow(
                        label: 'Marital Status',
                        value: app.maritalStatus ?? '',
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
                    onEdit: () => Navigator.pushNamed(
                      context,
                      '/application/employment',
                    ),
                    children: [
                      _InfoRow(
                        label: 'Employment Type',
                        value: app.employmentType ?? '',
                      ),
                      _InfoRow(
                          label: 'Employer', value: app.employerName ?? ''),
                      _InfoRow(label: 'Job Title', value: app.jobTitle ?? ''),
                      _InfoRow(
                        label: 'Years Employed',
                        value: app.yearsEmployed?.toString() ?? '',
                      ),
                      _InfoRow(
                        label: 'Monthly Income',
                        value: app.monthlyIncome != null
                            ? Formatters.formatCurrency(app.monthlyIncome!)
                            : '',
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildSection(
                    title: 'Financial Overview',
                    icon: Icons.account_balance,
                    onEdit: () => Navigator.pushNamed(
                      context,
                      '/application/assets-liabilities',
                    ),
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
                    onEdit: () => Navigator.pushNamed(
                      context,
                      '/application/property-info',
                    ),
                    children: [
                      _InfoRow(
                        label: 'Property Address',
                        value:
                            '${app.propertyStreet ?? ''}, ${app.propertyCity ?? ''}, ${app.propertyState ?? ''} ${app.propertyZip ?? ''}',
                      ),
                      _InfoRow(
                        label: 'Property Type',
                        value: app.propertyType ?? '',
                      ),
                      _InfoRow(
                        label: 'Estimated Value',
                        value: app.estimatedValue != null
                            ? Formatters.formatCurrency(app.estimatedValue!)
                            : '',
                      ),
                      _InfoRow(
                        label: 'Loan Amount',
                        value: app.loanAmount != null
                            ? Formatters.formatCurrency(app.loanAmount!)
                            : '',
                      ),
                      _InfoRow(
                        label: 'Loan Term',
                        value: app.loanTerm ?? '',
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (app.realEstateOwned != null &&
                      app.realEstateOwned!.isNotEmpty)
                    _buildSection(
                      title: 'Real Estate Owned',
                      icon: Icons.business,
                      onEdit: () => Navigator.pushNamed(
                        context,
                        '/application/real-estate',
                      ),
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
                                        entry.value.marketValue),
                                  ),
                                  _InfoRow(
                                    label: 'Mortgage',
                                    value: entry.value.mortgageBalance != null
                                        ? Formatters.formatCurrency(
                                            entry.value.mortgageBalance!)
                                        : '',
                                  ),
                                  _InfoRow(
                                    label: 'Monthly Payment',
                                    value: entry.value.monthlyPayment != null
                                        ? Formatters.formatCurrency(
                                            entry.value.monthlyPayment!)
                                        : '',
                                  ),
                                ],
                              ))
                          .toList(),
                    ),
                  const SizedBox(height: 16),
                  _buildSection(
                    title: 'Declarations',
                    icon: Icons.gavel,
                    onEdit: () => Navigator.pushNamed(
                      context,
                      '/application/declarations',
                    ),
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
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: AppTheme.dividerColor,
                      ),
                    ),
                    child: CheckboxListTile(
                      value: _certifyAccuracy,
                      onChanged: (value) {
                        setState(() {
                          _certifyAccuracy = value ?? false;
                        });
                      },
                      contentPadding: EdgeInsets.zero,
                      controlAffinity: ListTileControlAffinity.leading,
                      title: Text(
                        'I certify that all information provided in this application is true and accurate to the best of my knowledge.',
                        style: AppTheme.bodyMedium,
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      Expanded(
                        child: SecondaryButton(
                          text: 'Back',
                          onPressed: () => Navigator.pop(context),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: PrimaryButton(
                          text: 'Submit Application',
                          onPressed: _handleSubmit,
                          isLoading: appProvider.isLoading,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required VoidCallback onEdit,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(icon, color: AppTheme.primaryColor),
                    const SizedBox(width: 12),
                    Text(title, style: AppTheme.headingSmall),
                  ],
                ),
                TextButton.icon(
                  onPressed: onEdit,
                  icon: const Icon(Icons.edit, size: 18),
                  label: const Text('Edit'),
                ),
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
