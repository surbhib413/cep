import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomCard from "../../components/CustomCard/CustomCard";
import {
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@material-ui/core";
import styles from "./Signup.module.scss";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import validator from "validator";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { useDispatch, useSelector } from "react-redux";
import { isValidMobileNumber, isValidEmailAddress } from "../../utility/validations/validations";
import {
  assignRole,
  assignUsername,
  setLoader,
} from "../../redux/actions/actions";
import translate from "../../i18n/translate";
import { useRouter } from "next/router";
import { postSignUp, authorizationServer } from "../../lib/api/signup/signup";
import Cookies from "universal-cookie";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
const b2bSignupImage = "/WM_Illus-B2B_Sign in-up.svg";
const EditIcon = "/Edit_Icon.svg";
const WarningIcon = "/W_Icons_Warning.svg";

const useStyles = makeStyles({
  // root: {
  //   // padding: "2rem 4rem",
  //   textAlign: "center",
  // },
  title: {
    fontSize: "20px",
    fontWeight: 600,
  },
  label: {
    lineHeight: 1.36,
    textAlign: "left",
  },
  btnLarge: {
    width: "100%",
    height: "50px",
    // margin: "60px 0 20px 0",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.6px",
  },
  bold: {
    fontWeight: 600,
  },
  cursorPointer: {
    cursor: "pointer",
  },
});

const Signup = (props: { history: any }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const pathname = router.pathname;
  const classes = useStyles();
  const [showWhatsappNumber, setShowWhatsappNumber] = React.useState<boolean>(
    false
  );
  const [
    showMobileNumberField,
    setShowMobileNumberField,
  ] = React.useState<boolean>(false);

  const [username, setUsername] = React.useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");

  const [whatsappNumber, setWhatsappNumber] = React.useState<string>("");
  const [whatsappErrorMessage, setWhatsappErrorMessage] = React.useState("");

  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [isTermsChecked, setIsTermsChecked] = React.useState<boolean>(false);
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const dispatchRole = (role: string) => {
    dispatch(assignRole(role));
  };

  const assignRoleFromRoute = (): void => {
    const temp = pathname.split("/");
    if (temp[2] === "petrocorporate") {
      dispatchRole("PETROCORPORATE");
    }
  };

  // show or hide whatsapp number
  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked: boolean = event.target.checked;
    setIsChecked(isChecked);
    if (isChecked) {
      // if checkbox is checked
      if (isValidEmailAddress(username)) {
        //if (isValidEmailAddress(username)) {
        // if user entered email
        setShowMobileNumberField(isChecked);
      } else {
        setShowWhatsappNumber(event.target.checked);
      }
    } else {
      // hide mobile number field
      setShowWhatsappNumber(false);
      setShowMobileNumberField(false);
    }
  };

  const handleTermsConditions = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const isChecked: boolean = event.target.checked;
    setIsTermsChecked(isChecked);
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (validator.isMobilePhone(event.target.value, ["en-IN"])) {
      setWhatsappNumber(event.target.value);
      setWhatsappErrorMessage("");
    }
    setUsername(event.target.value);
    setUsernameErrorMessage("");
  };

  // enable edit whats app number
  const editWhatsappNumber = (): void => {
    setShowWhatsappNumber(false);
    setShowMobileNumberField(true);
  };

  // set whatsapp number
  const handleWhatsappNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setWhatsappNumber(event.target.value);
    setWhatsappErrorMessage("");
  };

  const validate = async () => {
    let isError: boolean = false;
    const otpChannel = isValidEmailAddress(username) ? "EMAIL" : "MOBILE";
    // Validate username
    if (!isValidMobileNumber(username) && !isValidEmailAddress(username)) {
      isError = true;
      setUsernameErrorMessage(validationErrorMessage.EMAIL_OR_MOBILE);
    }

    // Validate whatsappNumber
    if (isChecked) {
      if (!validator.isMobilePhone(whatsappNumber, ["en-IN"])) {
        isError = true;
        setWhatsappErrorMessage(validationErrorMessage.MOBILE_NUMBER);
      }
    }

    // If all validations pass
    if (!isError) {
      dispatch(setLoader(true));
      setWhatsappErrorMessage("");
      setUsernameErrorMessage("");
      const finalData = {
        isNotificationEnabled: isChecked,
        otpChannel: otpChannel,
        otpType: "SIGNUP",
        customerId: username,
        whatsappNumber: whatsappNumber,
        customerType: "Business",
      };

      console.log("FINAL DATA............", finalData);
      const authorizeRes: any = await authorizationServer();
      console.log("authorizationServer res : ", authorizeRes);
      if (authorizeRes?.status === "success" || authorizeRes?.status == 200) {
        // localStorage.setItem("mark_one", authorizeRes?.data.access_token);
        // document.cookie = `mark_one=${authorizeRes?.data.access_token}; path=/`;
        cookies.set("mark_one", authorizeRes?.data.access_token, { path: "/" });

        const res: any = await postSignUp(finalData);
        console.log("Sign Up res : ", res);

        //if (res?.data?.statusCode !== 403) {
        if (res?.status === "success" || res?.status == 200) {
          console.log("SignUp res : ", res);
          dispatch(assignUsername(username));
          redirectToOtp();
        } else {
          dispatch(setLoader(false));
          if (res?.errors) {
            res?.errors.forEach((element: any) => {
              console.log(element?.subject);
              if (!element.hasOwnProperty("subject")) {
                console.log(element?.subject);
                setApiOtherErrorMessage(element?.message);
              } else {
                if (element?.subject === "customerId") {
                  setUsernameErrorMessage(element?.message);
                } else if (element?.subject === "whatsappNumber") {
                  if (element?.reason === "missing") {
                    setWhatsappErrorMessage(element?.message);
                  } else if (element?.reason === "invalid") {
                    setWhatsappErrorMessage(validationErrorMessage.MOBILE_NUMBER);
                  }
                }
              }
            });
          }
        }
      } else {
        dispatch(setLoader(false));
        if (authorizeRes?.error) {
          console.log("ERROR RESPONSE", authorizeRes);
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      // if (res.data?.status === "success") {
    }
  };

  const redirectToLogin = (): void => {
    // props.history.push("/login");
    router.push("/login");
  };

  const redirectToOtp = (): void => {
    router.push({ pathname: "/otp", query: { redirectedFrom: "signUp" } });
  };

  const handleContinue = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    setWhatsappErrorMessage("");
    setUsernameErrorMessage("");
    assignRoleFromRoute();
    validate();
  };

  return (
    <>
      <Container
        className={`d-flex flex-column py-sm-4 px-0 px-sm-3 ${styles.signUpContainer}`}
        maxWidth="sm"
      >
        <CustomCard
          className={`py-4 px-4 px-sm-5 d-flex flex-column ${styles.root} `}
        >
          <div
            className={`mb-5 d-flex flex-column align-items-center justify-content-center`}
          >
            <Typography className={`${styles.title}`} color="primary">
              {translate("signUp-lbl")}
            </Typography>
            <img className={`mt-3`} src={b2bSignupImage} alt="sign up" />
          </div>
          <div className={`d-flex flex-column`}>
            <form noValidate autoComplete="off">
              <CustomLabel
                className={classes.label}
                color="primary"
                htmlFor="signup"
              >
                {translate("signUp-userId")}
              </CustomLabel>
              <CustomTextField
                id="signup-user-id"
                data-test-id="signup-user-id"
                placeholder="9820098200 / johndoe@example.com"
                variant="outlined"
                value={username}
                onChange={handleUsername}
                error={!!usernameErrorMessage}
                name="userId"
                helperText={usernameErrorMessage && usernameErrorMessage}
                inputProps={{ maxLength: 256 }}
                InputProps={{
                  endAdornment: usernameErrorMessage && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
                onKeyUp={(event: any) => {
                  if (event.key === "Enter") {
                    handleContinue(event);
                  }
                }}
              ></CustomTextField>
            </form>

            <div className={`d-flex`}>
              <FormControlLabel
                className={`float-left ${styles.whatsappLabel}`}
                control={
                  <Checkbox
                    onChange={handleCheckBox}
                    name="checkedB"
                    color="primary"
                    data-test-id="signup-notify"
                  />
                }
                // label={translate("signUp-updates-chk")}
                label=""
              />
              <Typography className={`float-left ${styles.whatsappLabel}`}>
                {translate("signUp-updates-chk")}
              </Typography>
            </div>
            {showWhatsappNumber ? (
              <div className={`d-flex my-3 ${styles.clearBoth}`}>
                <img
                  className={styles.cursorPointer}
                  src={EditIcon}
                  alt=""
                  onClick={editWhatsappNumber}
                  data-test-id="signup-notify-img"
                />
                <CustomLabel
                  className={`pl-3 m-0 ${classes.label}`}
                  color="primary"
                  htmlFor="signup"
                >
                  {translate("signUp-mobile-lbl")} :{" "}
                  <span>{whatsappNumber}</span>
                </CustomLabel>
              </div>
            ) : null}
            {showMobileNumberField ? (
              <div className={`${styles.clearBoth}`}>
                <CustomLabel
                  className={classes.label}
                  color="primary"
                  htmlFor="signup"
                >
                  {translate("signUp-mobile-lbl")}
                </CustomLabel>
                <CustomTextField
                  id="signup-whatsapp-number"
                  data-test-id="signup-whatsapp-number"
                  placeholder="9820098200"
                  variant="outlined"
                  onChange={handleWhatsappNumber}
                  value={whatsappNumber}
                  error={!!whatsappErrorMessage}
                  name="userId"
                  helperText={whatsappErrorMessage && whatsappErrorMessage}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    endAdornment: whatsappErrorMessage && (
                      <InputAdornment position="end">
                        <CustomSvgIcon iconsource={WarningIcon} />
                      </InputAdornment>
                    ),
                  }}
                  onKeyUp={(event: any) => {
                    if (event.key === "Enter") {
                      handleContinue(event);
                    }
                  }}
                ></CustomTextField>
              </div>
            ) : null}
          </div>
          <div className={`d-flex mt-auto`}>
            <FormControlLabel
              className={`float-left ${styles.whatsappLabel}`}
              control={
                <Checkbox
                  onChange={handleTermsConditions}
                  name="checkTerms"
                  color="primary"
                  data-test-id="signup-terms"
                />
              }
              // label={
              //   <span>
              //     By Signing up, I accept the BPCL{" "}
              //     <span className={styles.blueBold}>Terms of Service</span> and
              //     acknowledge the{" "}
              //     <span className={styles.blueBold}>Privacy Policy</span>.
              //   </span>
              // }
              label=""
            />
            <Typography className={`float-left ${styles.whatsappLabel}`}>
              <span>
                By Signing up, I accept the BPCL{" "}
                <span className={styles.blueBold}>Terms of Service</span> and
                 acknowledge the{" "}
                <span className={styles.blueBold}>Privacy Policy</span>.
              </span>
            </Typography>
          </div>
          <div className={`${styles.clearBoth}`}>
            <CustomButton
              className={`mb-2 ${classes.btnLarge}`}
              variant="contained"
              color="primary"
              disableElevation
              data-test-id="signup-continue-btn"
              disabled={!username || !isTermsChecked}
              onClick={(e) => handleContinue(e)}
            >
              {translate("signUp-continue")}
            </CustomButton>
            <Typography className="mt-2" variant="caption">
              {translate("signUp-haveAccount")}
              <span
                className={`${styles.signUpLbl}`}
                onClick={() => redirectToLogin()}
                data-test-id="signIn-link"
              >
                {translate("signUp-signIn-lbl")}
              </span>
            </Typography>
          </div>
        </CustomCard>
      </Container>
    </>
  );
};

export default Signup;
