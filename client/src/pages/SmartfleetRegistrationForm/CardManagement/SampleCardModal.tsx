import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import styles from "./CardManagement.module.scss";
import { CardsContextAddCard } from "src/pages/CAMCardManagement/AddCards/AddCards";
import { CardsContext } from "./CardManagement";

const cancelImg = "/W_Icons_X_white.svg";
const SampleCardImage = "/SampleCardImg.png";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
});

const SampleCardModal = (props: any): JSX.Element => {
  const classes = useStyles();


  const CARD_CONTEXT = props.navigationFlag ? useContext(CardsContext) : useContext(CardsContextAddCard);
  const sampleCardUrl =
    CARD_CONTEXT.urlForTemplates.sampleCardURL;

  const finalUrl =
    process.env.NEXT_PUBLIC_API_URL_BE + sampleCardUrl;

  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [open, setOpen] = React.useState(true);
  /* ---------------------------------------------------- */
 
  // handler to close confirm box
  const handleClose = () => {
    props.closeSampleCardPopUp();
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-switchpopup"
        classes={{
          paper: classes.dialog,
        }}
        // fullWidth
      >
        <DialogContent>
          <div
            className={`d-flex pt-5 flex-column align-items-center justify-content-center`}
            id="alert-dialog-switchpopup"
          >
            <img
              className={`${styles.iconColor}`}
              onClick={handleClose}
              src={cancelImg}
              alt="cancelImg"
            />
            
            <img src={finalUrl} alt="sample-card" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleCardModal;
