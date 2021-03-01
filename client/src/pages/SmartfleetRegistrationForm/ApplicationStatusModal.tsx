import React, { useEffect, useState } from "react";
import { Modal, makeStyles, Box, Fade, Grid } from "@material-ui/core";
import styles from "./SmartfleetRegistrationForm.module.scss";

const ApplicationUpdateImage = "/application_update_icon.svg";
const CancelIcon = "/Cancel_Icon.svg";
const ApplicationUpdateApproveIcon = "/application_update_approve.svg";
const ApplicationUpdatePendingIcon = "/application_update_pending.svg";
const ApplicationUpdateRejectIcon = "/application_update_reject.svg";

const useStyles = makeStyles(() => ({
  modalPos: {
    display: "flex",
    alignItems: "center",
    //justifyContent: "center",
  },
}));

const ApplicationStatus = (props: any): JSX.Element => {
  const { open, onClose } = props;
  const classes = useStyles();
  const [paymentType, setPaymentType] = useState<string>("");
  const [kycStatus, setKycStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  //Integrate backend logic here to get the application payment and kyc status
  useEffect(() => {
    setPaymentType("feePaidAtRO"); /* feePaidAtRO, feePaidAlready, feeWaiver */
    setKycStatus("pending"); /* pending, rejected, approved, NA */
    setPaymentStatus("rejected"); /* rejected, approved, NA */
  }, []);

  // if (paymentStatus && kycStatus) {
  //   props.history.push("/submit/enrolsuccess");
  // }

  const applicationStatus = (
    <Grid container className={`justify-content-around`}>
      <div
        className={`d-flex align-items-center justify-content-center ${styles.modal}`}
      >
        <div className={`w-80`}>
          <div
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={onClose}
          >
            <img src={CancelIcon} alt="" />
          </div>
          <Box
            className="px-5"
            color="#0257a3"
            fontSize="h5.fontSize"
            fontWeight={600}
          >
            Application Update
          </Box>
          <img
            className="p-3"
            src={ApplicationUpdateImage}
            alt="ApplicationUpdateIcon"
          />
          <div>
            <Grid item className="p-2">
              {paymentStatus === "approved" ? (
                <div className={`${styles.approvedBackground} d-flex p-2`}>
                  <div className="p-2">
                    <img
                      src={ApplicationUpdateApproveIcon}
                      alt="approvePaymentIcon"
                      className={`${styles.imageStyle}`}
                    />
                  </div>
                  <div className={`${styles.textAlign} p-2`}>
                    <Box color="text.primary" fontSize="14px" fontWeight={600}>
                      {paymentType === "feePaidAtRO"
                        ? "Your payment via ‘Paid at Fuel Station’ has been approved."
                        : ""}
                      {paymentType === "feePaidAlready"
                        ? "Your payment via Fee Paid Already has been approved."
                        : ""}
                      {paymentType === "feeWaiver"
                        ? "Your request for Fee Waiver has been approved."
                        : ""}
                    </Box>
                  </div>
                </div>
              ) : (
                  ""
                )}
              {kycStatus === "approved" ? (
                <div className="pt-2">
                  <div
                    className={`${styles.approvedBackground} ${styles.textAlign} d-flex p-2`}
                  >
                    <div className="p-2">
                      <img
                        src={ApplicationUpdateApproveIcon}
                        alt="approvedKYCIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <div className="p-2">
                      <Box
                        color="text.primary"
                        fontSize="14px"
                        fontWeight={600}
                      >
                        Your KYC verification has been approved.
                      </Box>
                    </div>
                  </div>
                </div>
              ) : (
                  ""
                )}
              {kycStatus === "pending" ? (
                <div className="pt-2">
                  <div
                    className={`${styles.pendingBackground} ${styles.textAlign} d-flex p-2`}
                  >
                    <div className="p-2">
                      <img
                        src={ApplicationUpdatePendingIcon}
                        alt="pendingKYCIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <div className="p-2">
                      <Box
                        color="text.primary"
                        fontSize="14px"
                        fontWeight={600}
                      >
                        Your KYC document is pending for submission.
                      </Box>
                      <Box
                        className="pt-2"
                        color="text.secondary"
                        fontSize="14px"
                      >
                        Resubmit the form by uploading the documents under KYC
                        Details section
                      </Box>
                    </div>
                  </div>
                </div>
              ) : (
                  ""
                )}
              {paymentStatus === "rejected" ? (
                <div className="pt-2">
                  <div className={`${styles.rejectedBackground} d-flex p-2`}>
                    <div className="p-2">
                      <img
                        src={ApplicationUpdateRejectIcon}
                        alt="rejectedPaymentIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <div className={`${styles.textAlign} p-2`}>
                      <Box
                        color="text.primary"
                        fontSize="14px"
                        fontWeight={600}
                      >
                        {paymentType === "feePaidAtRO"
                          ? "Your payment via ‘Paid at Fuel Station’ has been rejected."
                          : ""}
                        {paymentType === "feePaidAlready"
                          ? "Your payment via Fee Paid Already has been rejected."
                          : ""}
                        {paymentType === "feeWaiver"
                          ? "Your request for Fee Waiver has been rejected."
                          : ""}
                      </Box>
                      <Box
                        className="pt-2"
                        color="text.secondary"
                        fontSize="14px"
                      >
                        {paymentType === "feePaidAlready"
                          ? ""
                          : "Reason for rejection"}
                      </Box>
                      <Box color="text.secondary" fontSize="14px">
                        {paymentType === "feePaidAtRO" ? (
                          <ul className={`${styles.unorderedList}`}>
                            <Box
                              className="pt-2 ml-3"
                              color="text.secondary"
                              fontSize="14px"
                            >
                              <li className={`${styles.listItem}`}>
                                Transaction Reference Number provided could not
                                be reconciled at the Retail Outlet
                              </li>
                            </Box>
                          </ul>
                        ) : (
                            ""
                          )}
                        {paymentType === "feeWaiver" ? (
                          <ul className={`${styles.unorderedList}`}>
                            <Box
                              className="pt-2 ml-3"
                              color="text.secondary"
                              fontSize="14px"
                            >
                              <li className={`${styles.listItem}`}>
                                Rejected as per instructions from RFSM
                              </li>
                            </Box>
                          </ul>
                        ) : (
                            ""
                          )}
                      </Box>
                      <Box
                        className="pt-2"
                        color="text.secondary"
                        fontSize="14px"
                      >
                        {paymentType === "feeWaiver"
                          ? "Resubmit the form by using an alternate payment type."
                          : "Resubmit the form with the correct reference number or use an alternate payment method."}
                      </Box>
                    </div>
                  </div>
                </div>
              ) : (
                  ""
                )}
              {kycStatus === "rejected" ? (
                <div className="pt-2">
                  <div
                    className={`${styles.rejectedBackground} ${styles.textAlign} d-flex p-2`}
                  >
                    <div className="p-2">
                      <img
                        src={ApplicationUpdateRejectIcon}
                        alt="rejectedKYCIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <div className="p-2">
                      <Box
                        color="text.primary"
                        fontSize="14px"
                        fontWeight={600}
                      >
                        Your KYC verification has been rejected.
                      </Box>
                      <Box
                        className="pt-2"
                        color="text.secondary"
                        fontSize="14px"
                      >
                        Reason for rejection
                      </Box>
                      <ul className={`${styles.unorderedList}`}>
                        <Box
                          className="pt-2 ml-3"
                          color="text.secondary"
                          fontSize="14px"
                        >
                          <li className={`${styles.listItem}`}>
                            Organisation name does not match the business PAN
                          </li>
                        </Box>
                        <Box
                          className="pt-2 ml-3"
                          color="text.secondary"
                          fontSize="14px"
                        >
                          <li className={`${styles.listItem}`}>
                            Registered address does not match the Proof of
                            Address
                          </li>
                        </Box>
                        <Box
                          className="pt-2 ml-3"
                          color="text.secondary"
                          fontSize="14px"
                        >
                          <li className={`${styles.listItem}`}>
                            Blank Image is uploaded under Proof of Address.
                            Upload the document again as per instructions
                            provided in the KYC Details section
                          </li>
                        </Box>
                      </ul>
                      <Box
                        className="pt-2"
                        color="text.secondary"
                        fontSize="14px"
                      >
                        Resubmit the form by making the appropriate changes.
                      </Box>
                    </div>
                  </div>
                </div>
              ) : (
                  ""
                )}
              {kycStatus === "NA" ? "" : ""}
              {paymentStatus === "NA" ? "" : ""}
            </Grid>
          </div>
        </div>
      </div>
    </Grid>
  );

  return (
    <React.Fragment>
      <div>
        <Modal className={classes.modalPos} open={open} onClose={onClose}>
          <Fade in={open}>{applicationStatus}</Fade>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default ApplicationStatus;
