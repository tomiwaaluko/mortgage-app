import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/custom_button.dart';
import '../widgets/common_widgets.dart';

class VerifyEmailScreen extends StatefulWidget {
  final String? token;

  const VerifyEmailScreen({super.key, this.token});

  @override
  State<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {
  bool _isVerifying = false;
  bool _verificationSuccess = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    if (widget.token != null) {
      _verifyEmail();
    }
  }

  Future<void> _verifyEmail() async {
    setState(() {
      _isVerifying = true;
      _errorMessage = null;
    });

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.verifyEmail(token: widget.token!);

    if (mounted) {
      setState(() {
        _isVerifying = false;
        _verificationSuccess = success;
        _errorMessage = success ? null : authProvider.error;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Email Verification'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(
                _verificationSuccess
                    ? Icons.check_circle
                    : _isVerifying
                        ? Icons.email
                        : Icons.error_outline,
                size: 100,
                color: _verificationSuccess
                    ? AppTheme.secondaryColor
                    : _isVerifying
                        ? AppTheme.primaryColor
                        : AppTheme.errorColor,
              ),
              const SizedBox(height: 32),
              Text(
                _verificationSuccess
                    ? 'Email Verified!'
                    : _isVerifying
                        ? 'Verifying...'
                        : 'Verification Failed',
                style: AppTheme.headingLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              if (_isVerifying)
                const Center(child: CircularProgressIndicator())
              else if (_verificationSuccess)
                Text(
                  'Your email has been verified successfully. You can now sign in to your account.',
                  style: AppTheme.bodyMedium.copyWith(
                    color: AppTheme.textSecondaryColor,
                  ),
                  textAlign: TextAlign.center,
                )
              else if (_errorMessage != null)
                ErrorMessage(message: _errorMessage!),
              const SizedBox(height: 32),
              if (_verificationSuccess)
                PrimaryButton(
                  text: 'Sign In',
                  onPressed: () {
                    Navigator.pushReplacementNamed(context, '/sign-in');
                  },
                )
              else if (!_isVerifying && widget.token != null)
                PrimaryButton(
                  text: 'Try Again',
                  onPressed: _verifyEmail,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
