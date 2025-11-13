class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String role;
  final bool emailVerified;
  final DateTime? createdAt;
  final DateTime? verifiedAt;
  final DateTime? updatedAt;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    this.emailVerified = false,
    this.createdAt,
    this.verifiedAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      role: json['role'] as String,
      emailVerified: json['emailVerified'] ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      verifiedAt: json['verifiedAt'] != null
          ? DateTime.parse(json['verifiedAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'emailVerified': emailVerified,
      'createdAt': createdAt?.toIso8601String(),
      'verifiedAt': verifiedAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  String get fullName => '$firstName $lastName';
  bool get isAdmin => role == 'admin';
}
