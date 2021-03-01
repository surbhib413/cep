import React, { useEffect, useContext } from "react";
import validator from "validator";
import { Grid, InputAdornment } from "@material-ui/core";
import styles from "./UserProfileComponent.module.scss";
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { isVailidName, isValidMobileNumber, isValidEmailAddress } from "../../../utility/validations/validations";
import { useDispatch } from "react-redux";
import { SnackbarMessage } from "../../../utility/Snackbar/SnackbarMessages";
import { upsertSubUser } from "../../../lib/api/smartfleet/settings/subusers";
import { setLoader } from "../../../redux/actions/actions";
import { SubUsersContext } from '../SubUsers/SubUsers';

const IconUpload = "/W_Icon_Upload_2.svg"
const IconDelete = "/W_Icons_Delete_2.svg"
const IconEdit = "/Edit_Icon.svg"
const IconBack = "/Back_Icon.svg"
const InfoIcon = "/W_Icons_Info.svg";
const WarningIcon = "/W_Icons_Warning.svg";
const VisibilityOff = "../Visibility_Off_Eye_Icon.svg";
const Visibility = "../Visibility_On_Eye_Icon.svg";
const PasswordSuccess = "/Group29605.svg";
const PasswordSuccessMob = "/M_Illustrations_Password_Reset.svg";

const getNameInitials = (fullname: any) => {
  let name = fullname;
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];
  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
  return initials;
}

interface IErrorMessages {
  name?: string,
  designation?: string,
  mobileNumber?: string,
  whatsAppNumber?: string,
  emailId?: string
}

// createSubUser, viewSubUser, viewSubUser && isSectionEditable, myProfile 
const UserProfileComponent = (props: any): JSX.Element => {
  const [tableData, setTableData, setShowSubUsersTable, subUserProfileDetails, setSubUserProfileDetails, setShowSnackbar,
    setSnackbarMessage, setAlertType, setIsInputEdited] = useContext(SubUsersContext);
  const { componentType, isSectionEditable, setIsSectionEditable } = props;
  const dispatch = useDispatch();

  const initFields = {
    name: '',
    designation: '',
    mobileNumber: '',
    whatsAppNumber: null,
    emailId: '',
    thumbnailUrl: null,
    userId: '',
    active: true
  };

  const [fields, setFields] = React.useState(initFields);
  const [creds, setCreds] = React.useState<any>('AZ');
  const [originalState, setOriginalState] = React.useState<any | {}>(initFields);
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");

  useEffect(() => {
    const { initialData } = props;

    if (initialData) {

      const initialFields = {
        name: initialData?.name,
        designation: initialData?.designation,
        mobileNumber: initialData?.mobileNumber,
        whatsAppNumber: initialData?.whatsAppNumber,
        emailId: initialData?.emailId,
        thumbnailUrl: initialData?.thumbnailUrl,
        userId: initialData?.userId,
        active: initialData?.active
      };
      setOriginalState(initialFields);
      setFields(initialFields);
      if (initialFields.thumbnailUrl === '') {
        setCreds(getNameInitials(initialFields.name));
      }
    }

  }, []);

  useEffect(() => {
    if (fields.thumbnailUrl === '' || fields.thumbnailUrl === null) {
      setCreds(getNameInitials(fields.name));
    }
  }, [fields]);


  const handleTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (originalState && componentType === 'viewSubUser') {
      if (originalState[event.target.name] !== event.target.value) {
        setIsInputEdited(true);
      } else {
        setIsInputEdited(false);
      }
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value
    });
  }


  const validate = (): boolean => {
    let isError: boolean = false;

    // Validate User Name
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

    // Validate Primary Designation
    // if (!fields.designation) {
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,
    //     designation: validationErrorMessage.REQUIRED,
    //   }));
    // } else if (!isVailidDesignation(fields.designation)) {
    //   // else if (!isValidEmailAddress(fields.designation)) {
    //   isError = true;
    //   setErrorMessage((errorMessage) => ({
    //     ...errorMessage,
    //     designation: validationErrorMessage.DESIGNATION,
    //   }));
    // }



    // Validate User Mobile
    if (!fields.mobileNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        mobileNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidMobileNumber(fields.mobileNumber)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        mobileNumber: validationErrorMessage.MOBILE_NUMBER,
      }));
    }

    // Validate User Email
    if (!fields.emailId) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        emailId: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidEmailAddress(fields.emailId)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        emailId: validationErrorMessage.EMAIL,
      }));
    }

    return isError;
  };



  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    if (componentType === 'createSubUser') {
      props.handleClose();
    }

    // setFields(initFields);
    setFields(originalState);
    setErrorMessage({});
    setIsSectionEditable(false);
    if (componentType === 'viewSubUser') {
      setIsInputEdited(false);
    }
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }

    console.log(fields);

    setErrorMessage({});
    event.preventDefault();
    const isError = validate();

    if (!isError) {

      const finalData = {
        ...fields
      };

      let res: any;
      dispatch(setLoader(true));
      res = await upsertSubUser(finalData);
      dispatch(setLoader(false));
      console.log(res);


      if (res?.status === "success" || res?.status === "updated") {
        if (componentType === 'viewSubUser') {
          setIsInputEdited(false);
        }
        setErrorMessage({});
        setIsSectionEditable(false);
        setOriginalState(fields);
        // update the tableData for insertion/updation
        if (componentType === 'createSubUser') {
          props.handleClose();
          setTableData((tableData: any) => [...tableData, fields]);
        } else if (componentType === 'viewSubUser') {
          let userId = fields.userId;
          let index = tableData.findIndex((obj: any) => obj.userId === userId);
          let newArr = [...tableData];
          newArr[index] = fields;
          // newArr[index] = {...newArr[index], active: true};
          setTableData(newArr);
        }
        setShowSnackbar(true);
        setSnackbarMessage(res.message);
        setAlertType("success");

      } else {
        if (res?.errors) {
          const errorObj: any = {};
          res?.errors &&
            res?.errors.forEach((element: any) => {
              console.log(element?.subject);
              if (!element.hasOwnProperty("subject")) {
                setApiOtherErrorMessage(element?.message);
                setShowSnackbar(true);
                setSnackbarMessage(element?.message + " " + element?.subject);
                setAlertType("error");
              } else {
                if (element?.subject === "organizationName") {
                  errorObj.primaryUserOrganizationName = element?.message;
                }
                errorObj[element?.subject] = element?.message;
              }
            });

          setErrorMessage((errorMessage) => ({
            ...errorMessage,
            ...errorObj,
          }));
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }

    } else {

    }


  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12} className={styles.singleRow}>
        <div className={`${styles.profileImgContainer} ${componentType === 'createSubUser' ? styles.userProfileModal : null}`}>
          {/* <img src="https://via.placeholder.com/300.png" className={`${styles.profileImg}`} /> */}
          {/* <img src="https://via.placeholder.com/300.png" className={`${styles.profileImg}`} /> */}
          <div className={styles.defaultImg}>{creds}</div>
          {/* {
            isSectionEditable
              ?
              <div>
                <CustomButton className={`${styles.profImgBtn}`}>
                  <img
                    className={`mr-2 ${styles.profImgIcon}`}
                    src={IconUpload}
                    alt=""
                  />
                Upload
              </CustomButton>
                <CustomButton className={`${styles.profImgBtn}`}>
                  <img
                    className={`mr-2 ${styles.profImgIcon}`}
                    src={IconDelete}
                    alt=""
                  />
                Remove
              </CustomButton>
              </div>
              : null

          } */}

        </div>
      </Grid>

      <Grid item xs={12} sm={6} className={styles.singleRow}>
        <div>
          <CustomLabel htmlFor="primary-name">
            Name *
          </CustomLabel>
          <CustomTextField
            id="primary-name"
            variant="outlined"
            placeholder="John Doe"
            disabled={!isSectionEditable}
            name="name"
            value={fields.name}
            error={!!errorMessage.name}
            onChange={handleTextfieldChange}
            inputProps={{ maxLength: 256 }}
            helperText={
              errorMessage.name &&
              errorMessage.name
            }
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
      <Grid item xs={12} sm={6} className={styles.singleRow}>
        <div>
          <CustomLabel htmlFor="designation">
            Designation
          </CustomLabel>
          <CustomTextField
            id="designation"
            variant="outlined"
            placeholder="Manager"
            disabled={!isSectionEditable}
            name="designation"
            value={fields.designation}
            onChange={handleTextfieldChange}
            inputProps={{ maxLength: 256 }}
          />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} className={styles.singleRow}>
        <div>
          <CustomLabel htmlFor="mobileNumber">
            Mobile Number *
          </CustomLabel>
          <CustomTextField
            id="mobileNumber"
            variant="outlined"
            placeholder="9820098200"
            disabled={!isSectionEditable}
            // disabled={!isSectionEditablePermanent}
            // className={`${isSectionEditable ? styles.greyBg : null}`}
            name="mobileNumber"
            value={fields.mobileNumber}
            error={!!errorMessage.mobileNumber}
            onChange={handleTextfieldChange}
            helperText={
              errorMessage.mobileNumber &&
              errorMessage.mobileNumber
            }
            inputProps={{ maxLength: 10 }}
            InputProps={{
              endAdornment: errorMessage.mobileNumber && (
                <InputAdornment position="end">
                  <CustomSvgIcon iconsource={WarningIcon} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Grid>

      {
        componentType === 'viewSubUser' || componentType === 'createSubUser'
          ? null
          :
          <Grid item xs={12} sm={6} className={styles.singleRow}>
            <div>
              <CustomLabel htmlFor="whatsAppNumber">
                WhatsApp Number
              </CustomLabel>
              <CustomTextField
                id="whatsAppNumber"
                variant="outlined"
                placeholder="9820098200"
                disabled={!isSectionEditable}
                // disabled={!isSectionEditablePermanent}
                // className={`${isSectionEditable ? styles.greyBg : null}`}
                name="whatsAppNumber"
                value={fields.whatsAppNumber}
                helperText={
                  errorMessage.whatsAppNumber &&
                  errorMessage.whatsAppNumber
                }
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  endAdornment: errorMessage.whatsAppNumber && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Grid>
      }


      <Grid item xs={12} sm={6} className={styles.singleRow}>
        <div>
          <CustomLabel htmlFor="emailId">
            Email ID *
          </CustomLabel>
          <CustomTextField
            id="emailId"
            variant="outlined"
            placeholder="johndoe@gmail.com"
            disabled={!isSectionEditable}
            // disabled={!isSectionEditablePermanent}
            // className={`${isSectionEditable ? styles.greyBg : null}`}
            name="emailId"
            value={fields.emailId}
            error={!!errorMessage.emailId}
            onChange={handleTextfieldChange}
            helperText={
              errorMessage.emailId &&
              errorMessage.emailId
            }
            inputProps={{ maxLength: 256 }}
            InputProps={{
              endAdornment: errorMessage.emailId && (
                <InputAdornment position="end">
                  <CustomSvgIcon iconsource={WarningIcon} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Grid>

      {
        isSectionEditable
          ?
          <Grid item xs={12} sm={12} className={styles.singleRow}>
            <div className={`${styles.profileActionBtns}`}>
              <CustomButton
                variant="outlined"
                color="primary"
                className={`mr-4`}
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={(e) => handleSave(e)}
              >
                {componentType === 'createSubUser' ? 'Add User' : 'Save'}
              </CustomButton>
            </div>
          </Grid>
          :
          null
        // <Hidden smUp>
        //   <Grid item xs={12} sm={12} className={styles.singleRow}>
        //     <div className={`${styles.profileActionBtns}`}>
        //       <CustomButton
        //         variant="outlined"
        //         color="primary"
        //         className={`mr-4`}
        //       // onClick={(e) => handleCancel(e)}
        //       >
        //         Delete User
        //     </CustomButton>
        //       <CustomButton
        //         variant="contained"
        //         color="primary"
        //       // onClick={(e) => handleSave(e)}
        //       >
        //         Disable User
        //     </CustomButton>
        //     </div>
        //   </Grid>
        // </Hidden>
      }

    </Grid>
  )
}


export default UserProfileComponent;