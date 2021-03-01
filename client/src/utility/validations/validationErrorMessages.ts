export const validationErrorMessage = {
  REQUIRED: "* Required",
  INVALID_NAME: "This name is invalid",
  EMAIL: "This email ID is invalid. Enter a valid email ID.",
  MOBILE_NUMBER:
    "This mobile number is invalid. Enter a valid 10 digit mobile number",
  EMAIL_OR_MOBILE: "This mobile number or email ID is invalid",
  ADDRESS: "Address should be at least 10 characters long",
  PINCODE: "This Pin Code is invalid",
  PAN_CARD: "This PAN No. is invalid",
  AADHAR_NO: "This Aadhar No. is invalid",
  PASSPORT_NO: "This Passport No. is invalid",
  GSTIN_NUMBER: "This GSTIN No. is invalid",
  DATE_OF_BIRTH: "This Date of birth is invalid",
  DATE_EIGHTEEN_YEARS_OLD: "Employee should be atleast 18 years old",
  ADDRESSLINE: "This address is invalid",

  //FAID MEssages
  FA_ID_NOT_AVAILABLE:
    "The FA ID is already taken, click on Clear to try another FA ID.",
  FA_ID_AVAILABLE:
    "FA ID is available. Please click on save to use your new FA ID.",
  FA_ID_INVALID: "This FA Id is invalid.",

  USERNAME_ALREADY_EXISTS:
    // "This email ID or mobile number already exists. Kindly sign in",
    "This Bharat Petroleum account already exist. Kindly Sign in",
  USERNAME_DOESNOT_EXIST:
    "This Bharat Petroleum account doesn't exist. Enter correct User ID or Sign Up",
  INVALID_CREDENTIALS:
    "Password is incorrect, try again. If you don't remember your password, reset it now.",

  //error messages for credit card validation in payment methods
  CREDIT_CARD_NAME_INVALID: "This Card Name is invalid",
  CREDIT_CARD_NUMBER: "This Credit Number is invalid",
  CREDIT_CARD_EXPIRY_DATE: "This Expiry Date is invalid",
  CREDIT_CARD_CVV: "This CVV is invalid",

  // password error
  INVALID_PASSWORD:
    "Password should be atleast 8 characters long including a combination of upper, lower, number, special character",
  INVALID_PASSWORD_LENGTH:
    "Password should be atleast 8 characters",
  UNMATCHED_PASSWORD: "The passwords did not match. Try again",
  UNMATCHED_PASSWORD_SETTINGS: "Passwords do not match. Please retry.",
  NEW_PASSWORD_SAME_AS_OLD: "New password should be different from old one",
  TRANSACTION_REF_NOT_AVAILABLE:
    "Transaction Reference No. has already been used. Try another Transaction Reference No.",
  TRANSACTION_REF_INVALID: "This Transaction Reference No. is invalid.",
  ORGANIZATION_NAME_INVALID: "This Organization Name is invalid.",

  //Card Management Fields
  CUSTOM_CARD_NAME_INVALID: "This Custom Card Name is invalid", //isValidName
  CUSTOM_CARD_PERSONALIZATION_INVALID: "This Card Personalization Name is invalid", //isValidCardPersonalization


  VEHICLE_NUMBER_INVALID: "This vehicle number is invalid. Enter a valid vehicle number without spaces", //isValidVehicleNumber
  YEAR_OF_REGISTRATION: "This Year of Registration is invalid. Enter a valid year of registration in the format YYYY", //isValidYearOfRegistration
  MOBILE_NUMBER_DUPLICATE: "This mobile number already exists in the database. Try another mobile number.",
  MOBILE_NUMBER_DUPLICATE_FE: "This mobile number already exists in other card. Try another mobile number.",
};
