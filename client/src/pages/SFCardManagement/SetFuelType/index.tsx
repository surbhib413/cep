import {
  React,
  useState,
  useDispatch,
  useSelector,
  useRouter,
  useEffect,
  Checkbox,
  Container,
  FormControlLabel,
  Hidden,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "../../../utility/general-imports";
import { CustomButton } from "src/components/CustomButton/CustomButton";
import SideNav from "src/components/SideNav/SideNav";
import styles from "../CardManagement.module.scss";
import { setLoader } from "../../../redux/actions/actions";
import { getCardDropDowns, getCardForBulkAction, setBulkFuelType } from "../../../lib/api/SFCardManagement/sfcardmanagement";
import { getSearchResultsCardMgt, getOrderedData } from "../../../utility/utils"
import { Popup4 } from "../../../components/CustomPopups/Popup4/Popup4";
import NoRecordsFound from "../../../components/CardManagement/NoRecordsFound"
import {
  SORT_ICON_ASC,
  SORT_ICON_DESC,
  ICON_SEARCH,
  ICON_INFO,
} from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f9fbff",
    justifyContent: "space-between",
  },
  container: {
    "& .MuiTableCell-stickyHeader": {
        padding: "0.2rem",
        fontWeight: "600",
        color: "#354463",
    },
    "& .MuiTableCell-root": {
        fontSize: "13px"
    },
    '&::-webkit-scrollbar': {
        width: '0.4em'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
    }
  },
  header: {
    padding: "0.6rem 0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&: .MuiButton-label": {
      fontSize: "14px",
    },
  },
  headerTitle: {
    paddingLeft: "8px",
    color: "#0369dd",
    fontFamily: "Raleway",
    fontWeight: "bold",
    margin: "0px",
  },
  marginWrapper: {
    margin: "0rem 1.2rem",
  },
  search: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  tableBody: {
    backgroundColor: "#fff",
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
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    padding: "1rem 1rem",
  },
}));

const CheckBoxForm = ({ text, indexKey, selectFuelType }) => {
  return (
    <TableCell width="20%" style={{ padding: "0px", borderBottom: "none" }}>
      <FormControlLabel
        control={
          <Checkbox
            name={indexKey}
            size="small"
            color="primary"
            key={indexKey}
            onChange={selectFuelType}
          />
        }
        label={
          <span
            style={{
              fontSize: "13px",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        }
      />
    </TableCell>
  );
};

const fuelTypes = {
  All: false,
  Disel: false,
  CNG: false,
  Petrol: false,
  Lubricants: false,
  speed: false,
  speed_97: false,
  LNG: false,
  high_speed_diesel: false,
};

function index(props:any) {
  const classes = useStyles();
  const [cardData, setCardData] = React.useState(['']);
  const [fuelTypeData, setFuelTypeData] = React.useState([]);
  const [fuelType, setFuelType] = React.useState([]);
  const [cardDataPersistent, setCardDataPersistent] = React.useState(['']);
  const [searchText, setSearchText] = React.useState<string>("");
  const [orderBy, setOrderBy] = React.useState("asc");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [popupTitle, setPopupTitle] = React.useState('');
  const [popupDescription, setPopupDescription] = React.useState('');
  const [openSuccessModel, setOpenSuccessModel] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedFleetCards = useSelector(
    (state) => state.selectedFleetCardsForBulkAction
  );

  const cardHeadersData = () => {
    dispatch(setLoader(true));
    getCardForBulkAction({
      cards: selectedFleetCards,
      purpose: "setFuelType",
    }).then((response) => {
      if (
        response?.status == "success" &&
        response?.data &&
        response?.data?.fleetCards
      ) {
        setCardData(response.data.fleetCards);
        setCardDataPersistent(response.data.fleetCards);
      } 
      else {
        setCardData([]);
        if (response?.errors) {
          setSnackbarMessage(response?.errors[0]?.message);
          setShowSnackbar(true);
        }
      }
      dispatch(setLoader(false));
    });
  };

  const selectFuelType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if(target.checked){
      setFuelType((prevState:any) => [...prevState,event.target.name])
    }
    else{
      setFuelType((prevState:any) => {
        return prevState.filter((value:any,index:number) => {
          return value != target.name
        })
      })
    }
  }

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const BackToCardManagement = () => {
    router.push('/sfcardmanagement')
  }

  const handleSubmit = () => {
    const data = {
      allowedFuelTypes: fuelType,
      selectedCards: selectedFleetCards
    }
    setBulkFuelType(data).then((resp) => {
      if(resp?.data?.status == 'Updated'){
        setPopupTitle(`Fuel type for ${selectedFleetCards.length} cards set successfully`);
        setPopupDescription(resp?.data?.message);
        setOpenSuccessModel(true);
      }
    })
  }

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

  useEffect(() => {
    cardHeadersData();
  },[]);

  useEffect(() => {
    getCardDropDowns({ code: 'FuelType' }).then((resp) => {
      if (resp?.status == 'success' && resp?.data?.fuelType) {
        setFuelTypeData(resp.data.fuelType);
      }
      else {
        setFuelTypeData([]);
      }
    });
  }, [])

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
        className={`${classes.root} p-0 mr-4 ml-3 d-flex mw-100 flex-column`}
      >
        <div>
          <div className={classes.container}>
            <div className={classes.header}>
              <Typography
                variant="h3"
                className={classes.headerTitle}
                gutterBottom
              >
                Set Fuel Type
              </Typography>
            </div>
          </div>
          <div
            style={{ backgroundColor: "#fff" }}
            className={classes.marginWrapper}
          >
            <div style={{ margin: "1rem" }}>
              <TableContainer>
                <Table style={{ width: "75%" }}>
                  <TableBody>
                    <TableRow>
                      {
                        fuelTypeData.map((fuelType:any,index:number) => {
                          if(index < 5){
                            return (
                              <CheckBoxForm
                                text={fuelType.displayName}
                                indexKey={fuelType.code}
                                selectFuelType={selectFuelType}
                              />
                            )
                          }
                        })
                      }
                    </TableRow>
                    <TableRow>
                      {
                          fuelTypeData.map((fuelType:any,index:number) => {
                            if(index >= 5){
                              return (
                                <CheckBoxForm
                                  text={fuelType.displayName}
                                  indexKey={fuelType.code}
                                  selectFuelType={selectFuelType}
                                />
                              )
                            }
                          })
                        }
                    </TableRow>
                  </TableBody>
                </Table>
                <div>
                  <img src={ICON_INFO} alt="info_image" />
                  <span className={`${styles.info_msg}`}>
                    Fuel type set will be affected immediately
                  </span>
                </div>
              </TableContainer>
            </div>
          </div>
          <div className={`${classes.marginWrapper} ${classes.search}`}>
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
              onChange={handleSearchTextChange}
            />
          </div>
          {/* <Paper className={classes.root}> */}
          <TableContainer className={classes.container}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
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
                  <TableCell align="left">
                    Name of Card
                  </TableCell>
                  <TableCell align="left">
                    Card No.
                  </TableCell>
                  <TableCell align="left">
                    Allowed Fuel Types
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {true ? (
                  cardData.map((cardRowData:any, index:number) => {
                    return (
                      <TableRow key={index} className={classes.tableBody}>
                        <TableCell align="center">{cardRowData.slNo}</TableCell>
                        <TableCell>{cardRowData.cardname}</TableCell>
                        <TableCell>{cardRowData.fleetCardId}</TableCell>
                        <TableCell>
                          {cardRowData.fuelType ? cardRowData.fuelType.join(", ") : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
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
        </div>
        <div className={classes.footer}>
          <CustomButton
            variant="outlined"
            color="primary"
            className={`${styles.backToEnrolmentBtn} mr-4`}
            style={{ width: "16rem" }}
            onClick={BackToCardManagement}
          >
            Back to Card Management
          </CustomButton>
          <CustomButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
           Submit
          </CustomButton>
        </div>
      </Container>
      <Popup4
        open={openSuccessModel}
        close={() => setOpenSuccessModel(false)}
        closeAndSubmit={BackToCardManagement}
        title={popupTitle}
        description={popupDescription}
        btnText="BACK TO CARD MANAGEMENT"
      />
    </React.Fragment>
  );
}

export default index;
