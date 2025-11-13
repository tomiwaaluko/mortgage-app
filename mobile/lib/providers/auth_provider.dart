import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/api_response.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';

enum AuthState {
  initial,
  authenticated,
  unauthenticated,
  loading,
}

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;
  
  AuthState _state = AuthState.initial;
  User? _user;
  String? _error;
  bool _isLoading = false;

  AuthProvider({AuthService? authService})
      : _authService = authService ?? AuthService();

  // Getters
  AuthState get state => _state;
  User? get user => _user;
  String? get error => _error;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _state == AuthState.authenticated && _user != null;
  bool get isAdmin => _user?.isAdmin ?? false;

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Check authentication status on app start
  Future<void> checkAuthStatus() async {
    try {
      _state = AuthState.loading;
      notifyListeners();

      // Check if user data exists in storage
      final storedUser = await StorageService.getUser();
      final isAuthenticated = await _authService.isAuthenticated();

      if (storedUser != null && isAuthenticated) {
        // Verify with backend
        final response = await _authService.getCurrentUser();
        
        if (response.ok && response.data != null) {
          _user = response.data;
          await StorageService.saveUser(_user!);
          _state = AuthState.authenticated;
        } else {
          // Token might be expired
          await _logout();
          _state = AuthState.unauthenticated;
        }
      } else {
        _state = AuthState.unauthenticated;
      }
    } catch (e) {
      _state = AuthState.unauthenticated;
      _error = e.toString();
    } finally {
      notifyListeners();
    }
  }

  // Sign up
  Future<bool> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.signUp(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      );

      if (response.ok) {
        return true;
      } else {
        _error = response.error ?? 'Sign up failed';
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

  // Sign in
  Future<bool> signIn({
    required String email,
    required String password,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.signIn(
        email: email,
        password: password,
      );

      if (response.ok && response.data != null) {
        // Get full user profile
        final userResponse = await _authService.getCurrentUser();
        
        if (userResponse.ok && userResponse.data != null) {
          _user = userResponse.data;
          await StorageService.saveUser(_user!);
          _state = AuthState.authenticated;
          return true;
        } else {
          _error = userResponse.error ?? 'Failed to fetch user data';
          return false;
        }
      } else {
        _error = response.error ?? 'Sign in failed';
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

  // Verify email
  Future<bool> verifyEmail({required String token}) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.verifyEmail(token: token);

      if (response.ok) {
        return true;
      } else {
        _error = response.error ?? 'Email verification failed';
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

  // Resend verification email
  Future<bool> resendVerification({required String email}) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.resendVerification(email: email);

      if (response.ok) {
        return true;
      } else {
        _error = response.error ?? 'Failed to resend verification email';
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

  // Request password reset
  Future<bool> requestPasswordReset({required String email}) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.requestPasswordReset(email: email);

      if (response.ok) {
        return true;
      } else {
        _error = response.error ?? 'Failed to send password reset email';
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

  // Reset password
  Future<bool> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.resetPassword(
        token: token,
        password: password,
      );

      if (response.ok) {
        return true;
      } else {
        _error = response.error ?? 'Password reset failed';
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

  // Change password
  Future<bool> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );

      if (response.ok) {
        return true;
      } else {
        _error = response.error ?? 'Password change failed';
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

  // Update profile
  Future<bool> updateProfile({
    String? firstName,
    String? lastName,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _authService.updateProfile(
        firstName: firstName,
        lastName: lastName,
      );

      if (response.ok && response.data != null) {
        _user = response.data;
        await StorageService.saveUser(_user!);
        return true;
      } else {
        _error = response.error ?? 'Profile update failed';
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

  // Refresh user data
  Future<void> refreshUser() async {
    try {
      final response = await _authService.getCurrentUser();
      
      if (response.ok && response.data != null) {
        _user = response.data;
        await StorageService.saveUser(_user!);
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  // Logout
  Future<void> logout() async {
    await _logout();
  }

  // Internal logout helper
  Future<void> _logout() async {
    try {
      await _authService.logout();
    } catch (_) {
      // Ignore errors during logout
    } finally {
      _user = null;
      _state = AuthState.unauthenticated;
      _error = null;
      await StorageService.clearAll();
      notifyListeners();
    }
  }
}
