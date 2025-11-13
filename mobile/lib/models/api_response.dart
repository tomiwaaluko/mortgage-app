class ApiResponse<T> {
  final bool ok;
  final T? data;
  final String? error;
  final String? message;

  ApiResponse({
    required this.ok,
    this.data,
    this.error,
    this.message,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      ok: json['ok'] ?? false,
      data: fromJsonT != null && json['data'] != null
          ? fromJsonT(json['data'])
          : json['data'] as T?,
      error: json['error'] as String?,
      message: json['message'] as String?,
    );
  }
}

class AuthResponse {
  final bool ok;
  final User? user;
  final String? accessToken;
  final String? error;
  final String? message;
  final String? code;
  final bool? alreadyVerified;

  AuthResponse({
    required this.ok,
    this.user,
    this.accessToken,
    this.error,
    this.message,
    this.code,
    this.alreadyVerified,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      ok: json['ok'] ?? false,
      user: json['user'] != null
          ? User.fromJson(json['user'] as Map<String, dynamic>)
          : null,
      accessToken: json['accessToken'] as String?,
      error: json['error'] as String?,
      message: json['message'] as String?,
      code: json['code'] as String?,
      alreadyVerified: json['alreadyVerified'] as bool?,
    );
  }
}

class User {
  final String id;
  final String email;
  final String? firstName;
  final String? lastName;

  User({
    required this.id,
    required this.email,
    this.firstName,
    this.lastName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      if (firstName != null) 'firstName': firstName,
      if (lastName != null) 'lastName': lastName,
    };
  }
}
