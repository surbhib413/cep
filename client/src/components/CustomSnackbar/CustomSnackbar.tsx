import React from "react";
import styles from "./CustomSnackbar.module.scss";
import {
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";

const CustomSnackbar = (props: any) => {

  const { open, close, type, message } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={close}
    >
      <Alert
        className={`align-items-center`}
        severity={type}
        action={
          <IconButton
            aria-label="close"
            size="small"
            className={`${styles.borderButton}`}
            onClick={() => {
              close(false)
            }}
          >
            <CloseIcon
              fontSize="inherit"
              onClick={close}
            />
          </IconButton>
        }
      >
        <span>
          {message}
        </span>
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;