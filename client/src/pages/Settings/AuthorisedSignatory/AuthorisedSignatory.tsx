import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, makeStyles, InputAdornment, Snackbar, Hidden } from "@material-ui/core";
// import styles from "./../Settings.module.scss";
import styles from "./authorisedsign.module.scss"
import Divider from '@material-ui/core/Divider';
import Navigation from '../Navigation';
import { useRouter } from "next/router";
import { setLoader } from "../../../redux/actions/actions";
import { useDispatch } from "react-redux";
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { postAuthorisedSignature } from "../../../lib/api/smartfleet/settings/authorisedsignatory";
import {
  isVailidName,
  isValidMobileNumber,
  isValidEmailAddress
} from "../../../utility/validations/validations";
import validator from "validator";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Card from '../Card'
const IconEdit = "/Edit_Icon.svg";
const cancelImg = "/W_Icons_X.svg";
const WarningIcon = "/W_Icons_Warning.svg";
const backIcon = "/Back_Icon.svg";


interface IErrorMessages {
  name?: string;
  designation?: string;
  mobile?: string;
  email?: string;
}

const AuthorisedSignatory = (props: any): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState(props.initialData);
  // const [validInput, setValidInput] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [isInputEdited, setIsInputEdited] = React.useState(false);

  const initFields = {
    name: "",
    designation: "",
    mobile: "",
    email: "",
    editable: false
  }
  const [fields, setFields] = React.useState(initFields);
  const [originalState, setOriginalState] = React.useState<any | {}>(initFields);
  const [isSectionEditable, setIsSectionEditable] = React.useState(initFields.editable);
  // const [isEditIcon, setIsEditIcon] = React.useState(true);


  useEffect(() => {

    const { initialData } = props;


    if (initialData) {
      console.log("initialData", initialData);

      const initialFields = {
        name: initialData?.name || "",
        designation: initialData?.designation || "",
        mobile: initialData?.mobile || "",
        email: initialData?.email || "",
        editable: initialData?.editable,
      };
      setFields(initialFields);
      setOriginalState(initialFields);
      setIsSectionEditable(initialData?.editable);
    }
  }, []);



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

  //Handle Edit

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    setIsSectionEditable(true);
    // setIsEditIcon(false);

  }


  // const handleClear = (event: React.MouseEvent<HTMLElement>) => {
  //   if (!isSectionEditable) {
  //     return false;
  //   }
  //   // setFields(initFields);
  //   // setInitialData(originalState);
  //   // setFields(originalState);
  //   // setErrorMessage({});
  //   // setIsSectionEditable(false);
  //   // setIsEditIcon(true);
  //   setFields(initFields);
  //   setErrorMessage({});
  // };
  const handleClear = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    // setFields(initFields);
    // setInitialData(originalState);
    setFields(originalState);
    setErrorMessage({});
    setIsSectionEditable(false);
    // setIsEditIcon(true);
    setIsInputEdited(false);

  };






  // Validations

  const validate = (): boolean => {

    let isError: boolean = false;
    console.log("VVVVVVVVValidation");
    // setErrorMessage({});
    // Validate Name
    if (!fields.name) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        name: validationErrorMessage.REQUIRED,
      }));
    } else if (!isVailidName(fields.name)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        name: validationErrorMessage.INVALID_NAME,
      }));
    }
    console.log("VVVVVVVVValidation name");
    // Validate Designation
    // if (!fields.designation) {
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,
    //     designation: validationErrorMessage.REQUIRED,
    //   }));
    // } else if (!isVailidName(fields.designation)) {
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,
    //     designation: validationErrorMessage.INVALID_NAME,
    //   }));
    // }

    // Validate Mobile
    if (!fields.mobile) {
      console.log("inside mobile validation");
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        mobile: validationErrorMessage.REQUIRED,
      }));
    }
    else if (!isValidMobileNumber(fields.mobile)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        mobile: validationErrorMessage.MOBILE_NUMBER,
      }));

      console.log("validMobile number 2");
    }
   
    // Validate Email
    if (!fields.email) {

      console.log("inside email validation");

      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        email: validationErrorMessage.REQUIRED,
      }));
      console.log(errorMessage);
    } else if (!isValidEmailAddress(fields.email)) {
      console.log("inside email validation");
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        email: validationErrorMessage.EMAIL,
      }));
    }

    // else if(fields.email==""){
    //   console.log("inside empty email ");
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,
    //     email: validationErrorMessage.REQUIRED,
    //   }));

    // }

    console.log("outside validation of email");
    return isError;


  };



  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    // setErrorMessage({});
    event.preventDefault();
    const isError = validate();
    //setLoader(true);
    console.log("Authsign isError", isError);
    console.log("Authsign fields", fields);
    console.log("Authsign errorMessage", errorMessage);
    if (!isError) {
      setErrorMessage({});
      // If all validations pass, API call to submit basic profile data
      console.log("All validations pass-----");
      console.log(fields);
      dispatch(setLoader(true));
      const finalData = {
        ...fields,
      };
      // console.log("store", store);
      console.log("finalData", finalData);
      const res: any = await postAuthorisedSignature(finalData);

      console.log("postAuthorisedSignature res : ", res);

      if (res?.status === "success" || res?.status === "updated") {
        setIsInputEdited(false);
        setErrorMessage({});
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.SAVE_API_SUCCESS);
        setAlertType("success");
        setIsSectionEditable(false);
        setOriginalState(fields);
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
              // if (element?.subject === "organizationName") {
              //   errorObj.primaryUserOrganizationName = element?.message;

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

    }

  };


  return (
    <Container>

      <Grid container spacing={10} className={styles.padTop} >
        <Hidden smDown>
          <Grid item xs={12} sm={2} className={`${styles.mobileSideBar} py-0`}>sidebar</Grid>
        </Hidden>
        <Grid item xs={12} sm={10} className={`${styles.mainGridContainer} `}>
          <Hidden smDown>
            <Grid item xs={12} sm={4} >
              <Card />
              <Navigation isInputEdited={isInputEdited}
                setShowSnackbar={setShowSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setAlertType={setAlertType} />
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={8} >

            <div className={`ml-4 mr-2`}>
              <div className={`d-flex align-items-baseline justify-content-between ml-3`}>
                <Typography className={`${styles.authorised}`}  >

                  <Hidden smUp>
                    <img
                      className={`mr-3 ${styles.backToMyProfile}`}
                      src={backIcon}
                      alt=""
                      onClick={() => router.back()}
                    />
                  </Hidden>
                      Authorised Signatory
                      {
                    !isSectionEditable === true ?
                      <img className={styles.editIcon} src={IconEdit} alt="" onClick={(e) => handleEdit(e)} /> : null
                  }
                </Typography>
              </div>
              <Divider className={`${styles.secDivider} mb-3 ml-3 `} />

              <Grid container>

                <Grid item xs={12} sm={6} className="px-3">
                  <div >
                    <CustomLabel htmlFor="">
                      Name *
                      </CustomLabel>
                    <CustomTextField
                      variant="outlined"
                      placeholder="John Doe"
                      disabled={!isSectionEditable}
                      // value={initialData.name}
                      value={fields.name}
                      name="name"

                      onChange={handleTextfieldChange}
                      error={!!errorMessage.name}
                      helperText={errorMessage.name && errorMessage.name}
                      InputProps={{
                        endAdornment: errorMessage.name && (
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
                      Designation
                    </CustomLabel>
                    <CustomTextField
                      variant="outlined"
                      placeholder="Manager"
                      disabled={!isSectionEditable}
                      // value={initialData.designation}
                      value={fields.designation}
                      name="designation"
                      onChange={handleTextfieldChange}
                      inputProps={{ maxLength: 100 }}
                    // onChange={(e: any) => fieldUpdate(e)}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} className="px-3">
                  <div>
                    <CustomLabel htmlFor="">
                      Mobile Number *
                    </CustomLabel>
                    <CustomTextField
                      variant="outlined"
                      placeholder="9820098200"
                      disabled={!isSectionEditable}
                      // value={initialData.mobile}
                      value={fields.mobile}
                      name="mobile"
                      onChange={handleTextfieldChange}
                      // onChange={(e: any) => fieldUpdate(e)}
                      error={!!errorMessage.mobile}
                      helperText={errorMessage.mobile && errorMessage.mobile}
                      inputProps={{ maxLength: 10 }}
                      InputProps={{
                        endAdornment: errorMessage.mobile && (
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
                      Email ID *
                    </CustomLabel>
                    <CustomTextField
                      variant="outlined"
                      placeholder="johndoe@gmail.com"
                      disabled={!isSectionEditable}
                      // value={initialData.email}
                      value={fields.email}
                      name="email"
                      onChange={handleTextfieldChange}
                      // onChange={(e: any) => fieldUpdate(e)}
                      error={!!errorMessage.email}
                      helperText={errorMessage.email && errorMessage.email}
                      InputProps={{
                        endAdornment: errorMessage.email && (
                          <InputAdornment position="end">
                            <CustomSvgIcon iconsource={WarningIcon} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </Grid>

                {isSectionEditable === true ?
                  (
                    <Grid item xs={12} sm={12} className="px-3">
                      <div className={`${styles.actionBtns}`}>
                        <CustomButton
                          variant="outlined"
                          color="primary"
                          className={`mr-4`}
                          // onClick={() => handleCancel()}
                          onClick={(e) => handleClear(e)}
                        >
                          CANCEL
                      </CustomButton>
                        <CustomButton
                          variant="contained"
                          color="primary"
                          // disabled={!validInput}
                          onClick={(e) => handleSave(e)}
                        >
                          SAVE
                      </CustomButton>
                      </div>
                    </Grid>
                  ) : null}

                <CustomSnackbar
                  open={showSnackbar}
                  close={setShowSnackbar}
                  type={alertType}
                  message={snackbarMessage}
                ></CustomSnackbar>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );

};

export default AuthorisedSignatory;
