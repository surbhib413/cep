import React, { useEffect } from "react";
import CardManagementList from "./CardManagement";
import SideNav from "../../components/SideNav/SideNav";
import CardManagementActionBar from "./CardManagementActionBar";
import CardManagementTabs from "./CardManagementTabs";
import {
  getCardHeaders,
  getCardStatusCount,
} from "../../lib/api/SFCardManagement/sfcardmanagement";
import useDebounce from "./useDebounce";
import { setLoader } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
import CustomSnackbar from "src/components/CustomSnackbar/CustomSnackbar";
import { getCardDropDowns } from "../../lib/api/SFCardManagement/sfcardmanagement";

import {
  Button,
  makeStyles,
  Typography,
  Hidden,
  Container,
} from "@material-ui/core";
import { filter } from "lodash";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    marginRight: "1rem",
  },
  paddingWrapper: {
    // padding:"0px 1.2rem",
    paddingLeft: "1.2rem",
    paddingRight: "1.2rem",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
      paddingRight: "0px",
    },
  },
  container: {
    // padding: "1rem",
    // padding:"0px 1.2rem",
    backgroundColor: "#f9fbff",
  },
  addcard: {
    fontSize: "13px",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    letterSpacing: "0.65px",
    textAlign: "center",
    color: "#0369dd",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#0369dd",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  header: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    paddingLeft: "1.2rem",
    paddingRight: "1.2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&: .MuiButton-label": {
      fontSize: "14px",
    },
  },
  headerTitle: {
    color: "#0369dd",
    fontSize: "28px",
    fontFamily: "Raleway",
    fontWeight: "bold",
    margin: "0px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
  },
}));

function index(props: any) {
  const classes = useStyles();
  const [selectedButton, setSelectedButton] = React.useState("Active");
  const [cardData, setCardData] = React.useState([""]);
  const [cardCount, setCardCount] = React.useState(0);
  const [cardStatusCount, setCardStatusCount] = React.useState([]);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(1);
  const [searchText, setSearchText] = React.useState<string>("");
  const [collapsedRow, setCollapsedRow] = React.useState("");
  const [orderBy, setOrderBy] = React.useState("asc");
  const debouncedSearchTerm = useDebounce(searchText, 500);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [fuelTypeData, setFuelTypeData] = React.useState<
    Array<fuelTypeInterface>
  >([]);
  const [selectedRow, setRowSelected] = React.useState<Array<any>>([]);
  const [selectedRowData, setSelectedRowData] = React.useState<Array<any>>([]);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [openHotlistConfirmModal, setOpenHotelistConfirmModal] = React.useState(
    false
  );
  const [openBlockConfirmModal, setOpenBlockConfirmModal] = React.useState(
    false
  );
  const [openBlockSuccessModal, setOpenBlockSuccessModal] = React.useState(
    false
  );
  const initFilterData = {
    status: "Active",
    cardType: "",
    limitType: "",
    fuelType: "",
    page: 0,
    offset: 10,
    searchText: "",
    minBalance: "",
    maxBalance: "",
    orderBy: "asc",
  };
  const [filterData, setFilterData] = React.useState(initFilterData);
  const dispatch = useDispatch();

  interface fuelTypeInterface {
    code: string;
    displayName: string;
  }

  const handleTabButtonClick = (cardStatus: string): any => {
    if (selectedButton != cardStatus) {
      setSearchText("");
      setOrderBy("asc");
      setFilterData({ ...initFilterData, status: cardStatus, searchText: "" });
      setSelectedButton(cardStatus);
      setCurrentPageNumber(1);
    }
  };

  const filterCardData = (filters: any) => {
    setCurrentPageNumber(1);
    setRowSelected([]);
    setSelectedRowData([]);
    setFilterData((prevState) => ({
      ...prevState,
      ...filters,
    }));
  };

  const cardStatusData = () => {
    getCardStatusCount({ state: "all" }).then((response) => {
      if (response && response?.status == "success" && response.data) {
        console.log("card status data", response);
        setCardStatusCount(response.data);
      } else {
        setCardStatusCount([]);
        if (response?.errors) {
          setSnackbarMessage(response?.errors[0]?.message);
          setShowSnackbar(true);
        }
      }
    });
  };

  const cardHeadersData = () => {
    setCollapsedRow("");
    dispatch(setLoader(true));
    getCardHeaders({ ...filterData, page: currentPageNumber - 1 }).then(
      (response) => {
        console.log("response data of card headers data", response);
        if (
          response &&
          response?.status == "success" &&
          response.data &&
          response.data.fleetCards
        ) {
          setCardData(response.data.fleetCards);
          setCardCount(response.data.totalCount);
        } else {
          setCardData([]);
          setCardCount(0);
          if (response?.errors) {
            setSnackbarMessage(response?.errors[0]?.message);
            setShowSnackbar(true);
          }
        }
      }
    );
    dispatch(setLoader(false));
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowSelected([]);
    setSelectedRowData([]);
    setSearchText(event.target.value);
  };

  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      setCurrentPageNumber(1);
      setFilterData((prevState) => ({
        ...prevState,
        searchText: searchText,
      }));
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  );

  useEffect(() => {
    cardHeadersData();
  }, [filterData, currentPageNumber]);

  useEffect(() => {
    getCardDropDowns({ code: "FuelType" }).then((resp) => {
      if (resp?.status == "success" && resp?.data?.fuelType) {
        setFuelTypeData(resp.data.fuelType);
      } else {
        setFuelTypeData([]);
      }
    });
  }, []);

  useEffect(() => {
    cardStatusData();
    setRowSelected([]);
    setSelectedRowData([]);
  }, [selectedButton]);

  useEffect(() => {
    setFilterData((prevState) => ({ ...prevState, orderBy: orderBy }));
  }, [orderBy]);

  return (
    <React.Fragment>
      <Hidden smDown>
        <Container
          className={`pl-1 pr-2 d-flex w-25 mw-100 flex-column bd-highlight`}
        >
          <SideNav></SideNav>
        </Container>
      </Hidden>
      <Container
        className={`px-1  d-flex mw-100 flex-column  ${classes.rootContainer}`}
      >
        <div className={classes.container}>
          {/* <div className={classes.paddingWrapper}> */}
          <div className={`${classes.header}`}>
            <Typography
              variant="h3"
              className={classes.headerTitle}
              gutterBottom
            >
              Card Management
            </Typography>
            <div style={{ alignItems: "center" }}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.addcard}
              >
                ADD CARDS
              </Button>
            </div>
          </div>
          <div className={classes.paddingWrapper}>
            <CardManagementTabs
              cardCountResponse={cardStatusCount}
              selectedButton={selectedButton}
              handleTabButtonClick={handleTabButtonClick}
            ></CardManagementTabs>
            <CardManagementActionBar
              selectedButton={selectedButton}
              filterCardData={filterCardData}
              fuelTypeData={fuelTypeData}
              setOpenConfirmModal={setOpenConfirmModal}
              setOpenBlockConfirmModal={setOpenBlockConfirmModal}
              selectedRow={selectedRow}
              setShowSnackbar={setShowSnackbar}
              setSnackbarMessage={setSnackbarMessage}
              setOpenHotelistConfirmModal={setOpenHotelistConfirmModal}
            ></CardManagementActionBar>
          </div>
          {/* <CardTable /> */}
          <CardManagementList
            dropdownLists={props.dropdownLists}
            cardCountResponse={cardStatusCount}
            selectedButton={selectedButton}
            cardData={cardData}
            currentPageNumber={currentPageNumber}
            setCurrentPageNumber={setCurrentPageNumber}
            handleSearchTextChange={handleSearchTextChange}
            searchText={searchText}
            collapsedRow={collapsedRow}
            setCollapsedRow={setCollapsedRow}
            cardHeadersData={cardHeadersData}
            cardStatusData={cardStatusData}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            cardCount={cardCount}
            fuelTypeData={fuelTypeData}
            selectedRow={selectedRow}
            setRowSelected={setRowSelected}
            selectedRowData={selectedRowData}
            setSelectedRowData={setSelectedRowData}
            openConfirmModal={openConfirmModal}
            setOpenConfirmModal={setOpenConfirmModal}
            openBlockConfirmModal={openBlockConfirmModal}
            setOpenBlockSuccessModal={setOpenBlockSuccessModal}
            openBlockSuccessModal={openBlockSuccessModal}
            setOpenBlockConfirmModal={setOpenBlockConfirmModal}
            setShowSnackbar={setShowSnackbar}
            setSnackbarMessage={setSnackbarMessage}
            openHotlistConfirmModal={openHotlistConfirmModal}
            setOpenHotelistConfirmModal={setOpenHotelistConfirmModal}
          />
        </div>
        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>
      </Container>
    </React.Fragment>
  );
}

export default index;
