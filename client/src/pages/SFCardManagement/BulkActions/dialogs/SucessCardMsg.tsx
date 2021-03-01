import { Dialog, DialogContent, Typography, Button } from "@material-ui/core";
import React from "react";
import styles from "../dialogs/Dialogs.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { setCardsForBulkAction } from "../../../../redux/SmartFleet/SFCardManagement/CardManagementAction";
import { useRouter } from "next/router";

// import { useSelector } from "react-redux";
const Astronuat = "/w_illustrations_card-added-web.svg";
const CancelIcon = "/Cancel_Icon.svg";
const pending = "/application_update_pending.svg";

const useStyles = makeStyles({
  sucessMsg: {
    backgroundColor: "#fff9e6",
    fontFamily: "Open Sans",
    fontSize: "14px",
    paddingBottom: "1rem"
  },
});

export const SucessCardMsg = (props: any) => {
  const {
    open,
    close,
    closeAndSubmit,
    BackToCardManagement,
    successMessage,
    failedMessage,
    failedCards,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = () => {
    const fleetCardIds = failedCards.map((value: any, index: number) => {
      return value.fleetCardId;
    });
    if(fleetCardIds.length){
      dispatch(setCardsForBulkAction(fleetCardIds));
    }
    router.push("/sfcardmanagement/BulkActivation");
    closeAndSubmit();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm" disableBackdropClick disableEscapeKeyDown>
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-between">
          <Typography
            className={`px-2 px-sm-0 text-center ${styles.popStyles}`}
            variant="h5"
            color="primary"
          >
            {/* {title} */}
            {successMessage}
          </Typography>
        </div>

        <img className="p-4" src={Astronuat} alt="AutranautImg" />
        {
          failedMessage.length > 0 ?
            <div className={classes.sucessMsg}>
              <img src={pending} className={styles.errorIcon}></img>
              <span className={styles.not}>Note</span>
              {failedMessage.map((value: any, index: number) => {
                return (
                  <Typography className={`${styles.limitMsg}`} key={index}>{value}</Typography>
                );
              })}
            </div>
          : null
        }
        
        <div className="w-100 pt-4 pb-2 d-flex justify-content-center align-items-center">
          <span>
            <Button
              variant="outlined"
              color="primary"
              className={styles.custWBtn}
              onClick={BackToCardManagement}
            >
              BACK TO CARD MANAGEMENT
            </Button>
          </span>
          {
            failedMessage.length > 0 ?
              <span>
                <Button
                  variant="outlined"
                  color="primary"
                  className={styles.Submit}
                  onClick={handleSubmit}
                >
                  BACK TO SET CARD LIMIT
                </Button>
              </span>
            : null  
          }
          
        </div>
      </DialogContent>
    </Dialog>
  );
};
