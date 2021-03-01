import React, { createRef, useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./Popup10.module.scss";
import CustomCard from "src/components/CustomCard/CustomCard";
import { Typography, Hidden, Snackbar, DialogContent, Dialog } from "@material-ui/core";
import { CustomButton } from "src/components/CustomButton/CustomButton";
import validator from "validator";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import translate from "src/i18n/translate";
import { useRouter } from "next/router";
const b2bOtpImg = "/otp-business.svg";
const CancelIcon = "/Cancel_Icon.svg";


interface State {
    digit1: string;
    digit2: string;
    digit3: string;
    digit4: string;
    digit5: string;
    digit6: string;
}

const Popup10 = (props: any) => {
    const { close } = props;

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



    return (
        <Dialog open={props.open} fullWidth={true} maxWidth="sm">
            <DialogContent>
                <Container
                    maxWidth="sm"
                    className={`d-flex flex-column py-sm-4 px-0 px-sm-3 ${styles.container
                        }`}
                >
                    <div className={`pt-4`}>
                        <div
                            className={`justify-content-between align-items-center`}
                        >
                            <Typography className={styles.otpTitle} variant="h5">
                                {translate("otp-verification-lbl")}
                            </Typography>
                            <img
                                src={CancelIcon}
                                alt=""
                                className={`${styles.cursorPointer}`}
                                onClick={props.handleOtpClose()}
                            />
                        </div>
                        <img
                            className={`p-4 p-sm-5 ${styles.otpImage}`}
                            src={b2bOtpImg}
                            alt="image"
                        />
                        <div className="px-4">
                            <Hidden xsDown>
                                <Typography>
                                    {translate("otp-lbl")}
                                </Typography>
                            </Hidden>


                            <Hidden smUp>
                                <Typography className={styles.mobileSubTitle}>
                                    An OTP (One Time Password) has been sent to
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
                        </CustomButton>
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
                </Container>

            </DialogContent>
        </Dialog>
    );
};

export default Popup10