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
import { CustomButton } from "../../components/CustomButton/CustomButton";
import scssStyles from "./FilterDialog.module.scss";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
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

export default function FilterDialog(props: any) {
  const { filterDialogOpen, closeFilterDialog } = props;
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
        <DialogContent
          className={`${showCalendar ? scssStyles.dialogContent : ""}`}
        >
          <Typography variant="h6">Application Date</Typography>
          <Grid container spacing={4} className="mt-0 mt-sm-2 pb-0 pb-sm-4">
            <Grid item xs={6} sm={4}>
              <CustomLabel htmlFor="application-date-from">From</CustomLabel>
              <CustomTextField
                className={`${selectedStartDate && scssStyles.inputBackground}`}
                id="application-date-from"
                variant="outlined"
                name="registeredAddressLine1"
                onClick={() => setShowCalendar(true)}
                placeholder={today.toString()}
                value={format(state[0].startDate, "dd MMM yyyy", {
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
            <Grid item xs={6} sm={4}>
              <CustomLabel htmlFor="application-date-to">To</CustomLabel>
              <CustomTextField
                className={`${selectedEndDate && scssStyles.inputBackground}`}
                id="application-date-to"
                variant="outlined"
                name="registeredAddressLine1"
                placeholder={today.toString()}
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
                <DefinedRange
                  onChange={(item: any) => setState([item.selection])}
                  ranges={state}
                  staticRanges={staticRanges}
                  inputRanges={[]}
                  className={`${scssStyles.definedRanges}`}
                />

                <DateRange
                  onChange={(item: any) => handleDateSet(item)}
                  // onShownDateChange=
                  // {(item: any) => {
                  //   console.log(item);
                  //   setShowCalendar(false);
                  // }}
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

          {props.tabValue === 0 || props.tabValue === 2 ? (
            <>
              {props.tabValue === 0 ? (
                <>
                  <Typography variant="h6">KYC Status</Typography>
                  <Grid container className={`pb-0 pb-sm-4`}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Not Submitted"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Pending Approval"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Approved"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Rejected"
                      />
                    </Grid>
                  </Grid>
                </>
              ) : null}

              {store.role === "SO" ? null : (
                <>
                  <Typography variant="h6" className={`pt-3`}>
                    Payment Status
                  </Typography>
                  <Grid container className={`pb-0 pb-sm-4`}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Paid at Fuel Station"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Fees Not Applicable"
                      />
                    </Grid>

                    {props.tabValue === 0 ? (
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        className={`${scssStyles.gridHeight}`}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              // checked={fields.iocl}
                              // onChange={handleCheckboxChange}
                              name="iocl"
                            />
                          }
                          label="Payment Pending"
                        />
                      </Grid>
                    ) : null}

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${scssStyles.gridHeight}`}
                    >
                      <FormControlLabel
                        className={`mb-0`}
                        control={
                          <Checkbox
                            color="primary"
                            // checked={fields.iocl}
                            // onChange={handleCheckboxChange}
                            name="iocl"
                          />
                        }
                        label="Request for fee waiver approved"
                      />
                    </Grid>

                    {props.tabValue === 0 ? (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          className={`${scssStyles.gridHeight}`}
                        >
                          <FormControlLabel
                            className={`mb-0`}
                            control={
                              <Checkbox
                                color="primary"
                                // checked={fields.iocl}
                                // onChange={handleCheckboxChange}
                                name="iocl"
                              />
                            }
                            label="Request for fee waiver pending"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          className={`${scssStyles.gridHeight}`}
                        >
                          <FormControlLabel
                            className={`mb-0`}
                            control={
                              <Checkbox
                                color="primary"
                                // checked={fields.iocl}
                                // onChange={handleCheckboxChange}
                                name="iocl"
                              />
                            }
                            label="Request for fee waiver rejected"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          className={`${scssStyles.gridHeight}`}
                        >
                          <FormControlLabel
                            className={`mb-0`}
                            control={
                              <Checkbox
                                color="primary"
                                // checked={fields.iocl}
                                // onChange={handleCheckboxChange}
                                name="iocl"
                              />
                            }
                            label="Payment Verification Pending"
                          />
                        </Grid>
                      </>
                    ) : null}
                  </Grid>
                </>
              )}
            </>
          ) : null}

          {props.tabValue === 0 || props.tabValue === 2 ? (
            store.role === "SO" ? (
              <>
                <Typography variant="h6" className={`pt-3`}>
                  Loyality Type
                </Typography>
                <Grid container className={`pb-0 pb-sm-4`}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    className={`${scssStyles.gridHeight}`}
                  >
                    <FormControlLabel
                      className={`mb-0`}
                      control={
                        <Checkbox
                          color="primary"
                          // checked={fields.iocl}
                          // onChange={handleCheckboxChange}
                          name="PetroCorporate"
                        />
                      }
                      label="PetroCorporate"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    className={`${scssStyles.gridHeight}`}
                  >
                    <FormControlLabel
                      className={`mb-0`}
                      control={
                        <Checkbox
                          color="primary"
                          // checked={fields.iocl}
                          // onChange={handleCheckboxChange}
                          name="SmartDrive"
                        />
                      }
                      label="SmartDrive"
                    />
                  </Grid>
                </Grid>
              </>
            ) : null
          ) : null}
        </DialogContent>
        <Hidden xsDown>
          <DialogActions>
            <CustomButton
              // onClick={closeFilterDialog}
              variant="outlined"
              color="primary"
            >
              Reset Filter
            </CustomButton>
            <CustomButton
              onClick={closeFilterDialog}
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
              // onClick={closeFilterDialog}
              variant="outlined"
              color="primary"
              className={`d-flex mr-3`}
            >
              Reset Filter
            </CustomButton>
            <CustomButton
              onClick={closeFilterDialog}
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
