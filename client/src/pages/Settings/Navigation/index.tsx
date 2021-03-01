import React, { useEffect, useState } from "react";
import { Container, FormControlLabel, Grid, Hidden, Paper, Radio, Typography } from "@material-ui/core";
import styles from "./Navigation.module.scss";
import { useRouter } from "next/router";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const IconUser = "/W_Icon_User.svg"
const IconProfile = "/W_My_Profile.svg"
const IconAuthorisedSignatory = "/W_Authorised_Signatory.svg"
const IconAddress = "/W_Address.svg"
const IconBusinessInfo = "/W_Business_Info.svg"
const IconSubUsers = "/W_Sub_Users.svg"
const IconRelationshipOfficer = "/W_Relationship_Officer.svg"
const IconNext = "/Next_Icon.svg"

const lhsTabs = [
  {
    title: "My Profile",
    subtitle: "User Name, Mobile No...",
    icon: IconProfile,
    path: '/settings/myprofile'
  },
  {
    title: "Authorised Signatory",
    subtitle: "User Name, Mobile No...",
    icon: IconAuthorisedSignatory,
    path: '/settings/authorisedsignatory'
  },
  {
    title: "Address",
    subtitle: "Registered, Corresponding…",
    icon: IconAddress,
    path: '/settings/address'
  },
  {
    title: "Business Information",
    subtitle: "Business Type, Operation…",
    icon: IconBusinessInfo,
    path: '/settings/businessinformation'
  },
  {
    title: "Sub Users",
    subtitle: "Name, Designation, Mobile…",
    icon: IconSubUsers,
    path: '/settings/subusers'
  },
  {
    title: "BPCL Relationship Officer",
    subtitle: "Name, Designation, Mobile…",
    icon: IconRelationshipOfficer,
    path: '/settings/bpclrelationshipofficer'
  }
]

const Navigation = (props: any): JSX.Element => {
  const router = useRouter();

  const navClick = (path: any) => {
    if (props.isInputEdited) {
      props.setShowSnackbar(true);
      props.setSnackbarMessage(SnackbarMessage.UNSAVED_DATA_ON_TAB_CHANGE);
      props.setAlertType("error");
    } else {
      if (props.isMobile && path === '/settings/myprofile') {
        props.setMobShowTabContent(true);
      } else {
        router.push(path);
      }
    }

  }

  return (
    <div>
      {
        lhsTabs.map((tab, index) => {
          let initialClass = { activeParent: '', activeChild: '' };
          let activeClass;
          if (props.isMobile && tab.path === '/settings/myprofile') {
            activeClass = initialClass
          } else {
            activeClass = (router.pathname.toString() === tab.path.toString()) ?
              { activeParent: styles.activeParent, activeChild: styles.activeChild } : initialClass;
          }

          return (
            <div className={`${styles.singleNav} ${activeClass.activeParent}`} key={index}
              onClick={() => navClick(tab.path)}
            >
              {/* <div className={`${styles.singleNav} ${activeClass.activeParent}`} key={index}
              onClick={() => (router.pathname.toString() === tab.path.toString() || props.isModified) ? props.mobile() : router.push(tab.path)}
            > */}
              <div className={`${styles.iconBox}`}>
                <img
                  className={`${styles.iconUser}`}
                  src={tab.icon}
                  alt=""
                />
              </div>
              <div>
                <Typography className={`${styles.title} ${activeClass.activeChild}`}>{tab.title}</Typography>
                <Typography className={`${styles.subtitle}`}>{tab.subtitle}</Typography>
              </div>
              <img
                className={`${styles.iconNext}`}
                src={IconNext}
                alt=""
              />
            </div>
          )
        })
      }
    </div>
  );
};

export default Navigation;