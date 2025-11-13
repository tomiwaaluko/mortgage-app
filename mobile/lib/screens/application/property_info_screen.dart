import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class PropertyInfoScreen extends StatefulWidget {
  const PropertyInfoScreen({super.key});

  @override
  State<PropertyInfoScreen> createState() => _PropertyInfoScreenState();
}

class _PropertyInfoScreenState extends State<PropertyInfoScreen> {
  final _formKey = GlobalKey<FormState>();
  final _propertyAddressController = TextEditingController();
  final _propertyCityController = TextEditingController();
  final _propertyStateController = TextEditingController();
  final _propertyZipController = TextEditingController();
  final _purchasePriceController = TextEditingController();
  final _downPaymentController = TextEditingController();
  final _loanAmountController = TextEditingController();

  String _propertyType = 'Primary Residence';
  String _loanTerm = '30';
  String _loanType = 'Conventional';

  @override
  void initState() {
    super.initState();
    _loadExistingData();
    _purchasePriceController.addListener(_calculateLoanAmount);
    _downPaymentController.addListener(_calculateLoanAmount);
  }

  void _loadExistingData() {
    final appProvider = context.read<ApplicationProvider>();
    final app = appProvider.application;

    if (app != null) {
      _propertyAddressController.text = app.propertyStreet ?? '';
      _propertyCityController.text = app.propertyCity ?? '';
      _propertyStateController.text = app.propertyState ?? '';
      _propertyZipController.text = app.propertyZip ?? '';
      _loanAmountController.text = app.loanAmount?.toString() ?? '';
      if (app.propertyType != null) {
        _propertyType = app.propertyType!;
      }
      if (app.loanTerm != null) {
        _loanTerm = app.loanTerm.toString();
      }
    }
  }

  void _calculateLoanAmount() {
    final purchasePrice = double.tryParse(_purchasePriceController.text) ?? 0;
    final downPayment = double.tryParse(_downPaymentController.text) ?? 0;
    final loanAmount = purchasePrice - downPayment;

    if (loanAmount > 0) {
      _loanAmountController.text = loanAmount.toStringAsFixed(2);
    }
  }

  @override
  void dispose() {
    _propertyAddressController.dispose();
    _propertyCityController.dispose();
    _propertyStateController.dispose();
    _propertyZipController.dispose();
    _purchasePriceController.dispose();
    _downPaymentController.dispose();
    _loanAmountController.dispose();
    super.dispose();
  }

  Future<void> _handleContinue() async {
    if (_formKey.currentState?.validate() ?? false) {
      final appProvider = context.read<ApplicationProvider>();

      appProvider.updateLocalApplication({
        'propertyStreet': _propertyAddressController.text.trim(),
        'propertyCity': _propertyCityController.text.trim(),
        'propertyState': _propertyStateController.text.trim(),
        'propertyZip': _propertyZipController.text.trim(),
        'estimatedValue': double.tryParse(_purchasePriceController.text.trim()),
        'loanAmount': double.tryParse(_loanAmountController.text.trim()),
        'loanTerm': _loanTerm,
        'propertyType': _propertyType,
      });

      if (mounted) {
        Navigator.pushNamed(context, '/application/real-estate');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Information'),
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
                      'Step 4 of 7',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: 4 / 7,
                      backgroundColor: AppTheme.dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Loan & Property Details',
                      style: AppTheme.headingMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tell us about the property and loan',
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
                      'Property Location',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _propertyAddressController,
                      label: 'Property Address',
                      validator: (value) => Validators.validateRequired(
                          value, 'Property address'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _propertyCityController,
                      label: 'City',
                      validator: (value) =>
                          Validators.validateRequired(value, 'City'),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: _propertyStateController,
                            label: 'State',
                            validator: (value) =>
                                Validators.validateRequired(value, 'State'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: CustomTextField(
                            controller: _propertyZipController,
                            label: 'ZIP Code',
                            keyboardType: TextInputType.number,
                            validator: Validators.validateZipCode,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Property & Loan Details',
                      style: AppTheme.headingSmall,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: _propertyType,
                      decoration: InputDecoration(
                        labelText: 'Property Type',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: [
                        'Primary Residence',
                        'Secondary Residence',
                        'Investment Property'
                      ]
                          .map((type) => DropdownMenuItem(
                                value: type,
                                child: Text(type),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _propertyType = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _purchasePriceController,
                      label: 'Purchase Price',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Purchase price'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _downPaymentController,
                      label: 'Down Payment',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      validator: (value) => Validators.validatePositiveNumber(
                          value, 'Down payment'),
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _loanAmountController,
                      label: 'Loan Amount',
                      keyboardType: TextInputType.number,
                      prefixIcon: const Icon(Icons.attach_money),
                      readOnly: true,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: _loanTerm,
                      decoration: InputDecoration(
                        labelText: 'Loan Term',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: ['15', '20', '30']
                          .map((term) => DropdownMenuItem(
                                value: term,
                                child: Text('$term years'),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _loanTerm = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: _loanType,
                      decoration: InputDecoration(
                        labelText: 'Loan Type',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: ['Conventional', 'FHA', 'VA', 'USDA']
                          .map((type) => DropdownMenuItem(
                                value: type,
                                child: Text(type),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _loanType = value;
                          });
                        }
                      },
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
