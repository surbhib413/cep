import React, { useContext } from "react";
import { makeStyles, Typography, Hidden, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { CardsContext } from "./CardManagement";
import { CardsContextAddCard } from "src/pages/CAMCardManagement/AddCards/AddCards";
import { deleleteCards } from "src/lib/api/smartfleet/cardmanagement";
import { useDispatch } from "react-redux";
import styles from "./CardManagement.module.scss";
import { setLoader } from "src/redux/actions/actions";
import CustomSnackbar from "src/components/CustomSnackbar/CustomSnackbar";
const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";

const DeletePopUp = (props: any): JSX.Element => {
  const CARD_CONTEXT = props.navigationFlag
    ? useContext(CardsContext)
    : useContext(CardsContextAddCard);

  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [open, setOpen] = React.useState(true);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  /* ---------------------------------------------------- */
  const dispatch = useDispatch();
  //handler for confirm button

  const onFormSubmit = async () => {
    //check whether selceted card has fleetCardId or not. If yes then call api else delete card directly.
    if (
      props.cardFields.cards[props.selectedCardNumber - 1].fleetCardId !== null
    ) {
      const finalData = {
        fleetCardIds:
          props.cardFields.cards[props.selectedCardNumber - 1].fleetCardId,
        bulkUpload: false,
      };
      dispatch(setLoader(true));

      const res: any = await deleleteCards(finalData);
      if (res?.status === "success") {
        // props.resetCardDetails();
        CARD_CONTEXT.deleteCard(props.selectedCardNumber);
        console.log("Card deleted successfully.");
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.CARD_DELETE);
        setAlertType("success");
      } else {
        console.log("Error caught", res.errors);
        if (res?.errors) {
          res?.errors.forEach((element: any) => {
            if (element.hasOwnProperty("subject")) {
              if (element?.subject === "customerId") {
                setShowSnackbar(true);
                setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
                setAlertType("error");
              }
            }
          });
        } else {
          setShowSnackbar(true);
          //TODO Change and check with eknath if backend down
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      dispatch(setLoader(false));
    } else {
      //if card is not saved in database which is not have fleetcard id.
      CARD_CONTEXT.deleteCard(props.selectedCardNumber);
    }
  };

  //handler for cancel btn
  const handleClose = () => {
    CARD_CONTEXT.closeConfirmationBox();
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        // classes={{
        //   paper: classes.dialog,
        // }}
      >
        <DialogContent
          className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
        >
          <div className="w-100 d-flex bd-highlight align-items-center justify-content-between p-2 p-sm-0">
            <img
              src={CancelIcon}
              alt="CancelIcon"
              className={`${styles.noOpacity} `}
              onClick={handleClose}
            />
            <Typography
              className={`px-2 px-sm-5 mx-sm-5 text-center ${styles.popStyles} ${styles.dialogTitle}`}
              variant="h5"
              color="primary"
            >
              Are you sure you want to delete Card {props.selectedCardNumber}?
            </Typography>
            <img
              src={CancelIcon}
              alt="CancelIcon"
              className={`${styles.cursorPointer}`}
              onClick={handleClose}
            />
          </div>
          <img className="p-3 p-sm-4" src={WIconWarning} alt="requestSentImg" />

          <Typography className={`mx-2 px-sm-5 text-center`} variant="h6">
            Any details entered so far will be deleted.
          </Typography>

          {/* <div
              className={`d-flex pt-5 flex-column align-items-center justify-content-center`}
              id="alert-dialog-delete"
            >
              <Hidden smUp>
                <Typography className={`${styles.dialogMobileSubTitle}`}>
                  Any details entered so far will be deleted.
                </Typography>
              </Hidden>

              <Hidden xsDown>
                <Typography className={`${styles.dialogSubTitle}`}>
                  Are you sure you want to delete Card{" "}
                  {props.selectedCardNumber}? <br /> Any details entered so far
                  will be deleted.
                </Typography>
              </Hidden>
            </div> */}

          <div className="w-100 pt-4 d-flex justify-content-center align-items-center">
            <CustomButton
              onClick={handleClose}
              variant="outlined"
              color="primary"
              className={`${styles.backToEnrolmentBtn} mr-2 mx-sm-4`}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={onFormSubmit}
              variant="contained"
              color="primary"
              // className="mr-4"
            >
              Continue
            </CustomButton>
            <CustomSnackbar
              open={showSnackbar}
              close={setShowSnackbar}
              type={alertType}
              message={snackbarMessage}
            ></CustomSnackbar>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeletePopUp;
