import React, { useEffect, useState, useRef } from "react";
import { Container, Grid, Hidden, Typography, InputAdornment, IconButton, Checkbox,SwipeableDrawer,Button,Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import InputBase from '@material-ui/core/InputBase';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { isOnlyNumbers } from "../../../utility/validations/validations";
import { ARROW_ICON, ARROW_ICONDOWN } from "../../SFCardManagement/constants";
import styles from "./RedemptionHistory.module.scss";
import Link from 'next/link';
import { getRedemptionHistoryData } from "../../../../src/lib/api/smartfleet/rewards/redemptionhistory"
import DaterangePopup from "./DaterangePopup/DaterangePopup";
import { lightBlue } from "@material-ui/core/colors";



import CloseIcon from "@material-ui/icons/Close";

const IconEarned = "/w-icon-petromiles-earned-wc.svg";
const IconRedeemed = "/w-icon-petromiles-redeemed.svg";





const useStyles = makeStyles({
  root: {
    width: "100%",
    boxShadow: "none",
    // padding: "0.5rem"
  },
  table: {
    width:"100%",
    backgroundColor: 'transparent',
    borderSpacing: '0 10px !important',
    borderCollapse: 'separate !important'
  },
  container: {
    width:"100%",
    //maxHeight: "120vh",
    minHeight: "70vh",
    "& .MuiTableCell-stickyHeader": {
      padding: "0.3rem",
      fontWeight: "600",
      color: "#354463",
    },
  },
  // margin: {
  //   margin: theme.spacing(1),
  // },
});

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    height: "18px",
    width: "180px",
    '@media(max-width: 600px)': {
      width: "100%",
      alignSelf: "center",
      marginTop: "17px"
    },
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#fff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useRowStyles = makeStyles((theme) => ({

  resDrawer: {
    [theme.breakpoints.up('xs')]: {
      display: "none",
    },
    [theme.breakpoints.down('xs')]: {
      display: "block",
    }
  },
  closeButtonMobile: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    "&:focus": {
      outline: "none",
    },
  },
}));



const RedemptionHistory = (props: any): JSX.Element => {

  const initFields = {
    currentPage: 0,
    pageSize: 0,
    sort: "asc",
    numberOfPages: 0,
    totalNumberOfResults: 2,
    petromilesRedeemed: "1.20 Cr",
    selectedSearchTenure:""
    // dateAndTime:"02 Feb 21, 01:59 PM",
    // petromiles:"269",
    // redemptionAmount:"100.0",
    // redemptionType:"AMAZON_VOUCHER"   
  };
  const [fields, setFields] = React.useState(initFields);
  const classes = useStyles();
  const [TimeRange, setTimeRange] = React.useState('month');
  const [pageCount, setPageCount] = React.useState(fields.numberOfPages);
  const [gotoPage, setGotoPage] = React.useState("");
  const [currentPageNumber, setCurrentPageNumber] = React.useState(fields.currentPage + 1);
  const [tableData, setTableData] = React.useState([]);
  const [dateRangeDialogOpen, setdateRangeDialogOpen] = React.useState(false);
  const [petromilesRedeemed, setPetrolmilesRedeemed] = React.useState("");
  const [selectedSearchTenure, setselectedSearchTenure] = React.useState("");
  const [petromilesEarned, setPetrolmilesEarned] = React.useState("");
  const [open, setOpen] = React.useState(false);


  const isInitialMount = useRef(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const classesRow = useRowStyles();
  const [ dateRangeDialogClose, setdateRangeDialogClose ] = React.useState(false);



  useEffect(() => {
    console.log("inside useffect data", props);
    const { initialData } = props;
    console.log("redemption history api data ", initialData);
    console.log("table data", initialData.redemptionHistory);
    console.log("no of pages", initialData.pagination.numberOfPages);
    // console.log("petromiles earned", initialData.);
    //console.log("Quarterly data",initialQuarterData );



    if (initialData) {
      console.log("initialData", initialData);

      const initialFields = {
        currentPage: initialData?.pagination?.currentPage,
        pageSize: initialData?.pagination?.pageSize,
        sort: initialData?.pagination?.sort,
        numberOfPages: initialData?.pagination?.numberOfPages,
        totalNumberOfResults: initialData?.pagination?.totalNumberOfResults,
        petromilesRedeemed: initialData?.petromilesRedeemed,
        petromilesEarned: initialData?.petromilesEarned,
        selectedSearchTenure: initialData?.selectedSearchTenure

        // dateAndTime:initialData?.redemptionHistory?.dateAndTime,
        // petromiles:initialData?.redemptionHistory?.petromiles,
        // redemptionAmount:initialData?.redemptionHistory?.redemptionAmount,
        // redemptionType:initialData?.redemptionHistory?.redemptionType,

      };
      console.log("initial fields", initialFields);

      setFields(initialFields);
      setTableData(initialData.redemptionHistory);
      setPetrolmilesRedeemed(initialData.petromilesRedeemed);
      setPageCount(initialData.numberOfPages);
      setPetrolmilesEarned(initialData.petromilesEarned);
      setselectedSearchTenure(initialData.selectedSearchTenure);

    }
  }, []);

  useEffect(() => {
    console.log("current page number", currentPageNumber);
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    // } else {
    //   handleChange();
    // }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
      else if(TimeRange === "dateRange"){
        
      
    } else {
      handleChange();
    }

    //setPageCount(fields.numberOfPages);
  }, [currentPageNumber, TimeRange, pageCount]);

  const handleChange = async () => {

    const fields = { searchType: TimeRange, currentPage: currentPageNumber - 1 };

    console.log("search type value in handle change", fields.searchType);
    //setTimeRange(event.target.value);

    const response: any = await getRedemptionHistoryData(fields);
    console.log("response data ", response);
    console.log("petromiles redeemed", response.data.petromilesRedeemed);

    //setCurrentPageNumber(response.pagination.currentPage+1);
    // setTableData(response.data.redemptionHistory);
    // console.log(tableData,"taaaaable")
    // setPetrolmilesRedeemed(response.data.petromilesRedeemed);
    // setPetrolmilesEarned(response.data.petromilesEarned);
    // setPageCount(response.data.pagination.numberOfPages);
    // setdateRangeDialogOpen(true);

    if(response.data.redemptionHistory){
      setTableData(response.data.redemptionHistory);
      setPetrolmilesRedeemed(response.data.petromilesRedeemed);
      setPetrolmilesEarned(response.data.petromilesEarned);
      setselectedSearchTenure(response.data.selectedSearchTenure);

      setPageCount(response.data.pagination.numberOfPages);
    }else{
      setTableData([]);
      setPetrolmilesRedeemed(response.data.petromilesRedeemed);
      setPetrolmilesEarned(response.data.petromilesEarned);
      setselectedSearchTenure(response.data.selectedSearchTenure);

      setPageCount(response.data.pagination.numberOfPages);
    }







    // if (event.target.value==="quarter")
    // {

    //   setQuarterShow(true);
    // setQuarterTableData(props.initialQuarterData.redemptionHistory);
    // }

    // else if(event.target.value==="year"){
    //   setQuarterShow(true);
    //   setQuarterTableData(props.initialQuarterData.redemptionHistory);
    // }

    // else{
    //   setQuarterShow(false);
    //   setTableData(props.initialData.redemptionHistory);

    // }
  };

  // const handleMonth = (event: any) => {

  // }
  // const handleQuater = (event: any) => {
  //   console.log("event", event.target.value);
  //   setQuarterShow(true);
  //   setQuarterTableData(props.initialQuarterData.redemptionHistory);

  // }
  // const handleYear = (event: any) => {

  // }

  const handleDaterangeClose = () => {

    setdateRangeDialogOpen(false);
    

  }
  // const handleSnackbar = () => {

  //   setShowSnackbar(true);
  //   setSnackbarMessage(SnackbarMessage.SAVE_API_SUCCESS);
  //   setAlertType("success");

  // }
  
  const onSelectClick = (event: any) => {
    //setTimeRange(event.target.value);
    if (event.target.value === "dateRange") {
      setdateRangeDialogOpen(true);
      setTimeRange(event.target.value);
      setdateRangeDialogClose(true);
      
    }
    else {
      setTimeRange(event.target.value);
      setdateRangeDialogClose(false);
      
    }



    //setdateRangeDialogOpen(false);

  }

  return (
  <>
    <Container maxWidth="xl" className={styles.root}>

      <Grid container>

        <Hidden smDown>
          <Grid item xs={12} sm={2}>sidebar</Grid>
        </Hidden>
        <Grid item xs={12} sm={10} className={styles.mainGridContainer}>

          <div className={styles.headingContainer}>

            <div>
              <Typography className={styles.heading} color="primary">Redemption History
          </Typography>
            </div>

            <Grid item xs={12} sm={3}>

              <div>

                <FormControl className={styles.formControl}>
                  
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={TimeRange}
                      onChange={(e) => onSelectClick(e)}
                      // onChange={(e) =>setTimeRange(e.target.value)}
                      input={<BootstrapInput />}
                    >
                      {/* <option aria-label="None" value="" /> */}
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                      <option value="dateRange" >Date Range</option>
                      <DaterangePopup
                        dateRangeDialogOpen={dateRangeDialogOpen}
                        handleDaterangeClose={handleDaterangeClose}
                        setTableData={setTableData}
                        setPetrolmilesRedeemed={setPetrolmilesRedeemed}
                        setPageCount={setPageCount}
                        setSelectedSearchTenure={setselectedSearchTenure}
                      ></DaterangePopup>
                    </NativeSelect>
                 
                </FormControl>


              </div>

            </Grid>




          </div>





          {/* START HERE */}
          <Grid container>
            <Grid item xs={12} sm={4}>
              <div className={`${styles.card} ${styles.firstCard}`}>
                <div className={styles.iconContainer}>
                  <img src={IconEarned} alt="" />
                </div>
                <div>
                  <Typography className={styles.pmCount}>{petromilesEarned}</Typography>
                  {dateRangeDialogClose === true ?
                  <Typography className={styles.textBlackish}>Petromiles Earned ({selectedSearchTenure})</Typography>:
                  <Typography className={styles.textBlackish}>Petromiles Earned in {selectedSearchTenure}</Typography>
                  } 
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <div className={`${styles.card} ${styles.middleCard}`}>
                <div className={styles.iconContainer}>
                  <img src={IconRedeemed} alt="" />
                </div>
                <div>
                  <Typography className={styles.pmCount}>{petromilesRedeemed}</Typography>
                  {dateRangeDialogClose === true ?
                  <Typography className={styles.textBlackish}>Petromiles Redeemed ({selectedSearchTenure})</Typography>:
                    <Typography className={styles.textBlackish}>Petromiles Redeemed in {selectedSearchTenure}</Typography>
                  }
                </div>
              </div>
            </Grid>
          </Grid>


         {isMobile?

        // *************** Table on Responsive web******************
         ( <Grid container>
            <Grid item xs={12} sm={12}>
              <div className={styles.border}>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table  className={`${classes.table} ${styles.usersTable}`} aria-label="simple table">
                      <TableHead style={{width:"100%"}}>

                        <TableRow className={styles.rowroot}>

                          <TableCell align="left" className={styles.cell_long}>
                           
                            <div className={styles.rowDivider}>
                            Redemption Type
                            </div>
                            
                          </TableCell>


                          
                          <TableCell align="left" className={styles.cell_medium}>
                          
                          Petromiles
                            
                            
                </TableCell>

                          <TableCell
                            align="left"
                            
                            className={styles.cell_short}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {
                          tableData.length>0?tableData.map((row: any, index: any) => (
                            <TableRow key={`${row.redemptiontype}-${index}`} className={`${styles.tableRow} `}>
                              <TableCell component="th" scope="row">
                                {row.redemptionType}
                              </TableCell>
                              
                              <TableCell align="left" className={styles.subuserName}>{row.petromiles}</TableCell>
                              <TableCell
                            align="left"
                            
                            
                          ><IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => {
                            if (index === open) {
                              setOpen(false);
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
                        </IconButton></TableCell>
                        <SwipeableDrawer
          className={classesRow.resDrawer}
          anchor="bottom"
          open={open === index}
          onClose={() => setOpen(false)}
        // onOpen={()=>{
        //   if (index === open) {
        //     setOpen("");
        //   } else {
        //     setOpen(index);
        //   }
        // }}
        ><>
        <h1 className={styles.sliderDash}></h1>
        <IconButton
              aria-label="close"
              className={classesRow.closeButtonMobile}
              onClick={() => setOpen(false)}
              // onClose={() => setOpen("")}
            >
              <CloseIcon />
            </IconButton>
        <div className={styles.sliderTop}>
       
          <div className={styles.Slider} >Redemption Type </div>
            <div className={styles.sliderMargin}>{row.redemptionType}</div>
           <div className={styles.Slider}>Redemption Amount</div>
            <div  className={styles.sliderMargin}> &#8377;{row.redemptionAmount}</div>
            <div className={styles.sliderFlex}>
           <div className={styles.Slider}>Date and Time </div>
           <div className={styles.Slider}> Petromiles </div>
           </div>
           <div className={styles.sliderFlex}>
           <div className={styles.sliderMargin}>{row.dateAndTime} </div>
         
          <div  className={styles.sliderMargin}>{row.petromiles}</div>
          </div>
          </div>
          </>
          </SwipeableDrawer>
 
                            </TableRow>
                            

                          )): <div>No records found</div> } 
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
              <div className={styles.tableFooter}>

                <div>
                  <div className={styles.paginationContainer}>
                    <Pagination
                      page={currentPageNumber}
                      className={styles.pagination}
                      // count={pageCount}
                      count={isMobile ? 2 : pageCount}
                      color="primary"
                      onChange={(e, page) => {
                        setCurrentPageNumber(page);
                      }}
                    />
                    
                    {pageCount > 1 ? (
                      <div className={styles.paginationdiv}>
                        <span className={styles.goToPage}>Go to page</span>
                        <input
                          value={gotoPage}
                          onChange={(e) => {
                            if (e.target.value && Number(e.target.value) < 1) return false;
                            if (Number(e.target.value) > pageCount ) return false;
                            if (isOnlyNumbers(e.target.value))
                                        return setGotoPage(e.target.value);
                            // setGotoPage(e.target.value);
                          }}
                          className={styles.paginationInput}
                        />
                        <span
                          onClick={(e) => {
                            if ( gotoPage === '' || gotoPage === null) return false;
                            setCurrentPageNumber(Number(gotoPage));
                          }}
                          className={styles.go}
                        >
                          Go
                </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={styles.titleRow}>


                <div className={styles.hrLine}></div>
                <Link href="/rewards/rewards">
                  <Button
                    variant="outlined"
                    color="primary"
                    className={styles.backToRewards}
                  >

                    BACK TO REWARDS
              </Button>
                </Link>

              </div>

            </Grid>
          </Grid>
         )
         
         :
         
    // *******TABLE ON WEB*********     
         (<Grid container>
            <Grid item xs={12} sm={12}>
              <div className={styles.border}>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table  className={`${classes.table} ${styles.usersTable}`} aria-label="simple table">
                      <TableHead>

                        <TableRow className={styles.rowroot}>

                          <TableCell align="left" className={styles.cell_long}>
                           
                            <div className={styles.rowDivider}>
                            Redemption Type
                            </div>
                            
                          </TableCell>


                          <TableCell align="left" className={styles.cell_long}>
                          <div className={styles.rowDivider}>
                          
                          Redemption Amount
                            </div>
                            
                </TableCell>


                          <TableCell align="left" className={styles.cell_long}>
                          <div className={styles.rowDivider}>
                          Date and Time
                            </div>
                            
                </TableCell>
                          <TableCell align="left" className={styles.cell_medium}>
                          
                          Petromiles
                            
                            
                </TableCell>

                          <TableCell
                            align="left"
                            className={styles.cell_short}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {
                          tableData.length>0?tableData.map((row: any, index: any) => (
                            <TableRow key={`${row.redemptiontype}-${index}`} className={`${styles.tableRow} `}>
                              <TableCell component="th" scope="row">
                                {row.redemptionType}
                              </TableCell>
                              <TableCell align="left">&#8377; {row.redemptionAmount}</TableCell>
 
                              <TableCell align="left">{row.dateAndTime}</TableCell>
                              <TableCell align="left" className={styles.subuserName}>{row.petromiles}</TableCell>
 
                            </TableRow>
                          )): <div>No records found</div> } 
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
              <div className={styles.tableFooter}>

                <div>
                  <div className={styles.paginationContainer}>
                    <Pagination
                      page={currentPageNumber}
                      className={styles.pagination}
                      // count={pageCount}
                      count={isMobile ? 3 : pageCount}
                      color="primary"
                      onChange={(e, page) => {
                        setCurrentPageNumber(page);
                      }}
                    />
                    
                    {pageCount > 1 ? (
                      <div className={styles.paginationdiv}>
                        <span className={styles.goToPage}>Go to page</span>
                        <input
                          value={gotoPage}
                          onChange={(e) => {
                            if (e.target.value && Number(e.target.value) < 1) return false;
                            if (Number(e.target.value) > pageCount ) return false;
                            if (isOnlyNumbers(e.target.value))
                                        return setGotoPage(e.target.value);
                            // setGotoPage(e.target.value);
                          }}
                          className={styles.paginationInput}
                        />
                        <span
                          onClick={(e) => {
                            if ( gotoPage === '' || gotoPage === null) return false;
                            setCurrentPageNumber(Number(gotoPage));
                          }}
                          className={styles.go}
                        >
                          Go
                </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={styles.titleRow}>


                <div className={styles.hrLine}></div>
                <Link href="/rewards/rewards">
                  <Button
                    variant="outlined"
                    color="primary"
                    className={styles.backToRewards}
                  >

                    BACK TO REWARDS
              </Button>
                </Link>

              </div>

            </Grid>
          </Grid>)}









        </Grid>
      </Grid>
        {/* <CustomSnackbar
                  open={showSnackbar}
                  close={setShowSnackbar}
                  type={alertType}
                  message={snackbarMessage}
        ></CustomSnackbar> */}
    </Container>
    
    </>
  );
};

export default RedemptionHistory;