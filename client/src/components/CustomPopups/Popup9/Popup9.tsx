import React, { createRef, useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./Popup9.module.scss";
import CustomCard from "src/components/CustomCard/CustomCard";
import { Typography, Hidden, Snackbar } from "@material-ui/core";
import { CustomButton } from "src/components/CustomButton/CustomButton";
import validator from "validator";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import translate from "src/i18n/translate";
import { useRouter } from "next/router";
const b2bOtpImg = "otp-business.svg";
const CancelIcon = "/Cancel_Icon.svg";

interface State {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
}

const Popup9 = (): JSX.Element => {
  const router = useRouter();
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
    router.push("/signUp");
  };

  const redirectToSmartfleetRegistration = () => {
    router.push({
      pathname: "/registration/smartfleet",
      query: { formType: router.query.formType },
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
    router.push("/signup/business");
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

  const handleVerify = (): void => {
    const otpValue = Object.values(values).reduce(
      (otpString, value) => otpString + value
    );
    if (otpValue === "123456") {
      console.log("OTP VALUE ----- ", otpValue);
      setOpenInvalidOtpToast(true);
    } else if (otpValue === "654321") {
      setOpenTooManyAttempts(true);
    }
  };

  const resendOtp = (): void => {
    setOpenResendToast(true);
  };

  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
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
                  className={`${styles.noOpacity}`}
                  onClick={() => redirectToSignUp()}
                ></ArrowBackIcon>
              )}
              <Typography className={styles.otpTitle} variant="h5">
                {translate("otp-verification-lbl")}
              </Typography>
              <img
                src={CancelIcon}
                alt=""
                className={`${styles.cursorPointer}`}
              // onClick={close}
              />
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
                      : translate("otp-mobile")
                    : validator.isMobilePhone(store.username)
                      ? translate("otp-mobile")
                      : translate("otp-mobile")}
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
                      : " Mobile No. "
                    : validator.isMobilePhone(store.username)
                      ? " Mobile No. "
                      : " Mobile No. "}
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
                    onKeyUp={(e) => handleKeyUp(e, "digit6")}
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
        </CustomCard>
      </Container>

    </React.Fragment>
  );
};

export default Popup9;
