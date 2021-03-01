import { Dialog, DialogContent, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import styles from "./BulkActionPopup.module.scss";
import { CustomButton } from "../CustomButton/CustomButton";
// import { useSelector } from "react-redux";

const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";
const successImage = "/w_illustrations_card-added-web.svg"
const crossIcon = "/Icon_Error.svg"
const greenCheckIcon = "/Icon_Pop-up_Success-Error-Pending.svg"

export const SetPINSuccessful = (props: any) => {
    const { open, close, closeAndSubmit, title, successMessage, failedMessage, BackToCardManagement } = props;

    // const store: any = useSelector((state) => state);

    const closeAndSubmitHandler = () => {
        closeAndSubmit();
    };

    return (
        <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm" disableBackdropClick disableEscapeKeyDown>
            <DialogContent
                className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
            >
                <div className="w-100 d-flex bd-highlight align-items-center justify-content-center p-2 p-sm-0">
                    <Typography
                        className={`px-2 px-sm-5 mx-sm-5 text-center ${styles.popStyles} ${styles.dialogTitle}`}
                        variant="h6"
                        color="primary"
                    >
                        {title}
                    </Typography>
                </div>
                <div className={'w-100 p-2 d-flex justify-content-center'}>
                    <img src={successImage} alt="requestSentImg" />
                </div>
                {
                    successMessage != '' ?
                    <div className={'w-100 px-2 pt-4 pb-2'}>
                        <Alert
                            severity="success"
                            icon={<img src={greenCheckIcon} />}
                            style={{backgroundColor:'#e5fff7'}}
                            className={'py-3'}
                        >
                            <Typography
                                variant="h6"
                                align="left"
                                style={{
                                color: "#354463",
                                fontSize: "13px",
                                }}
                            >
                                {successMessage}
                            </Typography>
                        </Alert>
                    </div>
                    : null
                }
                {
                    failedMessage != '' ?
                    <div className={'w-100 p-2'}>
                        <Alert
                            severity="error"
                            icon={<img src={crossIcon} />}
                            className={'py-3'}
                        >
                            <Typography
                                variant="h6"
                                align="left"
                                style={{
                                color: "#354463",
                                backgroundColor: "#fff0f0",
                                fontSize: "13px",
                                }}
                            >
                                {failedMessage}
                            </Typography>
                        </Alert>
                    </div>
                    : null
                }
                <div className="w-100 pt-4 pb-2 d-flex justify-content-center align-items-center">
                    <CustomButton
                        variant="outlined"
                        color="primary"
                        className={`${styles.backToEnrolmentBtn} mr-4`}
                        style={{width:'16rem'}}
                        onClick={BackToCardManagement}
                    >
                        Back to Card Management
                    </CustomButton>
                    {
                        failedMessage != '' ? 
                            <CustomButton
                                onClick={closeAndSubmitHandler}
                                variant="contained"
                                color="primary"
                                className="pl-4 pr-4"
                                style={{width:'15rem'}}
                            >
                                Back to Set PIN
                            </CustomButton>
                        : null    
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
};