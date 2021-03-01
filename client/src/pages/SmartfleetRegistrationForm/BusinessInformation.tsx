import React, { useEffect } from "react";
import styles from "./SmartfleetRegistrationForm.module.scss";
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
import { setLoader } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import {
  businessToIndustryMap,
  IIndustryType,
} from "../../utility/BusinessConstants/BusinessToIndustryMap";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { formSections } from "./types/formSections.enum";
import { useSelector } from "react-redux";
import { postBusinessInformation } from "../../lib/api/smartfleet/smartfleet";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

interface IErrorMessages {
  businessType?: string;
}

export const BusinessInformation = (props: any) => {
  // const { role } = props;
  const { handleCompleteStep, handleIncompleteStep, dropdownLists } = props;
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();

  const [businessType, setBusinessType] = React.useState("0");
  const [industryType, setIndustryType] = React.useState("0");

  const [estimatedMonthlyFuel, setEstimatedMonthlyFuel] = React.useState("0");

  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  // console.log("dropdownLists", dropdownLists);
  const initFields = {
    interState: false,
    withinState: false,
    withinCity: false,

    iocl: false,
    hpcl: false,
    reliance: false,
    others: false,
    otherLoyaltyAccounts: "",

    operationalRouteFrom: "",
    operationalRouteTo: "",
    otherIndustryType: "",
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
      const initialFields = {
        interState: initialData?.areasOfOperations?.interState,
        withinState: initialData?.areasOfOperations?.withinState,
        withinCity: initialData?.areasOfOperations?.withinCity,
        iocl: initialData?.loyaltyAccounts?.iocl,
        hpcl: initialData?.loyaltyAccounts?.hpcl,
        reliance: initialData?.loyaltyAccounts?.reliance,
        others: initialData?.loyaltyAccounts?.others,
        otherLoyaltyAccounts:
          initialData?.loyaltyAccounts?.otherLoyaltyAccounts,
        operationalRouteFrom: initialData?.from,
        operationalRouteTo: initialData?.to,
        otherIndustryType: initialData?.otherIndustryType || "",
      };
      setIsSectionEditable(initialData?.editable);
      setFields(initialFields);
      // console.log(
      //   initialData?.businessType,
      //   initialData?.businessType ? initialData?.businessType : ""
      // );
      setBusinessType(initialData?.businessType || "0");
      setIndustryType(initialData?.industryType || "0");
      setEstimatedMonthlyFuel(initialData?.estimatedMonthlyFuel || "0");
      if (initialData?.completed) {
        handleCompleteStep(formSections.BUSINESS_INFORMATION, true);
        handleIncompleteStep(formSections.BUSINESS_INFORMATION, false);
      }
    }
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    //console.log('selected loyality', event.target.name);
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
    // console.log(event.target);
    setBusinessType(event.target.value as string);
    setIndustryType("0");
    setErrorMessage({ ...errorMessage, businessType: "" });
  };

  // select industry type => Level 2
  const selectIndustryType = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    console.log("Industry", event.target.value);
    setIndustryType(event.target.value as string);
  };

  const selectEstimatedMonthlyFuel = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setEstimatedMonthlyFuel(event.target.value as string);
  };

  const getIndustryTypeOptions = (key: string) => {
    let businessTypeIndex = -1;
    if (dropdownLists?.businessType) {
      businessTypeIndex = dropdownLists?.businessType.findIndex(
        (element: any) => element.code === key
      );
    }
    // console.log("businessTypeIndex", businessTypeIndex);

    if (businessTypeIndex === -1) {
      return null;
    }
    return dropdownLists?.businessType[businessTypeIndex]["industryType"].map(
      function (list: any, index: number) {
        return (
          <CustomMenuItem key={list.code} value={list.code}>
            {list.displayName}
          </CustomMenuItem>
        );
      }
    );
  };

  const validate = (): boolean => {
    let isError: boolean = false;

    // Validate businessType
    if (businessType === "0") {
      isError = true;
      setErrorMessage({
        ...errorMessage,
        businessType: validationErrorMessage.REQUIRED,
      });
    }
    return isError;
  };

  const handleClear = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields(initFields);
    setBusinessType("0");
    setIndustryType("0");
    setEstimatedMonthlyFuel("0");
    setErrorMessage({});
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!isSectionEditable) {
      return false;
    }
    const isError: boolean = validate();
    if (!isError) {
      // all validations pass
      // console.log("businessType", businessType);
      // console.log("industryType", industryType);
      // console.log("estimatedMonthlyFuel", estimatedMonthlyFuel);

      dispatch(setLoader(true));
      const finalData = {
        ...fields,
        businessType: businessType !== "0" ? businessType : "",
        industryType: industryType !== "0" ? industryType : "",
        estimatedMonthlyFuel:
          estimatedMonthlyFuel !== "0" ? estimatedMonthlyFuel : "",
      };
      console.log("finalData", finalData);

      const res: any = await postBusinessInformation(finalData);
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
          //TODO Change and check with eknath if backend down
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      dispatch(setLoader(false));
      if (res?.data?.completed) {
        handleCompleteStep(formSections.BUSINESS_INFORMATION, true);
        handleIncompleteStep(formSections.BUSINESS_INFORMATION, false);
      } else {
        handleIncompleteStep(formSections.BUSINESS_INFORMATION, true);
      }
    } else {
      handleIncompleteStep(formSections.BUSINESS_INFORMATION, true);
    }
  };

  return (
    <form className="w-100">
      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        {/* Area of Operations SECTION */}
        <Typography
          color="primary"
          variant="h5"
          data-test-id="area-of-operations"
        >
          Area of Operations
        </Typography>
        <Box fontSize="body2.fontSize">
          <FormGroup className="d-flex flex-row">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={fields.interState}
                  onChange={handleCheckboxChange}
                  name="interState"
                  id="interState"
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
                disabled={!isSectionEditable}
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
                {dropdownLists?.businessType &&
                  dropdownLists?.businessType.map(
                    (list: any, index: number) => {
                      return (
                        <CustomMenuItem key={list.code} value={list.code}>
                          {list.displayName}
                        </CustomMenuItem>
                      );
                    }
                  )}
              </CustomSelect>
              <FormHelperText>
                {errorMessage.businessType && errorMessage.businessType}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="industry-type" id="industry-type-id">
              Industry Type
            </CustomLabel>
            <CustomSelect
              disabled={!isSectionEditable}
              labelId="industry-type-id"
              id="industry-type"
              value={industryType}
              onChange={selectIndustryType}
              variant="outlined"
              fullWidth
              className={`${styles.selectMarginBottom}`}
            >
              <CustomMenuItem value="0">Select</CustomMenuItem>
              {getIndustryTypeOptions(businessType)}
            </CustomSelect>
          </Grid>
          {industryType === "Miscellaneous" ? (
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="operational-route-from">
                Type your Own Business Type
              </CustomLabel>
              <CustomTextField
                disabled={!isSectionEditable}
                id="operational-route-from"
                placeholder="Mention your Business Type "
                variant="outlined"
                name="otherIndustryType"
                value={fields.otherIndustryType}
                onChange={handleTextfieldChange}
                inputProps={{ maxLength: 256 }}
              />
            </Grid>
          ) : null}
        </Grid>
        <hr className={`mt-0 ${styles.headerDivider}`}></hr>
      </div>

      {/* OTHER LOYALTY ACCOUNTS SECTION */}

      <div className="mt-4 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          data-test-id="other-fleet-loyalty-accounts"
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
                  checked={fields.others}
                  onChange={handleCheckboxChange}
                  name="others"
                  id="others"
                />
              }
              className={`${styles.businessInfoAreaOfOperationsCheckbox}`}
              label="Others"
            />
          </FormGroup>
        </Box>
        {fields.others ? (
          <Grid container spacing={10} className="py-5">
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="other-loyalty-account">Others</CustomLabel>
              <CustomTextField
                disabled={!isSectionEditable}
                id="other-loyalty-account"
                placeholder="Mention your other Fleet Loyalty Accounts"
                variant="outlined"
                name="otherLoyaltyAccounts"
                value={fields.otherLoyaltyAccounts}
                onChange={handleTextfieldChange}
                inputProps={{ maxLength: 256 }}
              />
            </Grid>
          </Grid>
        ) : null}
      </div>

      {/* OPERATIONAL ROUTE SECTION */}

      <div className="mt-0 mt-sm-3 px-4 px-sm-0">
        <Typography
          color="primary"
          variant="h5"
          data-test-id="operational-route"
        >
          Operational Route
        </Typography>
        <hr className={`${styles.headerDivider}`}></hr>
        <Grid container spacing={10} className="py-5">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="operational-route-from">From</CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="operational-route-from"
              placeholder="Mumbai"
              variant="outlined"
              name="operationalRouteFrom"
              value={fields.operationalRouteFrom}
              onChange={handleTextfieldChange}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="operational-route-to">To</CustomLabel>
            <CustomTextField
              disabled={!isSectionEditable}
              id="operational-route-to"
              placeholder="Pune"
              variant="outlined"
              name="operationalRouteTo"
              value={fields.operationalRouteTo}
              inputProps={{ maxLength: 100 }}
              onChange={handleTextfieldChange}
            />
          </Grid>
        </Grid>

        {/* TYPE OF GOODS TO BE CARRIED SECTION */}

        <div className="mt-0 mt-sm-3">
          <Typography
            color="primary"
            variant="h5"
            data-test-id="fuel-requirement"
          >
            Fuel Requirement
          </Typography>
          <hr className={`${styles.headerDivider}`}></hr>
          <Grid container spacing={10} className="py-5">
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel
                htmlFor="monthly-fuel-estimate"
                id="monthly-fuel-estimate-id"
              >
                Estimated Monthly Fuel Required
              </CustomLabel>
              <CustomSelect
                disabled={!isSectionEditable}
                labelId="monthly-fuel-estimate-id"
                id="monthly-fuel-estimate"
                value={estimatedMonthlyFuel}
                onChange={selectEstimatedMonthlyFuel}
                variant="outlined"
                fullWidth
                className={`${styles.selectMarginBottom}`}
              >
                <CustomMenuItem value="0">Select</CustomMenuItem>
                {dropdownLists?.fuelRequirement && dropdownLists?.fuelRequirement.map(
                  (list: any, index: number) => {
                    return (
                      <CustomMenuItem key={list.code} value={list.code}>
                        {list.displayName}
                      </CustomMenuItem>
                    );
                  }
                )}
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
                data-test-id="sf-bi-clear-button"
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
                data-test-id="sf-bi-save-button"
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
            data-test-id="sf-bi-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="sf-bi-save-button"
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
