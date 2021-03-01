import React from "react";
import { Box, Container, InputAdornment } from "@material-ui/core";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import InputLabel from "@material-ui/core/InputLabel";
// import Typography from "@material-ui/core/Typography";
import styles from "./forgotPassword.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import validator from "validator";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { isValidMobileNumber } from "../../utility/validations/validations";
import translate from "../../i18n/translate";
import { useRouter } from "next/router";
import { postLoginVerifyUser } from "../../lib/api/signin/signin";
import { postResendOTP } from "../../lib/api/signup/signup";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import { setLoader, assignUsername } from "../../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  isValidEmailAddress
} from "../../utility/validations/validations";

const b2bForgotPasswordImage = "./WM_Illus-B2B_Reset-pass.svg";
const forgotPasswordImg = "/Forgot_Password.svg";
const WarningIcon = "/W_Icons_Warning.svg";

interface Props {
  history: any;
}

const ForgotPassword = (props: Props): JSX.Element => {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const dispatch = useDispatch();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
    setUsernameError("");
  };

  const validate = async () => {
    let isError: boolean = false;

    // Validate username
    if (
      // !validator.isMobilePhone(username, ["en-IN"]) &&
      !isValidMobileNumber(username) &&
      !isValidEmailAddress(username)
    ) {
      isError = true;
      setUsernameError(validationErrorMessage.EMAIL_OR_MOBILE);
    }

    // If all validations pass
    if (!isError) {
      setUsernameError("");
      dispatch(assignUsername(username));
      dispatch(setLoader(true));
      const finalData = {
        customerId: username,
      };
      console.log("FINAL DATA............", finalData);

      const res: any = await postLoginVerifyUser(finalData);
      console.log("userid verification res : ", res);

      if (res?.status === "success" || res?.status === 200) {
        if (res?.data.customerExists) {
          const otpChannel = isValidEmailAddress(username) ? "EMAIL" : "MOBILE";
          const otpData = {
            customerId: username,
            customerType: "Business",
            otpChannel: otpChannel,
            otpType: "SIGNIN",
          };

          const res: any = await postResendOTP(otpData);
          //console.log(!res?.errors);
          if (res?.status === "success" && res?.statusCode !== 403) {
            console.log("Resend OTP res : ", res);
            redirectToOtp();
          } else {
            dispatch(setLoader(false));
            res?.errors.forEach((element: any) => {
              console.log(element?.subject);
              if (!element.hasOwnProperty("subject")) {
                setShowSnackbar(true);
                setSnackbarMessage(element?.message);
                setAlertType("error");
              } else {
                setShowSnackbar(true);
                setSnackbarMessage(element?.message + " " + element?.subject);
                setAlertType("error");
              }
            });
          }
        } else {
          dispatch(setLoader(false));
          setUsernameError(validationErrorMessage.USERNAME_DOESNOT_EXIST);
        }
      } else {
        dispatch(setLoader(false));
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  const handleGetOtp = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    setUsernameError("");
    validate();
    //
  };

  const redirectToLogin = (): void => {
    router.push("/login");
  };

  const redirectToPassword = (): void => {
    router.push("/password");
  };

  const redirectToOtp = (): void => {
    router.push({
      pathname: "/otp",
      query: { redirectedFrom: "forgotPassword" },
    });
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
                  onClick={() => redirectToPassword()}
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
                  {translate("forgotPass-password-lbl")}
                </Box>
              </div>
            </div>
          </div>

          <div className={`d-flex justify-content-center align-items-center mt-4`}>
            <img
              // className="p-3"
              className={` ${styles.b2bForgotPasswordImage}`}
              src={b2bForgotPasswordImage}
              alt="forgotPasswordImg"
            />
          </div>


          {/* <div className="pt-4">
            <Typography>Enter your User ID to Reset your password</Typography>
          </div> */}
          <div
            className={`d-flex flex-column justify-content-center align-items-center pt-5`}
          >
            <form
              noValidate
              autoComplete="off"
              className={`${styles.formContainer}`}
            >
              <InputLabel className={`${styles.formLabel}`} color="primary">
                {translate("forgotPass-enter-userid")}
              </InputLabel>
              <CustomTextField
                id="forgot-password-user-id"
                placeholder="9820098200 / johndoe@example.com"
                variant="outlined"
                onChange={handleUsername}
                error={!!usernameError}
                name="username"
                value={username}
                helperText={usernameError && usernameError}
                inputProps={{ maxLength: 256 }}
                InputProps={{
                  endAdornment: usernameError && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
                onKeyUp={(event: any) => {
                  if (event.key === "Enter") {
                    handleGetOtp(event);
                  }
                }}
              />
            </form>
          </div>

          <div
            className={`d-flex flex-column justify-content-center mt-auto pb-5`}
          >
            <div
              className={`d-flex w-100 align-items-center justify-content-center ${styles.buttonContainer}`}
            >
              <CustomButton
                variant="contained"
                disabled={!username}
                className={`p-3 ${styles.buttonStyle} ${!username ? styles.inactiveButton : styles.activeButton
                  }`}
                onClick={(e) => handleGetOtp(e)}
                data-test-id="get-otp-btn"
              >
                {translate("forgotPass-getotp")}
              </CustomButton>
            </div>
          </div>
        </CustomCard>
      </Container>
    </React.Fragment>
  );
};

export default ForgotPassword;
