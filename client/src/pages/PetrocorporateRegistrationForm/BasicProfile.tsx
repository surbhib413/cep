import React from "react";
import validator from "validator";
import styles from "./PetrocorporateRegistrationForm.module.scss";
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
import { isVailidName } from "../../utility/validations/validations";
import { formSections } from "./types/formSections.enum";
import { useSelector } from "react-redux";
import {
  isValidMobileNumber,
  isValidOrganizationName,
  isValidEmailAddress
} from "../../utility/validations/validations";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";

const InfoIcon = "/W_Icons_Info.svg";
const WarningIcon = "/W_Icons_Warning.svg";

interface IErrorMessages {
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
  const { handleIncompleteStep, handleCompleteStep } = props;
  const store: any = useSelector((state) => state);
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});

  const initFields = {
    primaryUserOrganizationName: "",
    primaryUserName: "", //no special characters
    primaryUserDesignation: "",
    primaryUserMobileNumber: validator.isMobilePhone(store.username, ["en-IN"])
      ? store.username
      : "",
    primaryUserEmail: isValidEmailAddress(store.username) ? store.username : "", //get from store

    primaryUserSms: true,
    primaryUserEmailNotif: false,
    primaryUserWhatsapp: false,

    signatorySameAsPrimaryUser: false,
    authSignatoryMobileNumber: "",
    authSignatoryName: "",
    authSignatoryDesignation: "",
    authSignatoryEmail: "",
    authorizedSignatorySms: true,
    authorizedSignatoryEmailNotif: false,
    authorizedSignatoryWhatsapp: false,

    receiverSameAsPrimaryUser: false,
    receiverName: "",
    receiverMobileNumber: "",
    receiverEmail: "",
    receiverDesignation: "",
    receiverSms: true,
    receiverEmailNotif: false,
    receiverWhatsapp: false,
  };

  const [fields, setFields] = React.useState(initFields);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
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
      }
    }
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (
      event.target.name === "primaryUserMobileNumber" ||
      event.target.name === "authSignatoryMobileNumber" ||
      event.target.name === "receiverMobileNumber"
    ) {
      const regexMobileNumber = /^[0-9]*$/;
      if (regexMobileNumber.test(event.target.value)) {
        setFields({ ...fields, [event.target.name]: event.target.value });
      }
    }

    // If auth signatory is edited, unchec "Same as primary checkbox"
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

  const validate = (): void => {
    let isError: boolean = false;

    // Validate Organization Name
    if (!fields.primaryUserOrganizationName) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        primaryUserOrganizationName: validationErrorMessage.REQUIRED,
      }));
    }

    if (fields.primaryUserOrganizationName) {
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

    if (!isError) {
      // If all validations pass
      setErrorMessage({});
      handleCompleteStep(formSections.BASIC_PROFILE, true);
      handleIncompleteStep(formSections.BASIC_PROFILE, false);
    } else {
      handleIncompleteStep(formSections.BASIC_PROFILE, true);
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLElement>): void => {
    setFields(initFields);
    setErrorMessage({});
    // handleActive(formSections.BASIC_PROFILE);
  };

  const handleSave = (event: React.MouseEvent<HTMLElement>): void => {
    setErrorMessage({});
    event.preventDefault();
    validate();
    //
  };

  return (
    <form className="w-100" autoComplete="off">
      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        {/* PRIMARY USER SECTION */}
        <Typography color="primary" variant="h5" data-test-id="primary-user">
          Primary User
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
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="primary-user-organization-name">
              Organization Name *
            </CustomLabel>
            <CustomTextField
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

          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="primary-user-name">Name *</CustomLabel>
            <CustomTextField
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
              disabled={validator.isMobilePhone(store.username, ["en-IN"])}
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
              disabled={isValidEmailAddress(store.username)}
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
            />
          }
          label="Same as Primary User"
        />
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="receiver-name">Name *</CustomLabel>
            <CustomTextField
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
                onClick={(e) => handleClear(e)}
                variant="outlined"
                color="primary"
                className="w-100"
                data-test-id="p-bp-clear-button"
              >
                Clear
              </CustomButton>
            </Grid>
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={(e) => handleSave(e)}
                variant="contained"
                color="primary"
                className="w-100"
                data-test-id="p-bp-save-button"
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
            onClick={(e) => handleClear(e)}
            variant="outlined"
            color="primary"
            className="mx-4"
            data-test-id="p-bp-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="p-bp-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Hidden>
    </form>
  );
};
