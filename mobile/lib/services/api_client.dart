import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiClient {
  final String baseUrl;
  String? _accessToken;

  ApiClient({this.baseUrl = AppConstants.apiBaseUrl});

  // Get access token
  Future<String?> getAccessToken() async {
    if (_accessToken != null) return _accessToken;
    
    final prefs = await SharedPreferences.getInstance();
    _accessToken = prefs.getString(AppConstants.accessTokenKey);
    return _accessToken;
  }

  // Set access token
  Future<void> setAccessToken(String? token) async {
    _accessToken = token;
    final prefs = await SharedPreferences.getInstance();
    
    if (token != null) {
      await prefs.setString(AppConstants.accessTokenKey, token);
    } else {
      await prefs.remove(AppConstants.accessTokenKey);
    }
  }

  // Clear all stored data
  Future<void> clearStorage() async {
    _accessToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // Build headers
  Future<Map<String, String>> _buildHeaders({bool requiresAuth = false}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      final token = await getAccessToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Handle response
  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return {'ok': true};
      }
      return json.decode(response.body) as Map<String, dynamic>;
    }

    // Handle error responses
    String errorMessage = 'Request failed with status ${response.statusCode}';
    
    try {
      final errorBody = json.decode(response.body) as Map<String, dynamic>;
      errorMessage = errorBody['error'] as String? ?? errorMessage;
    } catch (_) {
      // If we can't parse the error, use the default message
    }

    throw ApiException(errorMessage, statusCode: response.statusCode);
  }

  // GET request
  Future<Map<String, dynamic>> get(
    String endpoint, {
    bool requiresAuth = false,
    Map<String, String>? queryParameters,
  }) async {
    try {
      final headers = await _buildHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('$baseUrl$endpoint').replace(
        queryParameters: queryParameters,
      );

      final response = await http.get(uri, headers: headers);
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // POST request
  Future<Map<String, dynamic>> post(
    String endpoint, {
    required Map<String, dynamic> data,
    bool requiresAuth = false,
  }) async {
    try {
      final headers = await _buildHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('$baseUrl$endpoint');

      final response = await http.post(
        uri,
        headers: headers,
        body: json.encode(data),
      );
      
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // PATCH request
  Future<Map<String, dynamic>> patch(
    String endpoint, {
    required Map<String, dynamic> data,
    bool requiresAuth = false,
  }) async {
    try {
      final headers = await _buildHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('$baseUrl$endpoint');

      final response = await http.patch(
        uri,
        headers: headers,
        body: json.encode(data),
      );
      
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // DELETE request
  Future<Map<String, dynamic>> delete(
    String endpoint, {
    bool requiresAuth = false,
  }) async {
    try {
      final headers = await _buildHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('$baseUrl$endpoint');

      final response = await http.delete(uri, headers: headers);
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}');
    }
  }
}
