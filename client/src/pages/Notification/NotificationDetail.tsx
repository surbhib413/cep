import React from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "./NotificationMenuContent.module.scss";
const greenIcon = "/Icon_Pop-up_Success-Error-Pending.svg";
const redIcon = "/w_illustrations_popup-warning.svg";
const closeLetter = "/Letter_Close.svg";
const icon = "/W_Icon_Blue dropdow.svg";
const openLetter = "/Letter_Open.svg";

const NotificationDetail = (props: any): JSX.Element => {
  const { index, redirectToApplication, notification } = props;

  return (
    <div key={index}>
      { index !== 0 ? <hr className={`${styles.headerDivider} w-100`}></hr> : null}
      <Grid container className={`py-2`}>
        <Grid item xs={12} sm={2} className={`${styles.textAlignCenter}`}>
          <img src={notification.applicationStatus === 'approved' ? greenIcon : redIcon}
            alt="applicationStatusIcon"></img>
        </Grid>
        <Grid item xs={12} sm={9} className={`py-1`}>
          <span className={styles.notificationTitle} >{notification.notificationTitle}</span>
          <Typography>{notification.notificationDescription}</Typography>
        </Grid>
        <Grid item xs={12} sm={1} >
          <img src={notification.readStatus ? openLetter : closeLetter} alt="closeLetter"></img>
        </Grid>
      </Grid>

      <Grid container className={`pb-2`}>
        <Grid item xs={12} sm={2} >
        </Grid>
        <Grid item xs={12} sm={7} >
          <span className={`${styles.redirectlink} ${styles.cursorPointer}`} onClick={redirectToApplication}>{notification.redirectUrl}</span>
        </Grid>
        <Grid item xs={12} sm={3} >
          <span className={`pr-4 ${styles.dateTimeLbl}`}>{notification.dateTime}</span>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotificationDetail;
