import React, { createRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { CustomButton } from "src/components/CustomButton/CustomButton";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Success from "src/components/Alerts/Success";
import Warning from "src/components/Alerts/Warning";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { Hidden } from "@material-ui/core";

const OTP_MOBILE = "/otpMobile.svg";
const CancelIcon = "/Cancel_Icon.svg";
const BackIcon = "/Back_Icon.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    // "& .MuiPaper-root":{
    // 	width:"53vw",
    // 	maxWidth:"650px"
    // }
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // margin: 'auto',
    // width: 'fit-content'
  },
  bold: {
    fontWeight: 800,
    paddingLeft: 6,
  },
  noOpacity: {
    opacity: 0,
  },
  close: {
    cursor: "pointer",
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  otpDialogTitle: {
    textAlign: "center",
    fontSize: 20,
    color: "#0257a3",
  },
  otpContent: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    color: "#354463",
    // fontSize: 16,
    // textAlign: 'center',
    // padding: '0 92px',
    // marginTop: 24,
    marginBottom: 0,
  },
  otpContent1: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 20px",
    marginTop: 24,
    color: "#405c7e",
    fontWeight: 500,
    // marginBottom: 24,
    ["@media (min-width:360px)"]: {
      fontSize: 13,
    },
  },
  otpImg: {
    textAlign: "center",
  },
  otpInputBox: {
    width: 36,
    border: 0,
    borderBottom: "1px solid #cddae0",
    marginRight: 30,
    outline: 0,
    color: "#0257a3",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 1.38,
    textAlign: "center",
    ["@media (max-width:360px)"]: {
      width: 28,
      marginRight: 18,
    },
  },
  resend: {
    color: "#0257a3",
    cursor: "pointer",
  },
  paddingStyle: {
    paddingBottom: 20,
  },
  otpTitle: {
    fontSize: "20px",
    color: "#0257a3",
    marginTop: "32px",
    ["@media (min-width:360px)"]: {
      marginLeft: "16px",
    },
  },
  otpDialogTitleSection: {
    width: "100%",
    display: "flex",
    // bd-highlight
    flexItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem",
    ["@media (max-width:360px)"]: {
      justifyContent: "initial",
      alignItems: "center",
      paddingBottom: "20%",
    },
  },

  verifyBtn: {
    width: "300px",
    margin: "0 auto",
    ["@media (max-width:360px)"]: {
      position: "absolute",
      bottom: "5%",
      right: 0,
      left: 0,
    },
  },
}));

const hideNumber=(number:number)=>{
	if(!number ) return "";
	let mNumber=String(number);
	let l=mNumber.length;
	return `${mNumber[0]}${mNumber[1]}xxxx${mNumber[l-4]}${mNumber[l-3]}${mNumber[l-2]}${mNumber[l-1]}`
}

export default function OtpMobile(props: any) {
  const classes = useStyles();
  const { resendMsg, setResendMsg, errorMsg, setErrorMsg, resendOTP, openOTPModal } = props;

  const handleClose = async () => {
    props.handleOtpClose();
    await setValues({
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    });
    props.handleOtpClose(values, setValues);
  };

  const handleOpen = () => {
    console.log("OPENNN", props.open);
    props.open;
    setValues({
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    });
  };

  const resendOTPAndReset = () => {
    resendOTP();
    handleOpen();
  }
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleVerify = () => {
    const otpValue = Object.values(values).reduce(
      (otpString, value) => otpString + value
    );
    console.log("otpString", otpValue);
    // setErrorMsg(true)
    setResendMsg(false);
    setErrorMsg(false);
    props.handleOtpVerify(otpValue);
  };

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
  const [values, setValues] = React.useState<State>({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: "",
  });
  const [error, setError] = React.useState<State>(true);
  useEffect(() => {
    setValues({
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    });
  }, [openOTPModal]);
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

  const validateEntry = (prop: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): boolean => {
    event.preventDefault();
    let index: number = event.currentTarget.dataset.index
      ? parseInt(event.currentTarget.dataset.index)
      : 1;
    const pattern = /^[0-9\b]+$/;
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
  return (
    <React.Fragment>
      {/* <Hidden smDown> */}
      <Dialog
        fullWidth
        className={classes.root}
        disableBackdropClick
        disableEscapeKeyDown
        fullScreen={fullScreen}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="otp-dialog-title"
      >
        <DialogTitle id="otp-dialog-title" className={classes.otpDialogTitle}>
          <div
            className={classes.otpDialogTitleSection}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div>
              <Hidden smUp>
                <img
                  src={BackIcon}
                  alt=""
                  className={classes.close}
                  onClick={handleClose}
                />
              </Hidden>
            </div>
            <div>
              <span className={classes.otpTitle}>OTP Verification</span>
            </div>
            <div>
              <Hidden xsDown>
                <img
                  src={CancelIcon}
                  alt=""
                  className={classes.close}
                  onClick={handleClose}
                />
              </Hidden>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={classes.otpImg}>
            <img src={OTP_MOBILE} alt="otp-mobile-img" />
          </div>
          <div className={classes.otpContent1}>
            An OTP (One Time Password) has been sent to{" "}
          </div>
          <DialogContentText className={classes.otpContent}>
            mobile number
            <span className={classes.bold}>{hideNumber(props.customerMobile)}</span>
          </DialogContentText>
          <div className={classes.otpContent1} style={{ marginTop: 0 }}>
            Please verify to activate your card
          </div>
          <form className={classes.form} noValidate>
            <Box>
              <div className="pb-3 px-4 d-flex justify-content-between">
                <div>
                  <input
                    name="digit1"
                    className={classes.otpInputBox}
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
                <div>
                  <input
                    name="digit2"
                    className={classes.otpInputBox}
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
                <div>
                  <input
                    name="digit3"
                    className={classes.otpInputBox}
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
                <div>
                  <input
                    name="digit4"
                    className={classes.otpInputBox}
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
                <div>
                  <input
                    name="digit5"
                    className={classes.otpInputBox}
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
                <div>
                  <input
                    name="digit6"
                    className={classes.otpInputBox}
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
            </Box>
            <Typography className="text-center mt-2 mb-3">
              Didn’t receive OTP?{" "}
              <span className={classes.resend} onClick={() => resendOTPAndReset()}>
                Resend
              </span>
            </Typography>
          </form>

          <div style={{ margin: "1rem 0px", textAlign: "center" }}>
            <CustomButton
              variant="contained"
              disabled={!values.digit6}
              color="primary"
              className={classes.verifyBtn}
              onClick={handleVerify}
            >
              VERIFY
            </CustomButton>
          </div>
          <div style={{ margin: "1rem 2rem" }}>
            <Warning style={{fontSize:"13px",color:"#e21e1e",backgroundColor:"#ffd1d1"}} open={errorMsg} onClose={() => setErrorMsg(false)}>
              Incorrect OTP entered. Please try again (2 attempts pending)
            </Warning>
            <Success style={{fontSize:"13px",color:"#008e65",backgroundColor:"#a5efd9"}} open={resendMsg} onClose={() => setResendMsg(false)}>
			        The OTP has been resent to {props.customerMobile}
            </Success>
          </div>
        </DialogContent>
      </Dialog>
      {/* </Hidden> */}
    </React.Fragment>
  );
}
