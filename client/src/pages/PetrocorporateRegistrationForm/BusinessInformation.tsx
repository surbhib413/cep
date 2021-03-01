import React from "react";
import styles from "./PetrocorporateRegistrationForm.module.scss";
import {
  Box,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Hidden,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { formSections } from "./types/formSections.enum";

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

  businessType?: string;
}

export const BusinessInformation = (props: any) => {
  const { handleCompleteStep, handleIncompleteStep } = props;

  const [businessType, setBusinessType] = React.useState("0");

  const [monthlyFuelEstimate, setMonthlyFuelEstimate] = React.useState("0");
  const [otherField, setOtherField] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});

  const initFields = {
    interstate: false,
    withinState: false,
    withinCity: false,

    iocl: false,
    hpcl: false,
    reliance: false,
    otherLoyaltyAccounts: false,
    otherLoyality: "",

    operationalRouteFrom: "",
    operationalRouteTo: "",
    miscellaneous: "",
  };
  const [fields, setFields] = React.useState(initFields);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.checked && event.target.name === "otherLoyaltyAccounts") {
      setOtherField(event.target.name);
    } else if (
      !event.target.checked &&
      event.target.name === "otherLoyaltyAccounts"
    ) {
      setOtherField("");
    }
    setFields({ ...fields, [event.target.name]: event.target.checked });
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  // select business type => Level 1
  const selectBusinessType = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBusinessType(event.target.value as string);
    setErrorMessage({ ...errorMessage, businessType: "" });
  };

  const selectMonthlyFuelEstimate = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setMonthlyFuelEstimate(event.target.value as string);
  };

  const validate = (): void => {
    let isError: boolean = false;

    // Validate businessType
    if (businessType === "0") {
      isError = true;
      setErrorMessage({
        ...errorMessage,
        businessType: validationErrorMessage.REQUIRED,
      });
    }

    // If all validations pass
    if (!isError) {
      setErrorMessage({});
      handleCompleteStep(formSections.BUSINESS_INFORMATION, true);
      handleIncompleteStep(formSections.BUSINESS_INFORMATION, false);
    } else {
      handleIncompleteStep(formSections.BUSINESS_INFORMATION, true);
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLElement>): void => {
    setFields(initFields);
    setBusinessType("0");
    setMonthlyFuelEstimate("0");
    setErrorMessage({});
  };

  const handleSave = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    setErrorMessage({});
    validate();
    //
  };

  return (
    <form className="w-100">
      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        {/* Area of Operations SECTION */}
        <Typography
          color="primary"
          variant="h5"
          data-test-id="area-of-operation"
        >
          Area of Operations
        </Typography>
        <Box fontSize="body2.fontSize">
          <FormGroup className="d-flex flex-row">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.interstate}
                  onChange={handleCheckboxChange}
                  name="interstate"
                  id="interstate"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="Interstate"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.withinState}
                  onChange={handleCheckboxChange}
                  name="withinState"
                  id="withinState"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="Within State"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.withinCity}
                  onChange={handleCheckboxChange}
                  name="withinCity"
                  id="withinCity"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="Within City"
            />
          </FormGroup>
        </Box>
        <hr className={`mt-0 ${styles.headerDivider}`}></hr>
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="business-type" id="business-type-id">
              Business Type *
            </CustomLabel>
            <FormControl error={!!errorMessage.businessType} className="w-100">
              <CustomSelect
                labelId="business-type-id"
                id="business-type"
                value={businessType}
                name="businessType"
                error={!!errorMessage.businessType}
                onChange={selectBusinessType}
                variant="outlined"
                fullWidth
                className={`${
                  !errorMessage.businessType && styles.selectMarginBottom
                }`}
              >
                <CustomMenuItem value="0">Select</CustomMenuItem>
                <CustomMenuItem value={1}>
                  Infrastructure & Mining
                </CustomMenuItem>
                <CustomMenuItem value={2}>Petroleum & Chemical</CustomMenuItem>
                <CustomMenuItem value={3}>
                  Household Items & Goods
                </CustomMenuItem>
                <CustomMenuItem value={4}>Pharma & Medical</CustomMenuItem>
                <CustomMenuItem value={5}>
                  Industrial & Automtive
                </CustomMenuItem>
                <CustomMenuItem value={6}>Corporate</CustomMenuItem>
                <CustomMenuItem value={7}>Services</CustomMenuItem>
                <CustomMenuItem value={8}>Others</CustomMenuItem>
              </CustomSelect>
              <FormHelperText>
                {errorMessage.businessType && errorMessage.businessType}
              </FormHelperText>
            </FormControl>
          </Grid>
          {businessType == "8" && (
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="operational-route-from">Others</CustomLabel>
              <CustomTextField
                id="other-business-type"
                placeholder="Mention your business type"
                variant="outlined"
                name="miscellaneous"
                value={fields.miscellaneous}
                onChange={handleTextfieldChange}
                inputProps={{ maxLength: 256 }}
              />
            </Grid>
          )}
        </Grid>
        <hr className={`mt-0 ${styles.headerDivider}`}></hr>
      </div>

      {/* OTHER LOYALTY ACCOUNTS SECTION */}

      <div className="mt-4 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          date-test-id="other-loyalty-accounts"
        >
          Other Fleet Loyalty Accounts
        </Typography>
        <Box fontSize="body2.fontSize">
          <FormGroup className="d-flex flex-row">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.iocl}
                  onChange={handleCheckboxChange}
                  name="iocl"
                  id="iocl"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="IOCL"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.hpcl}
                  onChange={handleCheckboxChange}
                  name="hpcl"
                  id="hpcl"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="HPCL"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.reliance}
                  onChange={handleCheckboxChange}
                  name="reliance"
                  id="reliance"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="Reliance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.otherLoyaltyAccounts}
                  onChange={handleCheckboxChange}
                  name="otherLoyaltyAccounts"
                  id="otherLoyaltyAccounts"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="Others"
            />
          </FormGroup>
        </Box>
        {otherField === "otherLoyaltyAccounts" ? (
          <Grid container spacing={10} className="py-5">
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="other-loyalty-account">Others</CustomLabel>
              <CustomTextField
                id="other-loyalty-account"
                placeholder="Mention other fleet loyalty accounts"
                variant="outlined"
                name="otherLoyality"
                value={fields.otherLoyality}
                onChange={handleTextfieldChange}
                inputProps={{ maxLength: 256 }}
              />
            </Grid>
          </Grid>
        ) : null}
      </div>

      {/* OPERATIONAL ROUTE SECTION */}

      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        <div className="mt-0 mt-sm-3">
          <Grid container spacing={10} className="py-5">
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel
                htmlFor="monthly-fuel-estimate"
                id="monthly-fuel-estimate-id"
              >
                Estimated Monthly Fuel Required
              </CustomLabel>
              <CustomSelect
                labelId="monthly-fuel-estimate-id"
                id="monthly-fuel-estimate"
                value={monthlyFuelEstimate}
                onChange={selectMonthlyFuelEstimate}
                variant="outlined"
                fullWidth
                className={`${styles.selectMarginBottom}`}
              >
                <CustomMenuItem value="0">Select</CustomMenuItem>
                <CustomMenuItem value={1}>Below 2.0 Lakhs</CustomMenuItem>
                <CustomMenuItem value={2}>2.0 to 5.0 Lakhs</CustomMenuItem>
                <CustomMenuItem value={3}>5.0 to 12.5 Lakhs</CustomMenuItem>
                <CustomMenuItem value={4}>12.5 to 50 Lakhs</CustomMenuItem>
                <CustomMenuItem value={5}>50 Lakhs to 2.0 Crore</CustomMenuItem>
                <CustomMenuItem value={6}>Above 2.0 Crore</CustomMenuItem>
              </CustomSelect>
            </Grid>
          </Grid>
        </div>
        <Hidden smUp>
          <Grid container spacing={4} className="mb-0  pt-4">
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={(e) => handleClear(e)}
                variant="outlined"
                color="primary"
                className="w-100"
                data-test-id="p-bi-clear-button"
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
                data-test-id="p-bi-save-button"
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
            data-test-id="p-bi-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="p-bi-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Hidden>
    </form>
  );
};
