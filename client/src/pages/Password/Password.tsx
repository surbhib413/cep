import React from "react";
import {
  Container,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  withStyles,
  IconButton,
  Box,
} from "@material-ui/core";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import InputLabel from "@material-ui/core/InputLabel";
import styles from "./password.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { useSelector, useDispatch } from "react-redux";
import { logUserIn, setLoader } from "../../redux/actions/actions";
import translate from "../../i18n/translate";
import { useRouter } from "next/router";
import { isValidPasswordLength } from "../../utility/validations/validations";
import { postVerifyPassword } from "../../lib/api/signin/signin";
import Cookies from "universal-cookie";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
const b2bPasswordImage = "./WM_Illus-B2B_Reset-pass.svg";
const VisibilityOff = "./Visibility_Off_Eye_Icon.svg";
const Visibility = "./Visibility_On_Eye_Icon.svg";

const Password = (props: { history: any }): JSX.Element => {
  const router = useRouter();
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const cookies = new Cookies();

  interface State {
    showPassword: boolean;
  }
  const [isSubmitEnable, setSubmitEnable] = React.useState<boolean>(false);

  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const [values, setValues] = React.useState<State>({
    showPassword: false,
  });

  const CustomFormControlLabel = withStyles({
    root: {
      "& .MuiTypography-body1": {
        fontSize: "14px",
        "@media only screen and (max-width: 600px)": {
          fontSize: "12px",
        },
      },
    },
  })(FormControlLabel);

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    //Enable submit button
    event.target.value.length > 0
      ? setSubmitEnable(true)
      : setSubmitEnable(false);
    setPassword(event.target.value);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRememberMe(event.target.checked);
  };

  const redirectToSignUp = (): void => {
    // props.history.push("/SignUp");
    router.push("/signup");
  };

  const redirectToForgotPassword = (): void => {
    // props.history.push("/ForgotPassword");
    router.push("/forgotpassword");
  };

  const redirectToLogin = (): void => {
    // props.history.push("/login");
    router.push("/login");
  };

  const redirectToSmartfleetRegistration = () => {
    // props.history.push("/registration/smartfleet");
    router.push("/registration/smartfleet");
  };

  const redirectToServiceRequest = () => {
    // props.history.push("/service-requests");
    router.push("/service-requests");
    dispatch(logUserIn());
  };

  const redirectToBusinessSelectionPage = () => {
    // props.history.push({
    //   pathname: "/signup/business",
    // });
    router.push("/business-programme");
  };

  const handleSubmit = async () => {
    const finalData = {
      customerId: store.username,
      password: password,
    };
    console.log("FINAL DATA............", finalData);

    dispatch(setLoader(true));
    const res: any = await postVerifyPassword(finalData);
    console.log("password verification res : ", res);

    if (res?.status === "success" || res?.status == 200 || res?.status == 201) {
      // localStorage.setItem("mark_two", res?.data.access_token);
      // localStorage.setItem("mark_three", res?.data.refresh_token);

      // document.cookie = `mark_two=${res?.data.access_token}; path=/`;
      // document.cookie = `mark_three=${res?.data.refresh_token}; path=/`;
      cookies.set("mark_two", res?.data.access_token, { path: "/" });
      cookies.set("mark_three", res?.data.refresh_token, { path: "/" });
      dispatch(logUserIn());
      redirectToBusinessSelectionPage();
    } else {
      dispatch(setLoader(false));
      if (res?.data?.error) {
        setPasswordError(validationErrorMessage.INVALID_CREDENTIALS);
        console.log("ERROR RESPONSE", res);
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
    /////// Remove this for backend integration
    // if (password === "abcd1234") {
    //   setPasswordError(validationErrorMessage.INVALID_CREDENTIALS);
    // } else {
    //   if (isValidPasswordLength(password)) {
    //     // if password valid
    //     if (store.role !== "CUSTOMER") {
    //       redirectToServiceRequest(); // send user to service request page
    //     } else {
    //       redirectToSmartfleetRegistration(); // send user to registration page
    //     }
    //   } else {
    //     setPasswordError(validationErrorMessage.INVALID_PASSWORD_LENGTH);
    //   }
    // }
  };

  const handleClickShowPassword = (): void => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <Container
        maxWidth="sm"
        className={`p-0 d-flex flex-column justify-content-between ${styles.businessContainer}`}
      >
        <CustomCard
          className={`d-flex flex-column justify-content-between ${styles.otpCard}`}
        >
          <div className={`d-flex flex-column pt-3`}>
            <div className={`d-flex align-items-center pt-2`}>
              <div
                className={`align-items-center pl-4 mr-auto justify-content-between`}
              >
                <ArrowBackIcon
                  className={`${styles.iconColor}`}
                  onClick={() => redirectToLogin()}
                  data-test-id="back-arrow"
                ></ArrowBackIcon>
              </div>
              <div
                className={`p-1 w-100 align-items-center justify-content-center bd-highlight mr-5`}
              >
                <Box
                  className={`text-align: center ${styles.title}`}
                  color="primary.dark"
                >
                  {translate("password-verification")}
                </Box>
              </div>
            </div>
          </div>

          <div className={`d-flex justify-content-center align-items-center mt-4`}>
            <img className={` ${styles.b2bPasswordImage}`} src={b2bPasswordImage} alt="requestSentImg" />
          </div>

          <div
            className={`d-flex pt-5 pt-sm-5 m-2 mt-sm-0 flex-column justify-content-center align-items-center ${styles.divpadding}`}
          >
            <form
              noValidate
              autoComplete="off"
              className={`${styles.formContainer}`}
            >
              <InputLabel className={`${styles.formLabel}`} color="primary">
                {translate("password-password-lbl")}
              </InputLabel>
              <CustomTextField
                id="login-password"
                type={values.showPassword ? "text" : "password"}
                placeholder="Enter your password"
                variant="outlined"
                name="password"
                value={password}
                error={!!passwordError}
                onChange={handleTextfieldChange}
                helperText={passwordError && passwordError}
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <img
                            src={Visibility}
                            alt="VisibilityImage"
                            data-test-id="show-password"
                          />
                        ) : (
                            <img
                              src={VisibilityOff}
                              alt="VisibilityOffImage"
                              data-test-id="hide-password"
                            />
                          )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyUp={(event: any) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <div className="d-flex bd-highlight justify-content-center align-item-center">
                <div className=" bd-highlight">
                  <CustomFormControlLabel
                    className={`${styles.checkboxLabel}`}
                    control={
                      <Checkbox
                        name="rememberMe"
                        color="primary"
                        checked={rememberMe}
                        onChange={handleCheckboxChange}
                        data-test-id="remember-chk"
                      />
                    }
                    label={translate("password-remember")}
                  />
                </div>

                <div className="ml-auto bd-highlight">
                  <span
                    className={`${styles.forgotPassword}`}
                    onClick={() => redirectToForgotPassword()}
                    data-test-id="forgot-link"
                  >
                    {translate("password-forgotPass")}
                  </span>
                </div>
              </div>
            </form>
          </div>

          <div
            className={`d-flex flex-column justify-content-center mt-auto pb-4`}
          >
            <div
              className={`d-flex w-100 align-items-center justify-content-center ${styles.buttonContainer}`}
            >
              <CustomButton
                data-test-id="submit-btn"
                variant="contained"
                disabled={!isSubmitEnable}
                className={`p-3 ${styles.buttonStyle} ${!isSubmitEnable ? styles.inactiveButton : styles.activeButton
                  }`}
                onClick={() => handleSubmit()}
              >
                {translate("password-submit")}
              </CustomButton>
            </div>

            {/* <div
              className={`d-flex align-items-center justify-content-center pt-3`}
            >
              <span className={`${styles.backToLabel}`}>
                {translate("password-noAccount")}
                <span
                  className={`${styles.signUpLabel}`}
                  onClick={() => redirectToSignUp()}
                >
                  {translate("password-signup")}
                </span>
              </span>
            </div> */}
          </div>
        </CustomCard>
      </Container>
    </React.Fragment>
  );
};

export default Password;
