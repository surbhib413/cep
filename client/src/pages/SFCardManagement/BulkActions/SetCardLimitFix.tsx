import {
  React,
  useRouter,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
  Alert
} from "../../../utility/general-imports";
import SetCardLimitTableRow from "./SetCardLimitTableRow";
import styles from "../../SFCardManagement/CardManagement.module.scss";
import { SucessCardMsg } from "./dialogs/SucessCardMsg"
import { setBulkLimit } from "src/lib/api/SFCardManagement/sfcardmanagement";
import NoRecordsFound from "../../../components/CardManagement/NoRecordsFound";
import {
  ICON_CROSS,
  NO_RECORDS_FOUND,
  NO_RECORDS_FOUND_DESC,
  NO_RECORDS_FOUND_SUGGESSION
} from "../constants";

const useStyles = makeStyles({
  root: {
    width: "100%",
    boxShadow: "none",
    // padding: "0.5rem"
  },
  note: {
    // height: "121px",
    padding:"0.8125rem 2rem 0.8125rem 0px",
    background: "#eff3fa",
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontSize: "13px",
  },
  no_padding: {
    " & .MuiTableCell-root": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  container: {
    //maxHeight: "120vh",
    // backgroundColor:"#fff",
    overflow:"none",
    // minHeight: "70vh",
    "& .MuiTableCell-stickyHeader": {
      padding: "0.3rem",
      fontWeight: "600",
      color: "#354463",
    },
  },
  errorStyle:{
    position:"absolute",
    width:"19rem",
    fontStyle:"normal",
    zIndex:99,
    color:"#354463",
    fontSize:"13px",
    padding:"3px 1rem"
  }
});

const Icon_NoRecords = "/Icon_No_Records_Found.svg";
const Icon_Search = "/icon_search_card.svg";
const info_image = "/info_logo.svg";

export default function SetCardLimitFix(props: any) {
  const classes = useStyles();
  const [limitType, setLimittype] = React.useState("daily");
  const [adhocLimit, setAdhocLimit] = React.useState("");
  const [dailyLimit, setDailyLimit] = React.useState("");
  const [monthlyLimit, setMonthlyLimit] = React.useState("");
  const [openSetLimitResultsModal, setOpenSetLimitResultsModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [failedMessage, setFailedMessage] = React.useState([]);
  const [failedCards, setFailedCards] = React.useState([]);
  const [limitError, setLimitError] = React.useState("");
  const sortIconAsc = "/W_Icon_Order.svg";
  const sortIconDesc = "/W_Icon_Order_Desc.svg";
  // console.log(limitError)
  const {
    orderBy,
    setOrderBy,
  } = props;
  const router = useRouter();

  const BackToCardManagement = () => {
    router.push('/sfcardmanagement')
  }

  const handleSubmit=(e:any)=>{
    if(!props.cardData.length) return false;
    
    if(Number(dailyLimit)>Number(monthlyLimit)){
      setLimitError("Daily card limit cannot be less than the monthly card limit")
    }
    let finalData;

    if(limitType==="adhoc" && adhocLimit){
      finalData={adhocLimit:adhocLimit,dialyLimit:"",monthlyLimit:"",isAdhocLimit:true,selectedCards:props.selectedFleetCards}
    }
    else if(limitType==="daily" && dailyLimit && monthlyLimit){
      finalData={adhocLimit:"",dialyLimit:dailyLimit,monthlyLimit:monthlyLimit,isAdhocLimit:false,selectedCards:props.selectedFleetCards}
    }
    setBulkLimit(finalData).then((resp) => {
      if(resp && (resp?.status == 'updated' || resp?.status == 'FAILED' || resp?.status == 'failed')){
        setOpenSetLimitResultsModal(true);
        setSuccessMessage(resp?.data?.successMessage ? resp.data.successMessage : '');
        setFailedMessage(resp?.data?.failureMessage ? resp.data.failureMessage : []);
        setFailedCards(resp?.data?.failedCards ? resp.data.failedCards : []);
      }
    })
    setLimitError("")
  }

  const handleAdhocLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;

    if(isNaN(targetValue) || targetValue.length > 7){
      event.preventDefault();
      return false;
    }
    setDailyLimit("");
    setMonthlyLimit("");
    setAdhocLimit(targetValue);
  }

  const handleDailyLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;

    if(isNaN(targetValue) || targetValue.length > 7){
      event.preventDefault();
      return false;
    }
    setDailyLimit(targetValue);
    setAdhocLimit("");
  }

  const handleMonthlyLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;

    if(isNaN(targetValue) || targetValue.length > 7){
      event.preventDefault();
      return false;
    }
    setMonthlyLimit(targetValue);
    setAdhocLimit("")
  }

  const getCardList = () => {
    const rowData = props.cardData.map((row: any, index: number) => {
      return (
        <SetCardLimitTableRow row={row}/>
      );
    });
    return rowData;
  };

  const resetFormData = () => {
    setLimittype('daily')
    setAdhocLimit('')
    setDailyLimit('')
    setMonthlyLimit('')
  }

  return (
    <>
      <div className={styles.search_limit}>
        <TableContainer className={classes.container}>
          <Table style={{ marginTop: "20px" }}>
            <TableBody>
              <TableRow className={classes.no_padding}>
                <TableCell className={styles.no_border} style={{paddingBottom:"1rem",paddingLeft:"6px",backgroundColor:"#fff"}}>
                  <Typography
                    className={`${styles.card_limit_heading}`}
                    variant="h6"
                  >
                    Limit Type
                  </Typography>
                  <TableRow className={classes.no_padding}>
                    <TableCell className={styles.no_border}>
                       <FormControlLabel
                        className={`${styles.radio_btn_limit}`}
                        control={
                          <Radio
                            name="limitType"
                            size="small"
                            color="primary"
                            value="adhoc"
                            checked={limitType==="adhoc"}
                            onChange={()=>setLimittype("adhoc")}
                          />
                        }
                        label={<span style={{ fontSize: "13px" }}>Adhoc</span>}
                      />
                      <FormControlLabel
                        className={`${styles.radio_btn_limit}`}
                        control={
                          <Radio
                            name="limitType"
                            size="small"
                            color="primary"
                            value="dailyMonthly"
                            checked={limitType==="daily"}
                            onChange={()=>setLimittype("daily")}
                          />
                        }
                        label={
                          <span
                            style={{
                              fontSize: "13px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Daily & Monthly
                          </span>
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.no_padding}>
                    <TableCell
                      className={styles.no_border}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingLeft: "20px",
                      }}
                    >
                      {limitType==="adhoc" && <span>
                        <Typography
                          className={`${styles.card_bal_limit} pb-1`}
                          variant="h6"
                        >
                          Adhoc Card Limit
                        </Typography>
                        <TextField
                          className={`${styles.no_arr}`}
                          type="string"
                          style={{ marginRight: "5px" }}
                          inputProps={{ className: styles.input_limit_bulk }}
                          size="small"
                          id="dailyLimit"
                          value={adhocLimit}
                          onChange={handleAdhocLimitChange}
                          variant="outlined"
                          aria-label="Adhoc Card Limit"
                        />
                        </span>} 
                        {limitType==="daily" && 
                        <>  <span style={{position:"relative"}}>
                        <Typography
                          className={`${styles.card_bal_limit} pb-1`}
                          variant="h6"
                        >
                          Daily Card Limit
                        </Typography>
                        <TextField
                          className={`${styles.no_arr}`}
                          type="string"
                          style={{ marginRight: "5px" }}
                          inputProps={{ className: styles.input_limit_bulk }}
                          size="small"
                          id="dailyLimit"
                          name="dailyLimit"
                          value={dailyLimit}
                          error={Boolean(limitError)}
                          onChange={handleDailyLimitChange}
                          variant="outlined"
                          aria-label="Daily Card Limit"
                        />
                        {limitError &&  <Alert icon={<img
                          src={ICON_CROSS}
                          style={{ cursor: "pointer" }}
                          onClick={(event) => setOrderBy("desc")}
                        />} className={classes.errorStyle}  severity="error">{limitError}</Alert>}
                      </span>
                      <span>
                        <Typography
                          className={`${styles.card_bal_limit} pb-1`}
                          variant="h6"
                        >
                          Monthly Card Limit
                        </Typography>
                        <TextField
                          style={{ marginRight: "5px" }}
                          className={`${styles.no_arr}`}
                          type="string"
                          inputProps={{ className: styles.input_limit_bulk }}
                          size="small"
                          id="monthlyLimit"
                          name="monthlyLimit"
                          value={monthlyLimit}
                          onChange={handleMonthlyLimitChange}
                          variant="outlined"
                          aria-label="Monthly Card Limit"
                        />
                      </span></>}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.no_padding}>
                    <TableCell
                      className={styles.no_border}
                      style={{
                        paddingLeft: "20px",
                        paddingTop: "16px",
                        paddingBottom: "16px",
                      }}
                    >
                      <img src={info_image} alt="info_image" />
                      <span className={`${styles.info_msg_limit}`}>
                        Limit set will be affected immediately
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.no_border}>
                      <span>
                        <Button
                          variant="outlined"
                          color="primary"
                          className={styles.cancel}
                          onClick={resetFormData}
                        >
                          CANCEL
                        </Button>
                      </span>
                      <span>
                        <Button
                          variant="outlined"
                          color="primary"
                          className={styles.Submit}
                          onClick={handleSubmit}
                        >
                          APPLY
                        </Button>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableCell>
                <TableCell
                  style={{minWidth:"20rem", verticalAlign:"top",paddingTop:"1.3rem",backgroundColor:"#fff" }}
                  className={styles.no_border}

                >
                  <div className={classes.note}>
                    <span
                      className={`pt-4, pl-4`}
                      style={{ lineHeight: "30px", fontWeight: "600" }}
                    >
                      Note
                    </span>
                    <ul>
                      <li style={{ lineHeight: 1.38, paddingBottom: "8px" }}>
                        Daily card limit cannot be more than monthly card limit
                      </li>
                      <li style={{ lineHeight: 1.38 }}>
                        Daily and monthly card limits should be more than their
                        respective sale transactions{" "}
                      </li>
                    </ul>
                  </div>
                </TableCell>
              </TableRow>
              {/* <TableRow> */}
                <TableCell className={`${styles.pad_top}`}>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    className={styles.input}
                    placeholder="Search by Name of Card/ Card Number"
                    endAdornment={
                      <InputAdornment position="start">
                        <img src={Icon_Search} className={styles.searchIcon} />
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
                </TableCell>
              {/* </TableRow> */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader>
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
                          src={sortIconAsc}
                          style={{ cursor: "pointer" }}
                          onClick={(event) => setOrderBy("desc")}
                        />
                      ) : (
                        <img
                          src={sortIconDesc}
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
                  Sales Transaction
                </TableCell>
                <TableCell align="left" className={styles.cell_last}>
                  Current Limit
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
      <SucessCardMsg
          open={openSetLimitResultsModal}
          close={() => setOpenSetLimitResultsModal(false)}
          closeAndSubmit={() => setOpenSetLimitResultsModal(false)}
          successMessage={successMessage}
          failedMessage={failedMessage}
          failedCards={failedCards}
          BackToCardManagement={BackToCardManagement}
      />          
    </>
  );
}