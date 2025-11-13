import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class PersonalInfoScreen extends StatefulWidget {
  const PersonalInfoScreen({super.key});

  @override
  State<PersonalInfoScreen> createState() => _PersonalInfoScreenState();
}

class _PersonalInfoScreenState extends State<PersonalInfoScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _ssnController = TextEditingController();
  final _dobController = TextEditingController();
  final _streetAddressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _zipCodeController = TextEditingController();

  String _maritalStatus = 'Single';
  int _dependents = 0;

  @override
  void initState() {
    super.initState();
    _loadExistingData();
  }

  void _loadExistingData() {
    final appProvider = context.read<ApplicationProvider>();
    final app = appProvider.application;

    if (app != null) {
      _firstNameController.text = app.borrowerFirstName ?? '';
      _lastNameController.text = app.borrowerLastName ?? '';
      _emailController.text = app.borrowerEmail ?? '';
      _phoneController.text = app.borrowerPhone ?? '';
      _ssnController.text = app.borrowerSSN ?? '';
      _dobController.text = app.borrowerDOB ?? '';
      _streetAddressController.text = app.currentStreet ?? '';
      _cityController.text = app.currentCity ?? '';
      _stateController.text = app.currentState ?? '';
      _zipCodeController.text = app.currentZip ?? '';
      if (app.maritalStatus != null) {
        _maritalStatus = app.maritalStatus!;
      }
      if (app.dependents != null) {
        _dependents = app.dependents!;
      }
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _ssnController.dispose();
    _dobController.dispose();
    _streetAddressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _zipCodeController.dispose();
    super.dispose();
  }

  Future<void> _handleContinue() async {
    if (_formKey.currentState?.validate() ?? false) {
      final appProvider = context.read<ApplicationProvider>();

      appProvider.updateLocalApplication({
        'borrowerFirstName': _firstNameController.text.trim(),
        'borrowerLastName': _lastNameController.text.trim(),
        'borrowerEmail': _emailController.text.trim(),
        'borrowerPhone': _phoneController.text.trim(),
        'borrowerSSN': _ssnController.text.trim(),
        'borrowerDOB': _dobController.text.trim(),
        'currentStreet': _streetAddressController.text.trim(),
        'currentCity': _cityController.text.trim(),
        'currentState': _stateController.text.trim(),
        'currentZip': _zipCodeController.text.trim(),
        'maritalStatus': _maritalStatus,
        'dependents': _dependents,
      });

      if (mounted) {
        Navigator.pushNamed(context, '/application/employment');
      }
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 365 * 25)),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        _dobController.text =
            '${picked.month.toString().padLeft(2, '0')}/${picked.day.toString().padLeft(2, '0')}/${picked.year}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Personal Information'),
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
                      'Step 1 of 7',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: 1 / 7,
                      backgroundColor: AppTheme.dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Tell us about yourself',
                      style: AppTheme.headingMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Please provide your personal information',
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
                    CustomTextField(
                      controller: _firstNameController,
                      label: 'First Name',
                      validator: (value) =>
                          Validators.validateRequired(value, 'First name'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _lastNameController,
                      label: 'Last Name',
                      validator: (value) =>
                          Validators.validateRequired(value, 'Last name'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _emailController,
                      label: 'Email Address',
                      keyboardType: TextInputType.emailAddress,
                      validator: Validators.validateEmail,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _phoneController,
                      label: 'Phone Number',
                      keyboardType: TextInputType.phone,
                      validator: Validators.validatePhone,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _ssnController,
                      label: 'Social Security Number',
                      keyboardType: TextInputType.number,
                      validator: Validators.validateSSN,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _dobController,
                      label: 'Date of Birth (MM/DD/YYYY)',
                      readOnly: true,
                      onTap: () => _selectDate(context),
                      suffixIcon: const Icon(Icons.calendar_today),
                      validator: Validators.validateDate,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Current Address',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _streetAddressController,
                      label: 'Street Address',
                      validator: (value) =>
                          Validators.validateRequired(value, 'Street address'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _cityController,
                      label: 'City',
                      validator: (value) =>
                          Validators.validateRequired(value, 'City'),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: _stateController,
                            label: 'State',
                            validator: (value) =>
                                Validators.validateRequired(value, 'State'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: CustomTextField(
                            controller: _zipCodeController,
                            label: 'ZIP Code',
                            keyboardType: TextInputType.number,
                            validator: Validators.validateZipCode,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Additional Information',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: _maritalStatus,
                      decoration: InputDecoration(
                        labelText: 'Marital Status',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: ['Single', 'Married', 'Divorced', 'Widowed']
                          .map((status) => DropdownMenuItem(
                                value: status,
                                child: Text(status),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _maritalStatus = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<int>(
                      value: _dependents,
                      decoration: InputDecoration(
                        labelText: 'Number of Dependents',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: List.generate(11, (index) => index)
                          .map((count) => DropdownMenuItem(
                                value: count,
                                child: Text(count.toString()),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _dependents = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 32),
                    PrimaryButton(
                      text: 'Continue',
                      onPressed: _handleContinue,
                      isLoading: appProvider.isLoading,
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
