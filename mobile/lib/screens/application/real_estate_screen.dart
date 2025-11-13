import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../models/loan_application.dart';
import '../../utils/app_theme.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class RealEstateScreen extends StatefulWidget {
  const RealEstateScreen({super.key});

  @override
  State<RealEstateScreen> createState() => _RealEstateScreenState();
}

class _RealEstateScreenState extends State<RealEstateScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _ownsOtherProperty = false;
  final List<Map<String, dynamic>> _properties = [];

  @override
  void initState() {
    super.initState();
    _loadExistingData();
  }

  void _loadExistingData() {
    final appProvider = context.read<ApplicationProvider>();
    final app = appProvider.application;

    if (app != null &&
        app.realEstateOwned != null &&
        app.realEstateOwned!.isNotEmpty) {
      setState(() {
        _ownsOtherProperty = true;
        _properties.addAll(app.realEstateOwned!
            .map((prop) => {
                  'address': prop.address,
                  'value': prop.marketValue,
                  'mortgage': prop.mortgageBalance,
                  'rental': prop.monthlyPayment,
                })
            .toList());
      });
    }
  }

  void _addProperty() {
    setState(() {
      _properties.add({
        'address': '',
        'value': 0.0,
        'mortgage': 0.0,
        'rental': 0.0,
      });
    });
  }

  void _removeProperty(int index) {
    setState(() {
      _properties.removeAt(index);
      if (_properties.isEmpty) {
        _ownsOtherProperty = false;
      }
    });
  }

  Future<void> _handleContinue() async {
    if (_formKey.currentState?.validate() ?? false) {
      final appProvider = context.read<ApplicationProvider>();

      final realEstateOwned = _ownsOtherProperty
          ? _properties
              .map((prop) => RealEstateProperty(
                    address: prop['address'],
                    marketValue: prop['value'],
                    mortgageBalance: prop['mortgage'],
                    monthlyPayment: prop['rental'],
                  ))
              .toList()
          : null;

      appProvider.updateLocalApplication({
        'realEstateOwned': realEstateOwned,
      });

      if (mounted) {
        Navigator.pushNamed(context, '/application/declarations');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Real Estate Owned'),
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
                      'Step 5 of 7',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: 5 / 7,
                      backgroundColor: AppTheme.dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Other Properties',
                      style: AppTheme.headingMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Do you own any other real estate properties?',
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
                    SwitchListTile(
                      title: const Text('I own other real estate'),
                      value: _ownsOtherProperty,
                      onChanged: (value) {
                        setState(() {
                          _ownsOtherProperty = value;
                          if (value && _properties.isEmpty) {
                            _addProperty();
                          }
                        });
                      },
                    ),
                    const SizedBox(height: 24),
                    if (_ownsOtherProperty) ...[
                      ..._properties.asMap().entries.map((entry) {
                        final index = entry.key;
                        final property = entry.value;
                        return _PropertyCard(
                          propertyNumber: index + 1,
                          property: property,
                          onRemove: () => _removeProperty(index),
                        );
                      }).toList(),
                      const SizedBox(height: 16),
                      SecondaryButton(
                        text: 'Add Another Property',
                        icon: Icons.add,
                        onPressed: _addProperty,
                      ),
                      const SizedBox(height: 32),
                    ],
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

class _PropertyCard extends StatefulWidget {
  final int propertyNumber;
  final Map<String, dynamic> property;
  final VoidCallback onRemove;

  const _PropertyCard({
    required this.propertyNumber,
    required this.property,
    required this.onRemove,
  });

  @override
  State<_PropertyCard> createState() => _PropertyCardState();
}

class _PropertyCardState extends State<_PropertyCard> {
  late TextEditingController _addressController;
  late TextEditingController _valueController;
  late TextEditingController _mortgageController;
  late TextEditingController _rentalController;

  @override
  void initState() {
    super.initState();
    _addressController =
        TextEditingController(text: widget.property['address']);
    _valueController = TextEditingController(
      text: widget.property['value']?.toString() ?? '',
    );
    _mortgageController = TextEditingController(
      text: widget.property['mortgage']?.toString() ?? '',
    );
    _rentalController = TextEditingController(
      text: widget.property['rental']?.toString() ?? '',
    );

    _addressController.addListener(() {
      widget.property['address'] = _addressController.text;
    });
    _valueController.addListener(() {
      widget.property['value'] = double.tryParse(_valueController.text) ?? 0.0;
    });
    _mortgageController.addListener(() {
      widget.property['mortgage'] =
          double.tryParse(_mortgageController.text) ?? 0.0;
    });
    _rentalController.addListener(() {
      widget.property['rental'] =
          double.tryParse(_rentalController.text) ?? 0.0;
    });
  }

  @override
  void dispose() {
    _addressController.dispose();
    _valueController.dispose();
    _mortgageController.dispose();
    _rentalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Property ${widget.propertyNumber}',
                  style: AppTheme.headingSmall,
                ),
                IconButton(
                  icon: Icon(Icons.delete, color: AppTheme.errorColor),
                  onPressed: widget.onRemove,
                ),
              ],
            ),
            const SizedBox(height: 16),
            CustomTextField(
              controller: _addressController,
              label: 'Property Address',
              validator: (value) =>
                  Validators.validateRequired(value, 'Property address'),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              controller: _valueController,
              label: 'Estimated Value',
              keyboardType: TextInputType.number,
              prefixIcon: const Icon(Icons.attach_money),
              validator: (value) =>
                  Validators.validatePositiveNumber(value, 'Estimated value'),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              controller: _mortgageController,
              label: 'Mortgage Balance (if any)',
              keyboardType: TextInputType.number,
              prefixIcon: const Icon(Icons.attach_money),
              validator: (value) =>
                  Validators.validatePositiveNumber(value, 'Mortgage balance'),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              controller: _rentalController,
              label: 'Monthly Rental Income (if any)',
              keyboardType: TextInputType.number,
              prefixIcon: const Icon(Icons.attach_money),
              validator: (value) =>
                  Validators.validatePositiveNumber(value, 'Rental income'),
            ),
          ],
        ),
      ),
    );
  }
}
