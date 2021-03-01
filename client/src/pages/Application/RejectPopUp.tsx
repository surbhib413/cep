import React from "react";
import { makeStyles, Container, Typography, Box } from "@material-ui/core";
import styles from "./Application.module.scss";

import { CustomButton } from "../../components/CustomButton/CustomButton";

import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";

const cancelImg = "/W_Icons_X.svg";
const W_Illustrations_Rejected_icon = "/W_Illustrations_Rejected_icon.svg";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    left: 328,
    top: 210,
    width: 624,
    height: 413,
    X: 328,
    Y: 210,
  },
});

const RejectPopUp = (props: { history: any }): JSX.Element => {
  // const redirectToLogin = (): void => {
  //   props.history.push("/login/");
  // };

  // const onFormSubmit = (): void => {
  //   props.history.push("/submit/application/");
  // };

  const classes = useStyles();

  // const redirectToForm = (): void => {
  //   props.history.push("/registration/smartfleet/");
  // };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container
        maxWidth="xl"
        className={`w-100 d-flex justify-content-around bd-highlight ${styles.parent}`}
      >
        <CustomButton
          color="primary"
          variant="contained"
          className={`text-align-center font-weight-bold w-40 mr-4`}
          onClick={handleClickOpen}
        >
          Click here to test
        </CustomButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          classes={{
            paper: classes.dialog,
          }}
        >
          <div
            className={`d-flex flex-column justify-content-center align-items-center`}
          >
            <div
              className={`d-flex flex-row pt-3 p-3 w-100 justify-content-between bd-highlight w-100`}
            >
              <img
                className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos} ${styles.noOpacity}`}
                src={cancelImg}
                onClick={handleClose}
                alt="cancelImg"
              />

              <Typography
                className={`d-flex pt-3 ${styles.titlePayment}`}
                color="primary"
                variant="h5"
              >
                Payment request Rejected
              </Typography>
              <img
                className={`d-flex  pt-2 mr-2 align-items-end cursor-pointer ${styles.iconColor}`}
                onClick={handleClose}
                src={cancelImg}
                alt="cancelImg"
              />
            </div>
            <DialogContent
              className={`d-flex flex-column align-items-center pt-2 justify-content-center`}
            >
              <img
                className={`d-flex pt-1 align-items-center`}
                src={W_Illustrations_Rejected_icon}
                alt=""
              />

              <div className="p-3">
                <Box
                  className={`d-flex pt-4 pl-3 flex-column w-100 justify-content-center align-items-center `}
                  color="text.primary"
                  fontSize="h6.fontSize"
                  fontWeight={600}
                >
                  Your payment via ‘Pay Fees at Fuel Station’ using
                  <span
                    className={`d-flex align-items-center ustify-content-center`}
                  >
                    Cash / EDC has been rejected.
                  </span>
                </Box>

                <Box
                  className={`d-flex pt-4 pl-3 flex-column w-100 justify-content-center align-items-center `}
                  color="text.secondary"
                  fontSize="h6.fontSize"
                >
                  Resubmit the form by entering a correct reference no.{" "}
                  <span
                    className={`d-flex align-items-center ustify-content-center`}
                  >
                    or use an alternate payment method
                  </span>
                </Box>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      </Container>
    </>
  );
};

export default RejectPopUp;
