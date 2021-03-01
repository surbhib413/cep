import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import styles from "./NotificationMenuContent.module.scss";
import { useRouter } from "next/router";
import NotificationMainPageStructure from "./NotificationMainPageStructure";
import moment from "moment";
import { indexOf, forEach, dropRight, get } from "lodash";
const icon = "/W_Icon_Blue dropdow.svg";

const NotificationMainPage = (props: any): JSX.Element => {
  const router = useRouter();
  const allNotifications = props.notifications;
  const notificationsForMenu = dropRight(props.notifications, (props.notifications.length - 2));
  const notifications = props.showAsMenu ? notificationsForMenu : allNotifications;
  const notificationTypeMap = { 'read': true, 'unread': false }
  const notificationType = props.buttonState === 'all' ? [true, false] : [get(notificationTypeMap, props.buttonState)];
  const todayDate = moment().format('l');
  const paddingStyle = !props.showAsMenu ? 'd-flex px-3 py-3 justify-content-between' : 'd-flex px-3 justify-content-between';
  const [displayTodaySecion, setDisplayTodaySection] = useState(true);
  const [displayWeekSection, setDisplayWeekSection] = useState(true);
  const [displayOlderSection, setDisplayOlderSection] = useState(true);
  let [todaySection, weekSection, olderSection] = [false, false, false];

  const redirectToNotification = () => {
    props.handleClose();
    router.push({
      pathname: "/notification"
    });
  };

  const redirectToApplication = () => {
    router.push({
      pathname: "/registration/smartfleet"
    });
  };

  useEffect(() => {
    forEach(notifications, notificaitonItem => {
      if (moment(notificaitonItem.dateTime, 'YYYY/MM/DD').isSame(todayDate) && indexOf(notificationType, notificaitonItem.readStatus) != -1) {
        todaySection = true;
      }
      if (moment(notificaitonItem.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'week') && !moment(notificaitonItem.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'day') && indexOf(notificationType, notificaitonItem.readStatus) != -1) {
        weekSection = true;
      }
      if (!moment(notificaitonItem.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'week') && !moment(notificaitonItem.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'day') && indexOf(notificationType, notificaitonItem.readStatus) != -1) {
        olderSection = true;
      }
    })

    if (!props.showAsMenu) {
      todaySection = true;
      weekSection = true;
      olderSection = true;
    }
    setDisplayTodaySection(todaySection);
    setDisplayWeekSection(weekSection);
    setDisplayOlderSection(olderSection);
  })

  const renderToday = () => {
    return notifications.map((el: any, index: number) => {
      if (moment(el.dateTime, 'YYYY/MM/DD').isSame(todayDate) && indexOf(notificationType, el.readStatus) != -1) {
        return (
          <NotificationMainPageStructure
            key={index}
            index={index}
            notification={el}
            redirectToApplication={redirectToApplication}
            markAsRead={props.markAsRead}
            format='hh:mm'
          ></NotificationMainPageStructure>
        );
      }
    });
  }

  const renderWeek = () => {
    return notifications.map((el: any, index: number) => {
      if (moment(el.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'week') && !moment(el.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'day') && indexOf(notificationType, el.readStatus) != -1) {
        return (
          <NotificationMainPageStructure
            key={index}
            index={index}
            notification={el}
            redirectToApplication={redirectToApplication}
            markAsRead={props.markAsRead}
            format='YYYY/MM/DD'
          ></NotificationMainPageStructure>
        );
      }
    });
  }

  const renderOld = () => {
    return notifications.map((el: any, index: number) => {
      if (!moment(el.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'week') && !moment(el.dateTime, 'YYYY/MM/DD').isSame(todayDate, 'day') && indexOf(notificationType, el.readStatus) != -1) {
        return (
          <NotificationMainPageStructure
            key={index}
            index={index}
            notification={el}
            redirectToApplication={redirectToApplication}
            markAsRead={props.markAsRead}
            format='YYYY/MM/DD'
          ></NotificationMainPageStructure>
        );
      }
    });
  }

  return (
    <React.Fragment>
      <Container
        className={`p-0 d-flex w-100 h-100 flex-column justify-content-center`}
      >
        <div className={paddingStyle}>
          {/* <span className={styles.alertsNotificationsLbl}>Alerts & notifications</span> */}
          {/* <span className={`${styles.markReadLbl} ${styles.cursorPointer}`} onClick={markReadFn}>Mark all as read</span> */}
        </div>
        {
          notifications && notifications.length > 0 && displayTodaySecion ?
            <div className={`d-flex flex-column justify-content-center`}>
              <div className={`d-flex ${styles.sectionHeader}`}>
                <Typography className={`py-2 px-3 ${styles.todayLbl}`} >Today</Typography>
              </div>
              {console.log('All Notifications', notifications)}
              {renderToday()}
            </div>
            :
            null
        }

        {
          notifications && notifications.length > 0 && displayWeekSection ?
            <div className={`d-flex flex-column justify-content-center`}>
              <div className={`d-flex ${styles.sectionHeader}`}>
                <Typography className={`py-2 px-3 ${styles.todayLbl}`} >This Week</Typography>
              </div>
              {renderWeek()}
            </div>
            :
            null
        }

        {
          notifications && notifications.length > 0 && displayOlderSection ?
            <div className={`d-flex flex-column justify-content-center`}>
              <div className={`d-flex ${styles.sectionHeader}`}>
                <Typography className={`py-2 px-3 ${styles.todayLbl}`} >Older</Typography>
              </div>
              {renderOld()}
            </div>
            :
            null
        }
        {
          props.showAsMenu ?
            <div className={`d-flex flex-column justify-content-bottom`}>
              <hr className={`${styles.headerDivider} w-100`}></hr>
              <div className={`d-flex py-2 px-3 justify-content-between mt-auto  ${styles.cursorPointer}`} onClick={redirectToNotification}>
                <span className={`${styles.alertsNotificationsLbl}`}>{allNotifications.length - notificationsForMenu.length} more new notifications</span>
                <img src={icon} alt="icon"></img>
              </div>
            </div>
            : null
        }
      </Container>
    </React.Fragment >
  );
};

export default NotificationMainPage;
