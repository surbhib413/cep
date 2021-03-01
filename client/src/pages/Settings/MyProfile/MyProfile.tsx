import React, { useEffect, useState } from "react";
import { Container, Grid, Hidden, Typography, InputAdornment, IconButton } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styles2 from "./MyProfile.module.scss";
import { useRouter } from "next/router";
import Divider from '@material-ui/core/Divider';
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { isVailidName, isValidPassword } from "../../../utility/validations/validations";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

import { useDispatch } from "react-redux";
import { setLoader, resetStore} from "../../../redux/actions/actions";
import { uploadProfileImage, removeProfileImage, updateUserDetails, changeUserPassword } from "../../../lib/api/smartfleet/settings/myprofile";
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Cookies from "universal-cookie";

import Card from '../Card'
import Navigation from '../Navigation'
import { callSignOut } from "src/lib/auth/helper";

const IconUpload = "/W_Icon_Upload_2.svg"
const IconDelete = "/W_Icons_Delete_2.svg"
const IconEdit = "/Edit_Icon.svg"
const IconEditBlue = "/W_Icon_Edit_Blue.svg"
const IconBack = "/Back_Icon.svg"
const InfoIcon = "/W_Icons_Info.svg";
const WarningIcon = "/W_Icons_Warning.svg";
const VisibilityOff = "../Visibility_Off_Eye_Icon.svg";
const Visibility = "../Visibility_On_Eye_Icon.svg";
const PasswordSuccess = "/Group29605.svg";
const PasswordSuccessMob = "/M_Illustrations_Password_Reset.svg";


const BACKOFFICE_URL = 'https://backoffice.czikjdqndy-bharatpet1-d1-public.model-t.cc.commerce.ondemand.com/backoffice';

const getNameInitials = (fullname: any) => {
  let name = fullname;
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];
  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
  return initials;
}

// START | MY PROFILE COMPONENT

interface IErrorMessages {
  name?: string,
  designation?: string,
  mobileNumber?: string,
  whatsAppNumber?: string,
  emailId?: string
}

const MyProfileComponent = (props: any): JSX.Element => {
  const dispatch = useDispatch();

  const [isSectionEditable, setIsSectionEditable] = React.useState(false);
  const [isSectionEditablePermanent, setIsSectionEditablePermanent] = React.useState(false);
  // const [originalState, setOriginalState] = React.useState<any | {}>({});

  const initFields = {
    name: '',
    designation: '',
    mobileNumber: '',
    whatsAppNumber: '',
    emailId: '',
    thumbnailUrl: '',
    userId: '',
    previewThumbnailUrl: ''
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
        name: initialData?.name || '',
        designation: initialData?.designation || '',
        mobileNumber: initialData?.mobileNumber || '',
        whatsAppNumber: initialData?.whatsAppNumber || '',
        emailId: initialData?.emailId || '',
        thumbnailUrl: initialData?.thumbnailUrl || '',
        userId: initialData?.userId,
        previewThumbnailUrl: ''
      };
      setOriginalState(initialFields);
      setFields(initialFields);
      if (initialFields.thumbnailUrl === '') {
        setCreds(getNameInitials(initialFields.name));
      }
    }

  }, []);

  useEffect(() => {
    if (fields.previewThumbnailUrl === '' && fields.thumbnailUrl === '') {
      setCreds(getNameInitials(fields.name));
    }
  }, [fields]);


  const handleTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (originalState[event.target.name] !== event.target.value) {
      props.setIsInputEdited(true);
    } else {
      props.setIsInputEdited(false);
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value
    });

  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let uploadedFile: any = '';
    uploadedFile = (event.target as HTMLInputElement).files[0];

    let file = uploadedFile;
    let reader = new FileReader();
    let url = reader.readAsDataURL(file);

    if (Math.floor(uploadedFile.size / 5120) >= 1023) {
      props.setShowSnackbar(true);
      props.setSnackbarMessage(SnackbarMessage.PROFILE_IMG_SIZE);
      props.setAlertType("error");
    } else {

      dispatch(setLoader(true));
      let formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("id", fields.userId);
      const res: any = await uploadProfileImage(formData);
      dispatch(setLoader(false));

      if (res?.status === "success" || res?.status === "updated") {
        setFields({
          ...fields,
          previewThumbnailUrl: [reader.result]
        });
        setOriginalState({
          ...fields,
          previewThumbnailUrl: [reader.result]
        });
        props.setShowSnackbar(true);
        props.setSnackbarMessage(res.data.message);
        props.setAlertType("success");
      } else {
        props.setShowSnackbar(true);
        props.setSnackbarMessage(res.data.message);
        props.setAlertType("error");
      }

    }

  }


  const handleImageRemove = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    dispatch(setLoader(true));
    const res: any = await removeProfileImage(fields);
    dispatch(setLoader(false));

    if (res?.status === "success" || res?.status === "updated") {
      setFields({
        ...fields,
        thumbnailUrl: '',
        previewThumbnailUrl: ''
      });
      setOriginalState({
        ...fields,
        thumbnailUrl: '',
        previewThumbnailUrl: ''
      });
      props.setShowSnackbar(true);
      props.setSnackbarMessage(res.data.message);
      props.setAlertType("success");
    } else {
      props.setShowSnackbar(true);
      props.setSnackbarMessage(res.data.message);
      props.setAlertType("error");
    }

  }


  const validate = (): boolean => {
    let isError: boolean = false;

    // Validate Primary User Name
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

    return isError;
  };



  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields(originalState);
    setErrorMessage({});
    setIsSectionEditable(false);
    props.setIsInputEdited(false);
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setErrorMessage({});
    event.preventDefault();
    const isError = validate();

    if (!isError) {
      dispatch(setLoader(true));

      const finalData = {
        ...fields
      };
      const res: any = await updateUserDetails(finalData);
      // console.log(res);

      if (res?.status === "success" || res?.status === "updated") {
        props.setIsInputEdited(false);
        setErrorMessage({});
        setIsSectionEditable(false);
        setOriginalState(fields);
        props.setShowSnackbar(true);
        props.setSnackbarMessage(res.message);
        props.setAlertType("success");
      } else {
        const errorObj: any = {};
        res?.errors &&
          res?.errors.forEach((element: any) => {
            console.log(element?.subject);
            if (!element.hasOwnProperty("subject")) {
              setApiOtherErrorMessage(element?.message);
              props.setShowSnackbar(true);
              props.setSnackbarMessage(element?.message + " " + element?.subject);
              props.setAlertType("error");
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
      }
      dispatch(setLoader(false));
      // if (res?.data?.completed) {
      //   handleCompleteStep(formSections.BASIC_PROFILE, true);
      //   handleIncompleteStep(formSections.BASIC_PROFILE, false);
      // } else {
      //   handleIncompleteStep(formSections.BASIC_PROFILE, true);
      // }
    } else {
      // handleIncompleteStep(formSections.BASIC_PROFILE, true);
    }


  };


  return (
    <div className={``}>
      <div className={`d-flex align-items-baseline justify-content-between mb-2`}>

        {
          props.isMobile
            ?
            <Typography className={`${styles2.sectionHeading}`}>
              <div>
                <img
                  className={`mr-3 ${styles2.backToMyProfile}`}
                  src={IconBack}
                  alt=""
                  onClick={() => props.setMobShowTabContent()}
                />
              My Profile
              </div>
              {
                isSectionEditable
                  ? null
                  :
                  <img
                    className={`ml-3 ${styles2.backToMyProfile}`}
                    src={IconEditBlue}
                    alt=""
                    onClick={() => setIsSectionEditable(true)}
                  />
              }
            </Typography>
            :
            <>
              <Typography className={`${styles2.sectionHeading}`}>
                My Profile
                {
                  isSectionEditable
                    ? null
                    :
                    <img
                      className={`ml-3 mr-3 ${styles2.backToMyProfile}`}
                      src={IconEdit}
                      alt=""
                      onClick={() => setIsSectionEditable(true)}
                    />
                }
              </Typography>
              <Typography color="primary" className={`${styles2.changePassLink}`} onClick={() => {
                props.setIsInputEdited(false);
                props.changePassLink();
              }}>
                Change Password
              </Typography>
            </>
        }

      </div>

      <Divider className={`${styles2.secDivider}`} />

      <Grid container>
        <Grid item xs={12} sm={12} className={styles2.singleRow}>
          <div className={`${styles2.profileImgContainer}`}>

            <div className={styles2.imgWrapper}>
              {
                fields.previewThumbnailUrl === '' && fields.thumbnailUrl === ''
                  ? <div className={styles2.defaultImg}>{creds}</div>
                  :
                  <img
                    id="user-profile-img"
                    className={`${styles2.profileImg}`}
                    src={
                      fields.previewThumbnailUrl
                        ? fields.previewThumbnailUrl
                        : `${BACKOFFICE_URL}${fields.thumbnailUrl}`}
                  />
              }
              {/* {
                isSectionEditable &&
                <div className={styles2.cameraWrapper}>
                  <img
                    className={`${styles2.cameraIcon}`}
                    src={IconUpload}
                    alt=""
                  />
                </div>
              } */}
            </div>
            {
              isSectionEditable
                ?
                <div>
                  <input
                    hidden
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={(e) => {
                      handleImageUpload(e);
                    }}
                    value={""}
                  />
                  <label htmlFor="contained-button-file">
                    <CustomButton className={`${styles2.profImgBtn}`}>
                      <img
                        className={`mr-2 ${styles2.profImgIcon}`}
                        src={IconUpload}
                        alt=""
                      />
                      Upload
                    </CustomButton>
                  </label>
                  <CustomButton className={`${styles2.profImgBtn}`} onClick={handleImageRemove}>
                    <img
                      className={`mr-2 ${styles2.profImgIcon}`}
                      src={IconDelete}
                      alt=""
                    />
                    Remove
                  </CustomButton>
                </div>
                : null

            }

          </div>
        </Grid>

        <Grid item xs={12} sm={6} className={styles2.singleRow}>
          <div>
            <CustomLabel htmlFor="primary-name">
              Name {isSectionEditable ? '*' : null}
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
        <Grid item xs={12} sm={6} className={styles2.singleRow}>
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
        <Grid item xs={12} sm={6} className={styles2.singleRow}>
          <div>
            <CustomLabel htmlFor="mobileNumber">
              Mobile Number
            </CustomLabel>
            <CustomTextField
              id="mobileNumber"
              variant="outlined"
              placeholder="9820098200"
              disabled={!isSectionEditablePermanent}
              className={`${isSectionEditable ? styles2.greyBg : null}`}
              name="mobileNumber"
              value={fields.mobileNumber}
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
        <Grid item xs={12} sm={6} className={styles2.singleRow}>
          <div>
            <CustomLabel htmlFor="whatsAppNumber">
              WhatsApp Number
            </CustomLabel>
            <CustomTextField
              id="whatsAppNumber"
              variant="outlined"
              placeholder="9820098200"
              disabled={!isSectionEditablePermanent}
              className={`${isSectionEditable ? styles2.greyBg : null}`}
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
        <Grid item xs={12} sm={6} className={styles2.singleRow}>
          <div>
            <CustomLabel htmlFor="emailId">
              Email ID
            </CustomLabel>
            <CustomTextField
              id="emailId"
              variant="outlined"
              placeholder="johndoe@gmail.com"
              disabled={!isSectionEditablePermanent}
              className={`${isSectionEditable ? styles2.greyBg : null}`}
              name="emailId"
              value={fields.emailId}
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
            <Grid item xs={12} sm={12} className={styles2.singleRow}>
              <div className={`${styles2.profileActionBtns}`}>
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
                  Save
                </CustomButton>
              </div>
            </Grid>
            : null
        }


        {
          props.isMobile && !isSectionEditable
            ?
            <Grid item xs={12} sm={12} className={`${styles2.singleRow} mt-3`}>
              <CustomButton
                variant="outlined"
                color="primary"
                className={`w-100`}
                onClick={() => props.changePassLink()}
              >
                Change Password
              </CustomButton>
            </Grid>
            : null
        }




      </Grid>

    </div>


  )
}
// END | MY PROFILE COMPONENT













// START | CONFIRMATION DIALOG
export interface ConfirmationDialogRawProps {
  isMobile?: boolean;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const router = useRouter();
  const { onClose, open, ...other } = props;

  const redirectToSignIn = async () => {
    router.push("/login");
    // dispatch(setLoader(true));
    const res: any = await callSignOut();
    console.log("Signout", res);
    if (res) {
      console.log("Signout successfully.");
    } else {
      console.log("Signout not done");       
    }
    // dispatch(setLoader(false));
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth={'md'}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogContent className={`${styles2.modalContent}`}>
        {
          props.isMobile
            ?
            <Typography className={`${styles2.passwordMsg}`}>Password Reset Successful</Typography>
            :
            <Typography className={`${styles2.passwordMsg}`}>Password has been successfully reset.</Typography>
        }
        <div>
          <img
            className={`${styles2.passwordSuccessImg}`}
            src={props.isMobile ? PasswordSuccessMob : PasswordSuccess}
            alt=""
          />
        </div>

        {
          props.isMobile
            ? null
            :
            <Typography className={`${styles2.passwordMsgSub}`}>You can now Sign In to your account</Typography>
        }

        <CustomButton
          variant="contained"
          color="primary"
          className={`${styles2.backToSignInBtn}`}
          onClick={() => redirectToSignIn()}
        >
          Back to sign in
        </CustomButton>
      </DialogContent>
    </Dialog >
  );
}
// END | CONFIRMATION DIALOG




// START | CHANGE PASSWORD COMPONENT

interface IErrorMessagesPassword {
  oldPassword?: string,
  newPassword?: string,
  confirmPassword?: string
}

const ChangePassword = (props: any): JSX.Element => {
  const dispatch = useDispatch();

  const initFields = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const [fields, setFields] = React.useState(initFields);
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessagesPassword>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [passwordVisibility, setPasswordVisibility] = React.useState<any>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    if (fields.oldPassword !== '' || fields.newPassword !== '' || fields.confirmPassword !== '') {
      // console.log('yes edited');
      props.setIsInputEdited(true);
    } else {
      // console.log('not edited');
      props.setIsInputEdited(false);
    }
  }, [fields]);

  const handleTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value
    });
  }

  const validate = (): boolean => {
    let isError: boolean = false;

    const { oldPassword, newPassword, confirmPassword } = fields;

    if (!oldPassword) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        oldPassword: validationErrorMessage.REQUIRED,
      }));
    }

    if (!newPassword) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        newPassword: validationErrorMessage.REQUIRED,
      }));
    }

    if (!confirmPassword) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        confirmPassword: validationErrorMessage.REQUIRED,
      }));
    }

    if (newPassword === oldPassword) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        newPassword: validationErrorMessage.NEW_PASSWORD_SAME_AS_OLD,
      }));
    }

    if (newPassword !== confirmPassword) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        newPassword: validationErrorMessage.UNMATCHED_PASSWORD_SETTINGS,
      }));
    } else if (!isValidPassword(newPassword)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        newPassword: validationErrorMessage.INVALID_PASSWORD,
      }));
    }

    return isError;
  };


  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    props.setIsInputEdited(false);
    setFields(initFields);
    setErrorMessage({});
    props.changePassLink();
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    // if (!isSectionEditable) {
    //   return false;
    // }
    setErrorMessage({});
    event.preventDefault();
    const isError = validate();

    if (!isError) {
      dispatch(setLoader(true));

      const finalData = {
        ...fields
      };
      const res: any = await changeUserPassword(finalData);
      // console.log(res);
      dispatch(setLoader(false));

      // setOpen(true);
      if (res?.status === "success" || res?.status === "updated") {
        props.setIsInputEdited(false);
        setOpen(true);
        setErrorMessage({});
      } else {
        if (res.data.completed === false) {
          // alert(res.data.message);
          props.setShowSnackbar(true);
          props.setSnackbarMessage(res.data.message);
          props.setAlertType("error");
        }

        const errorObj: any = {};
        res?.errors &&
          res?.errors.forEach((element: any) => {
            console.log(element?.subject);
            if (!element.hasOwnProperty("subject")) {
              setApiOtherErrorMessage(element?.message);
              // props.setShowSnackbar(true);
              // props.setSnackbarMessage(element?.message + " " + element?.subject);
              // props.setAlertType("error");
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
      }
      // if (res?.data?.completed) {
      //   handleCompleteStep(formSections.BASIC_PROFILE, true);
      //   handleIncompleteStep(formSections.BASIC_PROFILE, false);
      // } else {
      //   handleIncompleteStep(formSections.BASIC_PROFILE, true);
      // }
    } else {
      // handleIncompleteStep(formSections.BASIC_PROFILE, true);
    }


  };

  const handleClickShowPassword = (passType: any): void => {
    setPasswordVisibility({ ...passwordVisibility, [passType]: !passwordVisibility[passType] });
  };


  return (
    <div className={``}>
      <div className={`d-flex align-items-baseline mb-2`}>
        <img
          className={`mr-3 ${styles2.backToMyProfile}`}
          src={IconBack}
          alt=""
          onClick={() => {
            props.setIsInputEdited(false);
            props.changePassLink();
          }}
        />
        <Typography className={`${styles2.sectionHeading}`}>Change Password</Typography>
      </div>
      <Divider className={`${styles2.secDivider}`} />

      <Grid container>

        <Grid item xs={12} sm={6} className={styles2.singleRow}>

          <div className={`mt-4`}>
            <CustomLabel htmlFor="oldPassword">
              Old Password
            </CustomLabel>
            <div className={`${styles2.inputPassContainer}`}>
              <CustomTextField
                id="oldPassword"
                type={passwordVisibility.oldPassword ? "text" : "password"}
                variant="outlined"
                placeholder="********"
                error={!!errorMessage.oldPassword}
                name="oldPassword"
                value={fields.oldPassword}
                onChange={handleTextfieldChange}
                helperText={errorMessage.oldPassword && errorMessage.oldPassword}
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('oldPassword')}
                      >
                        {
                          passwordVisibility.oldPassword
                            ? <img src={Visibility} alt="VisibilityImage" data-test-id="show-password" />
                            : <img src={VisibilityOff} alt="VisibilityOffImage" data-test-id="hide-password" />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <Hidden smDown>
            <div className={`${styles2.tipsContainer}`}>
              <Typography className={`${styles2.passShould}`}>Password should be</Typography>
              <div>
                <Typography className={`mb-2`}>&bull; &nbsp; Atleast 8 characters long</Typography>
                <Typography>&bull; &nbsp; Combination of upper, lower, number and special characters</Typography>
              </div>
            </div>
          </Hidden>


          <div className={`${props.isMobile ? null : 'mt-4'}`}>
            <CustomLabel htmlFor="newPassword">
              New Password
            </CustomLabel>
            <div className={`${styles2.inputPassContainer}`}>
              <CustomTextField
                id="newPassword"
                type={passwordVisibility.newPassword ? "text" : "password"}
                variant="outlined"
                placeholder="********"
                error={!!errorMessage.newPassword}
                name="newPassword"
                value={fields.newPassword}
                onChange={handleTextfieldChange}
                helperText={errorMessage.newPassword && errorMessage.newPassword}
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('newPassword')}
                      >
                        {
                          passwordVisibility.newPassword
                            ? <img src={Visibility} alt="VisibilityImage" data-test-id="show-password" />
                            : <img src={VisibilityOff} alt="VisibilityOffImage" data-test-id="hide-password" />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div>
            <CustomLabel htmlFor="confirmPassword">
              Confirm Password
            </CustomLabel>
            <div className={`${styles2.inputPassContainer}`}>
              <CustomTextField
                id="confirmPassword"
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                variant="outlined"
                placeholder="********"
                error={!!errorMessage.confirmPassword}
                name="confirmPassword"
                value={fields.confirmPassword}
                onChange={handleTextfieldChange}
                helperText={errorMessage.confirmPassword && errorMessage.confirmPassword}
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('confirmPassword')}
                      >
                        {
                          passwordVisibility.confirmPassword
                            ? <img src={Visibility} alt="VisibilityImage" data-test-id="show-password" />
                            : <img src={VisibilityOff} alt="VisibilityOffImage" data-test-id="hide-password" />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <Hidden smUp>
            <div className={`${styles2.tipsContainer}`}>
              <Typography className={`${styles2.passShould}`}>Password should be</Typography>
              <div>
                <Typography className={`mb-2`}>&bull; &nbsp; Atleast 8 characters long</Typography>
                <Typography>&bull; &nbsp; Combination of upper, lower, number and special characters</Typography>
              </div>
            </div>
          </Hidden>

        </Grid>

        <Grid item xs={12} sm={12} className={styles2.singleRow}>
          <div className={`${styles2.profileActionBtns}`}>
            {
              props.isMobile
                ? null
                : <CustomButton
                  variant="outlined"
                  color="primary"
                  className={`mr-4`}
                  onClick={(e) => handleCancel(e)}
                >
                  Cancel
                  </CustomButton>
            }

            <CustomButton
              variant="contained"
              color="primary"
              className={`${styles2.passwordSubmitBtn}`}
              onClick={(e) => handleSave(e)}
              disabled={fields.oldPassword && fields.newPassword && fields.confirmPassword ? false : true}
            >
              Change Password
            </CustomButton>
          </div>
        </Grid>

        {/* SUCCESS MODAL */}
        <ConfirmationDialogRaw
          keepMounted
          open={open}
          onClose={handleClose}
          isMobile={props.isMobile}
        />

      </Grid>
    </div>
  )
}
// END | CHANGE PASSWORD COMPONENT



















const MyProfile = (props: any): JSX.Element => {

  const [mobShowTabContent, setMobShowTabContent] = useState(false)
  const [isChangePasswordLink, setIsChangePasswordLink] = useState(false)
  const [isInputEdited, setIsInputEdited] = useState(false)

  const isMobile = useMediaQuery('(max-width:600px)');
  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  useEffect(() => {
    // console.log(props);
  }, []);

  return (
    <Container>

      <Grid container spacing={10} className={styles2.padTop}>

        <Hidden smDown>
          <Grid item xs={12} sm={2} className="py-0">sidebar</Grid>
        </Hidden>
        <Grid item xs={12} sm={10} className={`${styles2.mainGridContainer}`}>

          {
            !isMobile || (isMobile && !mobShowTabContent)
              ?
              <Grid item xs={12} sm={4}>
                <Card initialData={props.response.data.cardDetails} />
                <Navigation
                  setMobShowTabContent={(val: boolean) => setMobShowTabContent(val)}
                  isInputEdited={isInputEdited}
                  isMobile={isMobile}
                  setShowSnackbar={setShowSnackbar}
                  setSnackbarMessage={setSnackbarMessage}
                  setAlertType={setAlertType}
                />
              </Grid>
              : null
          }

          {
            !isMobile || (isMobile && mobShowTabContent)
              ?
              <Grid item xs={12} sm={8} className={`${styles2.contentContainer}`}>
                {
                  isChangePasswordLink
                    ?
                    <ChangePassword
                      isMobile={isMobile}
                      changePassLink={() => setIsChangePasswordLink(false)}
                      setIsInputEdited={(bool: boolean) => setIsInputEdited(bool)}
                      setShowSnackbar={(val: any) => setShowSnackbar(val)}
                      setSnackbarMessage={(val: any) => setSnackbarMessage(val)}
                      setAlertType={(val: any) => setAlertType(val)}
                    />
                    :
                    <MyProfileComponent
                      isMobile={isMobile}
                      initialData={props.response.data}
                      changePassLink={() => setIsChangePasswordLink(true)}
                      setMobShowTabContent={() => setMobShowTabContent(!mobShowTabContent)}
                      setIsInputEdited={(bool: boolean) => setIsInputEdited(bool)}
                      setShowSnackbar={(val: any) => setShowSnackbar(val)}
                      setSnackbarMessage={(val: any) => setSnackbarMessage(val)}
                      setAlertType={(val: any) => setAlertType(val)}
                    />
                }
              </Grid>
              : null
          }

        </Grid>
      </Grid>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </Container>
  );
};

export default MyProfile;