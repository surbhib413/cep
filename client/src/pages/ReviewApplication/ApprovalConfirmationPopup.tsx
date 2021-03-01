import {
  Dialog,
  DialogContent,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import React, { useState } from "react";
import styles from "./ReviewApplication.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
const CancelIcon = "./Cancel_Icon.svg";
// import { useSelector } from "react-redux";

export const ApprovalConfirmationPopup = (props: any) => {
  const { open, close, closeAndSubmit } = props;

  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  // const [submit, setSubmit] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmCheckbox(event.target.checked);
  };

  const handleCloseAndSubmit = () => {
    // let finalData = confirmCheckbox;
    closeAndSubmit();
  };

  // const store: any = useSelector((state) => state);

  return (
    <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm">
      <DialogContent
        className={`d-flex flex-column align-items-start px-3 py-sm-4 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-between">
          <Typography className={`px-sm-0`} variant="h5" color="primary">
            RFSM Approval for Fee Waiver
          </Typography>
          <img
            src={CancelIcon}
            alt=""
            className={`p-2 ${styles.cursorPointer}`}
            onClick={close}
          />
        </div>
        <div className="py-4 mb-sm-3">
          <FormControlLabel
            className="d-flex m-0 align-items-start pr-2 pr-sm-5"
            control={
              <Checkbox
                color="primary"
                className="p-0"
                checked={confirmCheckbox}
                onChange={handleCheckboxChange}
                name="confirmation"
              />
            }
            label="I confirm that RFSM Approval has been taken for the customer’s fee waiver request."
          />
        </div>

        <div className="w-100 py-3 d-flex justify-content-end align-items-center">
          <CustomButton
            onClick={close}
            variant="outlined"
            color="primary"
            className={`${styles.backToEnrolmentBtn} mr-2 mx-sm-4`}
          >
            CANCEL
          </CustomButton>
          <CustomButton
            onClick={handleCloseAndSubmit}
            variant="contained"
            color="primary"
            disabled={!confirmCheckbox}
            // className="mr-4"
          >
            SUBMIT
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
