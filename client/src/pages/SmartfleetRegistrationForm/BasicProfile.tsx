import React, { useEffect } from "react";
import validator from "validator";
import styles from "./SmartfleetRegistrationForm.module.scss";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  InputAdornment,
  Hidden,
} from "@material-ui/core";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import CustomLoader from "../../components/CustomLoder/CustomLoader";
import {
  isVailidName,
  isOnlyNumbers,
} from "../../utility/validations/validations";
import { formSections } from "./types/formSections.enum";
import { useSelector } from "react-redux";
import {
  isValidMobileNumber,
  isValidOrganizationName,
  isValidEmailAddress
} from "../../utility/validations/validations";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";

import { useDispatch } from "react-redux";
import {
  setSmartfleetPrimaryMobileNumber,
  setLoader,
} from "../../redux/actions/actions";

import { postBasicProfile } from "../../lib/api/smartfleet/smartfleet";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const InfoIcon = "/W_Icons_Info.svg";
const WarningIcon = "/W_Icons_Warning.svg";

interface IErrorMessages {
  customerId?: string;
  primaryUserOrganizationName?: string;
  primaryUserName?: string; //no special characters
  primaryUserMobileNumber?: string; //10 digit number
  primaryUserEmail?: string;

  authSignatoryName?: string;
  authSignatoryMobileNumber?: string;
  authSignatoryEmail?: string;

  receiverName?: string;
  receiverMobileNumber?: string;
  receiverEmail?: string;
}

export const BasicProfile = (props: any) => {
  const { role, handleIncompleteStep, handleCompleteStep } = props;
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  //const [loader,setLoader]=React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");

  const primaryUserMobileNumber = validator.isMobilePhone(store.customerId, [
    "en-IN",
  ])
    ? store.customerId
    : "";

  const primaryUserEmail = isValidEmailAddress(store.customerId)
    ? store.customerId
    : "";

  const initFields = {
    primaryUserOrganizationName: "",
    primaryUserName: "", //no special characters
    primaryUserDesignation: "",
    primaryUserMobileNumber: primaryUserMobileNumber,
    primaryUserEmail: primaryUserEmail, //get from store

    signatorySameAsPrimaryUser: false,
    authSignatoryMobileNumber: "",
    authSignatoryName: "",
    authSignatoryDesignation: "",
    authSignatoryEmail: "",

    receiverSameAsPrimaryUser: false,
    receiverName: "",
    receiverMobileNumber: "",
    receiverEmail: "",
    receiverDesignation: "",
  };

  const [fields, setFields] = React.useState(initFields);
  const [isSectionEditable, setIsSectionEditable] = React.useState(true);

  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  useEffect(() => {
    const { initialData } = props;
    if (initialData) {
      console.log("initialData", initialData);
      console.log(
        "initialData primaryUserMobileNumber",
        primaryUserMobileNumber
      );
      console.log("initialData primaryUserEmail", primaryUserEmail);
      const initialFields = {
        primaryUserOrganizationName: initialData?.organizationName,
        primaryUserName: initialData?.primaryUserName,
        primaryUserDesignation: initialData?.primaryUserDesignation,
        primaryUserMobileNumber: primaryUserMobileNumber
          ? primaryUserMobileNumber
          : initialData?.primaryUserMobileNumber,
        primaryUserEmail: primaryUserEmail
          ? primaryUserEmail
          : initialData?.primaryUserEmail,
        authSignatoryName: initialData?.authSignatoryName,
        authSignatoryDesignation: initialData?.authSignatoryDesignation,
        authSignatoryMobileNumber: initialData?.authSignatoryMobileNumber,
        authSignatoryEmail: initialData?.authSignatoryEmail,
        signatorySameAsPrimaryUser: initialData?.authSameAsPrimary,
        receiverName: initialData?.receiverName,
        receiverDesignation: initialData?.receiverDesignation,
        receiverMobileNumber: initialData?.receiverMobileNumber,
        receiverEmail: initialData?.receiverEmail,
        receiverSameAsPrimaryUser: initialData?.receiverSameAsPrimary,
      };
      setIsSectionEditable(initialData?.editable || true);
      setFields(initialFields);
      if (initialData?.completed) {
        handleCompleteStep(formSections.BASIC_PROFILE, true);
        handleIncompleteStep(formSections.BASIC_PROFILE, false);
      }
    }
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields({ ...fields, [event.target.name]: event.target.checked });
    if (event.target.name === "signatorySameAsPrimaryUser") {
      if (event.target.checked) {
        setFields((fields) => ({
          ...fields,
          authSignatoryMobileNumber: fields.primaryUserMobileNumber,
          authSignatoryName: fields.primaryUserName,
          authSignatoryDesignation: fields.primaryUserDesignation,
          authSignatoryEmail: fields.primaryUserEmail,
        }));
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          authSignatoryMobileNumber: "",
          authSignatoryName: "",
          authSignatoryDesignation: "",
          authSignatoryEmail: "",
        }));
      } else {
        setFields((fields) => ({
          ...fields,
          authSignatoryMobileNumber: "",
          authSignatoryName: "",
          authSignatoryDesignation: "",
          authSignatoryEmail: "",
        }));
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          authSignatoryMobileNumber: "",
          authSignatoryName: "",
          authSignatoryDesignation: "",
          authSignatoryEmail: "",
        }));
      }
    }
    if (event.target.name === "receiverSameAsPrimaryUser") {
      if (event.target.checked) {
        setFields((fields) => ({
          ...fields,
          receiverMobileNumber: fields.primaryUserMobileNumber,
          receiverName: fields.primaryUserName,
          receiverDesignation: fields.primaryUserDesignation,
          receiverEmail: fields.primaryUserEmail,
        }));
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          receiverMobileNumber: "",
          receiverName: "",
          receiverDesignation: "",
          receiverEmail: "",
        }));
      } else {
        setFields((fields) => ({
          ...fields,
          receiverMobileNumber: "",
          receiverName: "",
          receiverDesignation: "",
          receiverEmail: "",
        }));
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          receiverMobileNumber: "",
          receiverName: "",
          receiverDesignation: "",
          receiverEmail: "",
        }));
      }
    }
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    console.log("Check event", event.target.name);
    if (
      event.target.name === "primaryUserMobileNumber" ||
      event.target.name === "authSignatoryMobileNumber" ||
      event.target.name === "receiverMobileNumber"
    ) {
      if (isOnlyNumbers(event.target.value)) {
        setFields({ ...fields, [event.target.name]: event.target.value });
      }
    }
    // If primary user is edited, uncheck all "Same as primary" checkbox
    else if (
      event.target.name === "primaryUserMobileNumber" ||
      event.target.name === "primaryUserOrganizationName" ||
      event.target.name === "primaryUserName" ||
      event.target.name === "primaryUserDesignation" ||
      event.target.name === "primaryUserEmail"
    ) {
      setFields({
        ...fields,
        ["signatorySameAsPrimaryUser"]: false,
        ["receiverSameAsPrimaryUser"]: false,
        [event.target.name]: event.target.value,
      });
    }
    // If auth signatory is edited, uncheck "Same as primary checkbox"
    else if (
      event.target.name === "authSignatoryMobileNumber" ||
      event.target.name === "authSignatoryName" ||
      event.target.name === "authSignatoryDesignation" ||
      event.target.name === "authSignatoryEmail"
    ) {
      setFields({
        ...fields,
        ["signatorySameAsPrimaryUser"]: false,
        [event.target.name]: event.target.value,
      });
    }

    // If auth receiver details are edited, unchec "Same as primary checkbox"
    else if (
      event.target.name === "receiverMobileNumber" ||
      event.target.name === "receiverName" ||
      event.target.name === "receiverDesignation" ||
      event.target.name === "receiverEmail"
    ) {
      setFields({
        ...fields,
        ["receiverSameAsPrimaryUser"]: false,
        [event.target.name]: event.target.value,
      });
    } else {
      setFields({ ...fields, [event.target.name]: event.target.value });
    }

    setErrorMessage({ ...errorMessage, [event.target.name]: "" });
  };

  const validate = (): boolean => {
    let isError: boolean = false;

    // Validate Organization Name
    if (
      !fields.primaryUserOrganizationName &&
      store.business !== "Individual"
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserOrganizationName: validationErrorMessage.REQUIRED,
      }));
    }

    if (fields.primaryUserOrganizationName && store.business !== "Individual") {
      if (!isValidOrganizationName(fields.primaryUserOrganizationName)) {
        isError = true;
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          primaryUserOrganizationName:
            validationErrorMessage.ORGANIZATION_NAME_INVALID,
        }));
      }
    }

    // Validate Primary User Name
    if (!fields.primaryUserName) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserName: validationErrorMessage.REQUIRED,
      }));
    } else if (!isVailidName(fields.primaryUserName)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserName: validationErrorMessage.INVALID_NAME,
      }));
    }

    // Validate Primary User Email
    if (!fields.primaryUserEmail) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserEmail: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidEmailAddress(fields.primaryUserEmail)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserEmail: validationErrorMessage.EMAIL,
      }));
    }

    // Validate Primary User Mobile
    if (!fields.primaryUserMobileNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserMobileNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (
      //!validator.isMobilePhone(fields.primaryUserMobileNumber, ["en-IN"])
      !isValidMobileNumber(fields.primaryUserMobileNumber)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserMobileNumber: validationErrorMessage.MOBILE_NUMBER,
      }));
    }
    // TODO : Also update this in redux when data is fetched from API and preloaded.
    dispatch(setSmartfleetPrimaryMobileNumber(fields.primaryUserMobileNumber));

    // validate authSignatoryName
    if (!fields.authSignatoryName) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        authSignatoryName: validationErrorMessage.REQUIRED,
      }));
    } else if (!isVailidName(fields.authSignatoryName)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        authSignatoryName: validationErrorMessage.INVALID_NAME,
      }));
    }

    // validate authSignatoryMobileNumber
    if (!fields.authSignatoryMobileNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        authSignatoryMobileNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (
      // !validator.isMobilePhone(fields.authSignatoryMobileNumber, ["en-IN"])
      !isValidMobileNumber(fields.authSignatoryMobileNumber)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        authSignatoryMobileNumber: validationErrorMessage.MOBILE_NUMBER,
      }));
    }

    // validate authSignatoryEmail
    if (!fields.authSignatoryEmail) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        authSignatoryEmail: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidEmailAddress(fields.primaryUserEmail)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        authSignatoryEmail: validationErrorMessage.EMAIL,
      }));
    }

    // validate receiverName
    if (!fields.receiverName) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        receiverName: validationErrorMessage.REQUIRED,
      }));
    } else if (!isVailidName(fields.receiverName)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        receiverName: validationErrorMessage.INVALID_NAME,
      }));
    }

    // validate receiverMobileNumber
    if (!fields.receiverMobileNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        receiverMobileNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (
      // !validator.isMobilePhone(fields.receiverMobileNumber, ["en-IN"])
      !isValidMobileNumber(fields.receiverMobileNumber)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        receiverMobileNumber: validationErrorMessage.MOBILE_NUMBER,
      }));
    }

    // validate receiverEmail
    if (!fields.receiverEmail) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        receiverEmail: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidEmailAddress(fields.primaryUserEmail)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        receiverEmail: validationErrorMessage.EMAIL,
      }));
    }

    return isError;
  };

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
    setErrorMessage({});
    event.preventDefault();
    const isError = validate();
    //setLoader(true);
    console.log("Basic Profile isError", isError);
    console.log("Basic Profile fields", fields);
    console.log("Basic Profile errorMessage", errorMessage);
    if (!isError) {
      // If all validations pass, API call to submit basic profile data
      console.log("All validations pass-----");

      dispatch(setLoader(true));
      const finalData = {
        ...fields,
      };
      console.log("store", store);
      console.log("finalData", finalData);
      const res: any = await postBasicProfile(finalData);

      console.log("postBasicProfile res : ", res);

      if (res?.status === "success" || res?.status === "updated") {
        setErrorMessage({});
        setShowSnackbar(true);
        setSnackbarMessage(res?.message);
        setAlertType("success");
      } else {
        if (res?.errors) {
          const errorObj: any = {};
          res?.errors.forEach((element: any) => {
            console.log(element?.subject);
            if (!element.hasOwnProperty("subject")) {
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
              if (element?.subject === "organizationName") {
                errorObj.primaryUserOrganizationName = element?.message;
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
      //setLoader(false);
      dispatch(setLoader(false));
      if (res?.data?.completed) {
        handleCompleteStep(formSections.BASIC_PROFILE, true);
        handleIncompleteStep(formSections.BASIC_PROFILE, false);
      } else {
        handleIncompleteStep(formSections.BASIC_PROFILE, true);
      }
    } else {
      handleIncompleteStep(formSections.BASIC_PROFILE, true);
    }
  };

  return (
    <form className="w-100" autoComplete="off">
      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        {/* PRIMARY USER SECTION */}
        <Typography color="primary" variant="h5" data-test-id="primary-user">
          Primary User
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <Grid container spacing={10} className="py-5">
          {store.business !== "Individual" && (
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="primary-user-organization-name">
                Organization Name *
              </CustomLabel>
              <CustomTextField
                disabled={!isSectionEditable}
                id="primary-user-organization-name"
                placeholder="ABC Corporation"
                variant="outlined"
                error={!!errorMessage.primaryUserOrganizationName}
                name="primaryUserOrganizationName"
                value={fields.primaryUserOrganizationName}
                onChange={handleTextfieldChange}
                inputProps={{ maxLength: 256 }}
                helperText={
                  errorMessage.primaryUserOrganizationName &&
                  errorMessage.primaryUserOrganizationName
                }
                InputProps={{
                  endAdornment: errorMessage.primaryUserOrganizationName && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="primary-user-name">Name *</CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="primary-user-name"
              placeholder="John Doe"
              variant="outlined"
              error={!!errorMessage.primaryUserName}
              name="primaryUserName"
              value={fields.primaryUserName}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.primaryUserName && errorMessage.primaryUserName
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.primaryUserName && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="primary-user-designation">
              Designation
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="primary-user-designation"
              placeholder="Manager"
              variant="outlined"
              name="primaryUserDesignation"
              value={fields.primaryUserDesignation}
              onChange={handleTextfieldChange}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="primary-user-mobile-number">
              Mobile No. *
            </CustomLabel>
            <CustomTextField
              disabled={
                !isSectionEditable ||
                validator.isMobilePhone(store.username, ["en-IN"]) ||
                validator.isMobilePhone(store.assistedCustomerUsername, [
                  "en-IN",
                ])
              }
              id="primary-user-mobile-number"
              placeholder="9820098200"
              variant="outlined"
              error={!!errorMessage.primaryUserMobileNumber}
              name="primaryUserMobileNumber"
              value={fields.primaryUserMobileNumber}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.primaryUserMobileNumber &&
                errorMessage.primaryUserMobileNumber
              }
              inputProps={{ maxLength: 10 }}
              InputProps={{
                endAdornment: errorMessage.primaryUserMobileNumber && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="primary-user-email">Email ID *</CustomLabel>
            <CustomTextField
              disabled={
                !isSectionEditable ||
                isValidEmailAddress(store.username) ||
                isValidEmailAddress(store.assistedCustomerUsername)
              }
              id="primary-user-email"
              placeholder="johndoe@example.com"
              variant="outlined"
              error={!!errorMessage.primaryUserEmail}
              name="primaryUserEmail"
              value={fields.primaryUserEmail}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.primaryUserEmail && errorMessage.primaryUserEmail
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.primaryUserEmail && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </div>

      {/* AUTHORIZED SIGNATORY SECTION */}

      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          data-test-id="authorized-signatory"
        >
          Authorized Signatory
          <CustomTooltip
            enterTouchDelay={0}
            disableFocusListener
            title="Key official to whom the statements and communications to be sent"
            placement="right-start"
          >
            <img
              src={InfoIcon}
              alt="Info for Authorized Signatory"
              className="px-4"
            ></img>
          </CustomTooltip>
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={fields.signatorySameAsPrimaryUser}
              onChange={handleCheckboxChange}
              name="signatorySameAsPrimaryUser"
              id="signatorySameAsPrimaryUser"
            />
          }
          label="Same as Primary User"
        />
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="authorized-signatory-name">
              Name *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="authorized-signatory-name"
              placeholder="John Doe"
              variant="outlined"
              error={!!errorMessage.authSignatoryName}
              name="authSignatoryName"
              value={fields.authSignatoryName}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.authSignatoryName && errorMessage.authSignatoryName
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.authSignatoryName && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="authorized-signatory-designation">
              Designation
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="authorized-signatory-designation"
              placeholder="Manager"
              variant="outlined"
              name="authSignatoryDesignation"
              value={fields.authSignatoryDesignation}
              onChange={handleTextfieldChange}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="authorized-signatory-mobile-number">
              Mobile No. *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="authorized-signatory-mobile-number"
              placeholder="9820098200"
              variant="outlined"
              error={!!errorMessage.authSignatoryMobileNumber}
              name="authSignatoryMobileNumber"
              value={fields.authSignatoryMobileNumber}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.authSignatoryMobileNumber &&
                errorMessage.authSignatoryMobileNumber
              }
              inputProps={{ maxLength: 10 }}
              InputProps={{
                endAdornment: errorMessage.authSignatoryMobileNumber && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="authorized-signatory-email">
              Email ID *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="authorized-signatory-email"
              placeholder="johndoe@example"
              variant="outlined"
              error={!!errorMessage.authSignatoryEmail}
              name="authSignatoryEmail"
              value={fields.authSignatoryEmail}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.authSignatoryEmail &&
                errorMessage.authSignatoryEmail
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.authSignatoryEmail && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </div>

      {/* AUTHORIZED SIGNATORY SECTION */}

      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          data-test-id="receiver-details"
        >
          Receiver’s Details
          <CustomTooltip
            enterTouchDelay={0}
            disableFocusListener
            title="Key Official to whom Cards should be delivered"
            placement="right-start"
          >
            <img
              src={InfoIcon}
              alt="Info tootltip for Receiver’s Details"
              className="px-4"
            ></img>
          </CustomTooltip>
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={fields.receiverSameAsPrimaryUser}
              onChange={handleCheckboxChange}
              name="receiverSameAsPrimaryUser"
              id="receiverSameAsPrimaryUser"
            />
          }
          label="Same as Primary User"
        />
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="receiver-name">Name *</CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="receiver-name"
              placeholder="John Doe"
              variant="outlined"
              error={!!errorMessage.receiverName}
              name="receiverName"
              value={fields.receiverName}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.receiverName && errorMessage.receiverName
              }
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment: errorMessage.receiverName && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="receiver-designation">
              Designation
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="receiver-designation"
              placeholder="Manager"
              variant="outlined"
              name="receiverDesignation"
              onChange={handleTextfieldChange}
              value={fields.receiverDesignation}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="receiver-mobile-number">
              Mobile No. *
            </CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="receiver-mobile-number"
              placeholder="9820098200"
              variant="outlined"
              error={!!errorMessage.receiverMobileNumber}
              name="receiverMobileNumber"
              value={fields.receiverMobileNumber}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.receiverMobileNumber &&
                errorMessage.receiverMobileNumber
              }
              inputProps={{ maxLength: 10 }}
              InputProps={{
                endAdornment: errorMessage.receiverMobileNumber && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="receiver-email">Email ID *</CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="receiver-email"
              placeholder="johndoe@example.com"
              variant="outlined"
              error={!!errorMessage.receiverEmail}
              name="receiverEmail"
              value={fields.receiverEmail}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.receiverEmail && errorMessage.receiverEmail
              }
              inputProps={{ maxLength: 256 }}
              InputProps={{
                endAdornment: errorMessage.receiverEmail && (
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
                data-test-id="sf-bp-clear-button"
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
                data-test-id="sf-bp-save-button"
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
            data-test-id="sf-bp-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            disabled={!isSectionEditable}
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="sf-bp-save-button"
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
