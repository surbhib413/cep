import classes from "*.module.css";
import { Dialog, DialogContent, Typography, Button } from "@material-ui/core";
import React from "react";
import styles from "../dialogs/Dialogs.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import { relative } from "path";
import translate from "src/i18n/translate";
import { Height } from "@material-ui/icons";
// import { useSelector } from "react-redux";
const Astronuat = "/w_illustrations_card-added-web.svg";
const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";
const approve = "/application_update_approve.svg";
const reject = "/application_update_reject.svg";

const useStyles = makeStyles({
  sucessMsg: {
    marginTop: "9.4%",
    width: "536px",
    height: "72px",
    backgroundColor: "#e5fff7",
    display: "flex",
  },
  mismatchMsg: {
    marginTop: "2.4%",
    width: "536px",
    height: "72px",
    backgroundColor: "#fff0f0",
    display: "flex",
  },
});

export const PinSetSuccessfulPopUp = (props: any) => {
  const { open, close, closeAndSubmit, title, description } = props;
  const classes = useStyles();
  const closeAndSubmitHandler = () => {
    closeAndSubmit();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm">
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-between">
          <img
            src={CancelIcon}
            alt=""
            className={`p-2 ${styles.noOpacity}`}
            onClick={close}
          />
          <Typography
            className={`px-4 px-sm-0 text-center ${styles.popStyles}`}
            variant="h5"
            color="primary"
          >
            {/* {title} */}
            PIN set successful
          </Typography>
          <img
            src={CancelIcon}
            alt=""
            className={`p-2 ${styles.cursorPointer}`}
            onClick={close}
          />
        </div>

        <img className="p-4" src={Astronuat} alt="AutranautImg" />

        <div className={classes.sucessMsg}>
          <span>
            <img src={approve} className={styles.approve}></img>{" "}
          </span>
          <span
            style={{
              marginTop: "4.7%",
              textIndent: "14px",
              fontFamily: "Open Sans",
              color: "#354463",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            PIN for 800 cards sucessfully set
          </span>
        </div>
        <div className={classes.mismatchMsg}>
          <span>
            <img src={reject} className={styles.reject}></img>{" "}
          </span>
          <span className={styles.textMsg}>
            PIN for 7 cards not set due to PIN mismatch
          </span>
        </div>

        <div className="w-100 pt-4 d-flex justify-content-center align-items-center">
          <span>
            <Button
              variant="outlined"
              color="primary"
              className={styles.custWBtn}
            >
              BACK TO CARD MANAGEMENT
            </Button>
          </span>
          <span>
            <Button
              variant="outlined"
              color="primary"
              className={styles.Submit}
            >
              BACK TO SET PIN
            </Button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
