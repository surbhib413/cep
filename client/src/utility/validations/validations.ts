export const isValidPan = (value: string): boolean => {
  const regexPan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  if (regexPan.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidGstin = (value: string): boolean => {
  const regexGstin = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (regexGstin.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isVailidName = (value: string) => {
  const regexName = /^[a-zA-Z ]*$/;
  if (regexName.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidAadhar = (value: string): boolean => {
  const regexAadhar = /^([0-9]){12}$/;
  if (regexAadhar.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidPassport = (value: string): boolean => {
  const regexPassport = /^([a-zA-Z]){1}([0-9]){7}$/;
  if (regexPassport.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidFAId = (value: string): boolean => {
  const regexFAId = /^[0-9]{4}$/;
  if (regexFAId.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidCreditCardNumber = (value: string): boolean => {
  // const regexcreditCardNumber = /^[0-9]*$/;
  // if (regexcreditCardNumber.test(value)) {
  //   return true;
  // } else {
  //   return false;
  // }
  return true;
};

export const isValidExpiryDate = (value: string): boolean => {
  const regexcreditCardExpiryDate = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  if (regexcreditCardExpiryDate.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidCreditCardCVV = (value: string): boolean => {
  const regexcreditCardCVV = /^([0-9]){3}$/;
  if (regexcreditCardCVV.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidPassword = (value: string): boolean => {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  console.log(regexPassword.test(value));
  if (regexPassword.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidPasswordLength = (value: string): boolean => {
  if (value.length >= 8) {
    return true;
  } else {
    return false;
  }
};

export const isValidMobileNumber = (value: string): boolean => {
  //const regexMobileNumber = /^\d{10}$/;
  const regexMobileNumber = /^[6-9]\d{9}$/;
  //console.log(regexMobileNumber.test(value))
  if (regexMobileNumber.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidTransactionRefNo = (value: string): boolean => {
  const regexTransactionRefNo = /^[a-zA-Z0-9]{1,20}$/;
  console.log(regexTransactionRefNo.test(value));
  if (regexTransactionRefNo.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidEmailAddress = (value: string): boolean => {
  //const regexEmailAddress = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regexEmailAddress = /^[a-zA-Z0-9.\\_\\#\\$\\&\\^\\*\\!\\~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //Updated the regex as per channge request from the client to include special characters.
  console.log("EMAIL", regexEmailAddress.test(value))
  if (regexEmailAddress.test(value) && value.length <= 256) {
    return true;
  } else {
    return false;
  }
};

export const isValidOrganizationName = (value: string): boolean => {
  const regexValidOrganization = /^[ A-Za-z0-9~`!@#$%^&*(-)_{=}[+]|\/:;",<'>.?]*$/;
  //console.log("Organization", regexValidOrganization.test(value))
  if (regexValidOrganization.test(value) && value.length <= 256) {
    return true;
  } else {
    return false;
  }
};

export const isValidVehicleNumber = (value: string): boolean => {
  const regexValidVehicleNumber = /^[0-9A-Za-z]{6,13}$/;
  if (regexValidVehicleNumber.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidYearOfRegistration = (value: string): boolean => {
  const regexValidYearOfRegistration = /^[0-9]{4}$/;
  if (regexValidYearOfRegistration.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isOnlyNumbers = (value: string): boolean => {
  const regexNumber = /^[0-9]*$/;
      if (regexNumber.test(value)) {
        return true;
      }else{
        return false;
      }
}

export const isValidAddressline = (value: string): boolean => {
  const regexValidAddressline = /^\S[\[\]()#./0-9a-zA-Z\s,-]+$/;
  
  if (regexValidAddressline.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isValidDecimal = (value: string): boolean => {
  //validate two decimal places
  const regexValidDecimal = /^(\d*)(\.\d{1,2})?$/;

  if(regexValidDecimal.test(value)) {
    return true;
  } else {
    return false;
  }
};