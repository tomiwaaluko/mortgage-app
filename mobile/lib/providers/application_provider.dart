import 'package:flutter/foundation.dart';
import '../models/loan_application.dart';
import '../services/application_service.dart';

enum ApplicationStatus {
  idle,
  loading,
  loaded,
  submitting,
  error,
}

class ApplicationProvider extends ChangeNotifier {
  final ApplicationService _applicationService;

  ApplicationStatus _status = ApplicationStatus.idle;
  LoanApplication? _application;
  List<LoanApplication>? _allApplications;
  String? _error;
  bool _isLoading = false;

  ApplicationProvider({ApplicationService? applicationService})
      : _applicationService = applicationService ?? ApplicationService();

  // Getters
  ApplicationStatus get status => _status;
  LoanApplication? get application => _application;
  List<LoanApplication>? get allApplications => _allApplications;
  String? get error => _error;
  bool get isLoading => _isLoading;
  bool get hasApplication => _application != null;

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Load user's application
  Future<void> loadUserApplication() async {
    try {
      _status = ApplicationStatus.loading;
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _applicationService.getUserApplication();

      if (response.ok) {
        _application = response.data;
        _status = ApplicationStatus.loaded;
      } else {
        // No application found or error
        _application = null;
        _status = ApplicationStatus.idle;
        if (response.error != null && !response.error!.contains('not found')) {
          _error = response.error;
        }
      }
    } catch (e) {
      _error = e.toString();
      _status = ApplicationStatus.error;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Submit or update application
  Future<bool> submitApplication(LoanApplication application) async {
    try {
      _status = ApplicationStatus.submitting;
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _applicationService.submitApplication(
        application: application,
      );

      if (response.ok) {
        // Reload the application to get updated data
        await loadUserApplication();
        return true;
      } else {
        _error = response.error ?? 'Failed to submit application';
        _status = ApplicationStatus.error;
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _status = ApplicationStatus.error;
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update application data (locally, for form editing)
  void updateApplicationData(LoanApplication updatedApplication) {
    _application = updatedApplication;
    notifyListeners();
  }

  // Update specific fields
  void updateField(LoanApplication Function(LoanApplication) update) {
    if (_application != null) {
      _application = update(_application!);
      notifyListeners();
    }
  }

  // Delete application
  Future<bool> deleteApplication() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _applicationService.deleteApplication();

      if (response.ok) {
        _application = null;
        _status = ApplicationStatus.idle;
        return true;
      } else {
        _error = response.error ?? 'Failed to delete application';
        return false;
      }
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load all applications (Admin only)
  Future<void> loadAllApplications() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _applicationService.getAllApplications();

      if (response.ok && response.data != null) {
        _allApplications = response.data;
      } else {
        _error = response.error ?? 'Failed to load applications';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Get application by ID (Admin only)
  Future<LoanApplication?> getApplicationById(String applicationId) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _applicationService.getApplicationById(
        applicationId: applicationId,
      );

      if (response.ok && response.data != null) {
        return response.data;
      } else {
        _error = response.error ?? 'Failed to load application';
        return null;
      }
    } catch (e) {
      _error = e.toString();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update approval status (Admin only)
  Future<bool> updateApprovalStatus({
    required String applicationId,
    required String approval,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _applicationService.updateApprovalStatus(
        applicationId: applicationId,
        approval: approval,
      );

      if (response.ok) {
        // Reload all applications to reflect the change
        await loadAllApplications();
        return true;
      } else {
        _error = response.error ?? 'Failed to update approval status';
        return false;
      }
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create a new draft application
  void createDraftApplication(String userId) {
    _application = LoanApplication(
      userId: userId,
      status: 'draft',
      approval: 'pending',
    );
    _status = ApplicationStatus.idle;
    notifyListeners();
  }

  // Clear application data
  void clearApplication() {
    _application = null;
    _status = ApplicationStatus.idle;
    _error = null;
    notifyListeners();
  }

  // Clear all applications (Admin)
  void clearAllApplications() {
    _allApplications = null;
    notifyListeners();
  }

  // Reset provider state
  void reset() {
    _application = null;
    _allApplications = null;
    _status = ApplicationStatus.idle;
    _error = null;
    _isLoading = false;
    notifyListeners();
  }
}
