import React, { useState } from "react";
import styles from "./ReviewApplication.module.scss";
import {
  Box,
  ClickAwayListener,
  Hidden,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { ApprovalConfirmationPopup } from "./ApprovalConfirmationPopup";
import { RejectionReasonPopup } from "./RejectionReasonPopup";
import { RejectReasonData } from "./types/rejectReason.interface";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { approvalType } from "./types/approvalType.enum";
import { ExpandMore } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import { useSelector } from "react-redux";
import { EnrolmentStatus } from "./types/EnrolmentStatus.enum";

const GreenTickIcon = "/done_kyc.svg";
const KYCApproved = "./W_KYC_Approved.svg";
const KYCRejected = "./W_KYC_Rejected.svg";

const RejectionReasonsTooltip = withStyles(() => ({
  tooltip: {
    opacity: 1,
    backgroundColor: "rgb(239, 243, 250)",
    fontsize: "0.752rem",
    color: "#354463",
    "@media (max-width:600px)": {
      fontSize: 11,
    },
    padding: 16,
  },
}))(Tooltip);

export const PendingApprovalItem = (props: any) => {
  const { currentApprovalType, currentEnrolmentStatus, index } = props;

  const store: any = useSelector((state) => state);
  console.log(store.role);

  const [reset, setReset] = useState(true);
  const [approve, setApprove] = useState(false);
  const [reject, setReject] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);

  const [reasonForRejection, setReasonForRejection] = useState<
    RejectReasonData
  >();

  const handleApproveBtnClick = () => {
    if (currentApprovalType === approvalType.REQUEST_FOR_FEE_WAIVER) {
      setOpenApproveModal(true);
    } else {
      setApprove(true);
      setReject(false);
      setReset(false);
    }
    //Create finalData with approval
  };

  const handleCloseApproveModal = () => {
    setOpenApproveModal(false);
  };

  const handleCloseAndSubmitApproveModal = (data: RejectReasonData) => {
    setOpenApproveModal(false);
    setApprove(true);
    setReject(false);
    setReset(false);
    //Create finalData with rejection
  };
  const handleResetBtn = () => {
    setApprove(false);
    setReject(false);
    setReset(true);
  };

  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
  };

  const handleCloseAndSubmitRejectModal = (data: RejectReasonData) => {
    // set the data that we got from popup
    setReasonForRejection(data);

    setOpenRejectModal(false);
    setApprove(false);
    setReject(true);
    setReset(false);
    //Create finalData with rejection
  };

  const [rejectionReasonTooltipOpen, setRejectionReasonTooltipOpen] = useState(
    false
  );
  const handleTooltipClose = () => {
    setRejectionReasonTooltipOpen(false);
  };
  const handleTooltipOpen = () => {
    setRejectionReasonTooltipOpen(true);
  };

  return (
    <Box
      className={`d-flex flex-column flex-sm-row justify-content-between align-items-sm-center px-3 py-3 mb-2 ${styles.approvalDiv}`}
    >
      <div
        className={`mb-sm-0 d-flex align-items-center justify-content-between ${
          store.role !== "FSO" && "w-100"
        }`}
      >
        <Typography
          variant="subtitle2"
          className="mb-0"
          data-test-id={`pending-${currentApprovalType}`}
        >
          {index + 1}. {currentApprovalType}
        </Typography>

        {/* ITEM STATUS FOR USER != FSO */}
        {store.role !== "FSO" && (
          <div className={`${styles.itemStatus}`}>
            {currentEnrolmentStatus === EnrolmentStatus.PENDING && (
              <div
                className={`d-flex align-items-center justify-content-center ${styles.pending}`}
                data-test-id={`${currentApprovalType}-${currentEnrolmentStatus}`}
              >
                {EnrolmentStatus.PENDING}
              </div>
            )}
            {currentEnrolmentStatus === EnrolmentStatus.APPROVED && (
              <div
                className={`d-flex`}
                data-test-id={`${currentApprovalType}-${currentEnrolmentStatus}`}
              >
                <img src={GreenTickIcon} alt="approved" />
                <p className={`mb-0 ml-1 mr-3 ${styles.approvedText}`}>
                  APPROVED
                </p>
              </div>
            )}
            {currentEnrolmentStatus === EnrolmentStatus.REJECTED && (
              <div
                className={`d-flex`}
                data-test-id={`${currentApprovalType}-${currentEnrolmentStatus}`}
              >
                <CancelIcon className={`${styles.rejectIcon}`} />
                <p className={`mb-0 mr-3 ${styles.rejectedText}`}>REJECTED</p>
              </div>
            )}
          </div>
        )}

        <Hidden xsDown>
          {reject && reasonForRejection && (
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <RejectionReasonsTooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={rejectionReasonTooltipOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <>
                    <ul className={`p-0 pl-2 m-0 ${styles.ulClass}`}>
                      {reasonForRejection.panCard && (
                        <li data-test-id="pan-card-rejection">
                          <span className={`${styles.reasonsList}`}></span>
                          Organization name does not match the business PAN
                        </li>
                      )}
                      {reasonForRejection.adhaarCard && (
                        <li data-test-id="address-proof-rejection">
                          <span className={`${styles.reasonsList}`}></span>
                          Registered address does not match the Proof of Address
                        </li>
                      )}
                      {reasonForRejection.othersDesc && (
                        <li data-test-id="other-rejection-reason">
                          <span className={`${styles.reasonsList}`}></span>
                          {reasonForRejection.othersDesc}
                        </li>
                      )}
                    </ul>
                  </>
                }
                placement="bottom"
              >
                <div
                  className={`ml-3 pl-3 d-flex align-items-center ${styles.rejectionReasons}`}
                  data-test-id="reaon-for-rejection"
                >
                  <Typography variant="body1">Reasons for rejection</Typography>
                  <ExpandMore
                    onClick={handleTooltipOpen}
                    className={`${styles.reasonsForRejectionArrow}`}
                  />
                </div>
              </RejectionReasonsTooltip>
            </ClickAwayListener>
          )}
        </Hidden>

        {/* RESET BUTTONS FOR ONLY FSO -- MOBILE WEB */}
        {store.role === "FSO" && (
          <Hidden smUp>
            {approve && (
              <div className={`d-flex align-items-center`}>
                <img src={GreenTickIcon} alt="approved" />
                <p className={`mb-0 mx-2 ${styles.approvedText}`}>APPROVED</p>
                <Typography
                  variant="body1"
                  className={`${styles.underline} ${styles.cursorPointer}`}
                  onClick={handleResetBtn}
                  data-test-id={`reset-${currentApprovalType}`}
                >
                  Reset
                </Typography>
              </div>
            )}
            {reject && (
              <div className={`d-flex align-items-center`}>
                <CancelIcon className={`${styles.rejectIcon}`} />
                <p className={`mb-0 mx-2 ${styles.rejectedText}`}>REJECTED</p>
                <Typography
                  variant="body1"
                  className={`${styles.underline} ${styles.cursorPointer}`}
                  onClick={handleResetBtn}
                  data-test-id={`pending-${currentApprovalType}`}
                >
                  Reset
                </Typography>
              </div>
            )}
          </Hidden>
        )}
      </div>

      {store.role === "FSO" && (
        <div className={`d-flex align-items-center`}>
          {reset && (
            <div className="pt-2 pt-sm-0">
              <CustomButton
                variant="contained"
                className={`mr-3 ${styles.rejectButton}`}
                onClick={() => setOpenRejectModal(true)}
                data-test-id={`reject-${currentApprovalType}`}
              >
                Reject
              </CustomButton>
              <CustomButton
                variant="contained"
                className={`${styles.approveButton}`}
                onClick={handleApproveBtnClick}
                data-test-id={`approve-${currentApprovalType}`}
              >
                Approve
              </CustomButton>
            </div>
          )}
          <Hidden xsDown>
            {approve && (
              <>
                <img src={GreenTickIcon} alt="approved" />
                <p className={`mb-0 ml-1 mr-3 ${styles.approvedText}`}>
                  APPROVED
                </p>
                <Typography
                  variant="body1"
                  className={`${styles.underline} ${styles.cursorPointer}`}
                  onClick={handleResetBtn}
                >
                  Reset
                </Typography>
              </>
            )}
            {reject && (
              <>
                <CancelIcon className={`${styles.rejectIcon}`} />
                <p className={`mb-0 mr-3 ${styles.rejectedText}`}>REJECTED</p>
                <Typography
                  variant="body1"
                  className={`${styles.underline} ${styles.cursorPointer}`}
                  onClick={handleResetBtn}
                >
                  Reset
                </Typography>
              </>
            )}
          </Hidden>
        </div>
      )}

      <Hidden smUp>
        {reject && reasonForRejection && (
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <RejectionReasonsTooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={rejectionReasonTooltipOpen}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={
                <>
                  <ul className={`p-0 pl-2 m-0 ${styles.ulClass}`}>
                    {reasonForRejection.panCard && (
                      <li data-test-id={`pan-card-reason`}>
                        <span className={`${styles.reasonsList}`}></span>
                        Organization name does not match the business PAN
                      </li>
                    )}
                    {reasonForRejection.adhaarCard && (
                      <li data-test-id={`address-proof-reason`}>
                        <span className={`${styles.reasonsList}`}></span>
                        Registered address does not match the Proof of Address
                      </li>
                    )}
                    {reasonForRejection.othersDesc && (
                      <li data-test-id={`other-reason`}>
                        <span className={`${styles.reasonsList}`}></span>
                        {reasonForRejection.othersDesc}
                      </li>
                    )}
                  </ul>
                </>
              }
              placement="bottom"
            >
              <div
                className={`pt-2 d-flex align-items-center justify-content-between ${styles.rejectionReasons}`}
                data-test-id={`reason-for-rejection`}
              >
                <Typography variant="body1">Reasons for rejection</Typography>
                <ExpandMore
                  onClick={handleTooltipOpen}
                  className={`${styles.reasonsForRejectionArrow}`}
                />
              </div>
            </RejectionReasonsTooltip>
          </ClickAwayListener>
        )}
      </Hidden>
      <RejectionReasonPopup
        open={openRejectModal}
        close={handleCloseRejectModal}
        closeAndSubmit={handleCloseAndSubmitRejectModal}
        currentApprovalType={currentApprovalType}
      ></RejectionReasonPopup>
      <ApprovalConfirmationPopup
        open={openApproveModal}
        close={handleCloseApproveModal}
        closeAndSubmit={handleCloseAndSubmitApproveModal}
        currentApprovalType={currentApprovalType}
      ></ApprovalConfirmationPopup>
    </Box>
  );
};
