import React from "react";
import {
  Hidden,
  withStyles,
  Theme,
  InputLabel,
  makeStyles,
  Container,
  Paper,
  Typography,
  Box,
} from "@material-ui/core";
import styles from "./Application.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import Tooltip from "@material-ui/core/Tooltip";
import { useRouter } from "next/router";

const downloadIcon = "/Download_Icon.svg";
const requestSentImg = "/Request_Sent.svg";
const cancelImg = "/W_Icons_X.svg";
const information = "/information.svg";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    left: 434,
    top: 188,
    width: 568,
    height: 369,
    X: 356,
    Y: 188,
    bottom: 243,
  },
});

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#001933",
    //   color: 'rgba(0, 0, 0, 0.87)',
    width: 207,
    height: 50,
    X: 629,
    Y: 200,
    objectFit: "contain",
    fontsize: "2rem",
    fontWeight: 200,
    //   visibility: "hidden",

    //   fontSize: theme.typography.pxToRem(12),
    //   border: '1px solid #dadde9',
  },
}))(Tooltip);

const ConfirmSubmit = (props: { history: any }): JSX.Element => {
  const router = useRouter();
  const redirectToLogin = (): void => {
    // props.history.push("/login/");
    router.push("/login");
  };

  const onFormSubmit = (): void => {
    // props.history.push("/submit/application/");
    router.push("/submit/application/");
  };

  const classes = useStyles();

  const redirectToForm = (): void => {
    // props.history.push("/registration/smartfleet/");
    router.push("/registration/smartfleet/");
  };
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
        className={`w-100 h-90 d-flex justify-content-around bd-highlight ${styles.parent}`}
      >
        <Paper className={`w-100 ${styles.headerPaper}`}>
          <CustomCard
            className={`w-100 d-flex flex-column ${styles.submitCard}`}
          >
            <Hidden xsDown>
              <img className="p-3" src={requestSentImg} alt="requestSentImg" />
            </Hidden>
            <div className="d-flex bd-highlight">
              <div
                className={`p-2 w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography className={`pl-2 ${styles.title}`} color="primary">
                  Application Submitted
                </Typography>
              </div>
            </div>
            <Typography className={`pt-5`}>
              <span className={`${styles.subLabel}`}>
                Application number 998766 has been submitted.
              </span>
            </Typography>
            <Typography className="pt-4">
              <span className={`${styles.subSpanLabel}`}>
                Request to visit nearby Bharat Petroleum Fuel Station and
                complete the payment.
              </span>
            </Typography>
            <Typography className="p-3">
              <span className={`${styles.subSpanLabel}`}>
                Post payment completion, Re-Login and enter the Transaction
                Reference Number{" "}
              </span>
              <p className={`${styles.subSpanLabel}`}>
                received at the Fuel Station to complete your enrolment.
              </p>
            </Typography>
            <div>
              <CustomButton
                color="primary"
                variant="contained"
                className={`font-weight-bold w-40 mr-4`}
                onClick={handleClickOpen}
              >
                UPDATE PAYMENT METHOD
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
                <div className={`d-flex flex-column `}>
                  <div
                    className={`d-flex flex-row pt-3 p-3 w-100 justify-content-between bd-highlight w-100`}
                  >
                    <img
                      src={cancelImg}
                      onClick={handleClose}
                      alt="cancelImg"
                      className={`${styles.noOpacity}`}
                    />

                    <Typography
                      className={`d-flex pt-3 ${styles.titlePayment}`}
                      color="primary"
                      variant="h5"
                    >
                      Update Payment
                    </Typography>
                    <img
                      className={`d-flex  pt-3 align-items-end cursor-pointer ${styles.iconColor}`}
                      onClick={handleClose}
                      src={cancelImg}
                      alt="cancelImg"
                    />
                  </div>
                  <DialogContent
                    className={`d-flex pr-5 pl-5 flex-column align-items-start`}
                  >
                    <InputLabel
                      className={`d-flex w-100 ${styles.formLabel}`}
                      color="primary"
                    >
                      <b> Amount Paid </b>
                    </InputLabel>
                    <CustomTextField
                      id="login"
                      placeholder="&#8377; 200"
                      variant="outlined"
                    ></CustomTextField>
                    <div
                      className={`d-flex flex-row align-items-between w-100`}
                    >
                      <InputLabel
                        className={`d-flex w-100 ${styles.formLabel}`}
                        color="primary"
                      >
                        <b>Transaction Reference No.</b>
                      </InputLabel>
                      <HtmlTooltip
                        enterTouchDelay={0}
                        disableFocusListener
                        title="Enter Transaction Refernce No. received at the Retail Outlet"
                        placement="left-start"
                      >
                        <img
                          className="pb-2"
                          src={information}
                          alt="information"
                        />
                      </HtmlTooltip>
                    </div>
                    <CustomTextField
                      id="login1"
                      placeholder="xxxxxxxxxxxxxx"
                      // masked="true"
                      variant="outlined"
                      className={`d-flex w-100`}
                    ></CustomTextField>
                  </DialogContent>
                  <div className={`d-flex flex-column align-items-center`}>
                    <DialogActions className={`d-flex align-items-center `}>
                      <CustomButton
                        onClick={onFormSubmit}
                        color="primary"
                        variant="contained"
                        className={`d-flex pt-2`}
                      >
                        Submit
                      </CustomButton>
                      <div></div>
                    </DialogActions>
                  </div>
                </div>
              </Dialog>
            </div>
            <Box
              className={`d-flex w-100 pt-4 mt-auto align-items-end ${styles.submitBox}`}
            >
              <CustomButton
                color="primary"
                variant="outlined"
                className={`ml-4 mr-auto`}
                onClick={() => redirectToLogin()}
              >
                BACK TO LOGIN
              </CustomButton>

              <CustomButton
                color="primary"
                variant="outlined"
                className={`mr-4 ${styles.btnStyle}`}
                onClick={() => redirectToForm()}
              >
                VIEW APPLICATION
              </CustomButton>
              <CustomButton
                color="primary"
                variant="contained"
                className={`mr-4 ${styles.btnEditStyle}`}
                startIcon={<img src={downloadIcon} alt="downloadIcon" />}
              >
                APPLICATION PDF
              </CustomButton>
            </Box>
          </CustomCard>
        </Paper>
      </Container>
    </>
  );
};

export default ConfirmSubmit;
