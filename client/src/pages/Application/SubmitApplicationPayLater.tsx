import React, { useState } from "react";
import {
  Hidden,
  withStyles,
  Theme,
  InputLabel,
  makeStyles,
  Container,
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
import { useSelector, useDispatch } from "react-redux";
import { unsetAssistedFlow } from "../../redux/actions/actions";
import { CustomInputAdornment } from "../../components/CustomTextField/CustomInputAdorment";
import { useRouter } from "next/router";

const downloadIcon = "/Download_Icon.svg";
const requestSentImg = "/Request_Sent.svg";
const requestSentMobileImg = "/Request_Sent_Mobile_Img.svg";
const cancelImg = "/W_Icons_X.svg";
const information = "/information.svg";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
  },
});

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#001933",
    //   color: 'rgba(0, 0, 0, 0.87)',
    width: 207,
    height: 80,
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

const SubmitApplicationPayLater = (props: { history: any }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);

  const redirectToLogin = (): void => {
    router.push("/login/");
  };

  const onFormSubmit = (): void => {
    router.push("/submit/enrolsuccess/");
  };

  const redirectToServiceRequests = () => {
    dispatch(unsetAssistedFlow());
    router.push("/service-requests");
  };

  const classes = useStyles();

  const redirectToForm = (): void => {
    router.push("/registration/smartfleet/");
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [amountToBePaid] = useState("200");

  return (
    <>
      <Hidden smUp>
        <Container
          maxWidth="xl"
          className={`p-0 w-100 d-flex flex-column justify-content-around bd-highlight ${styles.parent}`}
        >
          <CustomCard
            className={`w-100 d-flex flex-column ${styles.submitCard}`}
          >
            <div className="d-flex bd-highlight">
              <div
                className={`w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography className={`pl-2 ${styles.title}`} color="primary">
                  {store.assistedFlow ? "Customer's" : ""} Application Submitted
                </Typography>
              </div>
            </div>
            <div className={`d-flex justify-content-center align-items-center mt-4`}>
            <img
              className="p-3"
              src={requestSentMobileImg}
              alt="requestSentImg"
            />
            </div>
            <Typography className={`pt-4`}>
              <span className={`${styles.mobileSubLabel} ${styles.bold}`}>
                {store.assistedFlow ? "Customer's" : ""} Application number{" "}
                {store.smartFleetApplicationNumber} has been submitted.
              </span>
            </Typography>
            <Typography className="pt-4">
              <span className={`${styles.mobileSubSpanLabel}`}>
                Request {store.assistedFlow ? "them" : "you"} to visit nearby
                Bharat Petroleum Fuel Station and complete the payment.
              </span>
            </Typography>
            {store.assistedFlow ? (
              <Typography className="p-3 d-flex flex-column">
                <span className={`${styles.mobileSubSpanLabel}`}>
                  Update the payment details to successfully{" "}
                </span>
                <span className={`${styles.mobileSubSpanLabel}`}>
                  complete your enrolment
                </span>
              </Typography>
            ) : (
              <Typography className="p-3 d-flex flex-column">
                <span className={`${styles.mobileSubSpanLabel}`}>
                  Kindly sign in again and enter the Transaction Reference
                  Number received{" "}
                </span>
                <span className={`${styles.mobileSubSpanLabel}`}>
                  at the Fuel Station to complete your enrolment.
                </span>
              </Typography>
            )}
            <div>
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitpaylater-updatepayment"
                  variant="contained"
                  className={`font-weight-bold w-40 mt-1`}
                  onClick={handleClickOpen}
                >
                  UPDATE PAYMENT DETAILS
                </CustomButton>
              ) : (
                <CustomButton
                  color="primary"
                  id="submitpaylater-updatepayment"
                  variant="contained"
                  className={`font-weight-bold w-40 mt-1`}
                  onClick={handleClickOpen}
                >
                  UPDATE PAYMENT METHOD
                </CustomButton>
              )}
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
                <div className={`d-flex flex-column justify-content-between`}>
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
                      Update Payment {store.assistedFlow ? "Details" : ""}
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
                      <b> Fees to be paid </b>
                    </InputLabel>
                    <CustomTextField
                      disabled
                      id="submitpaylater-updatepayment-feetopay"
                      value={amountToBePaid}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <CustomInputAdornment position="start">
                            &#8377;
                          </CustomInputAdornment>
                          // <InputAdornment position="end">₹</InputAdornment>
                        ),
                      }}
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
                        title="The transaction reference number received for making the payment for the SmartFleet registration at the fuel station"
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
                      id="submitpaylater-updatepayment-transactionnum"
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
                        id="submitpaylater-updatepayment-submit"
                        variant="contained"
                        className={`d-flex pt-2 mb-2`}
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
              className={`d-flex flex-column pt-4 mt-auto align-items-center justify-content-center`}
            >
              <CustomButton
                color="primary"
                id="submitpaylater-applicationpdf"
                variant="contained"
                className={`w-100`}
                startIcon={<img src={downloadIcon} alt="downloadIcon" />}
              >
                APPLICATION PDF
              </CustomButton>
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitpaylater-reviewapplication"
                  variant="outlined"
                  className={`w-100 mt-3`}
                  onClick={() => redirectToForm()}
                >
                  REVIEW APPLICATION
                </CustomButton>
              ) : (
                <CustomButton
                  color="primary"
                  id="submitpaylater-editapplication"
                  variant="outlined"
                  className={`w-100 mt-3`}
                  onClick={() => redirectToForm()}
                >
                  EDIT APPLICATION
                </CustomButton>
              )}
              <div
                className={`d-flex align-items-start justify-content-start pt-0`}
              >
                {store.assistedFlow ? (
                  <span
                    className={`mt-3 ${styles.mobileBackToLoginLabel}`}
                    onClick={() => redirectToServiceRequests()}
                    id="submitpaylater-servicerequest"
                  >
                    BACK TO SERVICE REQUESTS
                  </span>
                ) : (
                  <span
                    className={`mt-3 ${styles.mobileBackToLoginLabel}`}
                    onClick={() => redirectToLogin()}
                    id="submitpaylater-signin"
                  >
                    BACK TO SIGN IN
                  </span>
                )}
              </div>
            </Box>
          </CustomCard>
        </Container>
      </Hidden>
      <Hidden xsDown>
        <Container
          maxWidth="xl"
          className={`w-100 d-flex flex-column justify-content-around bd-highlight ${styles.parent}`}
        >
          <CustomCard
            className={`w-100 d-flex flex-column ${styles.submitCard}`}
          >
            <div className={`d-flex justify-content-center align-items-center mt-4`}>
            <img className="p-3" src={requestSentImg} alt="requestSentImg" />
            </div>
            <div className="d-flex bd-highlight">
              <div
                className={`p-2 w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography className={`pl-2 ${styles.title}`} color="primary">
                  {store.assistedFlow ? "Customer's" : ""} Application Submitted
                </Typography>
              </div>
            </div>
            <Typography className={`pt-5`}>
              <span className={`${styles.subLabel}`}>
                {store.assistedFlow ? "Customer's" : ""} Application number{" "}
                {store.smartFleetApplicationNumber} has been submitted.
              </span>
            </Typography>
            <Typography className="pt-4">
              <span className={`${styles.subSpanLabel}`}>
                Request {store.assistedFlow ? "them" : "you"} to visit nearby
                Bharat Petroleum Fuel Station and complete the payment.
              </span>
            </Typography>
            {store.assistedFlow ? (
              <Typography className="p-3 d-flex flex-column">
                <span className={`${styles.subSpanLabel}`}>
                  Update the payment details to successfully{" "}
                </span>
                <span className={`${styles.subSpanLabel}`}>
                  complete your enrolment
                </span>
              </Typography>
            ) : (
              <Typography className="p-3 d-flex flex-column">
                <span className={`${styles.subSpanLabel}`}>
                  Kindly sign in again and enter the Transaction Reference
                  Number received{" "}
                </span>
                <span className={`${styles.subSpanLabel}`}>
                  at the Fuel Station to complete your enrolment.
                </span>
              </Typography>
            )}
            <div>
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitpaylater-updatepayment"
                  variant="contained"
                  className={`font-weight-bold w-40 mb-2`}
                  onClick={handleClickOpen}
                >
                  UPDATE PAYMENT DETAILS
                </CustomButton>
              ) : (
                <CustomButton
                  color="primary"
                  id="submitpaylater-updatepayment"
                  variant="contained"
                  className={`font-weight-bold w-40 mb-2`}
                  onClick={handleClickOpen}
                >
                  UPDATE PAYMENT METHOD
                </CustomButton>
              )}
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
                <div className={`d-flex flex-column justify-content-between`}>
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
                      Update Payment {store.assistedFlow ? "Details" : ""}
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
                      <b> Fees to be paid </b>
                    </InputLabel>
                    <CustomTextField
                      disabled
                      id="submitpaylater-updatepayment-feetopay"
                      value={amountToBePaid}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <CustomInputAdornment position="start">
                            &#8377;
                          </CustomInputAdornment>
                        ),
                      }}
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
                        title="The transaction reference number received for making the payment for the SmartFleet registration at the fuel station"
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
                      id="submitpaylater-updatepayment-transactionnum"
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
                        id="submitpaylater-updatepayment-submit"
                        variant="contained"
                        className={`d-flex pt-2 mb-2`}
                      >
                        Submit
                      </CustomButton>
                    </DialogActions>
                  </div>
                </div>
              </Dialog>
            </div>
            <Box
              className={`d-flex w-100 pt-4 mt-auto align-items-end ${styles.submitBox}`}
            >
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitpaylater-servicerequest"
                  variant="outlined"
                  className={`ml-4 mr-auto`}
                  onClick={() => redirectToServiceRequests()}
                >
                  BACK TO SERVICE REQUESTS
                </CustomButton>
              ) : (
                <CustomButton
                  color="primary"
                  id="submitpaylater-signin"
                  variant="outlined"
                  className={`ml-4 mr-auto`}
                  onClick={() => redirectToLogin()}
                >
                  BACK TO SIGN IN
                </CustomButton>
              )}
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitpaylater-reviewapplication"
                  variant="outlined"
                  className={`mr-4 ${styles.btnStyle}`}
                  onClick={() => redirectToForm()}
                >
                  REVIEW APPLICATION
                </CustomButton>
              ) : (
                <CustomButton
                  color="primary"
                  id="submitpaylater-editapplication"
                  variant="outlined"
                  className={`mr-4 ${styles.btnStyle}`}
                  onClick={() => redirectToForm()}
                >
                  EDIT APPLICATION
                </CustomButton>
              )}
              <CustomButton
                color="primary"
                id="submitpaylater-applicationpdf"
                variant="contained"
                className={`mr-4 ${styles.btnEditStyle}`}
                startIcon={<img src={downloadIcon} alt="downloadIcon" />}
              >
                APPLICATION PDF
              </CustomButton>
            </Box>
          </CustomCard>
        </Container>
      </Hidden>
    </>
  );
};

export default SubmitApplicationPayLater;
