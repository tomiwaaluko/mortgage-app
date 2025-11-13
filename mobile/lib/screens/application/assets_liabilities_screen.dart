import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class AssetsLiabilitiesScreen extends StatefulWidget {
  const AssetsLiabilitiesScreen({super.key});

  @override
  State<AssetsLiabilitiesScreen> createState() =>
      _AssetsLiabilitiesScreenState();
}

class _AssetsLiabilitiesScreenState extends State<AssetsLiabilitiesScreen> {
  final _formKey = GlobalKey<FormState>();
  final _bankAccountsController = TextEditingController();
  final _investmentsController = TextEditingController();
  final _retirementController = TextEditingController();
  final _otherAssetsController = TextEditingController();
  final _creditCardDebtController = TextEditingController();
  final _autoLoansController = TextEditingController();
  final _studentLoansController = TextEditingController();
  final _otherDebtsController = TextEditingController();
  final _monthlyDebtsController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadExistingData();
  }

  void _loadExistingData() {
    final appProvider = context.read<ApplicationProvider>();
    final app = appProvider.application;

    if (app != null) {
      _bankAccountsController.text =
          ((app.checkingBalance ?? 0) + (app.savingsBalance ?? 0)).toString();
      _investmentsController.text = app.investmentsBalance?.toString() ?? '';
      _retirementController.text = app.retirementBalance?.toString() ?? '';
      _otherAssetsController.text = app.otherAssetsBalance?.toString() ?? '';
      _creditCardDebtController.text = app.creditCardDebt?.toString() ?? '';
      _autoLoansController.text = app.autoLoanDebt?.toString() ?? '';
      _studentLoansController.text = app.studentLoanDebt?.toString() ?? '';
      _otherDebtsController.text = app.otherDebt?.toString() ?? '';
    }
  }

  @override
  void dispose() {
    _bankAccountsController.dispose();
    _investmentsController.dispose();
    _retirementController.dispose();
    _otherAssetsController.dispose();
    _creditCardDebtController.dispose();
    _autoLoansController.dispose();
    _studentLoansController.dispose();
    _otherDebtsController.dispose();
    _monthlyDebtsController.dispose();
    super.dispose();
  }

  double _calculateTotalAssets() {
    double total = 0;
    total += double.tryParse(_bankAccountsController.text) ?? 0;
    total += double.tryParse(_investmentsController.text) ?? 0;
    total += double.tryParse(_retirementController.text) ?? 0;
    total += double.tryParse(_otherAssetsController.text) ?? 0;
    return total;
  }

  double _calculateTotalLiabilities() {
    double total = 0;
    total += double.tryParse(_creditCardDebtController.text) ?? 0;
    total += double.tryParse(_autoLoansController.text) ?? 0;
    total += double.tryParse(_studentLoansController.text) ?? 0;
    total += double.tryParse(_otherDebtsController.text) ?? 0;
    return total;
  }

  Future<void> _handleContinue() async {
    if (_formKey.currentState?.validate() ?? false) {
      final appProvider = context.read<ApplicationProvider>();

      appProvider.updateLocalApplication({
        'checkingBalance':
            double.tryParse(_bankAccountsController.text.trim()) ?? 0,
        'savingsBalance': 0.0,
        'investmentsBalance':
            double.tryParse(_investmentsController.text.trim()),
        'retirementBalance': double.tryParse(_retirementController.text.trim()),
        'otherAssetsBalance':
            double.tryParse(_otherAssetsController.text.trim()),
        'creditCardDebt':
            double.tryParse(_creditCardDebtController.text.trim()),
        'autoLoanDebt': double.tryParse(_autoLoansController.text.trim()),
        'studentLoanDebt': double.tryParse(_studentLoansController.text.trim()),
        'otherDebt': double.tryParse(_otherDebtsController.text.trim()),
      });

      if (mounted) {
        Navigator.pushNamed(context, '/application/property-info');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assets & Liabilities'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<ApplicationProvider>(
        builder: (context, appProvider, _) {
          return LoadingOverlay(
            isLoading: appProvider.isLoading,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Step 3 of 7',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: 3 / 7,
                      backgroundColor: AppTheme.dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Financial Overview',
                      style: AppTheme.headingMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Provide details about your assets and liabilities',
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
                    Text(
                      'Assets',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _bankAccountsController,
                      label: 'Bank Accounts (Checking & Savings)',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Bank accounts'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _investmentsController,
                      label: 'Investments (Stocks, Bonds, etc.)',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Investments'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _retirementController,
                      label: 'Retirement Accounts (401k, IRA, etc.)',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Retirement'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _otherAssetsController,
                      label: 'Other Assets',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Other assets'),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total Assets',
                            style: AppTheme.bodyLarge.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            '\$${_calculateTotalAssets().toStringAsFixed(2)}',
                            style: AppTheme.headingSmall.copyWith(
                              color: AppTheme.secondaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Liabilities',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _creditCardDebtController,
                      label: 'Credit Card Debt',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Credit card debt'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _autoLoansController,
                      label: 'Auto Loans',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Auto loans'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _studentLoansController,
                      label: 'Student Loans',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Student loans'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _otherDebtsController,
                      label: 'Other Debts',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Other debts'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _monthlyDebtsController,
                      label: 'Total Monthly Debt Payments',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Monthly debt payments'),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.errorColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total Liabilities',
                            style: AppTheme.bodyLarge.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            '\$${_calculateTotalLiabilities().toStringAsFixed(2)}',
                            style: AppTheme.headingSmall.copyWith(
                              color: AppTheme.errorColor,
                            ),
                          ),
                        ],
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
                            text: 'Continue',
                            onPressed: _handleContinue,
                            isLoading: appProvider.isLoading,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
