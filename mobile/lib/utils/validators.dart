import 'package:email_validator/email_validator.dart';

class Validators {
  // Email validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    
    if (!EmailValidator.validate(value)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }

  // Password validation
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    return null;
  }

  // Required field validation
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  // Phone number validation
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone number is required';
    }
    
    // Remove non-numeric characters
    final numericOnly = value.replaceAll(RegExp(r'[^0-9]'), '');
    
    if (numericOnly.length != 10) {
      return 'Please enter a valid 10-digit phone number';
    }
    
    return null;
  }

  // SSN validation (XXX-XX-XXXX)
  static String? validateSSN(String? value) {
    if (value == null || value.isEmpty) {
      return 'SSN is required';
    }
    
    // Remove non-numeric characters
    final numericOnly = value.replaceAll(RegExp(r'[^0-9]'), '');
    
    if (numericOnly.length != 9) {
      return 'Please enter a valid 9-digit SSN';
    }
    
    return null;
  }

  // ZIP code validation
  static String? validateZipCode(String? value) {
    if (value == null || value.isEmpty) {
      return 'ZIP code is required';
    }
    
    final numericOnly = value.replaceAll(RegExp(r'[^0-9]'), '');
    
    if (numericOnly.length != 5) {
      return 'Please enter a valid 5-digit ZIP code';
    }
    
    return null;
  }

  // Number validation
  static String? validateNumber(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required';
    }
    
    if (double.tryParse(value) == null) {
      return 'Please enter a valid number';
    }
    
    return null;
  }

  // Positive number validation
  static String? validatePositiveNumber(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required';
    }
    
    final number = double.tryParse(value);
    if (number == null) {
      return 'Please enter a valid number';
    }
    
    if (number <= 0) {
      return '$fieldName must be greater than 0';
    }
    
    return null;
  }

  // Confirm password validation
  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    
    if (value != password) {
      return 'Passwords do not match';
    }
    
    return null;
  }

  // Date validation (simple format check)
  static String? validateDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Date is required';
    }
    
    // Basic format check for MM/DD/YYYY
    final dateRegex = RegExp(r'^\d{2}/\d{2}/\d{4}$');
    if (!dateRegex.hasMatch(value)) {
      return 'Please enter date in MM/DD/YYYY format';
    }
    
    return null;
  }
}
