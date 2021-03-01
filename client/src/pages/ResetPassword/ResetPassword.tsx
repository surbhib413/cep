import React from "react";
import { Box, Container } from "@material-ui/core";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import InputLabel from "@material-ui/core/InputLabel";
import styles from "./resetPassword.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { isValidPassword } from "../../utility/validations/validations";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";
import translate from "../../i18n/translate";
import { useRouter } from "next/router";
import { PasswordResetSuccessfulModal } from "./PasswordResetSuccessfulModal";
import { postSetResetPassword } from "../../lib/api/signin/signin";
import { useSelector, useDispatch } from "react-redux";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import Cookies from "universal-cookie";
import { setLoader, resetStore } from "../../redux/actions/actions";
import { callSignOut } from "src/lib/auth/helper";
const b2bResetPasswordImage = "./WM_Illus-B2B_Reset-pass.svg";
const VisibilityOff = "Visibility_Off_Eye_Icon.svg";
const Visibility = "Visibility_On_Eye_Icon.svg";
const InfoIcon = "W_Icons_Info.svg";

const ResetPassword = (props: any): JSX.Element => {
  const router = useRouter();
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const cookies = new Cookies();
  // const setPassword = router.query.setPassword
  //   ? router.query.setPassword
  //   : false;
  const setPassword = store.isPassword;

  interface State {
    password: string;
    showPassword: boolean;
    confirmPassword: string;
    showConfirmPassword: boolean;
  }

  const [values, setValues] = React.useState<State>({
    password: "",
    showPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });

  const [
    invalidPasswordErrorMsg,
    setInvalidPasswordErrorMsg,
  ] = React.useState<String>("");

  const [
    passwordMatchErrorMsg,
    setPasswordMatchErrorMsg,
  ] = React.useState<String>("");

  const handleChange = (prop: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.preventDefault();
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = (): void => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = (): void => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const [successModal, setSuccessModal] = React.useState(false);
  const closeSuccessModal = async () => {
    dispatch(setLoader(true));
    const res: any = await callSignOut();
    console.log("Signout", res);
    if (res) {
      setSuccessModal(false);
      console.log("Signout successfully.");
    } else {
      console.log("Signout not done");    
      setShowSnackbar(true);
      setSnackbarMessage("Something went wrong");
      setAlertType("error");
    }
    dispatch(setLoader(false));
  };
  const openSuccessModal = () => {
    setSuccessModal(true);
  };

  const redirectToSignUp = (): void => {
    // props.history.push("/SignUp");
    router.push("/signup");
  };

  const redirectToOtp = (): void => {
    // props.history.push("/otp");
    router.push("/otp");
  };

  const validate = async () => {
    let isError: boolean = false;

    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      isError = true;
      setPasswordMatchErrorMsg(validationErrorMessage.UNMATCHED_PASSWORD);
    } else if (!isValidPassword(password)) {
      isError = true;
      setInvalidPasswordErrorMsg(validationErrorMessage.INVALID_PASSWORD);
    }

    if (!isError) {
      dispatch(setLoader(true));
      const finalData = {
        customerId: store.username,
        password: password,
        //token: localStorage.getItem('server_token')
      };
      console.log("FINAL DATA............", finalData);
      const res: any = await postSetResetPassword(finalData);
      console.log("postSetResetPassword  res : ", res);

      if (res?.status === "success" || res?.status == 200) {
        openSuccessModal();
        // setOpenResendToast(true);
        // if (redirectedFrom === "signUp") {
        //   if (store.role === "PETROCORPORATE") {
        //     // if role is petrocorporate open modal
        //     openCustomerEnrolledModal();
        //   } else {
        //     openSelfEnrolledModal();
        //   }
        // }
        // if (redirectedFrom === "forgotPassword") {
        //   // props.history.push("/resetpassword");
        //   router.push("/resetpassword");
        // }
        // if (store.assistedFlow) {
        //   openCongratulationModal();
        // }
      } else {
        dispatch(setLoader(false));
        if (res?.errors) {
          res?.errors?.forEach((element: any) => {
            console.log(element?.subject);
            if (!element.hasOwnProperty("subject")) {
              console.log(element?.subject);
              setApiOtherErrorMessage(element?.message);
            } else {
              if (element?.subject === "password") {
                setInvalidPasswordErrorMsg(
                  validationErrorMessage.INVALID_PASSWORD
                );
              }
            }
          });
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
    } else {
      //
    }
  };

  // handle submit
  const handleSubmit = (): void => {
    validate();
  };

  return (
    <React.Fragment>
      {console.log("This is the password set field..........", setPassword)}
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
                className={`align-items-center pl-4 mr-auto justify-content-start`}
              >
                <ArrowBackIcon
                  className={`${styles.iconColor}`}
                  onClick={() => redirectToOtp()}
                  data-test-id="back-arrow"
                ></ArrowBackIcon>
              </div>
              <div
                className={`d-flex p-1 w-100 align-items-center justify-content-center bd-highlight mr-5`}
              >
                <Box
                  className={`text-align: center ${styles.title}`}
                  color="primary.dark"
                >
                  {setPassword
                    ? translate("resetPass-reset-lbl")
                    : "Set My Password "}
                </Box>
              </div>
            </div>
          </div>
          <div className={`d-flex justify-content-center align-items-center mt-4`}>
          <img
            className="p-3"
            src={b2bResetPasswordImage} 
            alt="resetPasswordImage"
          />
          </div>
          <div
            className={`d-flex flex-column justify-content-center align-items-center pt-4`}
          >
            <form
              noValidate
              autoComplete="off"
              className={`${styles.formContainer}`}
            >
              <InputLabel className={`${styles.formLabel}`} color="primary">
                {translate("resetPass-userId")}
              </InputLabel>
              <CustomTextField
                id="reset-password-user-id"
                InputProps={{ className: styles.disableInput }}
                disabled
                name="resetUserId"
                placeholder="9988776655"
                defaultValue={store.username}
                variant="outlined"
              />

              <InputLabel
                className={`d-flex justify-content-between ${styles.formLabel}`}
                color="primary"
              >
                {translate("resetPass-newPass")}
                <CustomTooltip
                  enterTouchDelay={0}
                  disableFocusListener
                  title={translate("resetPass-info")}
                  placement="right-start"
                >
                  <img src={InfoIcon} alt="Info for New Password"></img>
                </CustomTooltip>
              </InputLabel>
              <CustomTextField
                name="newPassword"
                placeholder="Enter New Password"
                variant="outlined"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
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
                error={invalidPasswordErrorMsg ? true : false}
                helperText={invalidPasswordErrorMsg}
                id="reset-password-new-password"
              />

              <InputLabel className={`${styles.formLabel}`} color="primary">
                {translate("resetPass-confirmPass")}
              </InputLabel>
              <CustomTextField
                name="confirmPassword"
                placeholder="Enter Confirm Password"
                variant="outlined"
                type={values.showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                      >
                        {values.showConfirmPassword ? (
                          <img src={Visibility} alt="VisibilityImage" />
                        ) : (
                            <img src={VisibilityOff} alt="VisibilityOffImage" />
                          )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={passwordMatchErrorMsg ? true : false}
                helperText={passwordMatchErrorMsg}
                id="reset-password-confirm-password"
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
                data-test-id="submit-btn"
                variant="contained"
                disabled={
                  values.password && values.confirmPassword ? false : true
                }
                className={`p-3 ${styles.buttonStyle} ${values.password && values.confirmPassword
                  ? styles.activeButton
                  : styles.inactiveButton
                  }`}
                onClick={() => handleSubmit()}
              >
                {translate("resetPass-submit")}
              </CustomButton>
            </div>

            <div
              className={`d-flex align-items-center justify-content-center pt-3`}
            >
              <span className={`${styles.backToLabel}`}>
                {translate("resetPass-noAccount")}
                <span
                  className={`${styles.signUpLabel}`}
                  onClick={() => redirectToSignUp()}
                  data-test-id="signup-link"
                >
                  {translate("resetPass-signup")}
                </span>
              </span>
            </div>
          </div>
        </CustomCard>
      </Container>
      <PasswordResetSuccessfulModal
        setPassword={setPassword}
        successModal={successModal}
        closeSuccessModal={closeSuccessModal}
      ></PasswordResetSuccessfulModal>
    </React.Fragment>
  );
};

export default ResetPassword;
