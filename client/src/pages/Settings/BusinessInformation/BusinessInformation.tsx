import React, { useEffect } from "react";
import styles from "./BusinessInformation.module.scss";
import {
  Container,
  Box,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  FormControl,
  Hidden,
  FormHelperText,
} from "@material-ui/core";
import { useRouter } from "next/router";
import Divider from '@material-ui/core/Divider';
import Navigation from "../Navigation";
import Card from '../Card'


const IconEdit = "/Edit_Icon.svg"
const IconBack = "/Back_Icon.svg"

import { CustomLabel } from "../../../../src/components/CustomTextField/CustomLabel";
import { CustomButton } from "../../../../src/components/CustomButton/CustomButton";
import CustomTextField from "../../../../src/components/CustomTextField/CustomTextField";
import CustomSelect from "../../../../src/components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../../../src/components/CustomMenu/CustomMenu";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { postBusinessInformation } from "../../../lib/api/smartfleet/settings/businessinformation";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/actions/actions";
import { SnackbarMessage } from "../../../utility/Snackbar/SnackbarMessages";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SelectAllRounded } from "@material-ui/icons";


interface IErrorMessages {
  businessType?: string;
}

const BusinessInformation = (props: any): JSX.Element => {
  const { dropdownLists } = props;
  const store: any = useSelector((state) => state);

  const [businessType, setBusinessType] = React.useState("0");
  const [industryType, setIndustryType] = React.useState("0");
  const [estimatedMonthlyFuel, setEstimatedMonthlyFuel] = React.useState("0");
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [alertType, setAlertType] = React.useState("error");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [isInputEdited, setIsInputEdited] = React.useState(false);
  //const { handleCompleteStep, handleIncompleteStep} = props;

  const initFields = {
    interState: false,
    withinState: false,
    withinCity: false,
    //businessType: "",
    completed: false,
    customerId: "",
    editable: false,
    //estimatedMonthlyFuel: "",
    operationalRouteFrom: "",
    //industryType: "",
    iocl: false,
    hpcl: false,
    reliance: false,
    others: false,
    otherLoyaltyAccounts: "",
    operationalRouteTo: "",
    otherIndustryType: "",
  };
  const [fields, setFields] = React.useState(initFields);
  const [originalState, setOriginalState] = React.useState<any | {}>(initFields);
  const [isSectionEditable, setIsSectionEditable] = React.useState(initFields.editable);
  const [isEditIcon, setIsEditIcon] = React.useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("inside useffect data", props);
    const { initialData, dropdownLists } = props;
    console.log("drop down data", dropdownLists);


    if (initialData) {
      console.log("initialData", initialData);
      const initialFields = {
        interState: initialData?.areasOfOperations?.interState,
        withinState: initialData?.areasOfOperations?.withinState,
        withinCity: initialData?.areasOfOperations?.withinCity,
        //businessType: dropdownLists?.businessType,
        completed: initialData?.completed,
        customerId: initialData?.customerId,
        editable: initialData?.editable,
        //estimatedMonthlyFuel: dropdownLists?.estimatedMonthlyFuel,
        operationalRouteFrom: initialData?.from,
        //industryType: dropdownLists?.industryType,
        hpcl: initialData?.loyaltyAccounts?.hpcl,
        iocl: initialData?.loyaltyAccounts?.iocl,
        otherLoyaltyAccounts: initialData?.loyaltyAccounts?.otherLoyaltyAccounts,
        others: initialData?.loyaltyAccounts?.others,
        reliance: initialData?.loyaltyAccounts?.reliance,
        otherIndustryType: initialData?.otherIndustryType || "",
        operationalRouteTo: initialData?.to,
      };
      console.log("initial fields", initialFields);
      setFields(initialFields);
      setOriginalState(initialFields);

      setIsSectionEditable(initialData?.editable);

      setBusinessType(initialData?.businessType || "0");
      setIndustryType(initialData?.industryType || "0");
      setEstimatedMonthlyFuel(initialData?.estimatedMonthlyFuel || "0");
    }
  }, []);


  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields({ ...fields, [event.target.name]: event.target.checked });
    setIsInputEdited(true);
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (originalState[event.target.name] !== event.target.value) {
      setIsInputEdited(true);
    } else {
      setIsInputEdited(false);
    }
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  // select business type => Level 1
  const selectBusinessType = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBusinessType(event.target.value as string);
    setIndustryType("0");
    setErrorMessage({ ...errorMessage, businessType: "" });
    setIsInputEdited(true);
    //setFields(originalState);
  };

  // select industry type => Level 2
  const selectIndustryType = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    console.log("Industry", event.target.value);
    setIndustryType(event.target.value as string);
    setIsInputEdited(true);
    //setFields(originalState);
  };

  const selectEstimatedMonthlyFuel = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setEstimatedMonthlyFuel(event.target.value as string);
    setIsInputEdited(true);
    //setFields(originalState);
  };

  // const getIndustryTypeOptions = (key: string) => {

  // };

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
    setFields(originalState);
    setErrorMessage({});
    setIsSectionEditable(false);
    setIsEditIcon(true);
    setIsInputEdited(false);
    // setBusinessType(originalState);
    // setIndustryType(originalState);
    // setEstimatedMonthlyFuel(originalState);

  };
  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    setIsSectionEditable(true);
    setIsEditIcon(false);

  }

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!isSectionEditable) {
      return false;
    }
    setErrorMessage({});
    event.preventDefault();
    const isError = validate();
    if (!isError) {
      dispatch(setLoader(true));
      // If all validations pass, API call to submit basic profile data
      console.log("All validations pass-----");
      console.log("saved field data", fields);
      console.log("store data", store.customerId);

      const finalData = {
        ...fields,
        businessType: businessType !== "0" ? businessType : "",
        industryType: industryType !== "0" ? industryType : "",
        estimatedMonthlyFuel:
          estimatedMonthlyFuel !== "0" ? estimatedMonthlyFuel : "",
        customerId: store.customerId,
      };
      console.log("final data", finalData);
      const res: any = await postBusinessInformation(finalData);
      console.log("success response on save", res);
      if (res?.status === "success" || res?.status === "updated") {
        console.log("Inside snackbar");
        setIsInputEdited(false);
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.SAVE_API_SUCCESS);
        setErrorMessage({});
        setAlertType("success");
        setIsSectionEditable(false);
        setOriginalState(fields);
        setIsEditIcon(true);
        console.log("Final success response on save", finalData);
        //setFields(originalState);
      } else {
        if (res?.errors) {
          console.log("inside response error");
          const errorObj: any = {};
          res?.errors.forEach((element: any) => {
            console.log(element?.subject);
            if (!element.hasOwnProperty("subject")) {
              console.log("subject error");
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.subject);
              setAlertType("error");
            } else {
              //check if customerId exists
              if (element?.subject === "customerId") {
                console.log("customer id error");
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
        }
        else {
          setShowSnackbar(true);
          //TODO Change and check with eknath if backend down
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      dispatch(setLoader(false));
    }
  };


  return (
    <Container >
      <Grid container spacing={10} className={`${styles.spacing}`}>
        <Hidden xsDown>
          <Grid item xs={12} sm={2} className="py-0">sidebar</Grid>
        </Hidden>

        <Grid item xs={12} sm={10} className={`${styles.mainGridContainer}`}>
          <Grid item xs={12} sm={4}>
            <div className={`${styles.mainCard}`}></div>
            <Hidden xsDown><Card /></Hidden>
            <Hidden xsDown><Navigation isInputEdited={isInputEdited}
              setShowSnackbar={setShowSnackbar}
              setSnackbarMessage={setSnackbarMessage}
              setAlertType={setAlertType} /></Hidden>
          </Grid>
          <Grid item xs={12} sm={8} className={`${styles.contentContainer}`}>

            <form className="w-200 ml-2" >
              {/* <div className="py-0"> */}
              {/* Area of Operations SECTION */}
              <Typography className={`${styles.heading} mb-3`}>
                <Hidden smUp>
                  <img
                    className={`mr-3 ${styles.backToMyProfile}`}
                    src={IconBack}
                    alt=""
                    onClick={() =>
                      router.back()}
                  />
                </Hidden>
                Business Information
                {

                  isEditIcon === true ?
                    <img
                      className={`${styles.editIcon}`}
                      src={IconEdit}
                      alt=""
                      onClick={(e) => handleEdit(e)
                      }
                    /> : null
                }
              </Typography>
              <Divider className={`${styles.secDivider} mb-2`} />
              <div className="py-3">
                <Typography
                  color="primary"
                  variant="h5"
                  data-test-id="area-of-operations"
                >
                  <CustomLabel>Area of Operations</CustomLabel>
                </Typography>
                <Box fontSize="body2.fontSize">
                  <FormGroup className="d-flex flex-row">
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                  </FormGroup>
                </Box>
                <Grid container spacing={10} className="py-5">
                  <Grid item xs={12} sm={6} className="py-0">
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
                        className={styles.selectMarginBottom}
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

                  <Grid item xs={12} sm={6} className="py-0">
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
                    <Grid item xs={12} sm={6} className="py-0">
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

              </div>

              {/* OTHER Fleet LOYALTY ACCOUNTS SECTION */}

              <div className="py-0">
                <Typography
                  color="primary"
                  variant="h5"
                  data-test-id="other-fleet-loyalty-accounts"
                >
                  <CustomLabel>Other Fleet Loyalty Accounts</CustomLabel>
                </Typography>
                <Box fontSize="body2.fontSize">
                  <FormGroup className="d-flex flex-row">
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                    <Grid item xs={6} sm={3} >
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
                    </Grid>
                  </FormGroup>
                </Box>
                {fields.others ? (
                  <Grid container spacing={10} className="py-5">
                    <Grid item xs={12} sm={6} className="py-0">
                      <CustomLabel htmlFor="other-loyalty-account">Others</CustomLabel>
                      <CustomTextField
                        disabled={!isSectionEditable}
                        id="other-loyalty-account"
                        variant="outlined"
                        name="otherLoyaltyAccounts"
                        value={fields.otherLoyaltyAccounts}
                        onChange={handleTextfieldChange}
                        inputProps={{ maxLength: 256 }}
                        className={`${styles.selectMarginBottom}`}
                      />
                    </Grid>
                  </Grid>
                ) : null}
              </div>

              {/* OPERATIONAL ROUTE SECTION */}

              <div className="py-0">
                <Typography
                  color="primary"
                  variant="h5"
                  data-test-id="operational-route"
                >
                  <CustomLabel>Operational Route</CustomLabel>
                </Typography>
                <Grid container spacing={10} className="py-5">
                  <Grid item xs={12} sm={6} className="py-0">
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="operational-route-from"
                      variant="outlined"
                      name="operationalRouteFrom"
                      value={fields.operationalRouteFrom}
                      onChange={handleTextfieldChange}
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                      className={`${styles.selectMarginBottom}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className="py-0">
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="operational-route-to"
                      variant="outlined"
                      name="operationalRouteTo"
                      value={fields.operationalRouteTo}
                      inputProps={{ maxLength: 100 }}
                      onChange={handleTextfieldChange}
                      fullWidth
                      className={`${styles.selectMarginBottom}`}
                    />
                  </Grid>
                </Grid>
              </div>

              {/* TYPE OF GOODS TO BE CARRIED SECTION */}

              <div className="py-0">
                <Typography
                  color="primary"
                  variant="h5"
                  data-test-id="operational-route"
                >
                  <CustomLabel
                    htmlFor="monthly-fuel-estimate"
                    id="monthly-fuel-estimate-id"
                  >
                    Estimated Monthly Fuel Required
              </CustomLabel>
                </Typography>
                <Grid container spacing={10} className="py-5">
                  <Grid item xs={12} sm={6} className="py-0">
                    <CustomSelect
                      disabled={!isSectionEditable}
                      labelId="monthly-fuel-estimate-id"
                      id="monthly-fuel-estimate"
                      value={estimatedMonthlyFuel}
                      onChange={selectEstimatedMonthlyFuel}
                      variant="outlined"
                      fullWidth
                    >
                      <CustomMenuItem value="0">Select</CustomMenuItem>
                      {dropdownLists.fuelRequirement.map(
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
                {isSectionEditable === true ?
                  (<Hidden smUp>
                    <Grid container spacing={4} className="mb-0  pt-4">
                      <Grid item xs={6} sm={4} className="py-0">
                        <CustomButton
                          onClick={(e) => handleClear(e)}
                          variant="outlined"
                          color="primary"
                          className="w-100"
                          data-test-id="sf-bi-clear-button"
                        >
                          Cancel
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
                  </Hidden>) : null}

              </div>

              {isSectionEditable === true ?
                (
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
                        Cancel
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
                  </Hidden>) : null}
              <CustomSnackbar
                open={showSnackbar}
                close={setShowSnackbar}
                type={alertType}
                message={snackbarMessage}
              ></CustomSnackbar>
            </form>
          </Grid>
        </Grid></Grid></Container>);

}

export default BusinessInformation;
