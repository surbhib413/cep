import React, { useState } from "react";
import { Typography, Hidden } from "@material-ui/core";
import styles from "./Header.module.scss";
import { CustomButton } from "../../../../components/CustomButton/CustomButton";
import { Popup3 } from "../../../../components/CustomPopups/Popup3/Popup3";
import { useRouter } from "next/router";

const BackIcon = "/Back_Icon.svg";

const Header = (props: any): JSX.Element => {
  const { toggleCreateMode, createMode } = props;
  const router = useRouter();

  const handleBackClick = () => {
    // Redirect to list view
    router.push("/petrocorp/employee-accounts");
  };

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleCloseAndSubmitConfirmModal = () => {
    toggleCreateMode();
    setOpenConfirmModal(false);
  };
  const handleToggleCreteMode = (newMode: string) => {
    if (newMode !== createMode) {
      setOpenConfirmModal(true);
    }
  };

  return (
    <>
      {/* <Hidden xsDown> */}
      <div className="d-flex flex-column flex-sm-row justify-content-between py-3">
        <Typography variant="h3" color="primary">
          Create Employee Accounts
        </Typography>
        <div className="d-flex flex-column align-items-center align-items-sm-end">
          <div className="pt-3 pt-sm-0 d-flex align-items-center">
            <CustomButton
              onClick={() => handleToggleCreteMode("individual")}
              variant={createMode === "individual" ? "contained" : "outlined"}
              color="primary"
              className={`${styles.customButton1}`}
            >
              INDIVIDUAL
            </CustomButton>
            <CustomButton
              onClick={() => handleToggleCreteMode("bulk")}
              variant={createMode === "bulk" ? "contained" : "outlined"}
              color="primary"
              className={`${styles.customButton2}`}
            >
              BULK
            </CustomButton>
          </div>
          <div className="d-flex align-items-center justify-content-end py-2">
            <Typography variant="body1" color="textPrimary">
              {props.createMode === "individual"
                ? "Switch to bulk to create multiple accounts"
                : "Switch to individual to create a single account"}
            </Typography>
          </div>
        </div>
      </div>
      {/* </Hidden> */}

      {/* <Hidden smUp>
        <div className="d-flex justify-content-left py-3">
          <img
            src={BackIcon}
            alt="Smartfleet logo"
            className={`${styles.cursorPointer} pr-3`}
            onClick={handleBackClick}
          ></img>
          <Typography variant="h3" color="primary">
            Create Employee Accounts
          </Typography>
        </div>
      </Hidden> */}
      <Popup3
        open={openConfirmModal}
        close={() => setOpenConfirmModal(false)}
        closeAndSubmit={handleCloseAndSubmitConfirmModal}
        title={`Are you sure you want to switch to ${createMode === "individual" ? "bulk upload?" : "individual accounts?"
          }`}
        description={`${createMode === "individual"
            ? "Any details entered so far will be deleted."
            : " Any document uploaded will be deleted."
          }`}
      ></Popup3>
    </>
  );
};

export default Header;
