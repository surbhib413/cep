import React, { createRef, useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./OtpVerification.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import { Typography, Hidden, Snackbar } from "@material-ui/core";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import validator from "validator";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CongratulationsModal } from "./CongratulationsModal";
import { CustomerEnrolledModal } from "./CustomerEnrolledModal";
import { SelfEnrolledModal } from "./SelfEnrolledModal";
import translate from "../../i18n/translate";
import { useRouter } from "next/router";
import { postVerifyOTP, postResendOTP } from "../../lib/api/signup/signup";
import { postVerifyPassword } from "../../lib/api/signin/signin";
import Cookies from "universal-cookie";
import { setLoader } from "../../redux/actions/actions";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import {
  isValidEmailAddress
} from "../../utility/validations/validations";
const b2bOtpImg = "otp-business.svg";

interface State {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
}

const OtpVerification = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
  const cookies = new Cookies();

  const redirectedFrom: any = router.query.redirectedFrom
    ? router.query.redirectedFrom
    : "";
  const textInput1: React.RefObject<HTMLInputElement> = createRef();
  const textInput2: React.RefObject<HTMLInputElement> = createRef();
  const textInput3: React.RefObject<HTMLInputElement> = createRef();
  const textInput4: React.RefObject<HTMLInputElement> = createRef();
  const textInput5: React.RefObject<HTMLInputElement> = createRef();
  const textInput6: React.RefObject<HTMLInputElement> = createRef();
  const refObjects = [
    textInput1,
    textInput2,
    textInput3,
    textInput4,
    textInput5,
    textInput6,
  ];

  const [open, setOpen] = React.useState(false);
  const [openResendToast, setOpenResendToast] = useState(false);
  const [openInvalidOtpToast, setOpenInvalidOtpToast] = useState(false);
  const [openTooManyAttempts, setOpenTooManyAttempts] = useState(false);

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const [values, setValues] = useState<State>({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: "",
  });

  const validateEntry = (prop: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): boolean => {
    event.preventDefault();
    let index: number = event.currentTarget.dataset.index
      ? parseInt(event.currentTarget.dataset.index)
      : 1;
    const pattern = /^[0-9\b]+$/;

    //console.log("Index............", index);
    if (pattern.test(event.target.value) && event.target.value.length === 1) {
      setValues({ ...values, [prop]: event.target.value });
      if (index <= 5) {
        if (refObjects[index].current !== null) {
          (refObjects[index] as any).current.focus();
        }
      }
      return true;
    } else {
      setValues({ ...values, [prop]: "" });
      return false;
    }
  };

  const handleContinue = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    handleVerify();
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
    prop: keyof State
  ) => {
    var key = event.key;
    let index: number = event.currentTarget.dataset.index
      ? parseInt(event.currentTarget.dataset.index)
      : 1;

    if (key === "Backspace") {
      //backspace pressed
      if (index > 1) {
        if (refObjects[index - 2].current !== null) {
          (refObjects[index - 2] as any).current.focus();
        }
      }
    }
  };

  const redirectToLogin = (): void => {
    // props.history.push("/login");
    router.push("/login");
  };

  const redirectToSignUp = (): void => {
    // props.history.push("/signUp");
    router.push("/signup");
  };

  const handleBackArrow = (): void => {
    redirectedFrom === "signIn" ? redirectToLogin() : redirectToSignUp();
  };

  const redirectToSmartfleetRegistration = () => {
    router.push({
      pathname: "/registration/smartfleet",
      // query: { formType: router.query.formType },
    });
  };

  const redirectToPetrocorporateRegistration = () => {
    // props.history.push({
    //   pathname: "/registration/petrocorporate",
    // });
    router.push("/registration/petrocorporate");
  };

  const redirectToBusinessSelectionPage = () => {
    // props.history.push({
    //   pathname: "/signup/business",
    // });
    router.push("/business-programme");
  };

  const redirectToServiceRequests = () => {
    dispatch({
      type: "UNSET_ASSISTED_FLOW",
    });
    // props.history.push("/service-requests");
    router.push("/service-requests");
  };

  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isCustEnrollModalOpen, setIsCustEnrollModalOpen] = useState(false);
  const [isSelfEnrollModalOpen, setIsSelfEnrollModalOpen] = useState(false);
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");

  const closeCongratulationsModal = () => {
    setVerificationComplete(false);
  };
  const openCongratulationModal = () => {
    setVerificationComplete(true);
  };

  const openCustomerEnrolledModal = () => {
    setIsCustEnrollModalOpen(true);
  };
  const closeCustomerEnrolledModal = () => {
    setIsCustEnrollModalOpen(false);
  };

  const openSelfEnrolledModal = () => {
    setIsSelfEnrollModalOpen(true);
  };
  const closeSelfEnrolledModal = () => {
    setIsSelfEnrollModalOpen(false);
  };

  const handleVerify = async () => {
    dispatch(setLoader(true));
    const otpValue = Object.values(values).reduce(
      (otpString, value) => otpString + value
    );
    const otpChannel = isValidEmailAddress(store.username) ? "EMAIL" : "MOBILE";
    let otpType;
    if (redirectedFrom === "signUp") {
      otpType = "SIGNUP";
    } else if (
      redirectedFrom === "signIn" ||
      redirectedFrom === "forgotPassword"
    ) {
      otpType = "SIGNIN";
    }

    const finalData = {
      customerId: store.username,
      otp: otpValue,
      otpType: otpType,
      otpChannel: otpChannel,
      customerType: "Business",
      //token: localStorage.getItem('server_token')
    };
    console.log("FINAL DATA............", finalData);
    const res: any = await postVerifyOTP(finalData);
    console.log("Otp Verification res : ", res);
    console.log("Otp Verification res : ", res?.data);

    // if (res?.status === "success" && res?.data.statusCode !== 403) {
    if (res?.status === "success" || res?.status == 200) {
      console.log("SUCCESS");
      const usernamePasswordData = {
        customerId: store.username,
        password: res?.data.secureString,
      };
      const userPassResponse: any = await postVerifyPassword(
        usernamePasswordData
      );
      console.log("userPassResponse res : ", userPassResponse);

      if (
        userPassResponse?.status === "success" ||
        userPassResponse?.status == 200
      ) {
        // localStorage.setItem("mark_two", userPassResponse?.data.access_token);
        // localStorage.setItem(
        //   "mark_three",
        //   userPassResponse?.data.refresh_token
        // );

        // document.cookie = `mark_two=${userPassResponse?.data.access_token}; path=/`;
        // document.cookie = `mark_three=${userPassResponse?.data.refresh_token}; path=/`;
        cookies.set("mark_two", userPassResponse?.data.access_token, {
          path: "/",
        });
        cookies.set("mark_three", userPassResponse?.data.refresh_token, {
          path: "/",
        });

        if (redirectedFrom === "signUp") {
          if (store.role === "PETROCORPORATE") {
            openCustomerEnrolledModal();
          } else {
            openSelfEnrolledModal();
          }
        }
        if (redirectedFrom === "forgotPassword") {
          router.push("/resetpassword");
        }

        if (redirectedFrom === "signIn") {
          router.push("/resetpassword");
        }

        if (store.assistedFlow) {
          openCongratulationModal();
        }
      } else {
        console.log("ERROR RESPONSE", userPassResponse);
        dispatch(setLoader(false));
        if (res?.data?.error) {
          setShowSnackbar(true);
          setSnackbarMessage(res?.data?.error?.error_description);
          setAlertType("error");
        }
      }
    } else {
      dispatch(setLoader(false));
      // if (res.data?.errors) {
      //   res.data?.errors?.forEach((element: any) => {
      if (res?.errors) {
        res?.errors?.forEach((element: any) => {
          console.log(element?.subject);
          if (!element.hasOwnProperty("subject")) {
            console.log(element?.subject);
            setApiOtherErrorMessage(element?.message);
          } else {
            if (element?.subject === "otp") {
              // setOpenInvalidOtpToast(true);
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.subject);
              setAlertType("error");
            }
          }
        });
      } else {
        dispatch(setLoader(false));
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
    //   setOpenTooManyAttempts(true);
  };

  const resendOtp = async () => {
    const otpChannel = isValidEmailAddress(store.username) ? "EMAIL" : "MOBILE";
    let otpType;
    if (redirectedFrom === "signUp") {
      otpType = "SIGNUP";
    } else if (
      redirectedFrom === "signIn" ||
      redirectedFrom === "forgotPassword"
    ) {
      otpType = "SIGNIN";
    }

    const finalData = {
      customerId: store.username,
      otpType: otpType,
      otpChannel: otpChannel,
    };
    const res: any = await postResendOTP(finalData);
    console.log("This is response for resend OTP....", res);
    if (
      (res?.status === "success" || res?.status == 200) &&
      res?.data.statusCode !== 403
    ) {
      console.log("SignUp res : ", res);
      // setOpenResendToast(true);
      setShowSnackbar(true);
      setSnackbarMessage(res?.message);
      setAlertType("success");
    } else {
      if (res?.errors) {
        res?.errors.forEach((element: any) => {
          console.log(element?.subject);
          if (!element.hasOwnProperty("subject")) {
            console.log(element?.subject);
            setApiOtherErrorMessage(element?.message);
          } else {
            if (element?.subject === "otp") {
              //setOpenInvalidOtpToast(true);
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.subject);
              setAlertType("error");
            } else {
              setShowSnackbar(true);
              setSnackbarMessage(element?.message);
              setAlertType("error");
            }
          }
        });
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  return (
    <React.Fragment>
      <Container
        maxWidth="sm"
        className={`d-flex flex-column py-sm-4 px-0 px-sm-3 ${styles.container
          } ${store.assistedFlow ? "h-100" : ""}`}
      >
        <CustomCard
          className={`d-flex px-3 px-sm-5 my-sm-4 my-0 flex-column justify-content-between ${styles.otpCard}`}
        >
          <div className={`pt-4`}>
            <div
              className={`${!store.assistedFlow ? "d-flex" : ""
                } justify-content-between align-items-center`}
            >
              {!store.assistedFlow && (
                <ArrowBackIcon
                  className={`${styles.backIconPos}`}
                  onClick={() => handleBackArrow()}
                // onClick={redirectedFrom === 'signIn' ? redirectToLogin() : redirectToSignUp()}
                ></ArrowBackIcon>
              )}
              <Typography className={styles.otpTitle} variant="h5">
                {translate("otp-verification-lbl")}
              </Typography>
              {!store.assistedFlow && (
                <ArrowBackIcon
                  data-test-id="otp-backIcon"
                  className={`${styles.noOpacity}`}
                  onClick={() => redirectToSignUp()}
                ></ArrowBackIcon>
              )}
            </div>
            <img
              className={`p-4 p-sm-5 ${styles.otpImage}`}
              src={b2bOtpImg}
              alt=""
            />
            <div className="px-4">
              <Hidden xsDown>
                <Typography>
                  {translate("otp-lbl")}
                  {store.assistedFlow
                    ? translate("otp-customer")
                    : translate("otp-your")}
                  {store.assistedFlow
                    ? validator.isMobilePhone(store.assistedCustomerUsername)
                      ? translate("otp-mobile")
                      : translate("otp-email")
                    : validator.isMobilePhone(store.username)
                      ? translate("otp-mobile")
                      : translate("otp-email")}
                  {store.assistedFlow ? (
                    <span className={`${styles.bold}`}>
                      {store.assistedCustomerUsername}.
                    </span>
                  ) : (
                      <span className={`${styles.bold}`}>{store.username}</span>
                    )}
                  {store.assistedFlow &&
                    " Please enter the OTP and click Confirm"}
                </Typography>
              </Hidden>

              <Hidden smUp>
                <Typography className={styles.mobileSubTitle}>
                  An OTP (One Time Password) has been sent to
                  {store.assistedFlow ? " the customer" : " your"}
                  {store.assistedFlow
                    ? validator.isMobilePhone(store.assistedCustomerUsername)
                      ? " Mobile No. "
                      : " Email Id "
                    : validator.isMobilePhone(store.username)
                      ? " Mobile No. "
                      : " Email Id "}
                  {store.assistedFlow ? (
                    <span className={`${styles.bold}`}>
                      {store.assistedCustomerUsername}.
                    </span>
                  ) : (
                      <span className={`${styles.bold}`}>{store.username}</span>
                    )}
                  {store.assistedFlow &&
                    " Please enter the OTP and click Confirm"}
                </Typography>
              </Hidden>
            </div>
          </div>
          <div className={`pb-5 pb-sm-0`}>
            <form autoComplete="off">
              <div className="pb-3 px-4 d-flex justify-content-between">
                <div className={`pr-4 ${styles.inputOtp}`}>
                  <input
                    name="digit1"
                    type="text"
                    ref={textInput1}
                    data-index={1}
                    onChange={validateEntry("digit1")}
                    onKeyUp={(e) => handleKeyUp(e, "digit1")}
                    placeholder=" "
                    maxLength={1}
                    value={values.digit1}
                    id="otp-1"
                  />
                </div>
                <div className={`pr-4 ${styles.inputOtp}`}>
                  <input
                    name="digit2"
                    type="text"
                    ref={textInput2}
                    data-index={2}
                    onChange={validateEntry("digit2")}
                    onKeyUp={(e) => handleKeyUp(e, "digit2")}
                    placeholder=" "
                    maxLength={1}
                    value={values.digit2}
                    id="otp-2"
                  />
                </div>
                <div className={`pr-4 ${styles.inputOtp}`}>
                  <input
                    name="digit3"
                    type="text"
                    ref={textInput3}
                    data-index={3}
                    onChange={validateEntry("digit3")}
                    onKeyUp={(e) => handleKeyUp(e, "digit3")}
                    placeholder=" "
                    maxLength={1}
                    value={values.digit3}
                    id="otp-3"
                  />
                </div>
                <div className={`pr-4 ${styles.inputOtp}`}>
                  <input
                    name="digit4"
                    type="text"
                    ref={textInput4}
                    data-index={4}
                    onChange={validateEntry("digit4")}
                    onKeyUp={(e) => handleKeyUp(e, "digit4")}
                    placeholder=" "
                    maxLength={1}
                    value={values.digit4}
                    id="otp-4"
                  />
                </div>
                <div className={`pr-4 ${styles.inputOtp}`}>
                  <input
                    name="digit5"
                    type="text"
                    ref={textInput5}
                    data-index={5}
                    onChange={validateEntry("digit5")}
                    onKeyUp={(e) => handleKeyUp(e, "digit5")}
                    placeholder=" "
                    maxLength={1}
                    value={values.digit5}
                    id="otp-5"
                  />
                </div>
                <div className={`${styles.inputOtp}`}>
                  <input
                    name="digit6"
                    type="text"
                    ref={textInput6}
                    data-index={6}
                    onChange={validateEntry("digit6")}
                    //onKeyUp={(e) => handleKeyUp(e, "digit6")}
                    onKeyUp={(e: any) => {
                      if (e.key === "Enter") {
                        handleContinue(e);
                      } else {
                        handleKeyUp(e, "digit6");
                      }
                    }}
                    placeholder=" "
                    maxLength={1}
                    value={values.digit6}
                    id="otp-6"
                  />
                </div>
              </div>
            </form>

            <Typography variant="caption" className="p-4">
              {translate("otp-resend-lbl")}
              <span
                data-test-id="resend-btn"
                className={`${styles.cursorPointer} ${styles.resendLbl}`}
                onClick={resendOtp}
              >
                {translate("otp-resend")}
              </span>{" "}
            </Typography>
          </div>
          <div className={`pb-4`}>
            <CustomButton
              variant="contained"
              data-test-id="verify-btn"
              disabled={
                values.digit1 &&
                  values.digit2 &&
                  values.digit3 &&
                  values.digit4 &&
                  values.digit5 &&
                  values.digit6
                  ? false
                  : true
              }
              className={`w-100 mb-3 ${styles.btnVerify} ${values.digit1 &&
                values.digit2 &&
                values.digit3 &&
                values.digit4 &&
                values.digit5 &&
                values.digit6
                ? styles.activeButton
                : styles.inactiveButton
                }`}
              onClick={() => handleVerify()}
            >
              {store.assistedFlow ? "Confirm" : translate("otp-verify")}
            </CustomButton>
            {/* {store.role === "CUSTOMER" && !store.assistedFlow ? (
              <Typography variant="caption">
                {translate("otp-haveAccount")}
                <span
                  className={`MuiTypography-colorPrimary ${styles.cursorPointer} ${styles.bold}`}
                  onClick={() => redirectToLogin()}
                >
                  {translate("otp-login")}
                </span>{" "}
              </Typography>
            ) : (
              ""
            )} */}
            {store.assistedFlow && (
              <Typography variant="caption">
                <span
                  className={`MuiTypography-colorPrimary ${styles.cursorPointer} ${styles.bold}`}
                  onClick={() => redirectToServiceRequests()}
                >
                  {translate("otp-backTo-requests")}
                </span>
              </Typography>
            )}
          </div>
          {/* OTP RESENT SUCCESSFULLT GREEN TOAST */}
          <Snackbar
            open={openResendToast}
            autoHideDuration={6000}
            onClose={() => {
              setOpenResendToast(false);
            }}
            className={`${styles.alertStyle}`}
          >
            <Alert
              className={`align-items-center ${styles.alertBackground}`}
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  className={`${styles.alertBackground}`}
                  onClick={() => {
                    setOpenResendToast(false);
                  }}
                >
                  <CloseIcon
                    fontSize="inherit"
                    className={`${styles.alertBackground}`}
                  />
                </IconButton>
              }
            >
              <Hidden xsDown>
                <span> OTP has been resent successfully!</span>
              </Hidden>
              <Hidden smUp>
                <span className={styles.alertMobileTitle}>
                  {" "}
                  OTP has been resent successfully!
                </span>
              </Hidden>
            </Alert>
          </Snackbar>

          {/* OTP INVALID RED TOAST */}
          <Snackbar
            open={openInvalidOtpToast}
            autoHideDuration={6000}
            onClose={() => {
              setOpenInvalidOtpToast(false);
            }}
          >
            <Alert
              className={`align-items-center ${styles.errorAlertStyle}`}
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  className={`${styles.errorAlertStyle} ${styles.borderButton}`}
                  onClick={() => {
                    setOpenInvalidOtpToast(false);
                  }}
                >
                  <CloseIcon
                    fontSize="inherit"
                    className={`${styles.errorAlertStyle}`}
                  />
                </IconButton>
              }
            >
              <Hidden xsDown>
                <span> OTP entered is incorrect. Try again.</span>
              </Hidden>
              <Hidden smUp>
                <span className={styles.alertMobileTitle}>
                  {" "}
                  OTP entered is incorrect. Try again
                </span>
              </Hidden>
            </Alert>
          </Snackbar>

          {/* TOO MANY ATTEMPTS RED TOAST */}
          <Snackbar
            open={openTooManyAttempts}
            autoHideDuration={6000}
            onClose={() => {
              setOpenTooManyAttempts(false);
            }}
          >
            <Alert
              className={`align-items-center ${styles.errorAlertStyle}`}
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  className={`${styles.errorAlertStyle} ${styles.borderButton}`}
                  onClick={() => {
                    setOpenTooManyAttempts(false);
                  }}
                >
                  <CloseIcon
                    fontSize="inherit"
                    className={`${styles.errorAlertStyle}`}
                  />
                </IconButton>
              }
            >
              <span>
                {" "}
                OTP verification failed. Too many failed attempts, try again
                after some time.
              </span>
            </Alert>
          </Snackbar>
          <CustomSnackbar
            open={showSnackbar}
            close={setShowSnackbar}
            type={alertType}
            message={snackbarMessage}
          ></CustomSnackbar>
        </CustomCard>
      </Container>
      <CongratulationsModal
        verificationComplete={verificationComplete}
        closeCongratulationsModal={closeCongratulationsModal}
        redirectToSmartfleetRegistration={redirectToSmartfleetRegistration}
      ></CongratulationsModal>
      <CustomerEnrolledModal
        verificationComplete={isCustEnrollModalOpen}
        closeCustomerEnrolledModal={closeCustomerEnrolledModal}
        redirectToPetrocorporateRegistration={
          redirectToPetrocorporateRegistration
        }
      ></CustomerEnrolledModal>
      <SelfEnrolledModal
        verificationComplete={isSelfEnrollModalOpen}
        closeSelfEnrolledModal={closeSelfEnrolledModal}
        redirectToBusinessSelectionPage={redirectToBusinessSelectionPage}
      ></SelfEnrolledModal>
    </React.Fragment>
  );
};

export default OtpVerification;
