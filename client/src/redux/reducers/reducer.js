import {
  ASSIGN_USERNAME,
  ASSIGN_ROLE,
  ASSIGN_PASSWORD,
  SERVER_TOKEN,
  USER_TOKEN,
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
  SET_CARDS_FOR_BULK_ACTION,
  SET_POPUP_TITLE_FOR_BULK_ACTION,
  SET_POPUP_DESCRIPTION_FOR_BULK_ACTION,
  SET_POPUP_ACTION_TYPE_FOR_BULK_ACTION,
} from "../types/types";
import { LOCALES } from "../../i18n";

const initialState = {
  username: "", // email or mobile
  role: "CUSTOMER",
  assistedFlow: false,
  userIsLoggedIn: false,
  assistedCustomerUsername: "",
  assistedCustomerName: "",
  customerId: "",
  // language: LOCALES.ENGLISH,
  language: LOCALES.ENGLISH,
  business: "",
  businessProgram: "",
  smartfleetPrimaryMobileNumber: "",
  IsPaymentApplicable: false,
  setLoader: false,
  smartFleetApplicationNumber: '',
  smartFleetPaymentMethod: '',
  isPassword: true,
  faIdType: '',
  cardTypeIndividual: '',
  cardTypeBulk: '',
  selectedFleetCardsForBulkAction: '',
  title: '',
  description: '',
  actionType: ''
};


import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key:"root",
  storage,
  // whitelist: ["ASSIGN_PASSWORD","USER_TOKEN", "SERVER_TOKEN"]
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_USERNAME:
      document.cookie = `customerId=${action.username}; path=/`;

      return {
        ...state,
        username: action.username,
        customerId: action.username,
      };

    case ASSIGN_ROLE:
      return {
        ...state,
        role: action.role,
      };

    case ASSIGN_PASSWORD:
      return {
        ...state,
        isPassword: action.isPassword,
      };

    case SET_ASSISTED_FLOW:
      return {
        ...state,
        assistedFlow: true,
      };

    case SERVER_TOKEN:
      return {
        ...state,
        serverToken: action.serverToken,
      };

    case USER_TOKEN:
      return {
        ...state,
        userToken: action.userToken,
      };

    case UNSET_ASSISTED_FLOW:
      return {
        ...state,
        assistedFlow: false,
      };

    case ASSIGN_ASSISTED_CUSTOMER_USER:
      document.cookie = `customerId=${action.assistedCustomerUsername}; path=/`;
      return {
        ...state,
        assistedCustomerUsername: action.assistedCustomerUsername,
        assistedCustomerName: action.assistedCustomerName,
        customerId: action.assistedCustomerUsername,
      };

    case SET_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };

    case LOG_USER_IN:
      return {
        ...state,
        userIsLoggedIn: true,
      };
    case LOG_USER_OUT:
      return {
        ...state,
        userIsLoggedIn: false,
      };

    case SMARTFLEET_PRIMARY_MOBILE_NUMBER:
      return {
        ...state,
        smartfleetPrimaryMobileNumber: action.smartfleetPrimaryMobileNumber,
      };
    // case PAYMENT_ISPAYMENTAPPLICABLE:
    //   return {
    //     ...state,
    //     IsPaymentApplicable: action.IsPaymentApplicable,
    //   };

    case SET_BUSINESS:
      return {
        ...state,
        business: action.business,
      };

    case SET_BUSINESS_PROGRAM:
      return {
        ...state,
        businessProgram: action.businessProgram,
      };
    case SET_LOADER:
      return {
        ...state,
        setLoader: action.loader,
      };

    case SET_SMARTFLEET_APPLICATION_NUMBER:
      return {
        ...state,
        smartFleetApplicationNumber: action.smartFleetApplicationNumber,
      };
    case SET_SMARTFLEET_PAYMENT_METHOD:
      return {
        ...state,
        smartFleetPaymentMethod: action.smartFleetPaymentMethod,
      };
    case SET_PAYMENTSECTON_FAID:
      return {
        ...state,
        faIdType: action.faIdType,
      };
    case SET_PAYMENTSECTON_INDIVIDUAL:
      return {
        ...state,
        cardTypeIndividual: action.cardTypeIndividual,
      };
    case SET_PAYMENTSECTON_BULKUPLOAD:
      return {
        ...state,
        cardTypeBulk: action.cardTypeBulk,
      };
    case RESET :
      return initialState
    case SET_CARDS_FOR_BULK_ACTION:  
      return {
        ...state,
        selectedFleetCardsForBulkAction: action.fleetCardIds
      };
    case SET_POPUP_TITLE_FOR_BULK_ACTION:  
      return {
        ...state,
        title: action.title
      };
    case SET_POPUP_DESCRIPTION_FOR_BULK_ACTION:  
      return {
        ...state,
        description: action.description,

      };
    case SET_POPUP_ACTION_TYPE_FOR_BULK_ACTION:
        return{
          ...state,
          actionType: action.actionType,
        };  
    default:
      return state;
  }
};

// export default reducer;
export default reducer
