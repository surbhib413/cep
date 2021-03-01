import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
import {
  Typography,
  withStyles,
  createStyles,
  makeStyles,
  Theme,
  WithStyles,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Hidden,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { CustomButton } from "../../../../components/CustomButton/CustomButton";
// import scssStyles from "./DaterangePop.module.scss";
import scssStyles from "./DaterangePopup.module.scss";
import CustomTextField from "../../../../components/CustomTextField/CustomTextField";
import { CustomLabel } from "../../../../components/CustomTextField/CustomLabel";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import defaultLocale from "date-fns/locale/en-US";
import { DateRange } from "react-date-range";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { useSelector } from "react-redux";
import { getRedemptionDateRange } from "../../../../lib/api/smartfleet/rewards/redemptionhistory"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      // padding: theme.spacing(5),
    },
    title: {
      fontWeight: 800,
      color: "#0369dd",
      fontFamily: "Open Sans",

     

    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(2),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
      "&:focus": {
        outline: "none",
      },
    },
    closeButtonMobile: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
      "&:focus": {
        outline: "none",
      },
    },
  });

const CustomDialog = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiDialog-paperFullWidth": {
        width: "100%"
      },
    },
  })
)(Dialog);


const DialogContent = withStyles((theme: Theme) => ({
  root: {
    //paddingLeft: theme.spacing(2),
    overflow: "Hidden"
  },
}))(MuiDialogContent);


const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  
}
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {/* <Typography variant="h3" color="primary" className={classes.title}> */}
      <Typography variant="h3" color="primary" className={classes.title}>
        {children}
      </Typography>
      
      {onClose ? (
        <>
          <Hidden smUp>
            <IconButton
              aria-label="close"
              className={classes.closeButtonMobile}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Hidden>
          <Hidden xsDown>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Hidden>
        </>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function DateRangePopup(props: any) {
  const { dateRangeDialogOpen, handleDaterangeClose } = props;
  const store: any = useSelector((state) => state);
  // const classes = useStyles();
 
  const [originalState, setOriginalState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date();

  const [selectedStartDate, setSelectedStartDate] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(false);
  const handleDateSet = (item: any) => {
    setSelectedStartDate(true);
    setSelectedEndDate(true);
    setState([item.selection]);
    console.log(item.selection, "itemselection");
  };

  

  // Handle save

 
    const handleSave = async (event: any) => {
      setOriginalState(state);

      console.log(event.target.value);
      // console.log(state, "stateeeeeeee");
      let startDate = 
      format(state[0].startDate, "dd-MMM-yyyy", {
        locale: defaultLocale,
      })
      // console.log(startDate,"sttttttart")
      let endDate = 
      format(state[0].endDate, "dd-MMM-yyyy", {
        locale: defaultLocale,
      })
      // console.log(endDate,"enddddddd")
          const fields = { startDate: startDate, endDate:endDate };
          console.log(fields)
          
          const response: any = await getRedemptionDateRange(fields);

          console.log("response data ", response);
          if(response.data.redemptionHistory){
            props.setTableData(response.data.redemptionHistory);
            props.setPetrolmilesRedeemed(response.data.petromilesRedeemed);
            props.setPageCount(response.data.pagination.numberOfPages);
            props.setSelectedSearchTenure(response.data.selectedSearchTenure);
           
          }else{
            props.setTableData([]);
            props.setPetrolmilesRedeemed(response.data.petromilesRedeemed);
            props.setPageCount(response.data.pagination.numberOfPages);
            props.setSelectedSearchTenure(response.data.selectedSearchTenure);
          }
          handleDaterangeClose()
          
    
    };

    const handleResetBtn = () => {
      
      setState(originalState);
      
    };

   
    
  
  return (
    <CustomDialog
      open={dateRangeDialogOpen}
      onClose={handleDaterangeClose}
      aria-labelledby="custom-table-dialog"
      fullWidth={true}
      // maxWidth="lg"
      className={`${scssStyles.customDialogBox} `}
      fullScreen={fullScreen}
    >
      <div className={`d-flex flex-column h-100 px-0 px-sm-3 py-sm-3 `}>
        <DialogTitle id="custom-table-dialog" onClose={handleDaterangeClose}>
          Redemption History
        </DialogTitle>
        
        <DialogContent
          className={`${showCalendar ? scssStyles.dialogContent : ""}`}
        >
          <Typography variant="h6" >Date Range</Typography>
          <Grid container spacing={4} className="mt-0 mt-sm-2 pb-0 pb-sm-4">
            <Grid item xs={12} sm={5}>
              <CustomLabel htmlFor="application-date-from">From</CustomLabel>
              <CustomTextField
                className={`${selectedStartDate && scssStyles.inputBackground}`}
                id="application-date-from"
                variant="outlined"
                name="fromdate"
                onClick={() => setShowCalendar(true)}
                placeholder= "DD MMM YYYY"
                value={format(state[0].startDate, "dd-MMM-yyyy", {
                  locale: defaultLocale,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayOutlinedIcon
                        className={`pr-2 ${scssStyles.calendarIcon}`}
                        color="primary"
                      />
                    </InputAdornment>
                  ),
                }}
              ></CustomTextField>
            </Grid>
            <Grid item xs={12} sm={5} >
              <CustomLabel htmlFor="application-date-to" className={`${scssStyles.dateFieldsto}`}>To</CustomLabel>
              <CustomTextField
                className={`${selectedEndDate && scssStyles.inputBackground}`}
                id="application-date-to"
                variant="outlined"
                name="todate"
                placeholder= "DD MMM YYYY"
                // placeholder={today.toString()}
                value={format(state[0].endDate, "dd MMM yyyy", {
                  locale: defaultLocale,
                })}
                onClick={() => setShowCalendar(true)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayOutlinedIcon
                        className={`pr-2 ${scssStyles.calendarIcon}`}
                        color="primary"
                      />
                    </InputAdornment>
                  ),
                }}
              ></CustomTextField>
            </Grid>
          </Grid>
          {showCalendar && (
            <ClickAwayListener
              onClickAway={() => {
                showCalendar && setShowCalendar(false);
              }}
            >
              <div className={`d-flex ${scssStyles.calanderContainer}`}>
               
                <DateRange
                  onChange={(item: any) => handleDateSet(item)}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={fullScreen ? 1 : 2}
                  ranges={state}
                  direction="horizontal"
                  className={scssStyles.rdrDateRangePickerWrapper}
                  showDateDisplay={false} //For textfields on top
                  // classes={pickerClasses.datePicker}
                />
              </div>
            </ClickAwayListener>
          )}

        </DialogContent>
        <Hidden xsDown>
          <DialogActions className={`${scssStyles.dialogActions} `}>
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={handleResetBtn}
            >
              Reset
            </CustomButton>
            <CustomButton
              onClick={(e) => handleSave(e)}
              variant="contained"
              color="primary"
            >
              Search
            </CustomButton>
          </DialogActions>
        </Hidden>
        <Hidden smUp>
          <DialogActions className={`${scssStyles.dialogActions2}`}>
            <CustomButton
              variant="outlined"
              color="primary"
              // className={`d-flex mr-3`}
              onClick={handleResetBtn}
            >
              Reset
            </CustomButton>
            <CustomButton
              onClick={(e) => handleSave(e)}
              variant="contained"
              color="primary"
            >
             
              Search
            </CustomButton>
          </DialogActions>
        </Hidden>
      </div>
    </CustomDialog>
  );
}
