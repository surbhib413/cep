import React from "react";
import styles from "./Header.module.scss";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Badge,
  Hidden,
} from "@material-ui/core";
import {
  ExpandMore,
  NotificationsOutlined,
  AccountCircleOutlined,
  Menu,
} from "@material-ui/icons";
import { CustomMenu, CustomMenuItem } from "../CustomMenu/CustomMenu";
import {
  CustomNotificationMenu,
  CustomNotificationMenuItem,
} from "../CustomNotificationMenu/CustomNotificationMenu";
import { LOCALES } from "../../i18n";
import { useDispatch, useSelector } from "react-redux";
import Notification from "src/pages/Notification/Notification";
import {
  setLanguage,
  setLoader,
  resetStore,
} from "../../redux/actions/actions";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";
import { postSignout } from "src/lib/api/signin/signin";
import { callSignOut, isUserAuthunticated } from "src/lib/auth/helper";

const BrandHeaderLogo = "/Brand_Header_Logo.svg";
const PetrolPumpIcon = "/W_Icon_Header_PetrolPump.svg";
const LanguageIcon = "/W_Icon_Header_Language.svg";
const HelpIcon = "/W_Icon_Header_Help.svg";
const SearchIcon = "/Icon_Search.svg";

const Header = (props: any) => {
  const router = useRouter();
  const store: any = useSelector((state) => state);
  const { toggleSidenavOpen } = props;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    notificationAnchorEl,
    setNotificationAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const [
    languageAnchorEl,
    setLanguageAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const cookies = new Cookies();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setLanguageAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleLanguage = (language: string) => {
    console.log("SELECTED LANGUAGE IS", language);
    setLanguageAnchorEl(null);
    dispatch(setLanguage(language));
    setLanguageAnchorEl(null);
  };

  const signOut = async () => {  
    dispatch(setLoader(true));
    const res: any = await callSignOut();    
    console.log("Signout", res);
    if (res) {
      console.log("Signout successfully.");
    } else {      
      console.log("Signout not done");      
      setShowSnackbar(true);
      setSnackbarMessage("Something went wrong");
      setAlertType("error");
    }    
    dispatch(setLoader(false));
  };

  return (
    <AppBar position="sticky" className={styles.appBarContainer}>
      <Toolbar className="justify-content-between py-1">
        <Hidden smUp>
          <Menu onClick={toggleSidenavOpen} />
        </Hidden>
        <Hidden xsDown>
          <img src={BrandHeaderLogo} alt="bpcl logo"></img>
        </Hidden>
        <div className="d-flex align-items-center">
          <div
            className={`d-flex align-items-center mx-3 ${styles.searchContainer}`}
          >
            <img src={SearchIcon} alt="Search Icon"></img>
            <Hidden xsDown>
              <InputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                className={styles.searchTextInput}
              />
            </Hidden>
          </div>
          <Hidden xsDown>
            <div
              aria-controls="fuel-and-services-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className={`d-flex align-items-center mx-3 ${styles.FuelServicesMenuContainer}`}
            >
              <img src={PetrolPumpIcon} alt="Fuel and services"></img>
              <Typography className={`mx-2`}>Fuel & Services</Typography>
              <ExpandMore />
            </div>
            <CustomMenu
              id="fuel-and-services-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <CustomMenuItem>Item 1</CustomMenuItem>
              <CustomMenuItem>Item 2</CustomMenuItem>
              <CustomMenuItem>Item 3</CustomMenuItem>
            </CustomMenu>

            <div
              aria-controls="language-menu"
              aria-haspopup="true"
              onClick={handleLanguageClick}
              className={`d-flex align-items-center mx-3 ${styles.LanguageMenuContainer} ${styles.cursorPointer} `}
            >
              <img src={LanguageIcon} alt="Language"></img>
              <Typography className={`mx-2`}>Language</Typography>
              <ExpandMore />
            </div>
            <CustomMenu
              id="language-menu"
              anchorEl={languageAnchorEl}
              keepMounted
              open={Boolean(languageAnchorEl)}
              onClose={handleClose}
            >
              <CustomMenuItem onClick={() => handleLanguage(LOCALES.ENGLISH)}>
                English
              </CustomMenuItem>
              <CustomMenuItem onClick={() => handleLanguage(LOCALES.FRENCH)}>
                French
              </CustomMenuItem>
              <CustomMenuItem onClick={() => handleLanguage(LOCALES.GERMAN)}>
                German
              </CustomMenuItem>
              <CustomMenuItem onClick={() => handleLanguage(LOCALES.HINDI)}>
                Hindi
              </CustomMenuItem>
            </CustomMenu>

            <div
              aria-controls="help-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className={`d-flex align-items-center mx-3 ${styles.HelpMenuContainer}`}
            >
              <img src={HelpIcon} alt="Help"></img>
              <Typography className={`mx-2`}>Help</Typography>
              <ExpandMore />
            </div>
            <CustomMenu
              id="help-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <CustomMenuItem>Item 1</CustomMenuItem>
              <CustomMenuItem>Item 2</CustomMenuItem>
              <CustomMenuItem>Item 3</CustomMenuItem>
            </CustomMenu>
          </Hidden>

          {/*---------------- Notification Menu---------------------- */}
          <div
            onClick={handleNotificationClick}
            className={styles.cursorPointer}
          >
            <Badge
              className="mx-3"
              badgeContent={2}
              color="secondary"
              overlap="circle"
              aria-controls="notification-menu"
              aria-haspopup="true"
            >
              <NotificationsOutlined />
            </Badge>
          </div>
          <CustomNotificationMenu
            id="notification-menu"
            anchorEl={notificationAnchorEl}
            keepMounted
            open={Boolean(notificationAnchorEl)}
            onClose={handleClose}
          >
            <div
              className={`w-100 ${styles.noOutline} ${styles.notificationPopupPosition}`}
            >
              <Notification
                handleClose={handleClose}
                showAsMenu={true}
              ></Notification>
            </div>
          </CustomNotificationMenu>
          {/*---------------- Notification Menu---------------------- */}

          <div
            aria-controls="fuel-and-services-menu"
            aria-haspopup="true"
            onClick={handleClick}
            className={`d-flex align-items-center ml-3 ${styles.HelpMenuContainer}`}
          >
            <AccountCircleOutlined />
            <ExpandMore />
          </div>
          <CustomMenu
            id="fuel-and-services-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <CustomMenuItem>Item 1</CustomMenuItem>
            <CustomMenuItem>Item 2</CustomMenuItem>
            <CustomMenuItem>Item 3</CustomMenuItem>
          </CustomMenu>
          {typeof window !== "undefined" ? (
            // localStorage.getItem('mark_one') && localStorage.getItem('mark_two') ?
            isUserAuthunticated() ? (
              <div onClick={signOut} className={`${styles.cursorPointer}`}>
                <Typography className={`mx-2`}>Sign out</Typography>
              </div>
            ) : null
          ) : null}
        </div>
      </Toolbar>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </AppBar>
  );
};

export default Header;
