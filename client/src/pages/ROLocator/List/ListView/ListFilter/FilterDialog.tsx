import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import {
  Typography,
  withStyles,
  createStyles,
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
import { CustomButton } from "../../../../../components/CustomButton/CustomButton";
import scssStyles from "./FilterDialog.module.scss";
import CustomTextField from "../../../../../components/CustomTextField/CustomTextField";
import { CustomLabel } from "../../../../../components/CustomTextField/CustomLabel";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import defaultLocale from "date-fns/locale/en-US";
import { DateRange, DefinedRange, defaultStaticRanges } from "react-date-range";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { useSelector } from "react-redux";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      // padding: theme.spacing(5),
    },
    title: {
      fontWeight: "bold",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(5),
      top: theme.spacing(3),
      color: theme.palette.grey[500],
      "&:focus": {
        outline: "none",
      },
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
  });

const CustomFilter = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiDialogContent-root": {
        overflowY: "unset",
      },
    },
  })
)(Dialog);

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
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

function FilterDialog(props: any) {
  const { filterDialogOpen, closeFilterDialog, selectedFilters } = props;
  const store: any = useSelector((state) => state);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const staticRanges = [
    defaultStaticRanges[2],
    defaultStaticRanges[4],
    defaultStaticRanges[5],
  ];

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date();

  const [selectedStartDate, setSelectedStartDate] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(false);
  const handleDateSet = (item: any) => {
    setSelectedStartDate(true);
    setSelectedEndDate(true);
    setState([item.selection]);
  };
  return (
    <CustomFilter
      open={filterDialogOpen}
      onClose={closeFilterDialog}
      aria-labelledby="filter-table-dialog"
      fullWidth={true}
      maxWidth="md"
      fullScreen={fullScreen}
    >
      <div className="d-flex flex-column h-100 px-0 px-sm-5 py-sm-3 py-3">
        <DialogTitle id="filter-table-dialog" onClose={closeFilterDialog}>
          Filter
        </DialogTitle>

        <div className={`d-flex flex-column ${scssStyles.filterCustom} px-0 px-sm-4 py-sm-3 py-3`}>
        {
          props?.initialData?.topFilter ?
            <>
              <Typography variant="h6">Top Filter</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.topFilter.map((item: any, index: any) => {
                    let checked = false;
                    selectedFilters.map((filter : any) => {
                      if(filter.code === "topFilter-"+item.code) {
                        checked = true;
                      }
                    }) 
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"topFilter-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              checked = {checked}
                              // checked={fields.iocl}
                              onChange={(e) => props.onChangeCheckedBox(e, item.displayName)}
                              // name="highspeed"
                              name={"topFilter-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }
        {
          props?.initialData?.amenities ?
            <>
              <Typography variant="h6">Amenities</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.amenities.map((item: any, index: any) => {

                    let checked = false;
                    selectedFilters.map((filter : any) => {
                      if(filter.code === "amenities-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"amenities-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              // checked={fields.iocl}
                              checked = {checked}
                              onChange={(e) => props.onChangeCheckedBox(e, item.displayName)}
                              // name="highspeed"
                              name={"amenities-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }
        {
          props?.initialData?.fuelStationCategory ?
            <>
              <Typography variant="h6">Fuel Station Category</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.fuelStationCategory.map((item: any, index: any) => {

                    let checked = false;
                    selectedFilters.map((filter : any) => {
                      if(filter.code === "fuelStationCategory-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"fuelStationCategory-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              // checked={fields.iocl}
                              checked = {checked}
                              onChange={(e) => props.onChangeCheckedBox(e, item.displayName)}
                              // name="highspeed"
                              name={"fuelStationCategory-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }

{
          props?.initialData?.fuelType ?
            <>
              <Typography variant="h6">Fuel Type</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.fuelType.map((item: any, index: any) => {

                    let checked = false;
                    selectedFilters.map((filter : any) => {
                      if(filter.code === "fuelType-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"fuelType-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              // checked={fields.iocl}
                              checked = {checked}
                              onChange={(e) => props.onChangeCheckedBox(e, item.displayName)}
                              // name="highspeed"
                              name={"fuelType-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }

{
          props?.initialData?.lessAmenities ?
            <>
              <Typography variant="h6">Less Amenities</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.lessAmenities.map((item: any, index: any) => {

                    let checked = false;
                    selectedFilters.map((filter : any) => {
                      if(filter.code === "lessAmenities-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"lessAmenities-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              // checked={fields.iocl}
                              checked = {checked}
                              onChange={(e) => props.onChangeCheckedBox(e, item.displayName)}
                              // name="highspeed"
                              name={"lessAmenities-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }

      </div>
    
        
        <Hidden xsDown>
          <DialogActions>
            <CustomButton
              onClick={props.clickReset}
              variant="outlined"
              color="primary"
            >
              Reset Filter
            </CustomButton>
            <CustomButton
              onClick={props.clickApply}
              variant="contained"
              color="primary"
            >
              Apply
            </CustomButton>
          </DialogActions>
        </Hidden>
        <Hidden smUp>
          <DialogActions className={`d-flex justify-content-center`}>
            <CustomButton
              onClick={props.clickReset}
              variant="outlined"
              color="primary"
              className={`d-flex mr-3`}
            >
              Reset Filter
            </CustomButton>
            <CustomButton
              onClick={props.clickApply}
              variant="contained"
              color="primary"
            >
              Apply
            </CustomButton>
          </DialogActions>
        </Hidden>
      </div>
    </CustomFilter>
  );
}

export default React.memo(FilterDialog);