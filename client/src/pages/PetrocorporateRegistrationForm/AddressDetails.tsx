import React, { useEffect } from "react";
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
import validator from "validator";
import { formSections } from "./types/formSections.enum";

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
}

export const AddressDetails = (props: any) => {
  const { handleCompleteStep, handleIncompleteStep } = props;

  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});

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
    correspondenceSms: true,
    correspondenceEmail: false,
    correspondenceWhatsapp: false,
  };
  const [fields, setFields] = React.useState(initFields);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
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
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // If auth signatory is edited, unchec "Same as primary checkbox"
    if (
      event.target.name === "correspondenceAddressLine1" ||
      event.target.name === "correspondenceAddressLine2" ||
      event.target.name === "correspondenceAddressPincode"
    ) {
      setFields({
        ...fields,
        ["correspondenceSameAsRegisteredAddress"]: false,
        [event.target.name]: event.target.value,
      });
    }

    // If auth receiver details are edited, unchec "Same as primary checkbox"
    else {
      setFields({ ...fields, [event.target.name]: event.target.value });
    }
    setErrorMessage({ ...errorMessage, [event.target.name]: "" });
  };

  const validate = (): void => {
    let isError: boolean = false;

    /////REGISTERED ADDRESS VALIDATIONS
    // Validate registeredAddressLine1
    if (!fields.registeredAddressLine1) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        registeredAddressLine1: validationErrorMessage.REQUIRED,
      }));
    } else if (
      !validator.isLength(fields.registeredAddressLine1, { min: 10 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        registeredAddressLine1: validationErrorMessage.ADDRESS,
      }));
    }

    // validate registeredAddressPincode
    if (!fields.registeredAddressPincode) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        registeredAddressPincode: validationErrorMessage.REQUIRED,
      }));
    } else if (
      !validator.isLength(fields.registeredAddressPincode, { min: 6, max: 6 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        registeredAddressPincode: validationErrorMessage.PINCODE,
      }));
    }

    // validate registeredAddressCity
    if (!fields.registeredAddressCity) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        registeredAddressCity: validationErrorMessage.REQUIRED,
      }));
    }

    // validate registeredAddressState
    if (!fields.registeredAddressState) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        registeredAddressState: validationErrorMessage.REQUIRED,
      }));
    }

    /////REGISTERED ADDRESS VALIDATIONS
    // Validate correspondenceAddressLine1
    if (!fields.correspondenceAddressLine1) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine1: validationErrorMessage.REQUIRED,
      }));
    } else if (
      !validator.isLength(fields.correspondenceAddressLine1, { min: 10 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine1: validationErrorMessage.ADDRESS,
      }));
    }

    // validate correspondenceAddressPincode
    if (!fields.correspondenceAddressPincode) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressPincode: validationErrorMessage.REQUIRED,
      }));
    } else if (
      !validator.isLength(fields.correspondenceAddressPincode, {
        min: 6,
        max: 6,
      })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressPincode: validationErrorMessage.PINCODE,
      }));
    }

    // validate correspondenceAddressCity
    if (!fields.correspondenceAddressCity) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressCity: validationErrorMessage.REQUIRED,
      }));
    }

    // validate correspondenceAddressState
    if (!fields.correspondenceAddressState) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressState: validationErrorMessage.REQUIRED,
      }));
    }

    // If all validations pass
    if (!isError) {
      setErrorMessage({});
      handleCompleteStep(formSections.ADDRESS_DETAILS, true);
      handleIncompleteStep(formSections.ADDRESS_DETAILS, false);
    } else {
      handleIncompleteStep(formSections.ADDRESS_DETAILS, true);
    }
  };

  useEffect(() => {
    // effect
    // Fetch city and state from backend

    ///////////Remove after BE Intergration
    const pincodeData = {
      pincode: "112233",
      city: "Bengaluru",
      state: "Karnataka",
    };
    if (fields.registeredAddressPincode === pincodeData.pincode) {
      setFields((fields) => ({
        ...fields,
        registeredAddressCity: pincodeData.city,
        registeredAddressState: pincodeData.state,
      }));
    }
    if (fields.correspondenceAddressPincode === pincodeData.pincode) {
      setFields((fields) => ({
        ...fields,
        correspondenceAddressCity: pincodeData.city,
        correspondenceAddressState: pincodeData.state,
      }));
    }
    ///////////Remove after BE Intergration

    return () => {
      // cleanup
    };
  }, [fields.registeredAddressPincode, fields.correspondenceAddressPincode]);

  const handleClear = (event: React.MouseEvent<HTMLElement>): void => {
    setFields(initFields);
    setErrorMessage({});
  };

  const handleSave = (event: React.MouseEvent<HTMLElement>): void => {
    setErrorMessage({});
    event.preventDefault();
    validate();
    //
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
              id="registered-address-pincode"
              placeholder="400001"
              variant="outlined"
              error={!!errorMessage.registeredAddressPincode}
              name="registeredAddressPincode"
              value={fields.registeredAddressPincode}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.registeredAddressPincode &&
                errorMessage.registeredAddressPincode
              }
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
              id="correspondence-address-pincode"
              placeholder="400001"
              variant="outlined"
              error={!!errorMessage.correspondenceAddressPincode}
              name="correspondenceAddressPincode"
              value={fields.correspondenceAddressPincode}
              onChange={handleTextfieldChange}
              helperText={
                errorMessage.correspondenceAddressPincode &&
                errorMessage.correspondenceAddressPincode
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
        <Hidden smUp>
          <Grid container spacing={4} className="mb-0">
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={(e) => handleClear(e)}
                variant="outlined"
                color="primary"
                className="w-100"
                data-test-id="p-ad-clear-button"
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
                data-test-id="p-ad-save-button"
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
            data-test-id="p-ad-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="p-ad-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Hidden>
    </form>
  );
};
