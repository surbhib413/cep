import React, { useState } from "react";
import { Grid, Typography, Hidden, Container, Paper } from "@material-ui/core";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import styles from "./ReviewApplication.module.scss";
import { ConfirmationModal } from "./ConfirmationModal";
import {
  CustomAccordion,
  CustomAccordionSummary,
  CustomAccordionDetails,
} from "../../components/CustomAccordian/CustomAccordian";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SideNav from "../../components/SideNav/SideNav";
import { PendingApprovalItem } from "./PendingApprovalItem";
import { useRouter } from "next/router";
import { approvalType } from "./types/approvalType.enum";
import { useSelector } from "react-redux";
import { EnrolmentStatus } from "./types/EnrolmentStatus.enum";

const PdfIcon = "/W_Icons_PDF.svg";
const PasswordEyeIcon = "/W_Icon_Password-Eye.svg";
const IconApplicationDetails1 = "/Icon_Application_Details_1.svg";
const IconApplicationDetails2 = "/Icon_Application_Details_2.svg";
const IconApplicationDetails3 = "/Icon_Application_Details_3.svg";
const IconApplicationDetails4 = "/Icon_Application_Details_4.svg";

const ReviewApplication = (props: any): JSX.Element => {
  const router = useRouter();
  // console.log(props.match.params.appId);
  // const applicationId = props.match.params.appId;
  const applicationId = router.query.appId;

  const store: any = useSelector((state) => state);
  console.log(store);
  // const [finalData, setFinalData] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [modalTitle, setModalTitle] = useState(``);
  const [modalDescription, setModalDescription] = useState(``);
  const [redirectToEnrolment, setRedirectToEnrolment] = useState(false);

  const handleRedirectToEnrollmentModal = () => {
    setOpenConfirmModal(true);
    setRedirectToEnrolment(true);
    if (store.role === "SO") {
      setModalTitle("Back to KYC Approval Request");
      setModalDescription(
        `Are you sure you want to go back to KYC approval request? Any changes made on this page will not be saved`
      );
    } else {
      setModalTitle("Back to Enrolment Request");
      setModalDescription(
        `Are you sure you want to go back to enrolment request? Any changes made on this page will not be saved`
      );
    }
  };
  const handleConfirmModal = () => {
    setOpenConfirmModal(true);
    setRedirectToEnrolment(false);
    setModalTitle("Confirm Submission");
    setModalDescription("Are you sure you want to save the changes made ?");
  };

  const handleCloseModal = () => {
    setOpenConfirmModal(false);
  };

  const handleCloseAndSubmitConfirmModal = () => {
    setOpenConfirmModal(false);

    if (redirectToEnrolment) {
      // Redirect to Enrolment Request.
    } else {
      // Submit the details.
    }
  };

  const [expanded, setExpanded] = React.useState(false);

  const toggleShowBtn = () => {
    setExpanded((expanded) => !expanded);
  };

  const pendingItems = [
    { type: approvalType.KYC, status: EnrolmentStatus.PENDING },
    {
      type: approvalType.REQUEST_FOR_FEE_WAIVER,
      status: EnrolmentStatus.APPROVED,
    },
    {
      type: approvalType.PAYMENT_VARIFICATION,
      status: EnrolmentStatus.REJECTED,
    },
  ];

  return (
    <>
      <Container maxWidth="lg" className={`px-0 px-sm-4`}>
        <Paper className={`px-3 px-sm-5 py-2 py-sm-3 ${styles.headerPaper}`}>
          <Typography
            color="primary"
            align="left"
            variant="h3"
            className="py-3"
          >
            Review Application
          </Typography>
          <Typography align="left" variant="h5" className="py-3">
            Application Details
          </Typography>
          <Hidden xsDown>
            <Grid container className={`${styles.applicationDetailsContainer}`}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  className="py-3 d-flex justify-content-center"
                >
                  <img src={IconApplicationDetails1} alt="pdf icon" />
                </Grid>
                <Grid item xs={12} sm={3} className="p-3">
                  <Typography variant="body1">Application ID</Typography>
                  <Typography variant="subtitle1">AQM67891</Typography>
                </Grid>

                {store.role === "SO" && (
                  <>
                    <Grid item xs={12} sm={4} className="p-3">
                      <Typography variant="body1">CC ID</Typography>
                      <Typography variant="subtitle1">CC1234567809</Typography>
                    </Grid>
                  </>
                )}
                {(store.role === "FSO" ||
                  store.role === "CRE" ||
                  store.role === "DEALER" ||
                  store.role === "CUSTOMER") && (
                  <>
                    <Grid item xs={12} sm={4} className="p-3">
                      <Typography variant="body1">Raised By</Typography>
                      <Typography variant="subtitle1">FSO</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3} className="p-3">
                      <Typography variant="body1">FA ID</Typography>
                      <Typography variant="subtitle1">Not Generated</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container className={`${styles.row} `}>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  className="py-3 d-flex justify-content-center"
                >
                  <img src={IconApplicationDetails2} alt="pdf icon" />
                </Grid>

                <Grid item xs={12} sm={3} className="p-3">
                  <Typography variant="body1">Name</Typography>
                  <Typography variant="subtitle1">Raj Kumar</Typography>
                </Grid>
                <Grid item xs={12} sm={4} className="p-3">
                  <Typography variant="body1">Mobile No</Typography>
                  <Typography variant="subtitle1">9876543212</Typography>
                </Grid>
                <Grid item xs={12} sm={3} className="p-3">
                  <Typography variant="body1">Email ID</Typography>
                  <Typography variant="subtitle1">
                    rajk5518@gmail.com
                  </Typography>
                </Grid>
              </Grid>

              <Grid container className={`${styles.row} `}>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  className="py-3 d-flex justify-content-center"
                >
                  <img src={IconApplicationDetails3} alt="pdf icon" />
                </Grid>

                <Grid item xs={12} sm={3} className="p-3">
                  <Typography variant="body1">Organisation Name</Typography>
                  <Typography variant="subtitle1">XYZ Corporation</Typography>
                </Grid>

                <Grid item xs={12} sm={4} className="p-3">
                  <Typography variant="body1">Registered Address</Typography>
                  <Typography variant="subtitle1">
                    #64 Godown Lot, LBS Marg, Mumbai, Maharashtra
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3} className="p-3">
                  <Typography variant="body1">Pincode</Typography>
                  <Typography variant="subtitle1">40080</Typography>
                </Grid>
              </Grid>
              {store.role === "FSO" && (
                <Grid container className={`${styles.row} `}>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    className="py-3 d-flex justify-content-center"
                  >
                    <img src={IconApplicationDetails4} alt="pdf icon" />
                  </Grid>

                  <Grid item xs={12} sm={3} className="p-3">
                    <Typography variant="body1">Payment Status</Typography>
                    <Typography variant="subtitle1">
                      Fees not applicable
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4} className="p-3">
                    <Typography variant="body1">Fees amount</Typography>
                    <Typography variant="subtitle1">Rs 250</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} className="p-3">
                    <Typography variant="body1">Request Summary</Typography>
                    <Typography variant="subtitle1">
                      Discussed issue over phone call with the FSO in charge
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <div className="d-flex pt-4 justify-content-end">
              <CustomButton variant="outlined" color="primary">
                {store.role === "FSO" ? "Edit" : "View"} Application
              </CustomButton>
            </div>
          </Hidden>
          <Hidden smUp>
            <Grid container className={`${styles.applicationDetailsContainer}`}>
              <Grid container>
                <Grid
                  item
                  xs={2}
                  className="py-3 d-flex justify-content-center"
                >
                  <img src={IconApplicationDetails1} alt="pdf icon" />
                </Grid>
                <Grid item xs={5} className="p-3">
                  <Typography variant="body1">Application ID</Typography>
                  <Typography variant="subtitle1">AQM67891</Typography>
                </Grid>
                {store.role === "SO" && (
                  <>
                    <Grid item xs={5} className="p-3">
                      <Typography variant="body1">CC ID</Typography>
                      <Typography variant="subtitle1">CC1234567809</Typography>
                    </Grid>
                  </>
                )}
                {(store.role === "FSO" ||
                  store.role === "CRE" ||
                  store.role === "DEALER" ||
                  store.role === "CUSTOMER") && (
                  <>
                    <Grid item xs={5} className="p-3">
                      <Typography variant="body1">Raised By</Typography>
                      <Typography variant="subtitle1">FSO</Typography>
                    </Grid>
                    <Grid item xs={2} className="p-3"></Grid>
                    <Grid item xs={5} className="p-3">
                      <Typography variant="body1">FA ID</Typography>
                      <Typography variant="subtitle1">Not Generated</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container className={`${styles.row} `}>
                <Grid
                  item
                  xs={2}
                  className="py-3 d-flex justify-content-center"
                >
                  <img src={IconApplicationDetails2} alt="pdf icon" />
                </Grid>

                <Grid item xs={5} className="p-3">
                  <Typography variant="body1">Name</Typography>
                  <Typography variant="subtitle1">Raj Kumar</Typography>
                </Grid>
                <Grid item xs={5} className="p-3">
                  <Typography variant="body1">Mobile No</Typography>
                  <Typography variant="subtitle1">9876543212</Typography>
                </Grid>
                <Grid item xs={2} className="p-3"></Grid>
                <Grid item xs={5} className="p-3">
                  <Typography variant="body1">Email ID</Typography>
                  <Typography variant="subtitle1">
                    rajk5518@gmail.com
                  </Typography>
                </Grid>
              </Grid>
              {expanded && (
                <>
                  <Grid container className={`${styles.row} `}>
                    <Grid
                      item
                      xs={2}
                      className="py-3 d-flex justify-content-center"
                    >
                      <img src={IconApplicationDetails3} alt="pdf icon" />
                    </Grid>

                    <Grid item xs={5} className="p-3">
                      <Typography variant="body1">Organisation Name</Typography>
                      <Typography variant="subtitle1">
                        XYZ Corporation
                      </Typography>
                    </Grid>
                    <Grid item xs={5} className="p-3">
                      <Typography variant="body1">Pincode</Typography>
                      <Typography variant="body1">40080</Typography>
                    </Grid>

                    <Grid item xs={2} className="p-3"></Grid>
                    <Grid item xs={5} className="p-3">
                      <Typography variant="body1">
                        Registered Address
                      </Typography>
                      <Typography variant="subtitle1">
                        #64 Godown Lot, LBS Marg, Mumbai, Maharashtra
                      </Typography>
                    </Grid>
                  </Grid>
                  {store.role === "FSO" && (
                    <>
                      <Grid container className={`${styles.row} `}>
                        <Grid
                          item
                          xs={2}
                          className="py-3 d-flex justify-content-center"
                        >
                          <img src={IconApplicationDetails4} alt="pdf icon" />
                        </Grid>

                        <Grid item xs={5} className="p-3">
                          <Typography variant="body1">
                            Payment Status
                          </Typography>
                          <Typography variant="subtitle1">
                            Fees not applicable
                          </Typography>
                        </Grid>

                        <Grid item xs={5} className="p-3">
                          <Typography variant="body1">Fees amount</Typography>
                          <Typography variant="subtitle1">Rs 250</Typography>
                        </Grid>
                        <Grid item xs={2} className="p-3"></Grid>
                        <Grid item xs={5} className="p-3">
                          <Typography variant="body1">
                            Request Summary
                          </Typography>
                          <Typography variant="subtitle1">
                            Discussed issue over phone call with the FSO in
                            charge
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
            {expanded && (
              <>
                <div className="d-flex px-3 pt-3 justify-content-center">
                  <CustomButton
                    variant="outlined"
                    color="primary"
                    className="w-100"
                  >
                    {store.role === "FSO" ? "Edit" : "View"} Application
                  </CustomButton>
                </div>
              </>
            )}
            <div className="d-flex justify-content-center pt-3">
              <Typography
                variant="body1"
                className={`${styles.underline} ${styles.cursorPointer}`}
                onClick={toggleShowBtn}
              >
                Show {expanded ? "Less" : "More"}
              </Typography>
            </div>
          </Hidden>
          <hr className={`${styles.headerDivider}`}></hr>
          <Typography align="left" variant="h5">
            KYC Documents
          </Typography>
          <Grid container spacing={1} className="pt-sm-3 pl-1">
            <Grid container item spacing={1} xs={12} sm={5} className="pt-4">
              <Grid item xs={12}>
                <CustomLabel>Business Pan</CustomLabel>
              </Grid>
              {/* <a
                className="w-100"
                target="blank"
                href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              >
                <Grid
                  container
                  className={`${styles.businessPanDiv}`}
                  alignItems="center"
                >
                  <Grid item xs={1} className="p-0">
                    <img src={PdfIcon} alt="pdf icon" />
                  </Grid>
                  <Grid item xs={10} className="py-0 pl-3">
                    <div className={`${styles.businessPanTitle}`}>
                      Pan card copy.pdf
                    </div>
                    <div className={`${styles.businessPanText}`}>
                      25th Aug 2020 . 100kb
                    </div>
                  </Grid>
                  <Grid item xs={1} className="py-0">
                    <img src={PasswordEyeIcon} alt="password eye icon" />
                  </Grid>
                </Grid>
              </a> */}
              <Grid item xs={12} sm={9} className={`${styles.noDocument}`}>
                <span>Business Pan not uploaded</span>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body1">
                  Name on the document should exactly match with the
                  Organisation Name entered in the application for KYC
                  verification
                </Typography>
              </Grid>
            </Grid>
            <Grid container item spacing={1} xs={12} sm={5} className="pt-4">
              <Grid item xs={12}>
                <CustomLabel>Proof of Address</CustomLabel>
              </Grid>
              <a
                className="w-100"
                target="blank"
                href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              >
                <Grid
                  container
                  className={`${styles.businessPanDiv}`}
                  alignItems="center"
                >
                  <Grid item xs={1} className="p-0">
                    <img src={PdfIcon} alt="pdf icon" />
                  </Grid>
                  <Grid item xs={10} className="py-0 pl-3">
                    <div className={`${styles.businessPanTitle}`}>
                      POA Copy_2.pdf
                    </div>
                    <div className={`${styles.businessPanText}`}>
                      25th Aug 2020 . 250kb
                    </div>
                  </Grid>
                  <Grid item xs={1} className="py-0">
                    <img src={PasswordEyeIcon} alt="password eye icon" />
                  </Grid>
                </Grid>
              </a>
              {/* <Grid item xs={12} sm={9} className={`${styles.noDocument}`}>
                <span>Proof of Address not uploaded</span>
              </Grid> */}
              <Grid item xs={10}>
                <Typography variant="body1">
                  Address on the document should exactly match with the
                  Registered Address entered in the application for KYC
                  verification
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <hr className={`${styles.headerDivider}`}></hr>

          <Typography className="pb-4" align="left" variant="h5">
            Pending Approvals
          </Typography>
          {pendingItems.map((pendingItem, index) => {
            return (
              <PendingApprovalItem
                key={index}
                currentApprovalType={pendingItem.type}
                currentEnrolmentStatus={pendingItem.status}
                index={index}
              />
            );
          })}
          {/* <PendingApprovalItem
            currentApprovalType={approvalType.REQUEST_FOR_FEE_WAIVER}
            currentEnrolmentStatus={EnrolmentStatus.APPROVED}
          ></PendingApprovalItem>
          <PendingApprovalItem
            currentApprovalType={approvalType.PAYMENT_VARIFICATION}
            currentEnrolmentStatus={EnrolmentStatus.REJECTED}
          ></PendingApprovalItem> */}
          <Hidden xsDown>
            <div className="w-100 d-flex justify-content-end align-items-center">
              <Hidden xsDown>
                <hr className={`${styles.headerDivider} w-75 ml-0 mr-3`}></hr>
              </Hidden>

              <CustomButton
                onClick={handleRedirectToEnrollmentModal}
                variant="outlined"
                color="primary"
                className={`${styles.backToEnrolmentBtn} mr-3`}
              >
                BACK TO{" "}
                {store.role === "SO"
                  ? "KYC Approval Request"
                  : "ENROLMENT REQUEST"}
              </CustomButton>
              <CustomButton
                onClick={handleConfirmModal}
                variant="contained"
                color="primary"
                // disabled={!(approveKYC || rejectKYC)}
              >
                Save
              </CustomButton>
            </div>
          </Hidden>
          <Hidden smUp>
            <CustomButton
              onClick={handleConfirmModal}
              variant="contained"
              color="primary"
              className="w-100 mt-3"
              // disabled={!(approveKYC || rejectKYC)}
            >
              Save
            </CustomButton>
            <CustomButton
              onClick={handleRedirectToEnrollmentModal}
              variant="outlined"
              color="primary"
              className="w-100 mt-3"
            >
              BACK TO{" "}
              {store.role === "SO"
                ? "KYC Approval Request"
                : "ENROLMENT REQUEST"}
            </CustomButton>
          </Hidden>
        </Paper>
      </Container>

      <ConfirmationModal
        open={openConfirmModal}
        // open={true}
        close={handleCloseModal}
        closeAndSubmit={handleCloseAndSubmitConfirmModal}
        title={modalTitle}
        description={modalDescription}
      ></ConfirmationModal>
    </>
  );
};

export default ReviewApplication;
