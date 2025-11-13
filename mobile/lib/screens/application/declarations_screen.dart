import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/application_provider.dart';
import '../../utils/app_theme.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/common_widgets.dart';

class DeclarationsScreen extends StatefulWidget {
  const DeclarationsScreen({super.key});

  @override
  State<DeclarationsScreen> createState() => _DeclarationsScreenState();
}

class _DeclarationsScreenState extends State<DeclarationsScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _bankruptcyHistory = false;
  bool _foreclosureHistory = false;
  bool _legalIssues = false;
  bool _citizenshipStatus = false;

  @override
  void initState() {
    super.initState();
    _loadExistingData();
  }

  void _loadExistingData() {
    final appProvider = context.read<ApplicationProvider>();
    final app = appProvider.application;

    if (app != null) {
      setState(() {
        _bankruptcyHistory = app.bankruptcyHistory ?? false;
        _foreclosureHistory = app.foreclosureHistory ?? false;
        _legalIssues = app.lawsuitHistory ?? false;
        _citizenshipStatus = app.citizenshipStatus ?? false;
      });
    }
  }

  Future<void> _handleContinue() async {
    if (_formKey.currentState?.validate() ?? false) {
      final appProvider = context.read<ApplicationProvider>();

      appProvider.updateLocalApplication({
        'bankruptcyHistory': _bankruptcyHistory,
        'foreclosureHistory': _foreclosureHistory,
        'lawsuitHistory': _legalIssues,
        'citizenshipStatus': _citizenshipStatus,
      });

      if (mounted) {
        Navigator.pushNamed(context, '/application/review');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Declarations'),
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
                      'Step 6 of 7',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: 6 / 7,
                      backgroundColor: AppTheme.dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Important Disclosures',
                      style: AppTheme.headingMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Please answer the following questions truthfully',
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
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            _DeclarationItem(
                              question:
                                  'Are you a U.S. citizen or permanent resident?',
                              value: _citizenshipStatus,
                              onChanged: (value) {
                                setState(() {
                                  _citizenshipStatus = value;
                                });
                              },
                            ),
                            const Divider(height: 32),
                            _DeclarationItem(
                              question:
                                  'Have you had a bankruptcy in the past 7 years?',
                              value: _bankruptcyHistory,
                              onChanged: (value) {
                                setState(() {
                                  _bankruptcyHistory = value;
                                });
                              },
                            ),
                            const Divider(height: 32),
                            _DeclarationItem(
                              question:
                                  'Have you had property foreclosed upon in the past 7 years?',
                              value: _foreclosureHistory,
                              onChanged: (value) {
                                setState(() {
                                  _foreclosureHistory = value;
                                });
                              },
                            ),
                            const Divider(height: 32),
                            _DeclarationItem(
                              question:
                                  'Are you currently involved in any lawsuits or legal proceedings?',
                              value: _legalIssues,
                              onChanged: (value) {
                                setState(() {
                                  _legalIssues = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: AppTheme.primaryColor,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'All information provided must be accurate and truthful. Providing false information may result in denial or legal consequences.',
                              style: AppTheme.bodySmall.copyWith(
                                color: AppTheme.textPrimaryColor,
                              ),
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

class _DeclarationItem extends StatelessWidget {
  final String question;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _DeclarationItem({
    required this.question,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          question,
          style: AppTheme.bodyMedium,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => onChanged(true),
                style: OutlinedButton.styleFrom(
                  backgroundColor: value
                      ? AppTheme.primaryColor.withOpacity(0.1)
                      : Colors.transparent,
                  side: BorderSide(
                    color:
                        value ? AppTheme.primaryColor : AppTheme.dividerColor,
                    width: value ? 2 : 1,
                  ),
                ),
                child: Text(
                  'Yes',
                  style: TextStyle(
                    color: value
                        ? AppTheme.primaryColor
                        : AppTheme.textSecondaryColor,
                    fontWeight: value ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: OutlinedButton(
                onPressed: () => onChanged(false),
                style: OutlinedButton.styleFrom(
                  backgroundColor: !value
                      ? AppTheme.primaryColor.withOpacity(0.1)
                      : Colors.transparent,
                  side: BorderSide(
                    color:
                        !value ? AppTheme.primaryColor : AppTheme.dividerColor,
                    width: !value ? 2 : 1,
                  ),
                ),
                child: Text(
                  'No',
                  style: TextStyle(
                    color: !value
                        ? AppTheme.primaryColor
                        : AppTheme.textSecondaryColor,
                    fontWeight: !value ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
