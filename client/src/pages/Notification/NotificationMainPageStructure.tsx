import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "./NotificationMenuContent.module.scss";
import moment from 'moment'
const greenIcon = "/Icon_Pop-up_Success-Error-Pending.svg";
const redIcon = "/w_illustrations_popup-warning.svg";
const closeLetter = "/Letter_Close.svg";
const icon = "/W_Icon_Blue dropdow.svg";
const openLetter = "/Letter_Open.svg";

const NotificationPageStructure = (props: any): JSX.Element => {
  const { index, redirectToApplication, notification, format, markAsRead } = props;

  return (
    <div key={index}>
      { index !== 0 ? <hr className={`${styles.headerDivider} w-100`}></hr> : null}
      <Grid container className={`py-2`}>
        <Grid item xs={2} sm={1} lg={1} className={`${styles.iconAlign} p-2`}>
          <img src={notification.applicationStatus === 'approved' ? greenIcon : redIcon}
            alt="applicationStatusIcon"></img>
        </Grid>
        <Grid item xs={8} sm={9} lg={10} className={`p-2`}>
          <span className={styles.notificationTitle} >{notification.notificationTitle}</span>
          <Typography>{notification.notificationDescription}</Typography>
        </Grid>
        <Grid item xs={2} sm={2} lg={1} className={'p-2'}>
          <img src={notification.readStatus ? openLetter : closeLetter} className={`${styles.cursorPointer}`} alt="closeLetter" onClick={() => markAsRead(notification.notificationId)}></img>
        </Grid>
      </Grid>
      <Grid container className={`py-2`}>
        <Grid item xs={2} sm={2} lg={1} className={`p-2`}>
        </Grid>
        <Grid item xs={7} sm={7} lg={9} className={`p-2`}>
          <span className={`${styles.redirectlink} ${styles.cursorPointer}`} onClick={redirectToApplication}>{notification.redirectUrl}</span>
        </Grid>
        <Grid item xs={3} sm={3} lg={2} className={`${styles.textAlignCenter} pt-2`}>
          <span className={`pr-2 ${styles.dateTimeLbl}`}>{moment(notification.dateTime).format(format)}</span>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotificationPageStructure;