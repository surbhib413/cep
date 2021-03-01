import {
  React,
  useDispatch,
  makeStyles,
  TableCell,
  TableRow,
  Checkbox,
  Collapse,
  IconButton,
  SwipeableDrawer,
} from "../../utility/general-imports";
import CardDetails from "./CardDetails";
import { CurrencyFormat, valueInLacs } from "src/utility/utils";
import { postCardDetails } from "../../lib/api/SFCardManagement/sfcardmanagement";
import styles from "./CardManagement.module.scss";
import { ARROW_ICON, ARROW_ICONDOWN } from "./constants";
import { setLoader } from "../../redux/actions/actions";
import ResponsiveDetails from "./ResponsiveDetails";

interface cardDetailsInterface {
  adhocLimit: string;
  allowedFuelTypes: [];
  cardStatus: string;
  dailyLimit: string;
  fleetCardId: string;
  mobileNumber: string;
  monthlyLimit: string;
  dailySaleTransaction: number;
  monthlySaleTransaction: number;
  cardWalletBalance: number;
  limitType: string;
}

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

const CardListTableRows = (props: any) => {
  const {
    row,
    selectedButton,
    setOpen,
    index,
    open,
    cardHeadersData,
    fuelTypeData,
    dropdownLists,
  } = props;
  // const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fleetCardData, setFleetCardData] = React.useState({});
  const [loadData, setLoadData] = React.useState({});
  const classes = useRowStyles();
  let cardColor = styles.greenDot;
  const dispatch = useDispatch();

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

  const handleCardDetailsUpdate = (fields: any) => {
    dispatch(setLoader(true));
    const resp = postCardDetails(fields)
      .then((res) => {
        setOpen("");
        cardHeadersData();
        dispatch(setLoader(false));
      })
      .catch((error) => {
        dispatch(setLoader(false));
        console.log("error", error);
      });
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="left" style={{ minWidth: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={Boolean(props.checked)}
              onChange={(event) => props.onChange(event, row)}
              size="small"
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </div>
        </TableCell>
        <TableCell align="center">{row.slNo}</TableCell>
        <TableCell align="left">{row.cardname}</TableCell>
        <TableCell align="left">
          <div className={styles.cardColor}>
            <span className={cardColor}></span>
            <span style={{ paddingLeft: "5px" }}>{row.fleetCardId}</span>
          </div>
        </TableCell>
        <TableCell align="left">{row.mobileNo}</TableCell>
        <TableCell align="left">{row.cardType}</TableCell>
        <TableCell align="right">
          {row.adhoclimit > 0 ? (
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  display: "inline-block",
                  minWidth: "60px",
                }}
              >
                Adhoc :{" "}
              </span>
              <span style={{ paddingLeft: "3px" }}>
                {valueInLacs(row.adhoclimit)}
              </span>
            </div>
          ) : (
            <div>
              {
                <div>
                  <span
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      minWidth: "60px",
                    }}
                  >
                    Daily:{" "}
                  </span>
                  <span style={{ paddingLeft: "3px" }}>
                    {valueInLacs(row.dailylimit)}
                  </span>
                </div>
              }
              {
                <div>
                  <span
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      minWidth: "60px",
                    }}
                  >
                    Monthly:
                  </span>
                  <span style={{ paddingLeft: "3px" }}>
                    {valueInLacs(row.monthlylimit)}
                  </span>
                </div>
              }
            </div>
          )}
        </TableCell>
        <TableCell align="right">
          {row.adhoclimit > 0 ? (
            <div>
              <span style={{ paddingLeft: "3px" }}>
                {CurrencyFormat(row.adhocbalance)}
              </span>
            </div>
          ) : (
            <div>
              <div>
                <span style={{ paddingLeft: "3px" }}>
                  {CurrencyFormat(row.dailybalance)}
                </span>
              </div>
              <div>
                <span style={{ paddingLeft: "3px" }}>
                  {CurrencyFormat(row.monthlybalance)}
                </span>
              </div>
            </div>
          )}
        </TableCell>
        <TableCell align="center">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                if (index === open) {
                  setOpen("");
                } else {
                  setOpen(index);
                }
              }}
            >
              {open === index ? (
                <img src={ARROW_ICONDOWN}></img>
              ) : (
                <img src={ARROW_ICON}></img>
              )}
            </IconButton>
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={classes.desktopCollapse}>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            borderBottom: `${open === index ? "10px solid #f9fbff" : "none"}`,
          }}
          colSpan={9}
        >
          <Collapse in={open === index} timeout="auto" unmountOnExit>
            <CardDetails
              dropdownLists={dropdownLists}
              fleetCardId={row.fleetCardId}
              selectedButton={selectedButton}
              fleetCardData={fleetCardData}
              setFleetCardData={setFleetCardData}
              handleCardDetailsUpdate={handleCardDetailsUpdate}
              fuelTypeData={fuelTypeData}
              loadData={loadData}
              setLoadData={setLoadData}
              cardHeadersData={cardHeadersData}
            />
          </Collapse>
        </TableCell>
      </TableRow>
      <SwipeableDrawer
        className={classes.resDrawer}
        anchor="bottom"
        open={open === index}
        onClose={() => setOpen("")}
      >
        <ResponsiveDetails
          data={fleetCardData[row.fleetCardId] || {}}
          onClose={() => setOpen("")}
        />
      </SwipeableDrawer>
    </React.Fragment>
  );
};

export default CardListTableRows;
