import React, { useEffect, useState } from "react";
import { Container, FormControlLabel, Grid, Hidden, InputAdornment, Paper, Radio, Typography } from "@material-ui/core";
// import styles from "../Settings.module.scss";
import styles from "./address.module.scss"
import { useRouter } from "next/router";
import Divider from '@material-ui/core/Divider';
import { setLoader } from "../../../redux/actions/actions";
import { useDispatch } from "react-redux";
import Navigation from '../Navigation'
import {
  getAddressData,
  postAddressData,
  getPincodeData
} from "../../../lib/api/smartfleet/settings/address";
import { isOnlyNumbers, isValidAddressline } from "../../../utility/validations/validations";

import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../../components/CustomSvgIcon/CustomSvgIcon";
import validator from "validator";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { useSelector } from "react-redux";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "../../../utility/Snackbar/SnackbarMessages";
import Card from '../Card'



const Editicon = "/Edit_Icon.svg"
const WarningIcon = "/W_Icons_Warning.svg";
const IconBack = "/Back_Icon.svg"

interface IErrorMessages {
  registeredAddressLine1?: string; //at least 10 characters
  registeredAddressLine2?: string; //at least 10 characters
  registeredAddressPincode?: string;
  registeredAddressCity?: string;
  registeredAddressDistrict?: string;
  registeredAddressState?: string;

  correspondenceAddressLine1?: string; //at least 10 characters
  correspondenceAddressLine2?: string; //at least 10 characters
  correspondenceAddressPincode?: string;
  correspondenceAddressCity?: string;
  correspondenceAddressDistrict?: string;
  correspondenceAddressState?: string;

  cardDeliveryAddressLine1?: string; //at least 10 characters
  cardDeliveryAddressLine2?: string; //at least 10 characters
  cardDeliveryAddressPincode?: string;
  cardDeliveryAddressCity?: string;
  cardDeliveryAddressDistrict?: string;
  cardDeliveryAddressState?: string;
}
const Address = (props: any): JSX.Element => {
  const router = useRouter();
  // const store: any = useSelector((state) => state);
  // const { handleCompleteStep, handleIncompleteStep } = props;
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  // const [validInput,setValidInput] = useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  // const [open, setOpen] = useState(true);
  const [oldPincodeValue, setOldPincodeValue] = React.useState("");
  const [isInputEdited, setIsInputEdited] = useState(false);
  // const [edit,setEdit] = useState(false);

  const initFields = {

    // formattedAddress:"",
    registeredAddressLine1: "",
    registeredAddressLine2: "",
    registeredAddressPincode: "",
    registeredAddressCity: "",
    registeredAddressDistrict: "",
    registeredAddressState: "",
    registeredAddressId: "",

    correspondenceAddressLine1: "",
    correspondenceAddressLine2: "",
    correspondenceAddressPincode: "",
    correspondenceAddressCity: "",
    correspondenceAddressDistrict: "",
    correspondenceAddressState: "",
    correspondenceAddressId: "",


    cardDeliveryAddressLine1: "",
    cardDeliveryAddressLine2: "",
    cardDeliveryAddressPincode: "",
    cardDeliveryAddressCity: "",
    cardDeliveryAddressDistrict: "",
    cardDeliveryAddressState: "",
    cardDeliveryAddressId: "",

  };
  const [fields, setFields] = React.useState(initFields);
  const [isSectionEditable, setIsSectionEditable] = React.useState(false);
  const [originalState, setOriginalState] = React.useState<any | {}>({});

  // const [addressType, setaddressType] = useState<string>(props.initialData?.isAddressType ? "card" :"correspondence");

  useEffect(() => {
    const { initialData } = props;

    let initialFields = {};
    let address1 = {};
    let address2 = {};
    let address3 = {};
    let addresses = initialData.addresses
    for (let i = 0; i < addresses.length; i++) {
      console.log(addresses[i])
      if (addresses[i].addressType === "CARD") {
        address1 = {
          cardDeliveryAddressLine1: addresses[i].line1,
          cardDeliveryAddressLine2: addresses[i].line2,
          cardDeliveryAddressPincode: addresses[i].pincode,
          cardDeliveryAddressCity: addresses[i].city,
          cardDeliveryAddressDistrict: addresses[i].district,
          cardDeliveryAddressState: addresses[i].state,
          cardDeliveryAddressId: addresses[i].id

        }

      } else if (addresses[i].addressType === "CORRESPONDENCE") {
        // setaddressType("correspondence");
        address2 = {
          correspondenceAddressLine1: addresses[i].line1,
          correspondenceAddressLine2: addresses[i].line2,
          correspondenceAddressPincode: addresses[i].pincode,
          correspondenceAddressCity: addresses[i].city,
          correspondenceAddressDistrict: addresses[i].district,
          correspondenceAddressState: addresses[i].state,
          correspondenceAddressId: addresses[i].id
        }
      } else if (addresses[i].addressType === "REGISTERED") {
        address3 = {
          registeredAddressLine1: addresses[i].line1,
          registeredAddressLine2: addresses[i].line2,
          registeredAddressPincode: addresses[i].pincode,
          registeredAddressCity: addresses[i].city,
          registeredAddressDistrict: addresses[i].district,
          registeredAddressState: addresses[i].state,
          registeredAddressId: addresses[i].id
        }
      }

    }

    console.log(initialFields);
    initialFields = { ...address1, ...address2, ...address3 }
    setFields(initialFields);
    setOriginalState(initialFields);


    console.log(initialFields, "address1 data");
  }, []);


  const validate = (): boolean => {
    let isError: boolean = false;
    const errObj: IErrorMessages = {};


    // Validate correspondenceAddressLine1
    // if (!fields.correspondenceAddressLine1) {
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,

    //     correspondenceAddressLine1 : validationErrorMessage.REQUIRED,
    //   }));

    // } else if (
    //   !validator.isLength(fields.correspondenceAddressLine1, { min: 10 })
    // ) {
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,

    //     correspondenceAddressLine1 : validationErrorMessage.ADDRESS,
    //   }));

    // } else {
    //   errObj.correspondenceAddressLine1 = "";
    // }

    // Validate correspondenceAddressLine1
    if (!fields.correspondenceAddressLine1) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine1: validationErrorMessage.REQUIRED,
      }));
      console.log("required")
    } else if (
      !validator.isLength(fields.correspondenceAddressLine1, { min: 10 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine1: validationErrorMessage.ADDRESS,
      }));
      console.log("")
    } else if (
      !isValidAddressline(fields.correspondenceAddressLine1)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine1: validationErrorMessage.ADDRESSLINE,
      }));

    }

    else {
      errObj.correspondenceAddressLine1 = "";
    }


    // Validate correspondenceAddressLine2

    if (!fields.correspondenceAddressLine2) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine2: validationErrorMessage.REQUIRED,
      }));
      console.log("required")
    } else if (
      !validator.isLength(fields.correspondenceAddressLine2, { min: 10 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine2: validationErrorMessage.ADDRESS,
      }));
      console.log("")
    } else if (
      !isValidAddressline(fields.correspondenceAddressLine2)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        correspondenceAddressLine2: validationErrorMessage.ADDRESSLINE,
      }));

    }
    else {
      errObj.correspondenceAddressLine2 = "";
    }
    // if (!fields.correspondenceAddressLine2) {
    //   isError = true;
    //   errObj.correspondenceAddressLine2 = validationErrorMessage.REQUIRED;
    // } else if (
    //   !validator.isLength(fields.correspondenceAddressLine2, { min: 10 })
    // ) {
    //   isError = true;
    //   errObj.correspondenceAddressLine2 = validationErrorMessage.ADDRESS;
    // } else {
    //   errObj.correspondenceAddressLine2 = "";
    // }

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

    // validate correspondenceAddressDistrict
    // if (!fields.correspondenceAddressDistrict) {
    //   isError = true;
    //   errObj.correspondenceAddressDistrict = validationErrorMessage.REQUIRED;
    // } else {
    //   errObj.correspondenceAddressDistrict = "";
    // }

    // validate correspondenceAddressState
    if (!fields.correspondenceAddressState) {
      isError = true;
      errObj.correspondenceAddressState = validationErrorMessage.REQUIRED;
    } else {
      errObj.correspondenceAddressState = "";
    }

    /////CARD DELIVERY ADDRESS VALIDATIONS
    // Validate cardDeliveryAddressLine1


    if (!fields.cardDeliveryAddressLine1) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        cardDeliveryAddressLine1: validationErrorMessage.REQUIRED,
      }));
      console.log("required")
    } else if (
      !validator.isLength(fields.cardDeliveryAddressLine1, { min: 10 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        cardDeliveryAddressLine1: validationErrorMessage.ADDRESS,
      }));
      console.log("")
    } else if (
      !isValidAddressline(fields.cardDeliveryAddressLine1)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        cardDeliveryAddressLine1: validationErrorMessage.ADDRESSLINE,
      }));

    }

    else {
      errObj.cardDeliveryAddressLine1 = "";
    }
    // if (!fields.cardDeliveryAddressLine1) {
    //   isError = true;
    //   errObj.cardDeliveryAddressLine1 = validationErrorMessage.REQUIRED;
    // } else if (
    //   !validator.isLength(fields.cardDeliveryAddressLine1, { min: 10 })
    // ) {
    //   isError = true;
    //   errObj.cardDeliveryAddressLine1 = validationErrorMessage.ADDRESS;
    // } else {
    //   errObj.cardDeliveryAddressLine1 = "";
    // }

    // Validate cardDeliveryAddressLine2

    if (!fields.cardDeliveryAddressLine2) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        cardDeliveryAddressLine2: validationErrorMessage.REQUIRED,
      }));
      console.log("required")
    } else if (
      !validator.isLength(fields.cardDeliveryAddressLine2, { min: 10 })
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        cardDeliveryAddressLine2: validationErrorMessage.ADDRESS,
      }));
      console.log("")
    } else if (
      !isValidAddressline(fields.cardDeliveryAddressLine2)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        cardDeliveryAddressLine2: validationErrorMessage.ADDRESSLINE,
      }));

    }

    else {
      errObj.cardDeliveryAddressLine2 = "";
    }
    // if (!fields.cardDeliveryAddressLine2) {
    //   isError = true;
    //   errObj.cardDeliveryAddressLine2 = validationErrorMessage.REQUIRED;
    // } else if (
    //   !validator.isLength(fields.cardDeliveryAddressLine2, { min: 10 })
    // ) {
    //   isError = true;
    //   errObj.cardDeliveryAddressLine2 = validationErrorMessage.ADDRESS;
    // } else {
    //   errObj.cardDeliveryAddressLine2 = "";
    // }

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

    // validate cardDeliveryAddressDistrict
    // if (!fields.cardDeliveryAddressDistrict) {
    //   isError = true;
    //   errObj.cardDeliveryAddressDistrict = validationErrorMessage.REQUIRED;
    // } else {
    //   errObj.cardDeliveryAddressDistrict = "";
    // }

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

  // Handle Cancel

  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    // setFields(initFields);
    setFields(originalState);
    setErrorMessage({});
    setIsSectionEditable(false);
    setIsInputEdited(false);

  };

  // Handle Save

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!isSectionEditable) {
      return false;
    }

    event.preventDefault();
    const isError = validate();

    // If all validations pass
    if (!isError) {

      setErrorMessage({});
      console.log("All validations pass-----");
      console.log(fields);


      dispatch(setLoader(true));
      const finalData = {
        ...fields,
        // customerId: store.customerId,
      };
      console.log(finalData, "success")

      const res: any = await postAddressData(finalData);
      console.log("postAddressData res : ", res);

      if (res?.status === "success" || res?.status === "updated") {
        setIsInputEdited(false);
        setErrorMessage({});
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.SAVE_API_SUCCESS);
        setAlertType("success");
        setIsSectionEditable(false);
        setOriginalState(fields);

      } else {
        // console.log('Failed');
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
    }

  };
  const handlePincodeAPI = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target);
    console.log(event.target.value, oldPincodeValue);

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
      console.log("RESPONSE PINCODe", response.data);
      if (response?.errors) {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          [name]: response?.errors[0].message,
        }));
        switch (name) {

        }
      } else if (response?.data) {
        switch (name) {

          case "correspondenceAddressPincode":
            setFields({
              ...fields,

              correspondenceAddressCity: response.data.city,
              correspondenceAddressState: response.data.state,
              correspondenceAddressDistrict: response?.data?.district || ""
            });
            break;

          case "cardDeliveryAddressPincode":
            setFields({
              ...fields,
              cardDeliveryAddressCity: response.data.city,
              cardDeliveryAddressState: response.data.state,
              cardDeliveryAddressDistrict: response?.data?.district || ""


            });
            break;
        }
      }

    }
    setOldPincodeValue("");
  };

  // 
  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (
      originalState[event.target.name] !== event.target.value

    ) {
      // setIsSectionEditable(true);
      setIsInputEdited(true);
    } else {
      // setIsSectionEditable(false);
      setIsInputEdited(false);
    }
    // setValidInput(true);
    setFields({ ...fields, [event.target.name]: event.target.value });
  };


  return (
    <Container >

      <Grid container spacing={10} className={`${styles.padTop}`}>
        <Hidden smDown>
          <Grid item xs={12} sm={2} className={`${styles.mobileSideBar} py-0`}>sidebar</Grid>
        </Hidden>
        <Grid item xs={12} sm={10} className={`${styles.mainGridContainer}`}>
          <Hidden smDown>
            <Grid item xs={12} sm={4}>
              <Card />
              <Navigation isInputEdited={isInputEdited}
                setShowSnackbar={setShowSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setAlertType={setAlertType} />
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={8} className={`${styles.contentContainer}`}>

            <div className={`mr-2`}>
              <div className={`d-flex align-items-baseline justify-content-between ml-3`}>
                {/* <div className="w-200"> */}
                <Typography className={`${styles.address}`}>

                  <Hidden smUp>
                    <img
                      className={`mr-3 ${styles.backToMyProfile}`}
                      src={IconBack}
                      alt=""
                      onClick={() => router.back()}
                    />
                  </Hidden>
                    Address

                  {
                    !isSectionEditable &&
                    <img className={`${styles.editicon}`} src={Editicon} alt="" onClick={() => setIsSectionEditable(true)} />
                  }
                </Typography>

              </div>

              <Divider className={`${styles.secDivider} mb-2 ml-3`} />

              {/* Registered Address */}
              <Grid container>
                <Typography color="primary" className={`${styles.regaddress}`} >Registered Address</Typography>
                <div className={`${styles.registeraddress}`}>

                  <Typography >
                    {fields.registeredAddressLine1}, {fields.registeredAddressLine2}, {fields.registeredAddressCity}, {fields.registeredAddressPincode}, {fields.registeredAddressDistrict}, {fields.registeredAddressState}
                  </Typography>
                </div>
              </Grid>
              <Typography color="primary" className={`${styles.corraddress}`} >Correspondence Address</Typography>
              <Grid container>

                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      Address Line 1
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      Pin Code
                    </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="correspondence-address-pincode"
                      placeholder="400001"
                      variant="outlined"
                      error={!!errorMessage.correspondenceAddressPincode}
                      name="correspondenceAddressPincode"
                      value={fields.correspondenceAddressPincode}
                      onBlur={handlePincodeAPI}
                      onFocus={(e: any) => setOldPincodeValue(e.target.value)}
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      City
                    </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="correspondence-address-city"
                      placeholder="Bengaluru"
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      District
                    </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="correspondence-address-district"
                      placeholder="Bengaluru"
                      variant="outlined"
                      error={!!errorMessage.correspondenceAddressDistrict}
                      name="correspondenceAddressDistrict"
                      value={fields.correspondenceAddressDistrict}
                      onChange={handleTextfieldChange}
                      helperText={
                        errorMessage.correspondenceAddressDistrict &&
                        errorMessage.correspondenceAddressDistrict
                      }
                      inputProps={{ maxLength: 100 }}
                      InputProps={{
                        endAdornment: errorMessage.correspondenceAddressDistrict && (
                          <InputAdornment position="end">
                            <CustomSvgIcon iconsource={WarningIcon} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      State
                    </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="correspondence-address-state"
                      placeholder="Karnataka"
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
                  </div>
                </Grid>
              </Grid>
              {/* Card Delivery Address */}
              <Typography color="primary" className={`${styles.cardaddress}`} >Card Delivery Address</Typography>
              <Grid container>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      Address Line 1
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      Pin Code
                      </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="card-delivery-address-pincode"
                      placeholder="400001"
                      variant="outlined"
                      error={!!errorMessage.cardDeliveryAddressPincode}
                      name="cardDeliveryAddressPincode"
                      value={fields.cardDeliveryAddressPincode}
                      onChange={handleTextfieldChange}
                      onBlur={handlePincodeAPI}
                      onFocus={(e: any) => setOldPincodeValue(e.target.value)}
                      helperText={
                        errorMessage.cardDeliveryAddressPincode &&
                        errorMessage.cardDeliveryAddressPincode
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      City
                      </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="card-delivery-address-city"
                      placeholder="Bengaluru"
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
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      District
                      </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="card-delivery-address-district"
                      placeholder="Bengaluru"
                      variant="outlined"
                      error={!!errorMessage.cardDeliveryAddressDistrict}
                      name="cardDeliveryAddressDistrict"
                      value={fields.cardDeliveryAddressDistrict}
                      onChange={handleTextfieldChange}
                      helperText={
                        errorMessage.cardDeliveryAddressDistrict &&
                        errorMessage.cardDeliveryAddressDistrict
                      }
                      inputProps={{ maxLength: 100 }}
                      InputProps={{
                        endAdornment: errorMessage.cardDeliveryAddressDistrict && (
                          <InputAdornment position="end">
                            <CustomSvgIcon iconsource={WarningIcon} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      State
                    </CustomLabel>
                    <CustomTextField
                      disabled={!isSectionEditable}
                      id="card-delivery-address-state"
                      placeholder="Karnataka"
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
                  </div>
                </Grid>
              </Grid>


              {
                isSectionEditable &&
                <Grid item xs={12} sm={12} className="px-3">
                  <div className={`${styles.actionBtns}`}>
                    <CustomButton

                      onClick={(e) => handleCancel(e)}
                      variant="outlined"
                      color="primary"

                      className="mr-4"
                    // data-test-id="sf-ad-clear-button"
                    >
                      CANCEL
                    </CustomButton>
                    <CustomButton

                      onClick={(e) => handleSave(e)}
                      variant="contained"
                      color="primary"
                    // disabled={!validInput}
                    // className="w-100"
                    // data-test-id="sf-ad-save-button"
                    >
                      SAVE
                    </CustomButton>
                  </div>
                </Grid>
              }

              <CustomSnackbar
                open={showSnackbar}
                close={setShowSnackbar}
                type={alertType}
                message={snackbarMessage}
              ></CustomSnackbar>


            </div>

          </Grid>

        </Grid>
      </Grid>
    </Container>
  );
};

export default Address;
