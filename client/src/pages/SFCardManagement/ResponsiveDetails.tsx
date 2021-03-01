import {
    Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  makeStyles,
  Radio,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import styles from "./CardManagement.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
    color: "#354463",
  },
  drawerLine: {
    display: "flex",
    justifyContent: "center",

    "& div": {
      backgroundColor: "#6e7a93",
      width: "38px",
      height: "4px",
      borderRadius: "8px",
      marginTop: "0.5rem",
    },
  },
  closeIcon: {
    textAlign: "end",
    "& img": {
      margin: "1rem",
      cursor: "pointer",
    },
  },
  cardStatus: {
    fontSize: "13px",
    color: "#1bad3c",
    fontWeight: 600,
  },
  cardLink: {
    fontFamily: "Open Sans",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.62,
    textAlign: "left",
    color: "#0369dd",
  },
  cardHeader: {
    fontFamily: "Open Sans",
    fontSize: "13px",
    fontWeight: 600,
    color: "#354463",
    marginBottom: "1px !important",
  },
  form: {
    fontSize: "13px",
    padding: "0px 0px 0px 1.5rem",
    "& p": {
      marginBottom: "2px",
    },
    "& .fuelSection": {
      //   display: "flex",
      //   justifyContent: "space-between",
      //   width: "16rem",
      marginBottom: "1.5rem",
      "& td:first-child": {
        width: "11rem",
      },
    },
  },
  row: {
    marginBottom: "1.5rem",
  },
}));

const WarningIcon = "/W_Icons_Warning.svg";
const info_image = "/info_logo.svg";
const flag_image = "/flag_logo.svg";

const FuelTypesOptions = ({ labelText }) => {
  return (
    <FormControlLabel
      style={{ display: "block" }}
      control={
        <Checkbox
          size="small"
          color="primary"
          // name={fuelType.code}
          // onChange={onChangeHandler}
          // checked={indexOf(selectedFuelTypes, fuelType.code) > -1}
        />
      }
      label={
        <span
          style={{
            fontSize: "13px",

            whiteSpace: "nowrap",
          }}
        >
          {labelText}
        </span>
      }
    />
  );
};

const RadioFormControl = ({ labelText }) => {
  return (
    <FormControlLabel
      style={{ marginBottom: "0" }}
      control={
        <Radio
          name="limitType"
          size="small"
          color="primary"
          value="dailyMonthly"
          // checked={
          //   ((Number(values.dailyLimit) > 0 || Number(values.monthlyLimit) > 0) &&
          //     values.limitType === "") ||
          //   values.limitType == "dailyMonthly"
          // }
          // onChange={handleLimitTypeChange}
        />
      }
      label={
        <span
          style={{
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          {labelText}
        </span>
      }
    />
  );
};

const FormInput = ({ inputLabel }) => {
  return (
    <>
      <Typography className={`${styles.card_bal} pb-1`} variant="h6">
        {inputLabel}
      </Typography>
      <TextField
        className={`${styles.no_arrow}`}
        type="string"
        inputProps={{ className: styles.input_limit }}
        size="small"
        id="dailyLimit"
        name="dailyLimit"
        // value={values.dailyLimit}
        // value={values.dailyLimit}
        // onChange={handleChange}
        variant="outlined"
        aria-label="Daily Card Limit"
        // error={!!errors.dailyLimit}
        InputProps={
          {
            //   endAdornment: errors?.dailyLimit && (
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <img src={WarningIcon}></img>
            //     </InputAdornment>
            //   ),
            //   ),
          }
        }
      />
    </>
  );
};

const closeIcon = "/close_Icon.svg";

function ResponsiveDetails(props: any) {
  const classes = useStyles();
  const [cardDetails, setCardDetails] = useState<cardDetailsInterface>(
    props.data || {}
  );

  return (
    <div className={classes.root}>
      <span className={classes.drawerLine}>
        <div></div>
      </span>
      <div className={classes.closeIcon}>
        <img
          //   className={`${classes.closeIcon}`}
          src={closeIcon}
          alt="closeIcon"
          onClick={props.onClose}
        />
      </div>
      <Formik
        enableReinitialize
        //   validationSchema={Schema}
        initialValues={{
          fleetCardId: cardDetails.fleetCardId,
          //   allowedFuelTypes: allowedFuelTypes,
          // limitType: limitType,
          adhocLimit: cardDetails.adhocLimit,
          dailyLimit: cardDetails.dailyLimit,
          monthlyLimit: cardDetails.monthlyLimit,
          dailySaleTransaction: cardDetails.dailySaleTransaction,
          monthlySaleTransaction: cardDetails.monthlySaleTransaction,
          cardStatus: cardDetails.cardStatus,
          cardWalletBalance: cardDetails.cardWalletBalance,
          mobileNumber: cardDetails.mobileNumber,
          //   isDisabled: disabled,
        }}
        onSubmit={(values, { setSubmitting }) => {
          // handCardDetailsUpdate(values);
        }}
        //   validate={validate}
      >
        {({
          values,
          errors,
          isValid,
          isSubmitting,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => {
          return (
            <div className={classes.form}>
              <div className="fuelSection">
                <table>
                  <tr>
                    <td style={{ width: "11rem" }}>
                      <Typography className={classes.cardHeader} variant="h6">
                        Balance
                      </Typography>
                      <p>₹ 20,000.00</p>
                    </td>
                    <td>
                      <Typography className={classes.cardHeader} variant="h6">
                        Fuel Stations
                      </Typography>

                      <p>14000 Allowed</p>
                      <p>15000 Blocked</p>
                    </td>
                  </tr>
                </table>
              </div>
              <div className={classes.row}>
                <Typography className={classes.cardHeader} variant="h6">
                  Card Status:
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "10rem",
                  }}
                >
                  <span className={classes.cardStatus}>Active</span>
                  <strong className={classes.cardLink}>
                    View Card Profile
                  </strong>
                </div>
              </div>
              <div className="fuelSection">
                <table>
                  <tr>
                    <td>
                      <Typography className={classes.cardHeader} variant="h6">
                        Card Wallet
                      </Typography>
                      <p>₹ 20,000.00</p>
                    </td>
                    <td>
                      <Typography className={classes.cardHeader} variant="h6">
                        Type
                      </Typography>
                      <p>Physical</p>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="fuelSection">
                <Typography className={classes.cardHeader} variant="h6">
                  Allowed Fuel Types
                </Typography>

                <table>
                  <tr>
                    <td>
                      <FuelTypesOptions labelText="All" />
                    </td>
                    <td>
                      <FuelTypesOptions labelText="LNG" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FuelTypesOptions labelText="Petrol" />
                    </td>
                    <td>
                      <FuelTypesOptions labelText="CNG" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FuelTypesOptions labelText="Speed 97" />
                    </td>
                    <td>
                      <FuelTypesOptions labelText="Speed" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FuelTypesOptions labelText="Diesel" />
                    </td>
                    <td>
                      <FuelTypesOptions labelText="High Speed Diesel" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FuelTypesOptions labelText="Lubricants" />
                    </td>
                  </tr>
                </table>
              </div>
              <div className="fuelSection">
                <Typography className={classes.cardHeader} variant="h6">
                  Limit Type
                </Typography>
                <table>
                  <tr>
                    <td>
                      <RadioFormControl labelText="Daily Card Limit" />
                    </td>
                    <td>
                      <RadioFormControl labelText="Adhoc" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FormInput inputLabel="Daily Card Limit" />
                    </td>
                    <td>
                      <FormInput inputLabel="Monthly Card Limit" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FormInput inputLabel="Mobile No." />
                    </td>
                  </tr>
                </table>
              </div>
              <div className="fuelSection">
                <img src={info_image} alt="info_image" />
                <span className={`${styles.info_msg}`}>
                  Limit set will be affected immediately
                </span>
              </div>
              <div className={"flex-fill"}>
                <strong className={`${styles.card_link}`}>
                  <img src={flag_image} alt="flag_image" />
                  <span> &nbsp; Raise a Service Request</span>
                </strong>
              </div>
              <div style={{marginRight:"1.5rem",padding:"1.5rem 0px"}} >
              <Button
                name="editButton"
                variant="contained"
                color="primary"
                 style={{width:"100%"}}
                // className={`${styles.submit_btn}`}
                // onClick={(event) => {
                //   event.preventDefault();
                //   enableForm();
                // }}
              >
                EDIT DETAILS
              </Button>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default ResponsiveDetails;
