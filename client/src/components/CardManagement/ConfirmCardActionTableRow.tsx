import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import styles from "../../pages/SFCardManagement/CardManagement.module.scss";

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // borderBottom: "unset",
      borderBottom: "5px solid #f9fbff",
      fontFamilty: "Open Sans",
      fontWeight: "550",
    },
    "& .MuiTableCell-root": {
      paddingTop: "0.6rem",
      paddingBottom: "0.6rem",
      paddingLeft: "0.2rem",
      paddingRight: 0,
      fontSize: "13px",
    },
    rowConditional: {
      // "& .MuiTableCell-root":{
      borderBottom: "10px solid #f9fbff",
      // }
    },
  },
  desktopCollapse: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  resDrawer: {
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  pinInput: {
    height: "2rem",
    width: "4rem",
    paddingRight: "0px",
    fontWeight: "normal",
    fontFamily: "Open Sans",
    fontSize: "13px",
    fontStretch: "normal",
    textAlign: "center"
  },
  noBottomBorder:{
    paddingBottom: 0,
    paddingTop: 0,
    borderBottom: "none"
  }
}));

const ConfirmCardActionTableRow = (props: any) => {
  const { row } = props;
  const classes = useRowStyles();
  let cardColor = styles.greenDot;

  // console.log(selectedButton);
  switch (row.status) {
    case "Active":
      cardColor = styles.greenDot;
      break;
    case "Inactive":
      cardColor = styles.greyDot;
      break;
    case "Unassigned":
      cardColor = styles.blueDot;
      break;
    case "Blocked":
      cardColor = styles.redDot;
      break;
    case "Hotlisted":
      cardColor = styles.orangeDot;
      break;
    case "Terminated":
      cardColor = styles.pinkDot;
      break;
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="center">{row.slNo}</TableCell>
        <TableCell align="left">{row.cardname}</TableCell>
        <TableCell align="left">
          <div className={styles.cardColor}>
            {/* <span className={cardColor}></span> */}
            <span>{row.fleetCardId}</span>
          </div>
        </TableCell>
        <TableCell align="left">2342342345</TableCell>
      </TableRow>
      <TableRow className={classes.desktopCollapse}>
        <TableCell className={classes.noBottomBorder} colSpan={6}></TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default ConfirmCardActionTableRow;