import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { CurrencyFormat, valueInLacs } from "../../../../src/utility/utils";
import styles from "../CardManagement.module.scss";

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // borderBottom: "unset",
      borderBottom: "10px solid #f9fbff",
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
  pleft: {
    paddingLeft: "3px",
  },
  dailyB: {
    display: "inlineBlock",
    fontWeight: "bold",
    minWidth: "60px",
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
}));

const SetCardLimitTableRow = (props: any) => {
  const { row } = props;
  const classes = useRowStyles();
  let cardColor = styles.greenDot;

  //console.log(row);
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
        <TableCell align="left">
          <div>
            <div>
              <span className={classes.dailyB}>Daily: </span>
              <span className={classes.pleft}>
                {valueInLacs(row.dailySalesTransaction)}
              </span>
            </div>
            <div>
              <span className={classes.dailyB}>Monthly:</span>
              <span className={classes.pleft}>
                {valueInLacs(row.monthlySalesTransaction)}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell align="left">
          {row.adhoclimit > 0 ? (
            <div>
              <span className={classes.pleft}>
                {CurrencyFormat(row.adhoclimit)}
              </span>
            </div>
          ) : (
            <div>
              <div>
                <span className={classes.pleft}>
                  {CurrencyFormat(row.dailylimit)}
                </span>
              </div>
              <div>
                <span className={classes.pleft}>
                  {CurrencyFormat(row.monthlylimit)}
                </span>
              </div>
            </div>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default SetCardLimitTableRow;
