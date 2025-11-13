import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'route_names.dart';

/// Extension methods for easy navigation using GoRouter
extension NavigationExtensions on BuildContext {
  // Navigation methods
  void goHome() => go(RoutePaths.home);
  void goSignIn() => go(RoutePaths.signIn);
  void goSignUp() => go(RoutePaths.signUp);
  void goForgotPassword() => go(RoutePaths.forgotPassword);
  void goDashboard() => go(RoutePaths.dashboard);
  void goProfile() => go(RoutePaths.profile);
  void goAdminDashboard() => go(RoutePaths.adminDashboard);

  // Application form navigation
  void goPersonalInfo() => go(RoutePaths.personalInfo);
  void goEmployment() => go(RoutePaths.employment);
  void goAssetsLiabilities() => go(RoutePaths.assetsLiabilities);
  void goPropertyInfo() => go(RoutePaths.propertyInfo);
  void goRealEstate() => go(RoutePaths.realEstate);
  void goDeclarations() => go(RoutePaths.declarations);
  void goReview() => go(RoutePaths.review);

  // Admin navigation
  void goAdminApplicationDetail(String id) =>
      go(RoutePaths.adminApplicationDetail(id));

  // Push methods (for stacking routes)
  void pushSignIn() => push(RoutePaths.signIn);
  void pushSignUp() => push(RoutePaths.signUp);
  void pushProfile() => push(RoutePaths.profile);
  void pushPersonalInfo() => push(RoutePaths.personalInfo);
  void pushAdminApplicationDetail(String id) =>
      push(RoutePaths.adminApplicationDetail(id));

  // Named navigation using GoRouter's context methods
  void goNamed(String name,
      {Map<String, String>? pathParameters,
      Map<String, dynamic>? queryParameters}) {
    GoRouter.of(this).goNamed(
      name,
      pathParameters: pathParameters ?? {},
      queryParameters: queryParameters ?? {},
    );
  }

  void pushNamed(String name,
      {Map<String, String>? pathParameters,
      Map<String, dynamic>? queryParameters}) {
    GoRouter.of(this).pushNamed(
      name,
      pathParameters: pathParameters ?? {},
      queryParameters: queryParameters ?? {},
    );
  }
}
