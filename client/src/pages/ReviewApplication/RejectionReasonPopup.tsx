import {
  Dialog,
  DialogContent,
  Typography,
  FormControlLabel,
  Checkbox,
  TextareaAutosize,
  FormControl,
} from "@material-ui/core";
import React, { useState } from "react";
import styles from "./ReviewApplication.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
// import { useSelector } from "react-redux";
import { approvalType } from "./types/approvalType.enum";
const CancelIcon = "./Cancel_Icon.svg";

export const RejectionReasonPopup = (props: any) => {
  const { open, close, closeAndSubmit, currentApprovalType } = props;

  const initCheckboxState = {
    panCard: false,
    adhaarCard: false,
    others: false,
  };
  const [checkboxState, setcheckboxState] = useState(initCheckboxState);
  const [reasonForRejection, setReasonForRejection] = useState("");
  // const [submit, setSubmit] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setcheckboxState({
      ...checkboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReasonForRejection(event.target.value);
  };

  const handleCloseAndSubmit = () => {
    // let finalData = { ...checkboxState, othersDesc: othersDesc };
    closeAndSubmit({
      ...checkboxState,
      othersDesc: reasonForRejection,
    });
  };

  //disable submit button if no reason is given
  const submitButtonDisabled = () => {
    if (currentApprovalType === approvalType.KYC) {
      if (checkboxState.panCard || checkboxState.adhaarCard) {
        return false;
      } else if (checkboxState.others && reasonForRejection) {
        return false;
      } else {
        return true;
      }
    } else {
      return reasonForRejection ? false : true;
    }
  };

  // const store: any = useSelector((state) => state);

  return (
    <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm">
      <DialogContent
        className={`d-flex flex-column align-items-start py-3 py-sm-4 px-sm-4 px-3`}
      >
        <div className="pb-3 w-100 d-flex bd-highlight align-items-center justify-content-between">
          <Typography className={`px-sm-0`} variant="h5" color="primary">
            {currentApprovalType === approvalType.KYC &&
              "Reason for KYC Rejection"}
            {currentApprovalType === approvalType.REQUEST_FOR_FEE_WAIVER &&
              "Reason for Fee Waiver Rejection"}
            {currentApprovalType === approvalType.PAYMENT_VARIFICATION &&
              "Reason for Payment Verification Rejection"}
          </Typography>
          <img
            src={CancelIcon}
            alt=""
            className={`p-2 ${styles.cursorPointer}`}
            onClick={close}
          />
        </div>

        {/* KYC REJECTION POPUP */}
        {currentApprovalType === approvalType.KYC && (
          <>
            {/* <Typography variant="h6" color="textPrimary" className="pt-3">
              Pan Card
            </Typography> */}
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={checkboxState.panCard}
                  onChange={handleCheckboxChange}
                  name="panCard"
                />
              }
              label="Organisation name does not match the business PAN"
            />

            {/* <Typography variant="h6" color="textPrimary" className="pt-3">
              Adhaar Card
            </Typography> */}
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={checkboxState.adhaarCard}
                  onChange={handleCheckboxChange}
                  name="adhaarCard"
                />
              }
              label="Registered address does not match the proof of Address "
            />

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={checkboxState.others}
                  onChange={handleCheckboxChange}
                  name="others"
                />
              }
              label="Others"
            />
          </>
        )}
        {checkboxState.others && (
          <FormControl className={`${styles.textareaPadding} w-100 pb-2`}>
            <TextareaAutosize
              className={`${styles.textArea}`}
              rowsMin={2}
              rowsMax={3}
              aria-label="maximum height"
              placeholder="Type your reason for rejection"
              maxLength={200}
              name="reasonForRejection"
              value={reasonForRejection}
              onChange={handleTextChange}
            />
          </FormControl>
        )}

        {/* REASON FOR REJECTION, OTHER THAN KYC */}
        {currentApprovalType !== approvalType.KYC && (
          <FormControl className={`w-100 py-4 pr-sm-4 mr-2`}>
            <TextareaAutosize
              className={`${styles.textArea}`}
              rowsMin={2}
              rowsMax={3}
              aria-label="maximum height"
              placeholder="Type your reason for rejection"
              maxLength={200}
              name="reasonForRejection"
              value={reasonForRejection}
              onChange={handleTextChange}
            />
          </FormControl>
        )}

        {/* ACTION BUTTONS */}
        <div className="w-100 py-3 d-flex justify-content-sm-end justify-content-between align-items-center">
          <CustomButton
            onClick={close}
            variant="outlined"
            color="primary"
            className={`${styles.backToEnrolmentBtn} mx-sm-4`}
          >
            CANCEL
          </CustomButton>
          <CustomButton
            onClick={handleCloseAndSubmit}
            variant="contained"
            color="primary"
            disabled={submitButtonDisabled()}
            // className="mr-4"
          >
            SUBMIT
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
