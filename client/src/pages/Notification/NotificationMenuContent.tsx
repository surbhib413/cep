import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import styles from "./NotificationMenuContent.module.scss";
import { useRouter } from "next/router";
import Notification from "./Notification";
const icon = "/W_Icon_Blue dropdow.svg";

const NotificationMenuContent = (props: any): JSX.Element => {
  const router = useRouter();

  const redirectToNotification = () => {
    props.handleClose();
    router.push({
      pathname: "/notification",
    });
  };

  const redirectToApplication = () => {
    props.handleClose();
    router.push({
      pathname: "/registration/smartfleet",
    });
  };

  return (
    <Notification showAsMenu={true}></Notification>
  );
}

export default NotificationMenuContent;
