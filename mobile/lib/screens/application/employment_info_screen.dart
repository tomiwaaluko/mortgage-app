import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class EmploymentInfoScreen extends StatefulWidget {
  const EmploymentInfoScreen({super.key});

  @override
  State<EmploymentInfoScreen> createState() => _EmploymentInfoScreenState();
}

class _EmploymentInfoScreenState extends State<EmploymentInfoScreen> {
  final _formKey = GlobalKey<FormState>();
  final _employerController = TextEditingController();
  final _jobTitleController = TextEditingController();
  final _startDateController = TextEditingController();
  final _annualIncomeController = TextEditingController();
  final _employerPhoneController = TextEditingController();
  final _employerAddressController = TextEditingController();

  String _employmentType = 'Full-time';

  @override
  void initState() {
    super.initState();
    _loadExistingData();
  }

  void _loadExistingData() {
    final appProvider = context.read<ApplicationProvider>();
    final app = appProvider.application;

    if (app != null) {
      _employerController.text = app.employerName ?? '';
      _jobTitleController.text = app.jobTitle ?? '';
      _startDateController.text = app.yearsEmployed?.toString() ?? '';
      _annualIncomeController.text = app.monthlyIncome?.toString() ?? '';
      _employerPhoneController.text = app.employerPhone ?? '';
      if (app.employmentType != null) {
        _employmentType = app.employmentType!;
      }
    }
  }

  @override
  void dispose() {
    _employerController.dispose();
    _jobTitleController.dispose();
    _startDateController.dispose();
    _annualIncomeController.dispose();
    _employerPhoneController.dispose();
    _employerAddressController.dispose();
    super.dispose();
  }

  Future<void> _handleContinue() async {
    if (_formKey.currentState?.validate() ?? false) {
      final appProvider = context.read<ApplicationProvider>();

      appProvider.updateLocalApplication({
        'employerName': _employerController.text.trim(),
        'jobTitle': _jobTitleController.text.trim(),
        'yearsEmployed': int.tryParse(_startDateController.text.trim()),
        'monthlyIncome': double.tryParse(_annualIncomeController.text.trim()),
        'employerPhone': _employerPhoneController.text.trim(),
        'employmentType': _employmentType,
      });

      if (mounted) {
        Navigator.pushNamed(context, '/application/assets-liabilities');
      }
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 365)),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        _startDateController.text =
            '${picked.month.toString().padLeft(2, '0')}/${picked.day.toString().padLeft(2, '0')}/${picked.year}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Employment Information'),
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
                      'Step 2 of 7',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: 2 / 7,
                      backgroundColor: AppTheme.dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Employment Details',
                      style: AppTheme.headingMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tell us about your current employment',
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
                    DropdownButtonFormField<String>(
                      value: _employmentType,
                      decoration: InputDecoration(
                        labelText: 'Employment Type',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: [
                        'Full-time',
                        'Part-time',
                        'Self-employed',
                        'Retired',
                        'Unemployed'
                      ]
                          .map((type) => DropdownMenuItem(
                                value: type,
                                child: Text(type),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _employmentType = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _employerController,
                      label: 'Employer Name',
                      validator: (value) =>
                          Validators.validateRequired(value, 'Employer name'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _jobTitleController,
                      label: 'Job Title',
                      validator: (value) =>
                          Validators.validateRequired(value, 'Job title'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _startDateController,
                      label: 'Employment Start Date (MM/DD/YYYY)',
                      readOnly: true,
                      onTap: () => _selectDate(context),
                      suffixIcon: const Icon(Icons.calendar_today),
                      validator: Validators.validateDate,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _annualIncomeController,
                      label: 'Annual Income',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Annual income'),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Employer Contact',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _employerPhoneController,
                      label: 'Employer Phone Number',
                      keyboardType: TextInputType.phone,
                      validator: Validators.validatePhone,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _employerAddressController,
                      label: 'Employer Address',
                      validator: (value) => Validators.validateRequired(
                          value, 'Employer address'),
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
