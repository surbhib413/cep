import React, { useEffect, useState } from "react";
import { Container, Button, Grid, Hidden } from "@material-ui/core";
import NotificationMainPage from "./NotificationMainPage";
import styles from "../Notification/NotificationMenuContent.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomCard from "../../components/CustomCard/CustomCard";
import SideNav from "../../components/SideNav/SideNav"

const Notification = (props: any): JSX.Element => {

  const { showAsMenu = false } = props;
  const [allNotifications, setAllNotifications] = React.useState([{}]);
  const [buttonState, setButtonState] = React.useState("all");
  const paddingStyle = !showAsMenu ? 'py-4 pl-2' : 'py-2 pl-1';
  const notificationList = [
    {
      notificationId: '1',
      notificationTitle: "Primary information: Notification title",
      notificationDescription: "Secondary information: Notification details(optional) 1",
      redirectUrl: "View Application",
      dateTime: "2021/01/01 02:34 PM",
      readStatus: false,
      applicationStatus: "approved",
      applicationId: "1234567",
    },
    {
      notificationId: '2',
      notificationTitle: "Secondary information: Notification title",
      notificationDescription: "Secondary information: Notification details(optional) 2",
      redirectUrl: "View Application",
      dateTime: "2020/12/31 02:34 PM",
      readStatus: false,
      applicationStatus: "approved",
      applicationId: "1234578",
    },
    {
      notificationId: '3',
      notificationTitle: "Your request for fee waiver has been rejected.",
      notificationDescription: "Kindly submit the form again using an alternate payment type.",
      redirectUrl: "Update Payment",
      dateTime: "2020/12/27 02:34 PM",
      readStatus: false,
      applicationStatus: "rejected",
      applicationId: "1234567",
    },
    {
      notificationId: '4',
      notificationTitle: "Card payment pending",
      notificationDescription: "You card payment is pending",
      redirectUrl: "View Application",
      dateTime: "2020/12/18",
      readStatus: true,
      applicationStatus: "approved",
      applicationId: "1234567",
    },
    {
      notificationId: '5',
      notificationTitle: "Your request for fee waiver has been rejected.",
      notificationDescription: "Kindly submit the form again using an alternate payment type.",
      redirectUrl: "Update Payment",
      dateTime: "2020/11/24",
      readStatus: true,
      applicationStatus: "rejected",
      applicationId: "1234567",
    },
    {
      notificationId: '6',
      notificationTitle: "Your request for fee waiver has been approved.",
      notificationDescription: "Kindly submit the form again using an alternate payment type.",
      redirectUrl: "Update Payment",
      dateTime: "2020/10/20",
      readStatus: true,
      applicationStatus: "approved",
      applicationId: "1234567",
    }
  ]

  useEffect(() => {
    setAllNotifications(notificationList);
  }, [])

  const markAllAsRead = () => {
    allNotifications.map(function (x: any) {
      x.readStatus = true;
      return x
    });

    setAllNotifications(allNotifications);
  }
  const handleButtonClick = (val: string) => {
    setButtonState(val)
  }

  const markAsRead = (notificationId: string) => {
    allNotifications.map(function (notification: any) {
      if (notification.notificationId == notificationId) {
        notification.readStatus = true;
        return notification
      }
    });
    setAllNotifications(allNotifications);
  }

  return (
    <React.Fragment>
      {
        !props.showAsMenu ?
          <Hidden smDown>
            <Container
              className={`pl-1 pr-4 d-flex w-25 mw-100 flex-column bd-highlight`}
            >
              <SideNav></SideNav>
            </Container>
          </Hidden> : null
      }
      <Container
        className={`px-1 d-flex mw-100 flex-column justify-content-center`}
      >
        <CustomCard className={`w-100 sm-px-4 d-flex flex-column ${styles.submitCard}`}>
          <Grid container>
            <Grid item xs={8} sm={7} className={paddingStyle}>
              <div className={styles.AlertsStyle}>Alerts & notifications</div>
            </Grid>
            <Hidden mdUp>
              <Grid item xs={4} sm={5} className={paddingStyle}>
                {
                  buttonState === "read" ?
                    null
                    :
                    <div className={`${styles.markReadLbl} ${styles.cursorPointer}`} onClick={markAllAsRead}>Mark all as read</div>
                }
              </Grid>
            </Hidden>
          </Grid>
          {
            !props.showAsMenu ?
              <div className="pt-3 pt-sm-0 d-flex align-items-center">
                <Grid container>
                  <Grid item xs={12} sm={12} md={10} lg={10}>
                    <CustomButton
                      onClick={() => handleButtonClick("all")}
                      variant={buttonState === "all" ? "contained" : "outlined"}
                      color="primary"
                      className={`${styles.allButton}`}
                    >
                      ALL
                    </CustomButton>
                    <CustomButton
                      onClick={() => handleButtonClick("unread")}
                      variant={buttonState === "unread" ? "contained" : "outlined"}
                      color="primary"
                      className={`${styles.unreadButton}`}
                    >
                      UNREAD
                    </CustomButton>
                    <CustomButton
                      onClick={() => handleButtonClick("read")}
                      variant={buttonState === "read" ? "contained" : "outlined"}
                      color="primary"
                      className={`${styles.readButton}`}
                    >
                      READ
                    </CustomButton>
                  </Grid>
                  <Hidden smDown>
                    <Grid item md={2} lg={2} className="pr-2 pt-3">
                      {
                        buttonState === "read" ?
                          null
                          :
                          <div className={`${styles.markReadLbl} ${styles.cursorPointer}`} onClick={markAllAsRead}>Mark all as read</div>
                      }
                    </Grid>
                  </Hidden>
                </Grid>
              </div>
              : null
          }
          {
            buttonState ?
              <div className={`d-flex flex-column justify-content-center`}>
                <NotificationMainPage notifications={allNotifications} buttonState={buttonState} showAsMenu={props.showAsMenu} markAsRead={markAsRead} handleClose={props.handleClose}></NotificationMainPage>
              </div>
              : null
          }
        </CustomCard>
      </Container>
    </React.Fragment>
  );
};

export default Notification;
