import {
  ASSIGN_USERNAME,
  ASSIGN_ROLE,
  ASSIGN_PASSWORD,
  SET_ASSISTED_FLOW,
  UNSET_ASSISTED_FLOW,
  ASSIGN_ASSISTED_CUSTOMER_USER,
  SET_LANGUAGE,
  SET_BUSINESS,
  SET_BUSINESS_PROGRAM,
  LOG_USER_IN,
  LOG_USER_OUT,
  SMARTFLEET_PRIMARY_MOBILE_NUMBER,
  // PAYMENT_ISPAYMENTAPPLICABLE,
  SET_LOADER,
  SET_SMARTFLEET_APPLICATION_NUMBER,
  SET_SMARTFLEET_PAYMENT_METHOD,
  SET_PAYMENTSECTON_FAID,
  SET_PAYMENTSECTON_INDIVIDUAL,
  SET_PAYMENTSECTON_BULKUPLOAD,
  RESET,
} from "../types/types";

export const setLanguage = (language) => {
  return {
    type: SET_LANGUAGE,
    language
  };
};
export const resetStore = () => {
  return {
    type: RESET,
  }
};

export const setBusiness = (business) => {
  return {
    type: SET_BUSINESS,
    business
  };
};

export const setBusinessProgram = (businessProgram) => {
  return {
    type: SET_BUSINESS_PROGRAM,
    businessProgram
  };
};

export const assignUsername = (username) => {
  return {
    type: ASSIGN_USERNAME,
    username,
  };
};

export const assignRole = (role) => {
  return {
    type: ASSIGN_ROLE,
    role,
  };
};

export const assignServerToken = (serverToken) => {
  return {
    type: SERVER_TOKEN,
    serverToken,
  };
};

export const assignUserToken = (userToken) => {
  return {
    type: USER_TOKEN,
    userToken,
  };
};

export const assignPassword = (isPassword) => {
  return {
    type: ASSIGN_PASSWORD,
    isPassword,
  };
};

export const setAssistedFlow = () => {
  return {
    type: SET_ASSISTED_FLOW,
  };
};

export const unsetAssistedFlow = () => {
  return {
    type: UNSET_ASSISTED_FLOW,
  };
};

export const assignAssistedCustomerUser = (
  assistedCustomerUsername,
  assistedCustomerName
) => {
  return {
    type: ASSIGN_ASSISTED_CUSTOMER_USER,
    assistedCustomerUsername,
    assistedCustomerName,
  };
};
export const logUserIn = () => {
  return {
    type: LOG_USER_IN
  }
}
export const logUserOut = () => {
  return {
    type: LOG_USER_OUT
  }
}
export const setSmartfleetPrimaryMobileNumber = (smartfleetPrimaryMobileNumber) => {
  return {
    type: SMARTFLEET_PRIMARY_MOBILE_NUMBER,
    smartfleetPrimaryMobileNumber
  }
}
// export const setPAYMENT_ISPAYMENTAPPLICABLE = (IsPaymentApplicable) => {
//   return {
//     type: PAYMENT_ISPAYMENTAPPLICABLE,
//     IsPaymentApplicable
//   }
// }
export const setLoader = (loader) => {
  return {
    type: SET_LOADER,
    loader
  }
}
export const setSmartFleetApplicationNumber = (smartFleetApplicationNumber) => {
  return {
    type: SET_SMARTFLEET_APPLICATION_NUMBER,
    smartFleetApplicationNumber
  }
}
export const setSmartFleetPaymentMethod = (smartFleetPaymentMethod) => {
  return {
    type: SET_SMARTFLEET_PAYMENT_METHOD,
    smartFleetPaymentMethod
  }
}
export const setPaymentFAID = (faIdType) => {
  return {
    type: SET_PAYMENTSECTON_FAID,
    faIdType
  }
}
export const setPaymentCardIndividual = (cardTypeIndividual) => {
  return {
    type: SET_PAYMENTSECTON_INDIVIDUAL,
    cardTypeIndividual
  }
}
export const setPaymentCardBulk = (cardTypeBulk) => {
  return {
    type: SET_PAYMENTSECTON_BULKUPLOAD,
    cardTypeBulk
  }
}