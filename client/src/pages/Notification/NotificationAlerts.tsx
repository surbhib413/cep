import React, { useEffect, useState } from "react";
import { Container, Grid, Hidden, Typography } from "@material-ui/core";
import styles from "../Notification/NotificationMenuContent.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import SideNav from "../../components/SideNav/SideNav"
import NotificationMainPageStructure from "./NotificationMainPageStructure";
import { useRouter } from 'next/router'

const NotificationAlerts = (props: any): JSX.Element => {
    const [allNotifications, setAllNotifications] = useState([{}]);
    const router = useRouter();
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
            actionNeeded: true
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
            actionNeeded: false
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
            actionNeeded: true
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
            actionNeeded: false
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
            actionNeeded: true
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
            actionNeeded: false
        }
    ]

    const renderUnRead = () => {
        return allNotifications.map((el: any, index: number) => {
            if (!el.readStatus) {
                return (
                    <NotificationMainPageStructure
                        key={index}
                        index={index}
                        notification={el}
                        redirectToApplication={redirectToApplication}
                        format='YYYY/MM/DD'
                    ></NotificationMainPageStructure>
                );
            }
        });
    }

    const renderNoActionUnRead = () => {
        return allNotifications.map((el: any, index: number) => {
            if (!el.readStatus && !el.actionNeeded) {
                return (
                    <NotificationMainPageStructure
                        key={index}
                        index={index}
                        notification={el}
                        redirectToApplication={redirectToApplication}
                        format='YYYY/MM/DD'
                    ></NotificationMainPageStructure>
                );
            }
        });
    }

    const renderRead = () => {
        return allNotifications.map((el: any, index: number) => {
            if (el.readStatus) {
                return (
                    <NotificationMainPageStructure
                        key={index}
                        index={index}
                        notification={el}
                        redirectToApplication={redirectToApplication}
                        format='YYYY/MM/DD'
                    ></NotificationMainPageStructure>
                );
            }
        });
    }

    const renderNoActionRead = () => {
        return allNotifications.map((el: any, index: number) => {
            if (el.readStatus && !el.actionNeeded) {
                return (
                    <NotificationMainPageStructure
                        key={index}
                        index={index}
                        notification={el}
                        redirectToApplication={redirectToApplication}
                        format='YYYY/MM/DD'
                    ></NotificationMainPageStructure>
                );
            }
        });
    }

    const renderTypesOfNotifications = () => {
        return allNotifications.map((el: any, index: number) => {
            return (
                <NotificationMainPageStructure
                    key={index}
                    index={index}
                    notification={el}
                    redirectToApplication={redirectToApplication}
                    format='YYYY/MM/DD'
                ></NotificationMainPageStructure>
            );
        });
    }

    const redirectToApplication = () => {
        router.push({
            pathname: "/registration/smartfleet"
        });
    };

    useEffect(() => {
        setAllNotifications(notificationList);
    }, [])

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
                        <Grid item xs={12} sm={12} className={'py-4 pl-2'}>
                            <div className={styles.AlertsStyle}>Notifications & Alerts Template (Contains all types of notification)</div>
                        </Grid>
                    </Grid>
                    <div className={`d-flex flex-column justify-content-center`}>
                        {
                            allNotifications && allNotifications.length > 0 ?
                                <div className={`d-flex flex-column justify-content-center`}>
                                    <div className={`d-flex ${styles.sectionHeader}`}>
                                        <Typography className={`py-2 px-3 ${styles.todayLbl}`} >Unread Notifications</Typography>
                                    </div>
                                    {renderUnRead()}
                                </div>
                                :
                                null
                        }
                        {
                            allNotifications && allNotifications.length > 0 ?
                                <div className={`d-flex flex-column justify-content-center`}>
                                    <div className={`d-flex ${styles.sectionHeader}`}>
                                        <Typography className={`py-2 px-3 ${styles.todayLbl}`} >Read Notifications</Typography>
                                    </div>
                                    {renderRead()}
                                </div>
                                :
                                null
                        }
                        {
                            allNotifications && allNotifications.length > 0 ?
                                <div className={`d-flex flex-column justify-content-center`}>
                                    <div className={`d-flex ${styles.sectionHeader}`}>
                                        <Typography className={`py-2 px-3 ${styles.todayLbl}`} >No Action Unread</Typography>
                                    </div>
                                    {renderNoActionUnRead()}
                                </div>
                                :
                                null
                        }
                        {
                            allNotifications && allNotifications.length > 0 ?
                                <div className={`d-flex flex-column justify-content-center`}>
                                    <div className={`d-flex ${styles.sectionHeader}`}>
                                        <Typography className={`py-2 px-3 ${styles.todayLbl}`} >No Action Read</Typography>
                                    </div>
                                    {renderNoActionRead()}
                                </div>
                                :
                                null
                        }
                        {
                            allNotifications && allNotifications.length > 0 ?
                                <div className={`d-flex flex-column justify-content-center`}>
                                    <div className={`d-flex ${styles.sectionHeader}`}>
                                        <Typography className={`py-2 px-3 ${styles.todayLbl}`} >Types of Notifications (Evolving List)</Typography>
                                    </div>
                                    {renderTypesOfNotifications()}
                                </div>
                                :
                                null
                        }
                    </div>
                </CustomCard>
            </Container>
        </React.Fragment>
    );
};

export default NotificationAlerts;
