class LoanApplication {
  final String? id;
  final String userId;
  final String status;
  final String approval;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? approvalUpdatedAt;

  // Personal Information
  final String? borrowerFirstName;
  final String? borrowerLastName;
  final String? borrowerEmail;
  final String? borrowerPhone;
  final String? borrowerDOB;
  final String? borrowerSSN;
  final String? maritalStatus;
  final int? dependents;

  // Current Address
  final String? currentStreet;
  final String? currentCity;
  final String? currentState;
  final String? currentZip;
  final String? residencyType;
  final int? yearsAtAddress;

  // Employment Information
  final String? employerName;
  final String? employerPhone;
  final String? jobTitle;
  final int? yearsEmployed;
  final double? monthlyIncome;
  final String? employmentType;

  // Assets & Liabilities
  final double? checkingBalance;
  final double? savingsBalance;
  final double? investmentsBalance;
  final double? retirementBalance;
  final double? otherAssetsBalance;
  final double? creditCardDebt;
  final double? autoLoanDebt;
  final double? studentLoanDebt;
  final double? otherDebt;

  // Real Estate Owned
  final List<RealEstateProperty>? realEstateOwned;

  // Loan & Property Information
  final String? loanPurpose;
  final double? loanAmount;
  final String? loanTerm;
  final String? propertyType;
  final String? propertyUse;
  final String? propertyStreet;
  final String? propertyCity;
  final String? propertyState;
  final String? propertyZip;
  final double? estimatedValue;
  final int? yearBuilt;

  // Declarations
  final bool? bankruptcyHistory;
  final bool? foreclosureHistory;
  final bool? lawsuitHistory;
  final bool? loanDefaultHistory;
  final bool? citizenshipStatus;
  final String? additionalComments;

  LoanApplication({
    this.id,
    required this.userId,
    this.status = 'draft',
    this.approval = 'pending',
    this.createdAt,
    this.updatedAt,
    this.approvalUpdatedAt,
    this.borrowerFirstName,
    this.borrowerLastName,
    this.borrowerEmail,
    this.borrowerPhone,
    this.borrowerDOB,
    this.borrowerSSN,
    this.maritalStatus,
    this.dependents,
    this.currentStreet,
    this.currentCity,
    this.currentState,
    this.currentZip,
    this.residencyType,
    this.yearsAtAddress,
    this.employerName,
    this.employerPhone,
    this.jobTitle,
    this.yearsEmployed,
    this.monthlyIncome,
    this.employmentType,
    this.checkingBalance,
    this.savingsBalance,
    this.investmentsBalance,
    this.retirementBalance,
    this.otherAssetsBalance,
    this.creditCardDebt,
    this.autoLoanDebt,
    this.studentLoanDebt,
    this.otherDebt,
    this.realEstateOwned,
    this.loanPurpose,
    this.loanAmount,
    this.loanTerm,
    this.propertyType,
    this.propertyUse,
    this.propertyStreet,
    this.propertyCity,
    this.propertyState,
    this.propertyZip,
    this.estimatedValue,
    this.yearBuilt,
    this.bankruptcyHistory,
    this.foreclosureHistory,
    this.lawsuitHistory,
    this.loanDefaultHistory,
    this.citizenshipStatus,
    this.additionalComments,
  });

  factory LoanApplication.fromJson(Map<String, dynamic> json) {
    return LoanApplication(
      id: json['_id'] as String?,
      userId: json['userId'] as String,
      status: json['status'] ?? 'draft',
      approval: json['approval'] ?? 'pending',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      approvalUpdatedAt: json['approvalUpdatedAt'] != null
          ? DateTime.parse(json['approvalUpdatedAt'])
          : null,
      borrowerFirstName: json['borrowerFirstName'] as String?,
      borrowerLastName: json['borrowerLastName'] as String?,
      borrowerEmail: json['borrowerEmail'] as String?,
      borrowerPhone: json['borrowerPhone'] as String?,
      borrowerDOB: json['borrowerDOB'] as String?,
      borrowerSSN: json['borrowerSSN'] as String?,
      maritalStatus: json['maritalStatus'] as String?,
      dependents: json['dependents'] as int?,
      currentStreet: json['currentStreet'] as String?,
      currentCity: json['currentCity'] as String?,
      currentState: json['currentState'] as String?,
      currentZip: json['currentZip'] as String?,
      residencyType: json['residencyType'] as String?,
      yearsAtAddress: json['yearsAtAddress'] as int?,
      employerName: json['employerName'] as String?,
      employerPhone: json['employerPhone'] as String?,
      jobTitle: json['jobTitle'] as String?,
      yearsEmployed: json['yearsEmployed'] as int?,
      monthlyIncome: json['monthlyIncome']?.toDouble(),
      employmentType: json['employmentType'] as String?,
      checkingBalance: json['checkingBalance']?.toDouble(),
      savingsBalance: json['savingsBalance']?.toDouble(),
      investmentsBalance: json['investmentsBalance']?.toDouble(),
      retirementBalance: json['retirementBalance']?.toDouble(),
      otherAssetsBalance: json['otherAssetsBalance']?.toDouble(),
      creditCardDebt: json['creditCardDebt']?.toDouble(),
      autoLoanDebt: json['autoLoanDebt']?.toDouble(),
      studentLoanDebt: json['studentLoanDebt']?.toDouble(),
      otherDebt: json['otherDebt']?.toDouble(),
      realEstateOwned: json['realEstateOwned'] != null
          ? (json['realEstateOwned'] as List)
              .map((e) => RealEstateProperty.fromJson(e))
              .toList()
          : null,
      loanPurpose: json['loanPurpose'] as String?,
      loanAmount: json['loanAmount']?.toDouble(),
      loanTerm: json['loanTerm'] as String?,
      propertyType: json['propertyType'] as String?,
      propertyUse: json['propertyUse'] as String?,
      propertyStreet: json['propertyStreet'] as String?,
      propertyCity: json['propertyCity'] as String?,
      propertyState: json['propertyState'] as String?,
      propertyZip: json['propertyZip'] as String?,
      estimatedValue: json['estimatedValue']?.toDouble(),
      yearBuilt: json['yearBuilt'] as int?,
      bankruptcyHistory: json['bankruptcyHistory'] as bool?,
      foreclosureHistory: json['foreclosureHistory'] as bool?,
      lawsuitHistory: json['lawsuitHistory'] as bool?,
      loanDefaultHistory: json['loanDefaultHistory'] as bool?,
      citizenshipStatus: json['citizenshipStatus'] as bool?,
      additionalComments: json['additionalComments'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) '_id': id,
      'userId': userId,
      'status': status,
      'approval': approval,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updatedAt': updatedAt!.toIso8601String(),
      if (approvalUpdatedAt != null)
        'approvalUpdatedAt': approvalUpdatedAt!.toIso8601String(),
      if (borrowerFirstName != null) 'borrowerFirstName': borrowerFirstName,
      if (borrowerLastName != null) 'borrowerLastName': borrowerLastName,
      if (borrowerEmail != null) 'borrowerEmail': borrowerEmail,
      if (borrowerPhone != null) 'borrowerPhone': borrowerPhone,
      if (borrowerDOB != null) 'borrowerDOB': borrowerDOB,
      if (borrowerSSN != null) 'borrowerSSN': borrowerSSN,
      if (maritalStatus != null) 'maritalStatus': maritalStatus,
      if (dependents != null) 'dependents': dependents,
      if (currentStreet != null) 'currentStreet': currentStreet,
      if (currentCity != null) 'currentCity': currentCity,
      if (currentState != null) 'currentState': currentState,
      if (currentZip != null) 'currentZip': currentZip,
      if (residencyType != null) 'residencyType': residencyType,
      if (yearsAtAddress != null) 'yearsAtAddress': yearsAtAddress,
      if (employerName != null) 'employerName': employerName,
      if (employerPhone != null) 'employerPhone': employerPhone,
      if (jobTitle != null) 'jobTitle': jobTitle,
      if (yearsEmployed != null) 'yearsEmployed': yearsEmployed,
      if (monthlyIncome != null) 'monthlyIncome': monthlyIncome,
      if (employmentType != null) 'employmentType': employmentType,
      if (checkingBalance != null) 'checkingBalance': checkingBalance,
      if (savingsBalance != null) 'savingsBalance': savingsBalance,
      if (investmentsBalance != null) 'investmentsBalance': investmentsBalance,
      if (retirementBalance != null) 'retirementBalance': retirementBalance,
      if (otherAssetsBalance != null) 'otherAssetsBalance': otherAssetsBalance,
      if (creditCardDebt != null) 'creditCardDebt': creditCardDebt,
      if (autoLoanDebt != null) 'autoLoanDebt': autoLoanDebt,
      if (studentLoanDebt != null) 'studentLoanDebt': studentLoanDebt,
      if (otherDebt != null) 'otherDebt': otherDebt,
      if (realEstateOwned != null)
        'realEstateOwned': realEstateOwned!.map((e) => e.toJson()).toList(),
      if (loanPurpose != null) 'loanPurpose': loanPurpose,
      if (loanAmount != null) 'loanAmount': loanAmount,
      if (loanTerm != null) 'loanTerm': loanTerm,
      if (propertyType != null) 'propertyType': propertyType,
      if (propertyUse != null) 'propertyUse': propertyUse,
      if (propertyStreet != null) 'propertyStreet': propertyStreet,
      if (propertyCity != null) 'propertyCity': propertyCity,
      if (propertyState != null) 'propertyState': propertyState,
      if (propertyZip != null) 'propertyZip': propertyZip,
      if (estimatedValue != null) 'estimatedValue': estimatedValue,
      if (yearBuilt != null) 'yearBuilt': yearBuilt,
      if (bankruptcyHistory != null) 'bankruptcyHistory': bankruptcyHistory,
      if (foreclosureHistory != null) 'foreclosureHistory': foreclosureHistory,
      if (lawsuitHistory != null) 'lawsuitHistory': lawsuitHistory,
      if (loanDefaultHistory != null) 'loanDefaultHistory': loanDefaultHistory,
      if (citizenshipStatus != null) 'citizenshipStatus': citizenshipStatus,
      if (additionalComments != null) 'additionalComments': additionalComments,
    };
  }

  LoanApplication copyWith({
    String? id,
    String? userId,
    String? status,
    String? approval,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? approvalUpdatedAt,
    String? borrowerFirstName,
    String? borrowerLastName,
    String? borrowerEmail,
    String? borrowerPhone,
    String? borrowerDOB,
    String? borrowerSSN,
    String? maritalStatus,
    int? dependents,
    String? currentStreet,
    String? currentCity,
    String? currentState,
    String? currentZip,
    String? residencyType,
    int? yearsAtAddress,
    String? employerName,
    String? employerPhone,
    String? jobTitle,
    int? yearsEmployed,
    double? monthlyIncome,
    String? employmentType,
    double? checkingBalance,
    double? savingsBalance,
    double? investmentsBalance,
    double? retirementBalance,
    double? otherAssetsBalance,
    double? creditCardDebt,
    double? autoLoanDebt,
    double? studentLoanDebt,
    double? otherDebt,
    List<RealEstateProperty>? realEstateOwned,
    String? loanPurpose,
    double? loanAmount,
    String? loanTerm,
    String? propertyType,
    String? propertyUse,
    String? propertyStreet,
    String? propertyCity,
    String? propertyState,
    String? propertyZip,
    double? estimatedValue,
    int? yearBuilt,
    bool? bankruptcyHistory,
    bool? foreclosureHistory,
    bool? lawsuitHistory,
    bool? loanDefaultHistory,
    bool? citizenshipStatus,
    String? additionalComments,
  }) {
    return LoanApplication(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      status: status ?? this.status,
      approval: approval ?? this.approval,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      approvalUpdatedAt: approvalUpdatedAt ?? this.approvalUpdatedAt,
      borrowerFirstName: borrowerFirstName ?? this.borrowerFirstName,
      borrowerLastName: borrowerLastName ?? this.borrowerLastName,
      borrowerEmail: borrowerEmail ?? this.borrowerEmail,
      borrowerPhone: borrowerPhone ?? this.borrowerPhone,
      borrowerDOB: borrowerDOB ?? this.borrowerDOB,
      borrowerSSN: borrowerSSN ?? this.borrowerSSN,
      maritalStatus: maritalStatus ?? this.maritalStatus,
      dependents: dependents ?? this.dependents,
      currentStreet: currentStreet ?? this.currentStreet,
      currentCity: currentCity ?? this.currentCity,
      currentState: currentState ?? this.currentState,
      currentZip: currentZip ?? this.currentZip,
      residencyType: residencyType ?? this.residencyType,
      yearsAtAddress: yearsAtAddress ?? this.yearsAtAddress,
      employerName: employerName ?? this.employerName,
      employerPhone: employerPhone ?? this.employerPhone,
      jobTitle: jobTitle ?? this.jobTitle,
      yearsEmployed: yearsEmployed ?? this.yearsEmployed,
      monthlyIncome: monthlyIncome ?? this.monthlyIncome,
      employmentType: employmentType ?? this.employmentType,
      checkingBalance: checkingBalance ?? this.checkingBalance,
      savingsBalance: savingsBalance ?? this.savingsBalance,
      investmentsBalance: investmentsBalance ?? this.investmentsBalance,
      retirementBalance: retirementBalance ?? this.retirementBalance,
      otherAssetsBalance: otherAssetsBalance ?? this.otherAssetsBalance,
      creditCardDebt: creditCardDebt ?? this.creditCardDebt,
      autoLoanDebt: autoLoanDebt ?? this.autoLoanDebt,
      studentLoanDebt: studentLoanDebt ?? this.studentLoanDebt,
      otherDebt: otherDebt ?? this.otherDebt,
      realEstateOwned: realEstateOwned ?? this.realEstateOwned,
      loanPurpose: loanPurpose ?? this.loanPurpose,
      loanAmount: loanAmount ?? this.loanAmount,
      loanTerm: loanTerm ?? this.loanTerm,
      propertyType: propertyType ?? this.propertyType,
      propertyUse: propertyUse ?? this.propertyUse,
      propertyStreet: propertyStreet ?? this.propertyStreet,
      propertyCity: propertyCity ?? this.propertyCity,
      propertyState: propertyState ?? this.propertyState,
      propertyZip: propertyZip ?? this.propertyZip,
      estimatedValue: estimatedValue ?? this.estimatedValue,
      yearBuilt: yearBuilt ?? this.yearBuilt,
      bankruptcyHistory: bankruptcyHistory ?? this.bankruptcyHistory,
      foreclosureHistory: foreclosureHistory ?? this.foreclosureHistory,
      lawsuitHistory: lawsuitHistory ?? this.lawsuitHistory,
      loanDefaultHistory: loanDefaultHistory ?? this.loanDefaultHistory,
      citizenshipStatus: citizenshipStatus ?? this.citizenshipStatus,
      additionalComments: additionalComments ?? this.additionalComments,
    );
  }
}

class RealEstateProperty {
  final String address;
  final double marketValue;
  final double? mortgageBalance;
  final double? monthlyPayment;
  final String? propertyStatus;

  RealEstateProperty({
    required this.address,
    required this.marketValue,
    this.mortgageBalance,
    this.monthlyPayment,
    this.propertyStatus,
  });

  factory RealEstateProperty.fromJson(Map<String, dynamic> json) {
    return RealEstateProperty(
      address: json['address'] as String,
      marketValue: json['marketValue']?.toDouble() ?? 0.0,
      mortgageBalance: json['mortgageBalance']?.toDouble(),
      monthlyPayment: json['monthlyPayment']?.toDouble(),
      propertyStatus: json['propertyStatus'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'marketValue': marketValue,
      if (mortgageBalance != null) 'mortgageBalance': mortgageBalance,
      if (monthlyPayment != null) 'monthlyPayment': monthlyPayment,
      if (propertyStatus != null) 'propertyStatus': propertyStatus,
    };
  }
}
