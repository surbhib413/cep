import React, { useEffect } from "react";
import styles from "./SmartfleetRegistrationForm.module.scss";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  InputAdornment,
  Hidden,
} from "@material-ui/core";
import { setLoader } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import validator from "validator";
import { isOnlyNumbers } from "../../utility/validations/validations";

import { formSections } from "./types/formSections.enum";
import { useSelector } from "react-redux";
import {
  postAddressDetails,
  getPincodeData,
} from "../../lib/api/smartfleet/smartfleet";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const WarningIcon = "/W_Icons_Warning.svg";

interface IErrorMessages {
  registeredAddressLine1?: string; //at least 10 characters
  registeredAddressLine2?: string; //at least 10 characters
  registeredAddressPincode?: string;
  registeredAddressCity?: string;
  registeredAddressState?: string;

  correspondenceAddressLine1?: string; //at least 10 characters
  correspondenceAddressLine2?: string; //at least 10 characters
  correspondenceAddressPincode?: string;
  correspondenceAddressCity?: string;
  correspondenceAddressState?: string;

  cardDeliveryAddressLine1?: string; //at least 10 characters
  cardDeliveryAddressLine2?: string; //at least 10 characters
  cardDeliveryAddressPincode?: string;
  cardDeliveryAddressCity?: string;
  cardDeliveryAddressState?: string;
}

export const AddressDetails = (props: any) => {
  // const { role}  = props;
  const { handleCompleteStep, handleIncompleteStep } = props;
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const [oldPincodeValue, setOldPincodeValue] = React.useState("");
  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const initFields = {
    registeredAddressLine1: "",
    registeredAddressLine2: "",
    registeredAddressPincode: "",
    registeredAddressCity: "",
    registeredAddressState: "",

    correspondenceAddressLine1: "",
    correspondenceAddressLine2: "",
    correspondenceAddressPincode: "",
    correspondenceAddressCity: "",
    correspondenceAddressState: "",
    correspondenceSameAsRegisteredAddress: false,

    cardDeliveryAddressLine1: "",
    cardDeliveryAddressLine2: "",
    cardDeliveryAddressPincode: "",
    cardDeliveryAddressCity: "",
    cardDeliveryAddressState: "",
    cardDeliverySameAsCorrespondenceAddress: false,
  };
  const [fields, setFields] = React.useState(initFields);
  const [isSectionEditable, setIsSectionEditable] = React.useState(true);

  useEffect(() => {
    const { initialData } = props;
    if (initialData) {
      console.log("initialData", initialData);
      const initialFields = {
        registeredAddressLine1: initialData?.registeredAddressLine1,
        registeredAddressLine2: initialData?.registeredAddressLine2,
        registeredAddressPincode: initialData?.registeredAddressPincode,
        registeredAddressCity: initialData?.registeredAddressCity,
        registeredAddressState: initialData?.registeredAddressState,

        correspondenceAddressLine1: initialData?.correspondenceAddressLine1,
        correspondenceAddressLine2: initialData?.correspondenceAddressLine2,
        correspondenceAddressPincode: initialData?.correspondenceAddressPincode,
        correspondenceAddressCity: initialData?.correspondenceAddressCity,
        correspondenceAddressState: initialData?.correspondenceAddressState,
        correspondenceSameAsRegisteredAddress:
          initialData?.corresSameAsReg || false,

        cardDeliveryAddressLine1: initialData?.cardDeliveryAddressLine1,
        cardDeliveryAddressLine2: initialData?.cardDeliveryAddressLine2,
        cardDeliveryAddressPincode: initialData?.cardDeliveryAddressPincode,
        cardDeliveryAddressCity: initialData?.cardDeliveryAddressCity,
        cardDeliveryAddressState: initialData?.cardDeliveryAddressState,
        cardDeliverySameAsCorrespondenceAddress:
          initialData?.cardDelSameAsCorres || false,
      };
      setIsSectionEditable(initialData?.editable || true);
      setFields(initialFields);
      if (initialData?.completed) {
        handleCompleteStep(formSections.ADDRESS_DETAILS, true);
        handleIncompleteStep(formSections.ADDRESS_DETAILS, false);
      }
    }
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields({ ...fields, [event.target.name]: event.target.checked });
    if (event.target.name === "correspondenceSameAsRegisteredAddress") {
      if (event.target.checked) {
        setFields((fields) => ({
          ...fields,
          correspondenceAddressLine1: fields.registeredAddressLine1,
          correspondenceAddressLine2: fields.registeredAddressLine2,
          correspondenceAddressPincode: fields.registeredAddressPincode,
          correspondenceAddressCity: fields.registeredAddressCity,
          correspondenceAddressState: fields.registeredAddressState,
        }));
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          correspondenceAddressLine1: "",
          correspondenceAddressLine2: "",
          correspondenceAddressPincode: "",
          correspondenceAddressCity: "",
          correspondenceAddressState: "",
        }));
      } else {
        setFields((fields) => ({
          ...fields,
          correspondenceAddressLine1: "",
          correspondenceAddressLine2: "",
          correspondenceAddressPincode: "",
          correspondenceAddressCity: "",
          correspondenceAddressState: "",
        }));
      }
    }
    if (event.target.name === "cardDeliverySameAsCorrespondenceAddress") {
      if (event.target.checked) {
        setFields((fields) => ({
          ...fields,
          cardDeliveryAddressLine1: fields.correspondenceAddressLine1,
          cardDeliveryAddressLine2: fields.correspondenceAddressLine2,
          cardDeliveryAddressPincode: fields.correspondenceAddressPincode,
          cardDeliveryAddressCity: fields.correspondenceAddressCity,
          cardDeliveryAddressState: fields.correspondenceAddressState,
        }));
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          cardDeliveryAddressLine1: "",
          cardDeliveryAddressLine2: "",
          cardDeliveryAddressPincode: "",
          cardDeliveryAddressCity: "",
          cardDeliveryAddressState: "",
        }));
      } else {
        setFields((fields) => ({
          ...fields,
          cardDeliveryAddressLine1: "",
          cardDeliveryAddressLine2: "",
          cardDeliveryAddressPincode: "",
          cardDeliveryAddressCity: "",
          cardDeliveryAddressState: "",
        }));
      }
    }
  };

  const handlePincodeAPI = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target);
    console.log(event.target.value, oldPincodeValue);
    const errObj: IErrorMessages = {};
    const name = event.target.name;
    const value = event.target.value;
    if (
      value &&
      oldPincodeValue !== value &&
      isOnlyNumbers(value) &&
      validator.isLength(value, { min: 6, max: 6 })
    ) {
      console.log("valid pincode", value);
      // Call Pincode API
      const response = await getPincodeData(value);
      if (response?.errors) {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          ...errObj,
          [name]: response?.errors[0].message,
        }));
        switch (name) {
          case "registeredAddressPincode":
            setFields({
              ...fields,
              registeredAddressCity: "",
              registeredAddressState: "",
            });
            break;
          case "correspondenceAddressPincode":
            setFields({
              ...fields,
              correspondenceAddressCity: "",
              correspondenceAddressState: "",
            });
            break;
          case "cardDeliveryAddressPincode":
            setFields({
              ...fields,
              cardDeliveryAddressCity: "",
              cardDeliveryAddressState: "",
            });
            break;
        }
      } else if (response?.data) {
        errObj.registeredAddressCity = "";
        errObj.registeredAddressState = "";
        setErrorMessage({
          ...errorMessage,
          ...errObj,
        });
        switch (name) {
          case "registeredAddressPincode":
            setFields({
              ...fields,
              ["correspondenceSameAsRegisteredAddress"]: false,
              registeredAddressCity: response?.data?.city,
              registeredAddressState: response?.data?.state,
            });
            break;
          case "correspondenceAddressPincode":
            setFields({
              ...fields,
              ["correspondenceSameAsRegisteredAddress"]: false,
              ["cardDeliverySameAsCorrespondenceAddress"]: false,
              correspondenceAddressCity: response?.data?.city,
              correspondenceAddressState: response?.data?.state,
            });
            break;
          case "cardDeliveryAddressPincode":
            setFields({
              ...fields,
              ["cardDeliverySameAsCorrespondenceAddress"]: false,
              cardDeliveryAddressCity: response?.data?.city,
              cardDeliveryAddressState: response?.data?.state,
            });
            break;
        }
      }
    }
    setOldPincodeValue("");
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (
      // If registered address is edited, uncheck "Same as registered Address"
      event.target.name === "registeredAddressLine1" ||
      event.target.name === "registeredAddressLine2" ||
      event.target.name === "registeredAddressPincode"
    ) {
      setFields({
        ...fields,
        ["correspondenceSameAsRegisteredAddress"]: false,
        [event.target.name]: event.target.value,
      });
    } else if (
      // If correspondence Address is edited, uncheck "Same as correspondence Address"
      event.target.name === "correspondenceAddressLine1" ||
      event.target.name === "correspondenceAddressLine2" ||
      event.target.name === "correspondenceAddressPincode"
    ) {
      setFields({
        ...fields,
        ["correspondenceSameAsRegisteredAddress"]: false,
        ["cardDeliverySameAsCorrespondenceAddress"]: false,
        [event.target.name]: event.target.value,
      });
    }

    // If card Delivery Address are edited, uncheck "Same as corrospondance address"
    else if (
      event.target.name === "cardDeliveryAddressLine1" ||
      event.target.name === "cardDeliveryAddressLine2" ||
      event.target.name === "cardDeliveryAddressPincode"
    ) {
      setFields({
        ...fields,
        ["cardDeliverySameAsCorrespondenceAddress"]: false,
        [event.target.name]: event.target.value,
      });
    } else {
      setFields({ ...fields, [event.target.name]: event.target.value });
    }
    setErrorMessage({ ...errorMessage, [event.target.name]: "" });
  };

  const validate = (): boolean => {
    let isError: boolean = false;
    const errObj: IErrorMessages = {};

    /////REGISTERED ADDRESS VALIDATIONS
    // Validate registeredAddressLine1
    if (!fields.registeredAddressLine1) {
      isError = true;
      errObj.registeredAddressLine1 = validationErrorMessage.REQUIRED;
    } else if (
      !validator.isLength(fields.registeredAddressLine1, { min: 10 })
    ) {
      isError = true;
      errObj.registeredAddressLine1 = validationErrorMessage.ADDRESS;
    } else {
      errObj.registeredAddressLine1 = "";
    }

    // validate registeredAddressPincode
    if (
      errorMessage.registeredAddressPincode !== "" &&
      errorMessage.registeredAddressPincode !== undefined
    ) {
      isError = true;
      errObj.registeredAddressPincode = errorMessage.registeredAddressPincode;
    } else if (!fields.registeredAddressPincode) {
      isError = true;
      errObj.registeredAddressPincode = validationErrorMessage.REQUIRED;
    } else if (
      !validator.isLength(fields.registeredAddressPincode, { min: 6, max: 6 })
    ) {
      isError = true;
      errObj.registeredAddressPincode = validationErrorMessage.PINCODE;
    } else {
      errObj.registeredAddressPincode = "";
    }

    // validate registeredAddressCity
    if (!fields.registeredAddressCity) {
      isError = true;
      errObj.registeredAddressCity = validationErrorMessage.REQUIRED;
    } else {
      errObj.registeredAddressCity = "";
    }

    // validate registeredAddressState
    if (!fields.registeredAddressState) {
      isError = true;
      errObj.registeredAddressState = validationErrorMessage.REQUIRED;
    } else {
      errObj.registeredAddressState = "";
    }

    /////REGISTERED ADDRESS VALIDATIONS
    // Validate correspondenceAddressLine1
    if (!fields.correspondenceAddressLine1) {
      isError = true;
      errObj.correspondenceAddressLine1 = validationErrorMessage.REQUIRED;
    } else if (
      !validator.isLength(fields.correspondenceAddressLine1, { min: 10 })
    ) {
      isError = true;
      errObj.correspondenceAddressLine1 = validationErrorMessage.ADDRESS;
    } else {
      errObj.correspondenceAddressLine1 = "";
    }

    // validate correspondenceAddressPincode
    if (
      errorMessage.correspondenceAddressPincode !== "" &&
      errorMessage.correspondenceAddressPincode !== undefined
    ) {
      isError = true;
      errObj.correspondenceAddressPincode =
        errorMessage.correspondenceAddressPincode;
    } else if (!fields.correspondenceAddressPincode) {
      isError = true;
      errObj.correspondenceAddressPincode = validationErrorMessage.REQUIRED;
    } else if (
      !validator.isLength(fields.correspondenceAddressPincode, {
        min: 6,
        max: 6,
      })
    ) {
      isError = true;
      errObj.correspondenceAddressPincode = validationErrorMessage.PINCODE;
    } else {
      errObj.correspondenceAddressPincode = "";
    }

    // validate correspondenceAddressCity
    if (!fields.correspondenceAddressCity) {
      isError = true;
      errObj.correspondenceAddressCity = validationErrorMessage.REQUIRED;
    } else {
      errObj.correspondenceAddressCity = "";
    }

    // validate correspondenceAddressState
    if (!fields.correspondenceAddressState) {
      isError = true;
      errObj.correspondenceAddressState = validationErrorMessage.REQUIRED;
    } else {
      errObj.correspondenceAddressState = "";
    }

    /////CARD DELIVERY ADDRESS VALIDATIONS
    // Validate correspondenceAddressLine1
    if (!fields.cardDeliveryAddressLine1) {
      isError = true;
      errObj.cardDeliveryAddressLine1 = validationErrorMessage.REQUIRED;
    } else if (
      !validator.isLength(fields.cardDeliveryAddressLine1, { min: 10 })
    ) {
      isError = true;
      errObj.cardDeliveryAddressLine1 = validationErrorMessage.ADDRESS;
    } else {
      errObj.cardDeliveryAddressLine1 = "";
    }

    // validate cardDeliveryAddressPincode
    if (
      errorMessage.cardDeliveryAddressPincode !== "" &&
      errorMessage.cardDeliveryAddressPincode !== undefined
    ) {
      isError = true;
      errObj.cardDeliveryAddressPincode =
        errorMessage.cardDeliveryAddressPincode;
    } else if (!fields.cardDeliveryAddressPincode) {
      isError = true;
      errObj.cardDeliveryAddressPincode = validationErrorMessage.REQUIRED;
    } else if (
      !validator.isLength(fields.cardDeliveryAddressPincode, { min: 6, max: 6 })
    ) {
      isError = true;
      errObj.cardDeliveryAddressPincode = validationErrorMessage.PINCODE;
    } else {
      errObj.cardDeliveryAddressPincode = "";
    }

    // validate cardDeliveryAddressCity
    if (!fields.cardDeliveryAddressCity) {
      isError = true;
      errObj.cardDeliveryAddressCity = validationErrorMessage.REQUIRED;
    } else {
      errObj.cardDeliveryAddressCity = "";
    }

    // validate cardDeliveryAddressState
    if (!fields.cardDeliveryAddressState) {
      isError = true;
      errObj.cardDeliveryAddressState = validationErrorMessage.REQUIRED;
    } else {
      errObj.cardDeliveryAddressState = "";
    }

    if (isError) {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        ...errObj,
      }));
    }
    console.log("isError", isError);
    console.log("isError errorMessage", errorMessage);
    console.log("isError errObj", errObj);
    return isError;
  };

  // useEffect(() => {
  //   // effect
  //   // Fetch city and state from backend

  //   ///////////Remove after BE Intergration
  //   const pincodeData = {
  //     pincode: "112233",
  //     city: "Bengaluru",
  //     state: "Karnataka",
  //   };

  //   if (fields.registeredAddressPincode === pincodeData.pincode) {
  //     setFields((fields) => ({
  //       ...fields,
  //       registeredAddressCity: pincodeData.city,
  //       registeredAddressState: pincodeData.state,
  //     }));
  //   }
  //   if (fields.correspondenceAddressPincode === pincodeData.pincode) {
  //     setFields((fields) => ({
  //       ...fields,
  //       correspondenceAddressCity: pincodeData.city,
  //       correspondenceAddressState: pincodeData.state,
  //     }));
  //   }
  //   if (fields.cardDeliveryAddressPincode === pincodeData.pincode) {
  //     setFields((fields) => ({
  //       ...fields,
  //       cardDeliveryAddressCity: pincodeData.city,
  //       cardDeliveryAddressState: pincodeData.state,
  //     }));
  //   }
  //   ///////////Remove after BE Intergration

  //   return () => {
  //     // cleanup
  //   };
  // }, [
  //   fields.registeredAddressPincode,
  //   fields.correspondenceAddressPincode,
  //   fields.cardDeliveryAddressPincode,
  // ]);

  const handleClear = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields(initFields);
    setErrorMessage({});
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    event.preventDefault();
    const isError = validate();

    // If all validations pass
    if (!isError) {
      setErrorMessage({});
      // If all validations pass, API call to submit basic profile data
      console.log("All validations pass-----");
      console.log(fields);

      dispatch(setLoader(true));
      const finalData = {
        ...fields,
      };

      const res: any = await postAddressDetails(finalData);
      console.log("postAddressDetails res : ", res);

      if (res?.status === "success" || res?.status === "updated") {
        setErrorMessage({});
        setShowSnackbar(true);
        setSnackbarMessage(res?.message);
        setAlertType("success");
      } else {
        if (res?.errors) {
          const errorObj: any = {};
          res?.errors.forEach((element: any) => {
            if (!element.hasOwnProperty("subject")) {
              console.log("key not present : ", element?.subject);
              setApiOtherErrorMessage(element?.message);
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.subject);
              setAlertType("error");
            } else {
              //check if customerId exists
              if (element?.subject === "customerId") {
                setShowSnackbar(true);
                setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
                setAlertType("error");
              }
              errorObj[element?.subject] = element?.message;
            }
            setErrorMessage((errorMessage) => ({
              ...errorMessage,
              ...errorObj,
            }));
          });
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      dispatch(setLoader(false));
      if (res?.data?.completed) {
        handleCompleteStep(formSections.ADDRESS_DETAILS, true);
        handleIncompleteStep(formSections.ADDRESS_DETAILS, false);
      } else {
        handleIncompleteStep(formSections.ADDRESS_DETAILS, true);
      }
    } else {
      handleIncompleteStep(formSections.ADDRESS_DETAILS, true);
    }
  };

  return (
    <form className="w-100">
      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        {/* REGISTERED ADDRESS SECTION */}
        <Typography
          color="primary"
          variant="h5"
          data-test-id="registered-address"
        >
          Registered Address
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="registered-address-line-1">
              Address Line 1 *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="registered-address-line-1"
              placeholder="Building No, Floor, Office"
              variant="outlined"
              error={!!errorMessage.registeredAddressLine1}
              name="registeredAddressLine1"
              value={fields.registeredAddressLine1}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.registeredAddressLine1 &&
                errorMessage.registeredAddressLine1
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.registeredAddressLine1 && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="registered-address-line-2">
              Address Line 2
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="registered-address-line-2"
              placeholder="Street, Cross"
              variant="outlined"
              error={!!errorMessage.registeredAddressLine2}
              name="registeredAddressLine2"
              value={fields.registeredAddressLine2}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.registeredAddressLine2 &&
                errorMessage.registeredAddressLine2
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.registeredAddressLine2 && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="registered-address-pincode">
              Pin Code *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="registered-address-pincode"
              placeholder="400001"
              variant="outlined"
              error={errorMessage?.registeredAddressPincode ? true : false}
              name="registeredAddressPincode"
              value={fields.registeredAddressPincode}
              onChange={handleTextfieldChange}
              onFocus={(e: any) => setOldPincodeValue(e.target.value)}
              onBlur={handlePincodeAPI}
              helperText={
                errorMessage?.registeredAddressPincode &&
                errorMessage?.registeredAddressPincode}
              inputProps={{ maxLength: 6 }}
              InputProps={{
                endAdornment: errorMessage.registeredAddressPincode && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="registered-address-city">City *</CustomLabel>
            <CustomTextField
              disabled
              id="registered-address-city"
              placeholder="Mumbai"
              variant="outlined"
              error={!!errorMessage.registeredAddressCity}
              name="registeredAddressCity"
              value={fields.registeredAddressCity}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.registeredAddressCity &&
                errorMessage.registeredAddressCity
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.registeredAddressCity && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="registered-address-state">
              State *
            </CustomLabel>
            <CustomTextField
              disabled
              id="registered-address-state"
              placeholder="Maharashtra"
              variant="outlined"
              error={!!errorMessage.registeredAddressState}
              name="registeredAddressState"
              value={fields.registeredAddressState}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.registeredAddressState &&
                errorMessage.registeredAddressState
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.registeredAddressState && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </div>

      {/* CORReSPONDENCE ADDRESS SECTION */}

      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          data-test-id="corrospondence-address"
        >
          Correspondence Address
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={fields.correspondenceSameAsRegisteredAddress}
              onChange={handleCheckboxChange}
              name="correspondenceSameAsRegisteredAddress"
            />
          }
          label="Same as Registered Address"
        />
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="correspondence-address-line-1">
              Address Line 1 *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="correspondence-address-line-1"
              placeholder="Building No, Floor, Office"
              variant="outlined"
              error={!!errorMessage.correspondenceAddressLine1}
              name="correspondenceAddressLine1"
              value={fields.correspondenceAddressLine1}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.correspondenceAddressLine1 &&
                errorMessage.correspondenceAddressLine1
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.correspondenceAddressLine1 && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="correspondence-address-line-2">
              Address Line 2
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="correspondence-address-line-2"
              placeholder="Street, Cross"
              variant="outlined"
              error={!!errorMessage.correspondenceAddressLine2}
              name="correspondenceAddressLine2"
              value={fields.correspondenceAddressLine2}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.correspondenceAddressLine2 &&
                errorMessage.correspondenceAddressLine2
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.correspondenceAddressLine2 && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="correspondence-address-pincode">
              Pin Code *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="correspondence-address-pincode"
              placeholder="400001"
              variant="outlined"
              error={errorMessage?.correspondenceAddressPincode ? true : false}
              name="correspondenceAddressPincode"
              value={fields.correspondenceAddressPincode}
              onChange={handleTextfieldChange}
              onFocus={(e: any) => setOldPincodeValue(e.target.value)}
              onBlur={handlePincodeAPI}
              helperText={
                errorMessage?.correspondenceAddressPincode &&
                errorMessage?.correspondenceAddressPincode
              }
              inputProps={{ maxLength: 6 }}
              InputProps={{
                endAdornment: errorMessage.correspondenceAddressPincode && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="correspondence-address-city">
              City *
            </CustomLabel>
            <CustomTextField
              disabled
              id="correspondence-address-city"
              placeholder="Mumbai"
              variant="outlined"
              error={!!errorMessage.correspondenceAddressCity}
              name="correspondenceAddressCity"
              value={fields.correspondenceAddressCity}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.correspondenceAddressCity &&
                errorMessage.correspondenceAddressCity
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.correspondenceAddressCity && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="correspondence-address-state">
              State *
            </CustomLabel>
            <CustomTextField
              disabled
              id="correspondence-address-state"
              placeholder="Maharashtra"
              variant="outlined"
              error={!!errorMessage.correspondenceAddressState}
              name="correspondenceAddressState"
              value={fields.correspondenceAddressState}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.correspondenceAddressState &&
                errorMessage.correspondenceAddressState
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.correspondenceAddressState && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </div>

      {/* CARD DELIVERY SECTION */}

      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          data-test-id="card-delivery-address"
        >
          Card Delivery Address
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={fields.cardDeliverySameAsCorrespondenceAddress}
              onChange={handleCheckboxChange}
              name="cardDeliverySameAsCorrespondenceAddress"
            />
          }
          label="Same as Correspondence Address"
        />
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="card-delivery-address-line-1">
              Address Line 1 *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="card-delivery-address-line-1"
              placeholder="Building No, Floor, Office"
              variant="outlined"
              error={!!errorMessage.cardDeliveryAddressLine1}
              name="cardDeliveryAddressLine1"
              value={fields.cardDeliveryAddressLine1}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.cardDeliveryAddressLine1 &&
                errorMessage.cardDeliveryAddressLine1
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.cardDeliveryAddressLine1 && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="card-delivery-address-line-2">
              Address Line 2
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="card-delivery-address-line-2"
              placeholder="Street, Cross"
              variant="outlined"
              error={!!errorMessage.cardDeliveryAddressLine2}
              name="cardDeliveryAddressLine2"
              value={fields.cardDeliveryAddressLine2}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.cardDeliveryAddressLine2 &&
                errorMessage.cardDeliveryAddressLine2
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.cardDeliveryAddressLine2 && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="card-delivery-address-pincode">
              Pin Code *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="card-delivery-address-pincode"
              placeholder="400001"
              variant="outlined"
              error={errorMessage?.cardDeliveryAddressPincode ? true : false}
              name="cardDeliveryAddressPincode"
              value={fields.cardDeliveryAddressPincode}
              onChange={handleTextfieldChange}
              onFocus={(e: any) => setOldPincodeValue(e.target.value)}
              onBlur={handlePincodeAPI}
              helperText={
                errorMessage?.cardDeliveryAddressPincode &&
                errorMessage?.cardDeliveryAddressPincode
              }
              inputProps={{ maxLength: 6 }}
              InputProps={{
                endAdornment: errorMessage.cardDeliveryAddressPincode && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="card-delivery-address-city">
              City *
            </CustomLabel>
            <CustomTextField
              disabled
              id="card-delivery-address-city"
              placeholder="Mumbai"
              variant="outlined"
              error={!!errorMessage.cardDeliveryAddressCity}
              name="cardDeliveryAddressCity"
              value={fields.cardDeliveryAddressCity}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.cardDeliveryAddressCity &&
                errorMessage.cardDeliveryAddressCity
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.cardDeliveryAddressCity && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="card-delivery-address-state">
              State *
            </CustomLabel>
            <CustomTextField
              disabled
              id="card-delivery-address-state"
              placeholder="Maharashtra"
              variant="outlined"
              error={!!errorMessage.cardDeliveryAddressState}
              name="cardDeliveryAddressState"
              value={fields.cardDeliveryAddressState}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.cardDeliveryAddressState &&
                errorMessage.cardDeliveryAddressState
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.cardDeliveryAddressState && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Hidden smUp>
          <Grid container spacing={4} className="mb-0">
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                disabled={!isSectionEditable}
                onClick={(e) => handleClear(e)}
                variant="outlined"
                color="primary"
                className="w-100"
                data-test-id="sf-ad-clear-button"
              >
                Clear
              </CustomButton>
            </Grid>
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                disabled={!isSectionEditable}
                onClick={(e) => handleSave(e)}
                variant="contained"
                color="primary"
                className="w-100"
                data-test-id="sf-ad-save-button"
              >
                Save
              </CustomButton>
            </Grid>
          </Grid>
        </Hidden>
      </div>
      <Hidden xsDown>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <hr className={`${styles.headerDivider} w-75 mx-0`}></hr>
          <CustomButton
            disabled={!isSectionEditable}
            onClick={(e) => handleClear(e)}
            variant="outlined"
            color="primary"
            className="mx-4"
            data-test-id="sf-ad-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            disabled={!isSectionEditable}
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="sf-ad-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Hidden>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </form>
  );
};
