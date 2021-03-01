import { DialogContent, Hidden, Typography } from "@material-ui/core";
import React from "react";
import styles from "./Popup2.module.scss";
import { CustomButton } from "../../CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
// import { useSelector } from "react-redux";
const requestSentImg = "/Request_Sent.svg";

export const Popup2 = (props: any) => {
  const { open, close, closeAndSubmit, title, description } = props;

  // const store: any = useSelector((state) => state);

  return (
    <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm">
      <DialogContent
        className={`d-flex flex-column align-items-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <img
          className={`m-3 ${styles.illustration}`}
          src={requestSentImg}
          alt="password reset successful image"
        />
        <Typography className={`pb-4 ${styles.popStyles}`} variant="h5" color="primary">
          {title}
        </Typography>
        <Hidden smUp>
          <Typography className={`pb-4 mx-4`} variant="subtitle1" color="textPrimary">
            {description}
          </Typography>
        </Hidden>
        <Hidden xsDown>
          <Typography className={`pb-4`} variant="subtitle1" color="textPrimary">
            {description}
          </Typography>
        </Hidden>
        <CustomButton
          className={`${styles.button}`}
          color="primary"
          variant="contained"
          onClick={closeAndSubmit}
        >
          DONE
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
};
