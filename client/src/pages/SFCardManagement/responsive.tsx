import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import { getCardDetails } from "../../lib/api/SFCardManagement/sfcardmanagement";
import {
  Button,
  Typography,
  TableRow,
  Grid,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@material-ui/core";
import { filter, concat, toString } from "lodash";
import styles from "./CardManagement.module.scss";
import { Formik } from "formik";
import { CurrencyFormat, valueInLacs } from "src/utility/utils";
import FuelTypesOptions from "../../components/CardManagement/FuelTypes";
import { setLoader } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Alert } from "@material-ui/lab";
const phoneRegExp = /^[789]\d{9}$/;

const useRowStyles = makeStyles({
  row: {
    "& .MuiTableCell-root": {
      //borderBottom: "10px solid #f9fbff",
      verticalAlign: "top",
    },
  },
});

const Schema = Yup.object().shape({
  mobileNumber: Yup.string()
    .matches(
      phoneRegExp,
      "Mobile no is not valid. Enter a valie 10 digit mobile no."
    )
    .required("Mobile Number is required"),
});

export default function CardDetailsResponsive(props: any) {
  const { fleetCardId, data } = props;
  const [cardDetails, setCardDetails] = useState<cardDetailsInterface>(
    props.data || {}
  );
  const [disabled, setDisabled] = useState(true);
  const [submitText, setSubmitText] = useState("Edit");
  const classes = useRowStyles();
  const [allowedFuelTypes, setAllowedFuelTypes] = React.useState<Array<String>>(
    data.allowedFuelTypes || []
  );
  const [limitType, setLimitType] = React.useState<String>(
    data.adhocLimit ? (data.adhocLimit > 0 ? "adhoc" : "dailyMonthly") : ""
  );
  const { handCardDetailsUpdate } = props;
  const dispatch = useDispatch();
  const WarningIcon = "/W_Icons_Warning.svg";
  const flag_image = "/flag_logo.svg";
  const info_image = "/info_logo.svg";
  const error_icon = "/Error_Icon.svg";

  interface cardDetailsInterface {
    adhocLimit: string;
    allowedFuelTypes: [];
    cardStatus: string;
    dailyLimit: string;
    fleetCardId: string;
    mobileNumber: string;
    monthlyLimit: string;
    dailySaleTransaction: number;
    monthlySaleTransaction: number;
    cardWalletBalance: number;
    limitType: string;
  }

  const enableForm = () => {
    setDisabled(false);
    setSubmitText("Save");
  };

  const handleAllowedFuelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.target.checked
      ? setAllowedFuelTypes((prevState) =>
          concat(prevState, [event.target.name])
        )
      : setAllowedFuelTypes((prevState) =>
          filter(prevState, (item) => {
            return item != event.target.name;
          })
        );
  };

  const handleLimitTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimitType(event.target.value);
    event.target.value === "dailyMonthly"
      ? setCardDetails({ ...cardDetails, adhocLimit: "" })
      : setCardDetails({ ...cardDetails, dailyLimit: "", monthlyLimit: "" });
  };
  const cardDetailsRow = () => {
    dispatch(setLoader(true));
    getCardDetails({ id: fleetCardId }).then((response) => {
      // console.log(response)
      dispatch(setLoader(false));
      if (response && response.data) {
        const respData = response.data[0];
        let cardData: any = {};
        cardData[props.fleetCardId] = respData;
        props.setData({ ...props.collapseData, ...cardData });
        setCardDetails(respData);
        setAllowedFuelTypes(respData.allowedFuelTypes);
        setLimitType(respData.adhocLimit > 0 ? "adhoc" : "dailyMonthly");
      } else {
        setCardDetails({});
      }
    });
  };

  useEffect(() => {
    if (!Object.keys(props.data).length) {
      cardDetailsRow();
    }
  }, []);

  useEffect(() => {
    setCardDetails((prevState: any) => ({
      ...prevState,
      allowedFuelTypes: [...allowedFuelTypes],
      limitType: limitType,
    }));
  }, [allowedFuelTypes, limitType]);

  const getAlerts = (errors: any) => {
    const errorDetails = Object.keys(errors).map((key) => (
      <Typography
        variant="h6"
        align="left"
        style={{
          color: "#354463",
          backgroundColor: "#fff0f0",
          fontSize: "13px",
        }}
      >
        {errors[key]}
      </Typography>
    ));
    return errorDetails;
  };

  const validate = (values: any) => {
    const errors = {};

    if (values.limitType == "dailyMonthly") {
      if (Number(values.dailyLimit) == 0) {
        errors.dailyLimit = "Daily card limit should be greator than 0";
      }
      if (Number(values.monthlyLimit) == 0) {
        errors.monthlyLimit = "Montly limit should be greator than 0";
      }
      if (Number(values.dailyLimit) > Number(values.monthlyLimit)) {
        errors.dailyLimit =
          "Daily card limit cannot be greator than the monthly card limit";
      }
      if (Number(values.dailyLimit) < Number(values.dailySaleTransaction)) {
        errors.dailyLimit =
          "Daily card limit cannot be less than the daily sales transactions";
      }
      if (Number(values.monthlyLimit) < Number(values.monthlySaleTransaction)) {
        errors.dailyLimit =
          "Monthly card limit cannot be less than the monthly sales transactions";
      }
      if (Number(values.monthlyLimit) < Number(values.dailyLimit)) {
        errors.dailyLimit =
          "Monthly card limit cannot be less than the daily card limit";
      }
    }

    return errors;
  };

  return (
    <Formik
      enableReinitialize
      validationSchema={Schema}
      initialValues={{
        fleetCardId: cardDetails.fleetCardId,
        allowedFuelTypes: allowedFuelTypes,
        limitType: limitType,
        adhocLimit: cardDetails.adhocLimit,
        dailyLimit: cardDetails.dailyLimit,
        monthlyLimit: cardDetails.monthlyLimit,
        dailySaleTransaction: cardDetails.dailySaleTransaction,
        monthlySaleTransaction: cardDetails.monthlySaleTransaction,
        cardStatus: cardDetails.cardStatus,
        cardWalletBalance: cardDetails.cardWalletBalance,
        mobileNumber: cardDetails.mobileNumber,
        isDisabled: disabled,
      }}
      onSubmit={(values, { setSubmitting }) => {
        handCardDetailsUpdate(values);
      }}
      validate={validate}
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
          <form onSubmit={handleSubmit} method="POST" noValidate>
            <fieldset disabled={disabled}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell width="20%">
                      <Typography
                        className={`${styles.card_headers}`}
                        variant="h6"
                      >
                        Fuel Stations
                      </Typography>
                      <strong className={`${styles.card_link}`}>
                        View list
                      </strong>
                    </TableCell>
                    <TableCell width="30%">
                      <Typography
                        className={`${styles.card_headers}`}
                        variant="h6"
                      >
                        Card Status:
                      </Typography>
                      <span className={`${styles.card_status}`}>
                        {values.cardStatus}
                      </span>
                      <strong className={`${styles.card_link}`}>
                        &nbsp; View Card Profile
                      </strong>
                    </TableCell>
                    <TableCell width="30%" className={`${styles.item_pad}`}>
                      <Typography
                        className={`${styles.card_headers}`}
                        variant="h6"
                      >
                        Sale Transactions
                      </Typography>
                      <span className={`${styles.card_values}`}>
                        <strong className={`${styles.card_values}`}>
                          Daily{" "}
                        </strong>
                        <span className={`${styles.card_values} pr-1`}>
                          {valueInLacs(values.dailySaleTransaction)}
                        </span>
                        |
                        <strong className={`${styles.card_values} pl-1`}>
                          Monthly{" "}
                        </strong>
                        <span className={`${styles.card_values}`}>
                          {valueInLacs(values.monthlySaleTransaction)}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell
                      width="20%"
                      align="right"
                      className={`${styles.item_padright}`}
                    >
                      <Typography
                        className={`${styles.card_headers}`}
                        align="right"
                        variant="h6"
                      >
                        Card Wallet
                      </Typography>
                      <span className={`${styles.card_values}`}>
                        <span>{CurrencyFormat(values.cardWalletBalance)}</span>
                        <span className={`${styles.transfer}`}>
                          &nbsp;Transfer
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <TableCell
                      colSpan={2}
                      className={`${styles.no_border}`}
                      align="left"
                    >
                      <Grid container alignItems="flex-start" className={"p-0"}>
                        <Grid item sm={12} xs={12}>
                          <Typography
                            className={`${styles.card_fuel}`}
                            variant="h6"
                          >
                            Allowed Fuel Types
                          </Typography>
                        </Grid>
                        <FuelTypesOptions
                          columns={4}
                          onChangeHandler={handleAllowedFuelTypeChange}
                          selectedFuelTypes={values.allowedFuelTypes}
                        />
                      </Grid>
                    </TableCell>
                    <TableCell
                      className={styles.item_pad_no_border}
                      align="left"
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item sm={12} xs={12}>
                          <Typography
                            className={`${styles.card_fuel}`}
                            variant="h6"
                          >
                            Limit Type
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={6}>
                          <FormControlLabel
                            className={`${styles.radio_btn}`}
                            control={
                              <Radio
                                name="limitType"
                                size="small"
                                color="primary"
                                value="adhoc"
                                checked={
                                  (Number(values.adhocLimit) > 0 &&
                                    values.limitType === "") ||
                                  values.limitType == "adhoc"
                                }
                                onChange={handleLimitTypeChange}
                              />
                            }
                            label={
                              <span style={{ fontSize: "13px" }}>Adhoc</span>
                            }
                          />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                          <FormControlLabel
                            style={{ marginBottom: "0" }}
                            control={
                              <Radio
                                name="limitType"
                                size="small"
                                color="primary"
                                value="dailyMonthly"
                                checked={
                                  ((Number(values.dailyLimit) > 0 ||
                                    Number(values.monthlyLimit) > 0) &&
                                    values.limitType === "") ||
                                  values.limitType == "dailyMonthly"
                                }
                                onChange={handleLimitTypeChange}
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
                        </Grid>
                        {((Number(values.dailyLimit) > 0 ||
                          Number(values.monthlyLimit) > 0) &&
                          values.limitType === "") ||
                        values.limitType == "dailyMonthly" ? (
                          <Grid item sm={6} xs={6}>
                            <Typography
                              className={`${styles.card_bal} pb-1`}
                              variant="h6"
                            >
                              Daily Card Limit
                            </Typography>
                            <TextField
                              className={`${styles.no_arrow}`}
                              type="string"
                              inputProps={{ className: styles.input_limit }}
                              size="small"
                              id="dailyLimit"
                              name="dailyLimit"
                              // value={values.dailyLimit}
                              value={values.dailyLimit}
                              onChange={handleChange}
                              variant="outlined"
                              aria-label="Daily Card Limit"
                              error={!!errors.dailyLimit}
                              InputProps={{
                                endAdornment: errors?.dailyLimit && (
                                  <InputAdornment position="end">
                                    <img src={WarningIcon}></img>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        ) : null}
                        {((Number(values.dailyLimit) > 0 ||
                          Number(values.monthlyLimit) > 0) &&
                          values.limitType === "") ||
                        values.limitType == "dailyMonthly" ? (
                          <Grid item sm={6} xs={6}>
                            <Typography
                              className={`${styles.card_bal} pb-1`}
                              variant="h6"
                            >
                              Monthly Card Limit
                            </Typography>
                            <TextField
                              className={`${styles.no_arrow}`}
                              type="string"
                              inputProps={{ className: styles.input_limit }}
                              size="small"
                              id="monthlyLimit"
                              name="monthlyLimit"
                              // value={values.monthlyLimit}
                              value={values.monthlyLimit}
                              onChange={handleChange}
                              variant="outlined"
                              aria-label="Monthly Card Limit"
                              error={!!errors.monthlyLimit}
                              InputProps={{
                                endAdornment: errors?.monthlyLimit && (
                                  <InputAdornment position="end">
                                    <img src={WarningIcon}></img>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        ) : null}
                        {(Number(values.adhocLimit) > 0 &&
                          values.limitType === "") ||
                        values.limitType == "adhoc" ? (
                          <Grid item sm={6} xs={6}>
                            <Typography
                              className={`${styles.card_bal} pb-1`}
                              variant="h6"
                            >
                              Adhoc Limit
                            </Typography>
                            <TextField
                              className={`${styles.no_arrow}`}
                              type="string"
                              inputProps={{ className: styles.input_limit }}
                              size="small"
                              id="adhocLimit"
                              name="adhocLimit"
                              // value={values.monthlyLimit}
                              value={values.adhocLimit}
                              onChange={handleChange}
                              variant="outlined"
                              aria-label="Adhoc Limit"
                              error={!!errors.adhocLimit}
                              InputProps={{
                                endAdornment: errors?.adhocLimit && (
                                  <InputAdornment position="end">
                                    <img src={WarningIcon}></img>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      className={`${styles.item_pad_no_border}`}
                      align="right"
                    >
                      <div className={"d-flex w-100 justify-content-end"}>
                        <div></div>
                        <div
                          className={
                            "d-flex flex-column justify-content-start align-content-start"
                          }
                        >
                          <div>
                            <Typography
                              className={`${styles.card_bal} pb-2`}
                              variant="h6"
                              align="left"
                            >
                              Mobile No.
                            </Typography>
                          </div>
                          <div>
                            <TextField
                              className={`${styles.no_arrow}`}
                              type="string"
                              inputProps={{ className: styles.input_mobile }}
                              size="small"
                              id="mobileNumber"
                              name="mobileNumber"
                              onChange={handleChange}
                              value={values.mobileNumber}
                              variant="outlined"
                              aria-label="Monthly Card Limit"
                              error={!!errors.mobileNumber}
                              InputProps={{
                                endAdornment: errors?.mobileNumber && (
                                  <InputAdornment position="end">
                                    <img src={WarningIcon}></img>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className={styles.item_pad_no_border}
                      style={{ position: "relative" }}
                    >
                      <div className={"d-flex align-items-center"}>
                        <div className={"flex-fill w-50"}>
                          <strong className={`${styles.card_link}`}>
                            <img src={flag_image} alt="flag_image" />
                            <span> &nbsp; Raise a Service Request</span>
                          </strong>
                        </div>
                        <div className={"flex-fill w-50"}>
                          {toString(Object.values(errors)) !== "" ? (
                            <div
                              className={"flex-fill"}
                              style={{
                                position: "absolute",
                                bottom: "0.5rem",
                                left: "calc(50%)",
                                width: "25rem",
                              }}
                            >
                              <Alert
                                severity="error"
                                icon={<img src={error_icon} />}
                              >
                                {getAlerts(errors)}
                              </Alert>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={styles.item_pad_no_border}>
                      <img src={info_image} alt="info_image" />
                      <span className={`${styles.info_msg}`}>
                        Limit set will be affected immediately
                      </span>
                    </TableCell>
                    <TableCell
                      className={styles.item_pad_no_border}
                      align="right"
                    >
                      {values.isDisabled ? (
                        <Button
                          name="editButton"
                          variant="outlined"
                          color="primary"
                          className={`${styles.submit_btn}`}
                          onClick={(event) => {
                            event.preventDefault();
                            enableForm();
                          }}
                        >
                          EDIT
                        </Button>
                      ) : (
                        <Button
                          name="submit"
                          type="submit"
                          variant="outlined"
                          color="primary"
                          className={`${styles.submit_btn}`}
                        >
                          SAVE
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </fieldset>
          </form>
        );
      }}
    </Formik>
  );
}
