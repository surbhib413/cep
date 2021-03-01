import React from "react";
import {
  makeStyles,
  Typography,
  Hidden,
  Grid,
  withStyles,
  Theme,
  createStyles,
  DialogTitle,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import styles from "./CardManagement.module.scss";

const cancelImg = "/W_Icons_X.svg";
// const DownloadIcon = "/W_Icons_Download.svg";
const DownloadIcon = "/Card_Mgmt_Download_Icon.svg";

const useStyles = makeStyles({
  dialog: {
    //position: "absolute",
    // left: 500,
    // top: 307,
    width: 544,
    //height: 712,
    "& .MuiDialogContent-root": {
      padding: "0px 12px",
    },
    "& .MuiDialogTitle-root": {
      padding: "0px",
    },
  },
});

const ErrorLogPopUp = (props: any): JSX.Element => {
  const classes = useStyles();

  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [open, setOpen] = React.useState(true);
  /* ---------------------------------------------------- */

  const createData = (name: string, phoneNumber: number) => {
    return { name, phoneNumber };
  };

  const rows = [
    createData("Card 1", 8867010642),
    createData("Card 3", 9067010642),
    createData("Card 17", 9867010642),
    createData("Card 10", 7767010642),
    createData("Card 7", 3867010642),
    createData("Card 23", 4467010642),
    createData("Card 24", 4467010642),
    createData("Card 25", 4467010642),
    createData("Card 26", 4467010642),
    createData("Card 27", 4467010642),
    createData("Card 28", 4467010642),
    createData("Card 29", 4467010642),
  ];

  //handler to close confirm box
  const handleClose = () => {
    props.closePopUp();
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-delete"
      scroll="paper"
      // fullWidth
      classes={{
        paper: classes.dialog,
      }}
    >
      <DialogTitle>
        <div
          className={`d-flex flex-row pt-2 w-100 justify-content-between bd-highlight w-100`}
        >
          <Typography className={`d-flex ${styles.errorLogTitle}`}>
            Error Log
          </Typography>
          <img
            className={`d-flex pt-2 align-items-end cursor-pointer ${styles.iconColor} ${styles.errorLogPopCloseIcon}`}
            onClick={handleClose}
            src={cancelImg}
            alt="cancelImg"
          />
        </div>
        <Grid
          container
          className={`pt-5 ${styles.errorLogSubHeadingContainer}`}
        >
          <Grid item xs={10} sm={10}>
            <Typography
              className={`d-flex pt-2 pt-sm-3 ${styles.errorLogSubHeading}`}
              color="primary"
            >
              Mobile Numbers Existing in Database
            </Typography>
          </Grid>
          <Grid item xs={2} sm={2} className={styles.downloadLinkContainer}>
            <img src={DownloadIcon} alt="download" className={`pt-1`}></img>
            <Hidden xsDown>
              <Typography
                className={`d-flex pt-2 pt-sm-3 ${styles.downLoadLinkStyle}`}
                color="primary"
              >
                &nbsp;Download
              </Typography>
            </Hidden>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <div
          className={`d-flex flex-column align-items-center justify-content-center`}
          id="alert-dialog-delete"
        >
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow className={styles.errorLogTableHeader}>
                  <TableCell className={styles.errorLogTableHeader}>
                    Card No
                  </TableCell>
                  <TableCell className={styles.errorLogTableHeader}>
                    Mobile Number
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className={styles.errorLogTableContent}>
                      {row.name}
                    </TableCell>
                    <TableCell className={styles.errorLogTableContent}>
                      {row.phoneNumber}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </DialogContent>
      <DialogActions
        className={`d-flex flex-column justify-content-center align-items-center pt-2`}
      ></DialogActions>
    </Dialog>
  );
};

export default ErrorLogPopUp;
