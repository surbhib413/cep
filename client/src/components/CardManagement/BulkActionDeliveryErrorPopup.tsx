import { Dialog, DialogContent, Typography } from "@material-ui/core";
import React from "react";
import styles from "./BulkActionPopup.module.scss";
import { CustomButton } from "../CustomButton/CustomButton";
import { useRouter } from "next/router";

const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";

export const BulkActionDeliveryErrorPopup = (props: any) => {
    const { open, close, title, description, raiseServiceRequest } = props;

    return (
        <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm">
            <DialogContent
                className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
            >
                <div className="w-100 d-flex bd-highlight align-items-center justify-content-between p-2 p-sm-0">
                    <img
                        src={CancelIcon}
                        alt=""
                        className={`${styles.noOpacity} `}
                        onClick={close}
                    />
                    <Typography
                        className={`px-2 px-sm-5 mx-sm-5 text-center ${styles.popStyles} ${styles.dialogTitle}`}
                        variant="h5"
                        color="primary"
                    >
                        {title}
                    </Typography>
                    <img
                        src={CancelIcon}
                        alt=""
                        className={`${styles.cursorPointer}`}
                        onClick={close}
                    />
                </div>

                <img className="p-3 p-sm-4" src={WIconWarning} alt="requestSentImg" />
                <Typography className={`mx-2 px-sm-5 text-center`} variant="h6">
                    {/* You can only activate cards if you have received physical cards. */}
                    {description &&
                        description.split("\n").map((item: any, key: any) => {
                            return (
                                <React.Fragment key={key}>
                                    {item}
                                    <br />
                                </React.Fragment>
                            );
                        })}
                </Typography>

                <div className="w-100 pt-4 d-flex justify-content-center align-items-center">
                    <CustomButton
                        onClick={close}
                        variant="outlined"
                        color="primary"
                        className={`${styles.backToEnrolmentBtn} mr-2 mx-sm-4`}
                    >
                        Back
                    </CustomButton>
                    <CustomButton
                        onClick={raiseServiceRequest}
                        variant="contained"
                        color="primary"
                    // className="mr-4"
                    >
                        Raise Service Request
                    </CustomButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};
