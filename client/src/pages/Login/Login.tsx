import React from "react";
import { Container, InputAdornment } from "@material-ui/core";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import styles from "./Login.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import validator from "validator";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import {
  assignRole,
  assignUsername,
  assignPassword,
  assignServerToken,
  assignUserToken,
  setLoader,
} from "../../redux/actions/actions";
import { useRouter } from "next/router";
import {
  postLoginVerifyUser,
  authorizationServer,
  postVerifyPassword,
} from "../../lib/api/signin/signin";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import translate from "../../i18n/translate";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import {
  isValidEmailAddress
} from "../../utility/validations/validations";
const b2bLoginImage = "/WM_Illus-B2B_Sign in-up.svg";
const WarningIcon = "/W_Icons_Warning.svg";

const Login = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
    setUsernameError("");
  };

  const redirectToSignUp = (): void => {
    // props.history.push("/signup/");
    router.push("/signup");
  };

  const redirectToPassword = (): void => {
    // props.history.push("/Password");
    router.push("/password");
  };

  const redirectToOtp = (): void => {
    router.push({ pathname: "/otp", query: { redirectedFrom: "signIn" } });
  };

  const dispatchRole = (role: string) => {
    dispatch(assignRole(role));
  };

  const dispatchPasswordSet = (isPasswordSet: boolean) => {
    dispatch(assignPassword(isPasswordSet));
  };

  const validate = async () => {
    let isError: boolean = false;

    // Validate username
    if (
      !validator.isMobilePhone(username, ["en-IN"]) &&
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
      const authorizeRes: any = await authorizationServer();
      console.log("authorizationServer res : ", authorizeRes);
      if (authorizeRes?.status === "success" || authorizeRes?.status == 200) {
        console.log(
          "ServerToken is...........",
          authorizeRes?.data.access_token
        );
        // localStorage.setItem("mark_one", authorizeRes?.data.access_token);
        // document.cookie = `mark_one=${authorizeRes?.data.access_token}; path=/`;
        cookies.set("mark_one", authorizeRes?.data.access_token, { path: "/" });

        const finalData = {
          customerId: username,
        };
        console.log("FINAL DATA............", finalData);
        const res: any = await postLoginVerifyUser(finalData);
        console.log("userid verification res : ", res);

        if (res?.status === "success" || res?.status == 200) {
          if (res?.data.customerExists) {
            if (res?.data.passwordSet) {
              redirectToPassword();
            } else {
              dispatchPasswordSet(res?.data.passwordSet);
              redirectToOtp();
            }
          } else {
            dispatch(setLoader(false));
            setUsernameError(validationErrorMessage.USERNAME_DOESNOT_EXIST);
          }
        } else {
          dispatch(setLoader(false));
          if (res?.error || res?.errors) {
            console.log("ERROR RESPONSE", authorizeRes);

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
          } else {
            setShowSnackbar(true);
            setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
            setAlertType("error");
          }
        }
      } else {
        dispatch(setLoader(false));
        if (authorizeRes?.error) {
          console.log("ERROR RESPONSE", authorizeRes);
          setShowSnackbar(true);
          setSnackbarMessage(authorizeRes?.error);
          setAlertType("error");
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }

      // const res: any = await postVerifyUser(finalData);
      // console.log("userid verification res : ", res);

      // if (res?.status === "Success") {
      //   //set user-role here
      //   if (username === "dealer@bpcl.com") {
      //     dispatchRole("DEALER");
      //   } else if (username === "cre@bpcl.com") {
      //     dispatchRole("CRE");
      //   } else if (username === "fso@bpcl.com") {
      //     dispatchRole("FSO");
      //   } else if (username === "so@bpcl.com") {
      //     dispatchRole("SO");
      //   } else {
      //     dispatchRole("CUSTOMER");
      //   }

      //   dispatch(assignUsername(username)); //assign username

      //   //check if password set already
      //   res?.response.forEach((element: any) => {
      //     console.log(element?.isPasswordSet);
      //     if (element?.isPasswordSet === true) {
      // redirectToPassword();//if password is set then redirect to enter password screen
      //     } else {
      //redirectToOtp(); //else redirect to otp screen
      //     }
      //   });
      // } else {
      //   res?.errors.forEach((element: any) => {
      //     console.log(element?.subject);
      //     if (element?.subject === "customerId") {
      //       if (element?.reason === "missing") {
      //         setUsernameError(element?.message);
      //       }
      //       else if (element?.reason === "invalid") {
      //         setUsernameError(validationErrorMessage.USERNAME_DOESNOT_EXIST);
      //       }
      //     }
      //   });
      // }
    }
  };

  const handleContinue = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    setUsernameError("");
    validate();
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
          <div
            className={`d-flex flex-column align-items-center justify-content-center pt-3`}
          >
            <div className={`d-flex align-items-center pt-2`}>
              <div
                className={`p-1 w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography
                  className={`pl-2 text-align: center ${styles.title}`}
                  data-test-id="user-id"
                >
                  {translate("login-signin")}
                  {/* Sign In */}
                </Typography>
              </div>
            </div>
            <img
              className={`mt-4 ${styles.b2bLoginImage}`}
              id="optionalImage"
              src={b2bLoginImage}
              alt="requestSentImg"
            />
          </div>

          <div
            className={`d-flex flex-column justify-content-center align-items-center pt-4 mt-2`}
          >
            <form
              noValidate
              autoComplete="off"
              className={`${styles.formContainer}`}
            >
              <InputLabel className={`${styles.formLabel}`} color="primary">
                {translate("login-userid")}
                {/* User ID */}
              </InputLabel>
              <CustomTextField
                id="login-user-id"
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
                    handleContinue(event);
                  }
                }}
              />
            </form>
          </div>

          <div
            className={`d-flex flex-column justify-content-center mt-auto pb-4`}
          >
            <div
              className={`d-flex w-100 align-items-center justify-content-center ${styles.buttonContainer}`}
            >
              <CustomButton
                variant="contained"
                data-test-id="continue-btn"
                disabled={!username}
                className={`p-3 ${styles.buttonStyle} ${!username ? styles.inactiveButton : styles.activeButton
                  }`}
                onClick={(e) => handleContinue(e)}
              // onClick = {handleClickOpen}
              >
                {translate("login-continue")}
                {/* CONTINUE */}
              </CustomButton>
            </div>

            <div
              className={`d-flex align-items-center justify-content-center pt-3`}
            >
              <span className={`${styles.backToLabel}`}>
                {translate("login-noAccount")}
                {/* Don't have an account?{" "} */}
                <span
                  className={`${styles.signUpLabel}`}
                  onClick={() => redirectToSignUp()}
                  data-test-id="signup-link"
                >
                  {translate("login-signup")}
                  {/* Sign Up */}
                </span>
              </span>
            </div>
          </div>
          <CustomSnackbar
            open={showSnackbar}
            close={setShowSnackbar}
            type={alertType}
            message={snackbarMessage}
          ></CustomSnackbar>
        </CustomCard>
      </Container>
    </React.Fragment>
  );
};

export default Login;
