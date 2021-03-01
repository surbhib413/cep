import {
  React,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  InputAdornment
} from "../../../utility/general-imports";
import SetCardPinTableRow from "./SetCardPinTableRow";
import styles from "../../SFCardManagement/CardManagement.module.scss";
import NoRecordsFound from "../../../components/CardManagement/NoRecordsFound"
import {
  ICON_EYE,
  ICON_EYEOPEN,
  SORT_ICON_ASC,
  SORT_ICON_DESC,
  ICON_SEARCH
} from "../constants";

const useStyles = makeStyles({
  root: {
    width: "100%",
    boxShadow: "none",
    // padding: "0.5rem"
  },
  container: {
    //maxHeight: "120vh",
    //minHeight: "70vh",
    "& .MuiTableCell-stickyHeader": {
      padding: "0.3rem",
      fontWeight: "600",
      color: "#354463",
    },
  },
});

export default function SetCardPinTable(props: any) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [gotoPage, setGotoPage] = React.useState("");
  const [pageCount, setPageCount] = React.useState(0);
  const [pinShown, setPinShown] = React.useState(false);
  const [openModal, setModalOpen] = React.useState(false);
  const [confirmPinShown, setConfirmPinShown] = React.useState(false);
  const {
    showPinError,
    orderBy,
    setOrderBy,
    setOpenOTPModal,
    handleNewPINChange,
    handleConfirmPINChange,
  } = props;

  const [openPopupSucess, setOpenPopupSucess] = React.useState(false);
  const [openCardSucess, setOpenCardSucess] = React.useState(false);
  const [cardBulkLimitError, setCardBulkLimitError] = React.useState(false);
  const [sucessCardMsg, setSucessCardMsg] = React.useState(false);
  const handlePopupSucess = () => {
    setOpenPopupSucess(true);
  };
  const handleActivationCardSucess = () => {
    setOpenCardSucess(true);
  };
  const handleBulkLimitError = () => {
    setCardBulkLimitError(true);
  };
  const handleSucessCardMsg = () => {
    setSucessCardMsg(true);
  };
  const togglePinVisiblity = () => {
    setPinShown(pinShown ? false : true);
  };
  const toggleConfirmPinVisiblity = () => {
    setConfirmPinShown(confirmPinShown ? false : true);
  };

  const getCardList = () => {
    const rowData = props.cardData.map((row: any, index: number) => {
      return (
        <SetCardPinTableRow
          pinShown={pinShown}
          setPinShown={setPinShown}
          togglePinVisiblity={togglePinVisiblity}
          confirmPinShown={confirmPinShown}
          setConfirmPinShown={setConfirmPinShown}
          toggleConfirmPinVisiblity={toggleConfirmPinVisiblity}
          row={row}
          key={index}
          index={index}
          handleNewPINChange={handleNewPINChange}
          handleConfirmPINChange={handleConfirmPINChange}
          showPinError={showPinError}
        />
      );
    });
    return rowData;
  };

  return (
    <>
      <div className={styles.searchPin}>
        <span style={{ width: "50%" }}>
          <OutlinedInput
            id="outlined-adornment-weight"
            className={styles.input}
            placeholder="Search by Name of Card/ Card Number"
            endAdornment={
              <InputAdornment position="start">
                <img src={ICON_SEARCH} className={styles.searchIcon} />
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            labelWidth={0}
            onChange={props.handleSearchTextChange}
            value={props.searchText}
          />
        </span>
        <span className={styles.pinNote}>
          <span className={styles.note}>Note</span>
          <p>PIN must be 4 digit number</p>
        </span>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.cell_medium}>
                  <div className={"d-flex justify-content-center flex-fill"}>
                    <div style={{ alignSelf: "center", paddingRight: "10px" }}>
                      #
                    </div>
                    <div
                      className={"d-flex flex-column justify-content-center"}
                    >
                      {orderBy === "asc" ? (
                        <img
                          src={SORT_ICON_ASC}
                          style={{ cursor: "pointer" }}
                          onClick={(event) => setOrderBy("desc")}
                        />
                      ) : (
                        <img
                          src={SORT_ICON_DESC}
                          style={{ cursor: "pointer" }}
                          onClick={(event) => setOrderBy("asc")}
                        />
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left" className={styles.cell_long}>
                  Name of Card
                </TableCell>
                <TableCell align="left" className={styles.cell_long}>
                  Card No.
                </TableCell>
                <TableCell align="left" className={styles.cell_long}>
                  New PIN{" "}
                </TableCell>
                <TableCell align="left" className={styles.cell_last}>
                  Confirm PIN{" "}
                  <img
                    src={confirmPinShown ? ICON_EYEOPEN : ICON_EYE}
                    className={styles.eyeImg}
                    onClick={toggleConfirmPinVisiblity}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.cardData.length > 0 ? (
                getCardList()
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    valign="middle"
                    style={{ height: "25rem" }}
                    className={`${styles.no_border}`}
                  >
                    <NoRecordsFound />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
