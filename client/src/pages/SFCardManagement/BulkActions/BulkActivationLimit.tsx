import React, { useEffect } from "react";
import SetCardLimitFix from "./SetCardLimitFix";
import SideNav from "../../../components/SideNav/SideNav";
import { setLoader } from "../../../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import CustomSnackbar from "../../../../src/components/CustomSnackbar/CustomSnackbar";
import styles from "../../SFCardManagement/CardManagement.module.scss";
import {
  Button,
  makeStyles,
  Typography,
  Hidden,
  Container,
} from "@material-ui/core";
import { getCardForBulkAction } from "../../../lib/api/SFCardManagement/sfcardmanagement";
import { useRouter } from "next/router"
import { getSearchResultsCardMgt, getOrderedData } from "../../../utility/utils"

const useStyles = makeStyles({
  container: {
    padding: "1rem",
    backgroundColor: "#f9fbff",
  },
  Btn: {
    display: "flex",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "1.3rem 0",
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
  },
  header: {
    padding: "1rem 0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&: .MuiButton-label": {
      fontSize: "14px",
    },
  },
  headerTitle: {
    // paddingLeft: "8px",
    marginBottom: "-57px",
    color: "#0369dd",
    fontSize: "1.75rem",
    fontFamily: "Raleway",
    fontWeight: "bold",
    margin: "0px",
  },
});

export default function SetCardLimit(props: any) {
  const classes = useStyles();
  const [cardData, setCardData] = React.useState(['']);
  const [cardDataPersistent, setCardDataPersistent] = React.useState(['']);
  const [searchText, setSearchText] = React.useState<string>("");
  const [orderBy, setOrderBy] = React.useState("asc");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const selectedFleetCards = useSelector(
    (state) => state.selectedFleetCardsForBulkAction
  );
  const [alertType, setAlertType] = React.useState("error");
  const dispatch = useDispatch();
  const router = useRouter();

  interface fuelTypeInterface {
    code: string;
    displayName: string;
  }

  const BackToCardManagement = () => {
    router.push('/sfcardmanagement')
  }
  
  const cardHeadersData = () => {
    dispatch(setLoader(true));
    getCardForBulkAction({
      cards: selectedFleetCards,
      purpose: "setlimit",
    }).then((response) => {
      if (
        response?.status == "success" &&
        response?.data &&
        response?.data?.fleetCards
      ) {
        setCardData(response.data.fleetCards);
        setCardDataPersistent(response.data.fleetCards);
      } else {
        setCardData([]);
        if (response?.errors) {
          setSnackbarMessage(response?.errors[0]?.message);
          setShowSnackbar(true);
        }
        if (
          response?.message ==
          "Our records show that physical cards have not been dispatched yet"
        ) {
        }
      }
      dispatch(setLoader(false));
    });
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    cardHeadersData();
  }, [selectedFleetCards]);

  useEffect(() => {
    setCardData((prevState: any) => {
      return getSearchResultsCardMgt(searchText, cardDataPersistent);
    });
  }, [searchText]);

  useEffect(() => {
    setCardData((prevState: any) => {
      return getOrderedData(prevState,'slNo',orderBy)
    })
  },[orderBy])

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
        className={`px-1 pr-3 d-flex mw-100 flex-column justify-content-center`}
      >
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography
              variant="h3"
              className={classes.headerTitle}
              gutterBottom
            >
              Set Card Limit
            </Typography>
          </div>
          <SetCardLimitFix
            cardData={cardData}
            selectedFleetCards={selectedFleetCards}
            handleSearchTextChange={handleSearchTextChange}
            searchText={searchText}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
        </div>

        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>
        <div className={`${classes.Btn} pb-4`}>
          <div className={"ml-auto"}>
            <React.Fragment>
              <span>
                <Button
                  variant="outlined"
                  color="primary"
                  className={styles.backCardMgt}
                  onClick={BackToCardManagement}
                >
                  BACK TO CARD MANAGEMENT
                </Button>
              </span>
            </React.Fragment>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
}
