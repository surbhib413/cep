import React from "react";
import { Typography, Hidden } from "@material-ui/core";
import styles from "./Header.module.scss";
import { useRouter } from "next/router";

const BackIcon = "/Back_Icon.svg";

const Header = (props: any): JSX.Element => {
  const router = useRouter();
  const handleBackClick = () => {
    // Redirect to list view
    router.push("/petrocorp/employee-accounts");
  };

  return (
    <>
      <Hidden xsDown>
        <div className="d-flex justify-content-left py-3 mb-3">
          <Typography variant="h3" color="primary">
            Add Employee Accounts
          </Typography>
        </div>
      </Hidden>

      <Hidden smUp>
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
      </Hidden>
    </>
  );
};

export default Header;
