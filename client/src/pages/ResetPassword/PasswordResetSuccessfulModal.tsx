import { DialogContent, Hidden, Typography } from "@material-ui/core";
import React from "react";
import styles from "./resetPassword.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
import { useSelector } from "react-redux";

const CancelIcon = "/Cancel_Icon.svg";
const GreenTickIcon = "/done_kyc.svg";
const b2bResetPasswordImage = "./WM_Illus-B2B_Reset-pass.svg";
const webB2bResetImage = "./Group29605.svg";

export const PasswordResetSuccessfulModal = (props: any) => {
  const { successModal, closeSuccessModal, setPassword } = props;
  const store: any = useSelector((state) => state);

  return (
    <Dialog
      open={successModal}
      onClose={closeSuccessModal}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-between">
          <img alt="" className={`p-3 ${styles.noOpacity}`} />
          <Typography className={`text-center ${styles.titleStyle}`} variant="h5">
            {setPassword
              ? "Password has been successfully reset."
              : "Password set successfully!"}
          </Typography>
          <img
            src={CancelIcon}
            alt="cancel"
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={closeSuccessModal}
          />
        </div>
        {console.log(store.role)}
        <Hidden xsDown>
          <img className={`p-4`}
            src={
              webB2bResetImage
              // store.role === "PETROCORPORATE"
              //   ? webB2bResetImage : GreenTickIcon
            }
            alt="password reset successful image"
          />
        </Hidden>
        <Hidden smUp>
          <img
            className={`p-4 `}
            src={
              b2bResetPasswordImage
              // store.role === "PETROCORPORATE"
              //   ? b2bResetPasswordImage : GreenTickIcon
            }
            alt="password reset successful image"
          />
        </Hidden>
        {/* {store.role === 'PETROCORPORATE' ? */}
        <Typography className={`pb-4 ${styles.modalSubTitle}`}>You can now sign in to your account</Typography>
        {/* : null
        } */}
        <CustomButton
          color="primary"
          variant="contained"
          onClick={() => closeSuccessModal()}
        >
          Sign in
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
};
