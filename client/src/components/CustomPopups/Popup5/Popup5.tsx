import { Dialog, DialogContent, Typography } from "@material-ui/core";
import React from "react";
import styles from "./Popup5.module.scss";
import { CustomButton } from "../../CustomButton/CustomButton";
// import { useSelector } from "react-redux";

const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";

const Popup5 = (props: any) => {

    return (
        <Dialog open={props.open} onClose={props.handleOtpClose()} fullWidth={true} maxWidth="sm">
            <DialogContent
                className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
            >
                <div className="w-100 d-flex bd-highlight align-items-center justify-content-between p-2 p-sm-0" style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <img
                            src={CancelIcon}
                            alt=""
                            className={`${styles.noOpacity} `}
                            onClick={props.handleOtpClose()}
                        />
                    </div>
                    <div>

                        <span className={`${styles.otpVerification}`}>OTP Verification</span>
                    </div>
                    <div>
                        <img
                            src={CancelIcon}
                            alt=""
                            className={`${styles.cursorPointer}`}
                            onClick={props.handleOtpClose()}
                        />

                    </div>
                </div>


                <div className={`${styles.warning}`}>
                    <img src={WIconWarning} alt="requestSentImg" />
                </div>
                {/* <Typography className={`mx-2 px-sm-5 text-center`} variant="h6">
                   
                    {description &&
                        description.split("\n").map((item: any, key: any) => {
                            return (
                                <React.Fragment key={key}>
                                    {item}
                                    <br />
                                </React.Fragment>
                            );
                        })}
                </Typography> */}


                <span className={`${styles.msg}`}>You exceeded the maximum limits for OTP verification. </span>
                <span className={`${styles.msg2}`}>Please try again after sometime.</span>


            </DialogContent>
        </Dialog>
    );
};

export default Popup5