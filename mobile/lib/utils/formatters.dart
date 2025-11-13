import 'package:intl/intl.dart';

class Formatters {
  // Format currency
  static String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      symbol: '\$',
      decimalDigits: 2,
    );
    return formatter.format(amount);
  }

  // Format phone number (XXX) XXX-XXXX
  static String formatPhone(String phone) {
    final numericOnly = phone.replaceAll(RegExp(r'[^0-9]'), '');
    
    if (numericOnly.length != 10) {
      return phone;
    }
    
    return '(${numericOnly.substring(0, 3)}) ${numericOnly.substring(3, 6)}-${numericOnly.substring(6)}';
  }

  // Format SSN XXX-XX-XXXX
  static String formatSSN(String ssn) {
    final numericOnly = ssn.replaceAll(RegExp(r'[^0-9]'), '');
    
    if (numericOnly.length != 9) {
      return ssn;
    }
    
    return '${numericOnly.substring(0, 3)}-${numericOnly.substring(3, 5)}-${numericOnly.substring(5)}';
  }

  // Mask SSN (show only last 4 digits)
  static String maskSSN(String ssn) {
    final numericOnly = ssn.replaceAll(RegExp(r'[^0-9]'), '');
    
    if (numericOnly.length != 9) {
      return '***-**-****';
    }
    
    return '***-**-${numericOnly.substring(5)}';
  }

  // Format date
  static String formatDate(DateTime date) {
    return DateFormat('MM/dd/yyyy').format(date);
  }

  // Format date and time
  static String formatDateTime(DateTime dateTime) {
    return DateFormat('MM/dd/yyyy hh:mm a').format(dateTime);
  }

  // Parse date from string
  static DateTime? parseDate(String dateString) {
    try {
      return DateFormat('MM/dd/yyyy').parse(dateString);
    } catch (_) {
      return null;
    }
  }

  // Format number with commas
  static String formatNumber(num number) {
    final formatter = NumberFormat('#,###');
    return formatter.format(number);
  }

  // Format percentage
  static String formatPercentage(double value, {int decimals = 2}) {
    return '${value.toStringAsFixed(decimals)}%';
  }

  // Capitalize first letter
  static String capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }

  // Format loan term
  static String formatLoanTerm(String term) {
    switch (term) {
      case '15':
        return '15 Years';
      case '30':
        return '30 Years';
      default:
        return '$term Years';
    }
  }

  // Format approval status
  static String formatApprovalStatus(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Approved';
      case 'denied':
        return 'Denied';
      case 'pending':
        return 'Pending Review';
      default:
        return capitalize(status);
    }
  }

  // Format application status
  static String formatApplicationStatus(String status) {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'in_review':
        return 'In Review';
      case 'approved':
        return 'Approved';
      case 'denied':
        return 'Denied';
      default:
        return capitalize(status);
    }
  }
}
