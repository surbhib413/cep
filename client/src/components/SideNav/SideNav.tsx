import React from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import styles from "./SideNav.module.scss";

const credit_blue = "/W_Icon_Credit Mgmnt_blue.svg";
const creditCardImg = "/dealer_credit_Img.svg";
const reportsImg = "/dealer_reports_Img.svg";
const reports_blue = "/file-text_reports_blue.svg";
const help_blue = "/help-circle_blue.svg";
const helpImg = "/dealer_help_Img.svg";
const logout_blue = "/W_Icon_logout_blue.svg";
const logoutImg = "/dealer_logout_Img.svg";
const dashboard_blue = "/W_Icon_dashboard_blue.svg";
const dashboardImg = "/dealer_dashboard_Img.svg";
const feedback_blue = "/W_Icons_Complaints_blue.svg";
const feedbackImg = "/dealer_feedback_Img.svg";
const settingsImg = "/dealer_settings_Img.svg";
const settingsImg_blue = "/W_Icon_SettingsBlue.svg";
const serviceRequestImg = "/headphones.svg";
const serviceRequestImg_blue = "/W_Icons_Service RequestsBlue.svg";
const userImg = "/W_Icon_User.svg";
const userImg_blue = "/userBlue.svg";
const wallet_blue = "/w_icon_wallet (blue).svg";
const wallet_white = "/w_icon_wallet-grey.svg";

// Custom Styles for material UI
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerContainer: {
      overflow: "auto",
    },
    listItem1: {
      backgroundColor: "#e5f0fc",
    },
    listItem2: {
      color: "#0369dd",
    },
    listItem: {
      backgroundColor: "#0369dd",
    },
    listItemText: {
      paddingLeft: "1.5rem",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    listItemIcon: {
      minWidth: "auto",
      marginRight: "12px",
    },
  })
);

const CustomDrawer = withStyles({
  root: {
    "& .MuiDrawer-paper": {
      position: "inherit",
      zIndex: 0,
    },
  },
})(Drawer);

const sidenavData = [
  {
    index: 0,
    key: "Dashboard",
    dataIndexId: "sidenav-dashboard",
    icon_blue: dashboard_blue,
    icon_white: dashboardImg,
    alt: "dashboard",
    primary: "Dashboard",
  },
  {
    index: 1,
    key: "Credit Management",
    dataIndexId: "sidenav-cardMgmt",
    icon_blue: credit_blue,
    icon_white: creditCardImg,
    alt: "credit",
    primary: "Credit Management",
  },
  {
    index: 2,
    key: "Employee Account Management",
    dataIndexId: "sidenav-employeeMgmt",
    icon_blue: userImg_blue,
    icon_white: userImg,
    alt: "employee",
    primary: "Employee Account Management",
  },
  {
    index: 3,
    key: "Card Management",
    dataIndexId: "sidenav-cardMgmt",
    icon_blue: wallet_blue,
    icon_white: wallet_white,
    alt: "card",
    primary: "Card Management",
  },
  {
    index: 4,
    key: "Service Requests",
    dataIndexId: "sidenav-serviceReq",
    icon_blue: serviceRequestImg_blue,
    icon_white: serviceRequestImg,
    alt: "service",
    primary: "Service Requests",
  },
  {
    index: 5,
    key: "Reports & Forms",
    dataIndexId: "sidenav-reports",
    icon_blue: reports_blue,
    icon_white: reportsImg,
    alt: "reports",
    primary: "Reports & Forms",
  },
  {
    index: 6,
    key: "Complaints & Feedback",
    dataIndexId: "sidenav-complaints",
    icon_blue: feedback_blue,
    icon_white: feedbackImg,
    alt: "complaints",
    primary: "Complaints & Feedback",
  },
  {
    index: 7,
    key: "Settings",
    dataIndexId: "sidenav-settings",
    icon_blue: settingsImg_blue,
    icon_white: settingsImg,
    alt: "settings",
    primary: "Settings",
  },
  {
    index: 8,
    key: "Help",
    dataIndexId: "sidenav-help",
    icon_blue: help_blue,
    icon_white: helpImg,
    alt: "help",
    primary: "Help",
  },
];

const SideNav = (props: any): JSX.Element => {
  const { sidenavOpen } = props;
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(3);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  return (
    <React.Fragment>
      <CustomDrawer
        open={sidenavOpen !== undefined ? sidenavOpen : true}
        className={`${
          sidenavOpen === undefined ? "" : !sidenavOpen && styles.displayNone
        }`}
        variant="persistent"
      >
        <div className={classes.drawerContainer}>
          <List>
            {sidenavData.map((item, index) => {
              return (
                <ListItem
                  button
                  key={item.key}
                  data-test-id={item.dataIndexId}
                  className={
                    selectedIndex === item.index ? classes.listItem1 : ""
                  }
                  selected={selectedIndex === item.index}
                  onClick={(event) => handleListItemClick(event, item.index)}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <img
                      src={
                        selectedIndex === item.index
                          ? item.icon_blue
                          : item.icon_white
                      }
                      alt={item.alt}
                    ></img>
                  </ListItemIcon>
                  <ListItemText
                    className={
                      selectedIndex === item.index ? classes.listItem2 : ""
                    }
                    primary={item.primary}
                  />
                </ListItem>
              );
            })}
          </List>
          <Divider className={`mt-5`} />
          <List>
            <ListItem
              button
              key="Logout"
              data-test-id="sidenav-logout"
              className={selectedIndex === 9 ? classes.listItem1 : ""}
              selected={selectedIndex === 9}
              onClick={(event) => handleListItemClick(event, 9)}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {" "}
                <img
                  src={selectedIndex === 9 ? logout_blue : logoutImg}
                  alt="logoutImg"
                ></img>
              </ListItemIcon>
              <ListItemText
                className={selectedIndex === 9 ? classes.listItem2 : ""}
                primary="Logout"
              />
            </ListItem>
          </List>
        </div>
      </CustomDrawer>
    </React.Fragment>
  );
};

export default SideNav;
