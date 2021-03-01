import {
  React,
  useEffect,
  useRouter,
  useSelector,
  useDispatch,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  moment,
  Typography,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  Button,
  Pagination,
  includes,
} from "../../utility/general-imports";
import CardListTableRows from "./CardListTableRows";
import styles from "../SFCardManagement/CardManagement.module.scss";
import { BulkActionCheckDeliveryPopup } from "../../components/CardManagement/BulkActionPopup";
import { Popup1 } from "../../components/CustomPopups/Popup1/Popup1";
import { Popup4 } from "../../components/CustomPopups/Popup4/Popup4";
import NoRecordsFound from "../../components/CardManagement/NoRecordsFound";
import { BulkActionDeliveryErrorPopup } from "../../components/CardManagement/BulkActionDeliveryErrorPopup";
import { ConfirmCardHotlisting } from "../../components/CardManagement/ConfirmCardHotlisting";
import { setCardsForBulkAction } from "../../redux/SmartFleet/SFCardManagement/CardManagementAction";
import {
  getCardForBulkAction,
  postCardStatus,
} from "../../lib/api/SFCardManagement/sfcardmanagement";
import { setLoader } from "../../redux/actions/actions";
import {
  CARD_RECEIVED_CONFIRMATION_TITLE,
  CARD_RECEIVED_CONFIRMATION_DESCRIPTION,
  CARD_NOT_DELIVERED_ERROR_TITLE,
  CARD_NOT_DELIVERED_ERROR_DESCRIPTION,
  SORT_ICON_ASC,
  SORT_ICON_DESC,
  MAXIMUM_CARDS_FOR_SELECTION,
  ICON_SEARCH,
  CONFIRM_CARD_TERMINATE_TITLE,
  CONFIRM_CARD_TERMINATE_DESCRIPTION,
} from "./constants";
import {
  setPopupTitleForBulkAction,
  setPopupDescriptionForBulkAction,
  setPopupActionTypeForBulkAction,
} from "../../redux/SmartFleet/SFCardManagement/CardManagementAction";

const useStyles = makeStyles((theme) => ({
  paddingWrapper: {
    padding: "0px 1.2rem",
    [theme.breakpoints.down("sm")]: {
      padding: "0px",
    },
  },
  root: {
    width: "100%",
    boxShadow: "none",
    // padding:"0px 1.5rem",
    // padding: "0.5rem"
  },
  container: {
    //maxHeight: "120vh",
    // minHeight: "70vh",
    "& .MuiTableCell-stickyHeader": {
      padding: "0.3rem",
      fontWeight: "600",
      color: "#354463",
    },
  },
  footer: {
    backgroundColor: "#fff",
    padding: "1rem 0px",
    justifyContent: "flex-end",
    "& button": {
      width: "auto",
      whiteSpace: "nowrap",
    },
  },
  tableFooter: {
    padding: "0px 1.2rem",
    // margin: "0rem 0px 0px 0px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "baseline",
    [theme.breakpoints.down("sm")]: {
      backgroundColor: "#fff",
      flexDirection: "column",
    },
  },
  search: {
    margin: "1rem 0px 0px 0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontStyle: "italic",
    fontSize: "13px",
    alignSelf: "center",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

export default function CardManagementList(props: any) {
  const {
    openConfirmModal,
    setOpenConfirmModal,
    setShowSnackbar,
    setSnackbarMessage,
    openHotlistConfirmModal,
    setOpenHotelistConfirmModal,
    openBlockSuccessModal,
    openBlockConfirmModal,
    setOpenBlockConfirmModal,
    setOpenBlockSuccessModal,
    dropdownLists,
  } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [gotoPage, setGotoPage] = React.useState("");
  const [pageCount, setPageCount] = React.useState(0);
  const [popupTitle, setPopupTitle] = React.useState(
    CARD_RECEIVED_CONFIRMATION_TITLE
  );
  const [popupDescription, setPopupDescription] = React.useState(
    CARD_RECEIVED_CONFIRMATION_DESCRIPTION
  );

  const popupCardTitle = useSelector((state) => {
    console.log(state.title);
    return state.title;
  });
  const popupCardDescription = useSelector((state) => state.description);
  const cardActionType = useSelector((state) => state.actionType);

  const {
    collapsedRow,
    setCollapsedRow,
    cardHeadersData,
    orderBy,
    setOrderBy,
    cardCount,
    fuelTypeData,
    selectedButton,
    selectedRow,
    setRowSelected,
    selectedRowData,
    setSelectedRowData,
    cardStatusData,
  } = props;
  const [openErrorPopupModal, setOpenErrorPopupModal] = React.useState(false);
  const [cardDeliveryError, setCardDeliveryError] = React.useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmitCardDeliveryModal = () => {
    setOpenConfirmModal(false);
    checkSelectedCardDelivery();
    //getOTP();
  };

  const handleBlockConfirmationModal = async () => {
    setOpenBlockConfirmModal(false);
    setOpenHotelistConfirmModal(false);
    const data = {
      cards: selectedRow,
      changeStatus: cardActionType,
    };
    const resp: any = await postCardStatus(data);
    setPopupTitle("Card Status Updated");
    const description = `${resp.message}`;
    setPopupDescription(description);
    setOpenBlockSuccessModal(true);
    setRowSelected([]);
    setSelectedRowData([]);
    cardHeadersData();
    cardStatusData();
  };

  const handleBlockSuccessModal = () => {
    setOpenBlockSuccessModal(false);
    router.push("/sfcardmanagement");
  };

  const checkSelectedCardDelivery = () => {
    dispatch(setLoader(true));
    getCardForBulkAction({ cards: selectedRow, purpose: "setpin" }).then(
      (response) => {
        console.log(response);
        if (
          response?.status == "success" &&
          response?.data &&
          response?.data?.fleetCards
        ) {
          dispatch(setCardsForBulkAction(selectedRow));
          router.push("/sfcardmanagement/BulkActions");
        } else {
          if (response?.errors) {
            setSnackbarMessage(response?.errors[0]?.message);
            setShowSnackbar(true);
          }
          if (
            response?.message &&
            includes(
              response?.message,
              "physical cards have not been dispatched"
            )
          ) {
            showCardDeliveryError();
          }
        }
        dispatch(setLoader(false));
      }
    );
  };

  const showCardDeliveryError = () => {
    setCardDeliveryError(true);
    setPopupDescription(CARD_NOT_DELIVERED_ERROR_DESCRIPTION);
    setPopupTitle(CARD_NOT_DELIVERED_ERROR_TITLE);
    setOpenErrorPopupModal(true);
  };

  const raiseServiceRequest = () => {
    console.log("Redirect to service request create page");
  };

  const selectHandler = (event: any, row: any) => {
    setPopupTitle(CARD_RECEIVED_CONFIRMATION_TITLE);
    setPopupDescription(CARD_RECEIVED_CONFIRMATION_DESCRIPTION);
    if (event.target.checked) {
      if (selectedRow.length > MAXIMUM_CARDS_FOR_SELECTION) {
        setSnackbarMessage(
          `Maximum of ${MAXIMUM_CARDS_FOR_SELECTION} cards can be selected`
        );
        setShowSnackbar(true);
        event.preventDefault();
      } else {
        setRowSelected([...selectedRow, row.fleetCardId]);
        setSelectedRowData((prevState: any) => [...prevState, row]);
      }
    } else {
      if (selectedRow.length) {
        const filteredRecords = selectedRow.filter(
          (fleetCardId: any, index: number) => {
            return row.fleetCardId !== fleetCardId;
          }
        );
        const filteredRowData = selectedRowData.filter(
          (rowData: any, index: number) => {
            return rowData.fleetCardId != row.fleetCardId;
          }
        );
        setRowSelected(filteredRecords);
        setSelectedRowData(filteredRowData);
      }
    }
    console.log("selected checkboxes", selectedRow, selectedRowData);
  };

  const selectAllCards = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setRowSelected(
        props.cardData.map((value: any, index: number) => value.fleetCardId)
      );
      setSelectedRowData(props.cardData);
    } else {
      setRowSelected([]);
      setSelectedRowData([]);
    }
  };

  const handleTerminateCards = () => {
    if (selectedRow.length) {
      setOpenHotelistConfirmModal(true);
      dispatch(setPopupTitleForBulkAction(CONFIRM_CARD_TERMINATE_TITLE));
      dispatch(
        setPopupDescriptionForBulkAction(CONFIRM_CARD_TERMINATE_DESCRIPTION)
      );
      dispatch(setPopupActionTypeForBulkAction("terminate"));
    } else {
      setSnackbarMessage("Please select a card to proceed");
      setShowSnackbar(true);
    }
  };

  const getButtonsForCurrentCardStatus = () => {
    if (selectedButton == "Active" || selectedButton == "Unassigned") {
      return (
        <React.Fragment>
          <span
            onClick={() => {
              dispatch(setCardsForBulkAction(selectedRow));
              router.push("/sfcardmanagement/BulkActivation");
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              className={styles.setLimit}
            >
              SET LIMIT
            </Button>
          </span>
          <span
            onClick={() => {
              dispatch(setCardsForBulkAction(selectedRow));
              router.push("/sfcardmanagement/bulkfueltypeupdate");
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              className={styles.setFuelType}
            >
              SET Fuel Type
            </Button>
          </span>
          <span>
            <Button
              variant="outlined"
              color="primary"
              className={styles.setFuelStation}
            >
              SET Fuel Station
            </Button>
          </span>
        </React.Fragment>
      );
    } else if (selectedButton == "Hotlisted") {
      return (
        <React.Fragment>
          <span onClick={handleTerminateCards}>
            <Button
              variant="outlined"
              color="primary"
              className={styles.setLimit}
            >
              TERMINATE
            </Button>
          </span>
          <span>
            <Button
              variant="outlined"
              color="primary"
              className={styles.setFuelType}
            >
              RE-ISSUE
            </Button>
          </span>
          <span>
            <Button
              variant="outlined"
              color="primary"
              className={styles.setFuelStation}
            >
              REQUEST TO RE-ACTIVATE
            </Button>
          </span>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    setPageCount(Math.ceil(cardCount / 10));
  }, [cardCount]);

  const getCardList = () => {
    const rowData = props.cardData.map((row: any, index: number) => {
      let checked = selectedRow.find((fleetCardId: string) => {
        return fleetCardId === row.fleetCardId;
      });
      return (
        <CardListTableRows
          row={row}
          key={index}
          index={index}
          checked={checked}
          onChange={selectHandler}
          open={collapsedRow}
          setOpen={setCollapsedRow}
          cardHeadersData={cardHeadersData}
          fuelTypeData={fuelTypeData}
          selectedButton={selectedButton}
          dropdownLists={dropdownLists}
        />
      );
    });
    return rowData;
  };

  return (
    <>
      <div className={classes.paddingWrapper}>
        <div className={classes.search}>
          <OutlinedInput
            id="outlined-adornment-weight"
            className={styles.input}
            placeholder="Search by Name of Card/ Card No./ Mobile No."
            startAdornment={
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
          <p className={styles.count}>
            Showing {(props.currentPageNumber - 1) * 10 + 1} to{" "}
            {props.currentPageNumber != pageCount
              ? props.currentPageNumber * 10
              : cardCount}{" "}
            of {cardCount} cards
          </p>
        </div>

        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" className={styles.cell_short}>
                    <div className={styles.flexAlignCenter}>
                      <Checkbox
                        checked={
                          selectedRow.length > 0 &&
                          selectedRow.length === props.cardData.length
                        }
                        onChange={selectAllCards}
                        size="small"
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </div>
                  </TableCell>
                  <TableCell align="center" className={styles.cell_medium}>
                    <div className={"d-flex justify-content-center flex-fill"}>
                      <div
                        style={{ alignSelf: "center", paddingRight: "10px" }}
                      >
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
                    Name on Card
                  </TableCell>
                  <TableCell align="left" className={styles.cell_long}>
                    Card No.
                  </TableCell>
                  <TableCell align="left" className={styles.cell_long}>
                    Mobile No.
                  </TableCell>
                  <TableCell align="left" className={styles.cell_medium}>
                    Type
                  </TableCell>
                  <TableCell align="right" className={styles.cell_long}>
                    Limit
                  </TableCell>
                  <TableCell align="right" className={styles.cell_medium}>
                    Balance
                  </TableCell>
                  <TableCell
                    align="left"
                    className={styles.cell_short}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.cardData.length > 0 ? (
                  getCardList()
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
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
      </div>
      <div className={classes.tableFooter}>
        <p className={styles.lastUpdated}>
          Last Updated - {moment().format("DD/MM/YYYY, hh:mm a")}
        </p>
        <div>
          <div className={styles.paginationContainer}>
            <Pagination
              page={props.currentPageNumber}
              className={styles.pagination}
              count={pageCount}
              size="small"
              color="primary"
              onChange={(e, page) => {
                props.setCurrentPageNumber(page);
              }}
            />
            {pageCount > 1 ? (
              <div style={{ alignSelf: "center", padding: "0px 1rem" }}>
                <span style={{ color: "#354463" }}>Go to page</span>
                <input
                  value={gotoPage}
                  onChange={(e) => {
                    if (e.target.value && Number(e.target.value) < 1) return;
                    if (Number(e.target.value) > pageCount) return false;
                    setGotoPage(e.target.value);
                  }}
                  style={{ maxWidth: "3rem", margin: "0px 1rem" }}
                />
                <span
                  onClick={() => {
                    props.setCurrentPageNumber(Number(gotoPage));
                  }}
                  style={{ color: "#0369dd", cursor: "pointer" }}
                >
                  Go
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={`d-flex w-100 align-content-center align-items-center ${classes.footer}`}
      >
        <div>
          {/* className={'mr-auto'} */}
          {selectedRow.length > 0 ? (
            <span className={styles.count}>
              {selectedRow.length} Items selected
            </span>
          ) : null}
        </div>
        <div>{getButtonsForCurrentCardStatus()}</div>
      </div>
      <BulkActionCheckDeliveryPopup
        open={openConfirmModal}
        close={() => setOpenConfirmModal(false)}
        closeAndSubmit={handleSubmitCardDeliveryModal}
        title={popupTitle}
        description={popupDescription}
      />
      <BulkActionDeliveryErrorPopup
        open={openErrorPopupModal}
        close={() => setOpenErrorPopupModal(false)}
        title={popupTitle}
        description={popupDescription}
        raiseServiceRequest={raiseServiceRequest}
      />
      <ConfirmCardHotlisting
        open={openHotlistConfirmModal}
        close={() => setOpenHotelistConfirmModal(false)}
        title={popupCardTitle}
        description={popupCardDescription}
        raiseServiceRequest={raiseServiceRequest}
        selectedRowData={selectedRowData}
        closeAndSubmit={handleBlockConfirmationModal}
      />
      <Popup1
        open={openBlockConfirmModal}
        close={() => setOpenBlockConfirmModal(false)}
        closeAndSubmit={handleBlockConfirmationModal}
        title={popupCardTitle}
        // title={popupData.title}
        description={popupCardDescription}
      />
      <Popup4
        open={openBlockSuccessModal}
        close={() => setOpenBlockSuccessModal(false)}
        closeAndSubmit={handleBlockSuccessModal}
        title={popupTitle}
        description={popupDescription}
        btnText="BACK TO CARD MANAGEMENT"
      />
    </>
  );
}
