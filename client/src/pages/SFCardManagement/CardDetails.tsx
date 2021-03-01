import {
  React,
  useState,
  useEffect,
  useDispatch,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TextField,
  Button,
  Typography,
  TableRow,
  Grid,
  FormControlLabel,
  Radio,
  InputAdornment,
  Tooltip,
  filter, 
  concat, 
  toString, 
  isNumber, 
  toNumber,
  Formik,
  Yup,
  Alert
} from "../../utility/general-imports"
import styles from "./CardManagement.module.scss";
import { CurrencyFormat, valueInLacs } from "src/utility/utils";
import FuelTypesOptions from "../../components/CardManagement/FuelTypes";
import { setLoader } from "../../redux/actions/actions";
import { getCardDetails } from "../../lib/api/SFCardManagement/sfcardmanagement";
import { PopupCardProfile } from "./PopUpCardProfile";
import {
  MOBILE_NOT_VALID,
  PHONE_REG_EXP,
  MOBILE_TOOLTIP,
  CARD_DETAILS_LIMIT_INFO
} from "./constants"

const useRowStyles = makeStyles({
  row: {
    "& .MuiTableCell-root": {
      //borderBottom: "10px solid #f9fbff",
      verticalAlign: "top",
      paddingBottom: "0.2rem"
    },
    "& .Mui-disabled": {
      color: "#97a2a8",
    },
  },
});

const Schema = Yup.object().shape({
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(
      PHONE_REG_EXP,
      MOBILE_NOT_VALID
    ),
});

export default function CardDetails(props: any) {
  const {
    fleetCardData,
    setFleetCardData,
    handleCardDetailsUpdate,
    fuelTypeData,
    fleetCardId,
    loadData,
    setLoadData,
    selectedButton,
    dropdownLists,
    cardHeadersData
  } = props;
  const [disabled, setDisabled] = useState(true);
  const [openModal, setModalOpen] = React.useState(false);
  const classes = useRowStyles();
  const [cardData, setCardData] = React.useState(fleetCardData);
  const [cardDetails, setCardDetails] = React.useState("");
  const [allowedFuelTypes, setAllowedFuelTypes] = React.useState<Array<String>>(
    cardData.allowedFuelTypes || []
  );
  const [limitType, setLimitType] = React.useState(
    cardData.adhocLimit > 0 ? "adhoc" : "dailyMonthly"
  );
  const [adhocLimit, setAdhocLimit] = React.useState(cardData.adhocLimit);
  const [dailyLimit, setDailyLimit] = React.useState(cardData.dailyLimit);
  const [monthlyLimit, setMonthlyLimit] = React.useState(cardData.monthlyLimit);
  const [mobileNumber, setMobileNumber] = React.useState(cardData.mobileNumber);
  const dispatch = useDispatch();
  const disableFields = selectedButton == "Terminated" ? true : false;
  const WarningIcon = "/W_Icons_Warning.svg";
  const flag_image = "/flag_logo.svg";
  const info_image = "/info_logo.svg";
  const error_icon = "/Error_Icon.svg";
  const infoMob_msg = "/W_Toottip_mobN.svg";

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

  const handleCardProfileClick = () => {
    setModalOpen(true);
  };
  const handleCardProfileClose = () => {
    setModalOpen(false);
  };

  const enableForm = () => {
    setDisabled(false);
  };

  useEffect(() => {
    setLimitType(cardData.adhocLimit > 0 ? "adhoc" : "dailyMonthly");
  }, []);

  const handleAllowedFuelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fuleTypesList = fuelTypeData.map((value: any, index: number) => {
      return value.code;
    });
    if (event.target.checked) {
      if (event.target.name === "All") {
        setAllowedFuelTypes(fuleTypesList);
      } else {
        setAllowedFuelTypes((prevState: any) =>
          concat(prevState, [event.target.name])
        );
      }
    } else {
      if (event.target.name === "All") {
        setAllowedFuelTypes([]);
      } else {
        setAllowedFuelTypes((prevState: any) =>
          filter(prevState, (item) => {
            return item != event.target.name && item != "All";
          })
        );
      }
    }
  };

  const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;
    if (!isNumber(toNumber(targetValue))) {
      event.preventDefault();
      return false;
    }
    setMobileNumber(targetValue);
  };

  const handleDailyLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const targetValue = event.target.value;
    if (!isNumber(toNumber(targetValue))) {
      event.preventDefault();
      return false;
    }
    setDailyLimit(targetValue);
    setAdhocLimit("");
  };

  const handleMonthlyLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const targetValue = event.target.value;
    if (!isNumber(toNumber(targetValue))) {
      event.preventDefault();
      return false;
    }
    setMonthlyLimit(targetValue);
    setAdhocLimit("");
  };

  const handleAdhocLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const targetValue = event.target.value;
    if (!isNumber(toNumber(targetValue))) {
      event.preventDefault();
      return false;
    }
    setAdhocLimit(targetValue);
    setDailyLimit("");
    setMonthlyLimit("");
  };

  const handleLimitTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const targetValue = event.target.value;
    setLimitType(targetValue);
    if (targetValue === "dailyMonthly") {
      setAdhocLimit("");
    } else {
      setDailyLimit("");
      setMonthlyLimit("");
    }
  };

  useEffect(() => {
    setCardData((prevState: any) => ({
      ...prevState,
      allowedFuelTypes: allowedFuelTypes,
      limitType: limitType,
      mobileNumber: mobileNumber,
      dailyLimit: dailyLimit,
      monthlyLimit: monthlyLimit,
      adhocLimit: adhocLimit,
    }));
  }, [
    allowedFuelTypes,
    limitType,
    dailyLimit,
    monthlyLimit,
    adhocLimit,
    mobileNumber,
  ]);

  const cardDetailsRow = () => {
    dispatch(setLoader(true));
    getCardDetails({ id: fleetCardId }).then((response) => {
      dispatch(setLoader(false));
      if (response && response.data) {
        const respData = response.data[0];
        setCardDetails(respData);
        setFleetCardData((prevState: any) => ({ ...prevState, ...respData }));
        setCardData((prevState: any) => ({ ...prevState, ...respData }));
        setLoadData((prevState: any) => ({
          ...prevState,
          [respData?.fleetCardId]: false,
        }));
        setAllowedFuelTypes((prevState: any) => [
          ...prevState,
          ...respData.allowedFuelTypes,
        ]);
        setDailyLimit(respData.dailyLimit);
        setMonthlyLimit(respData.monthlyLimit);
        setAdhocLimit(respData.adhocLimit);
        setMobileNumber(respData.mobileNumber);
        setLimitType(respData.adhocLimit > 0 ? "adhoc" : "dailyMonthly");
      }
    });
  };

  useEffect(() => {
    if (
      Object.keys(loadData).length == 0 ||
      (loadData && loadData[fleetCardId])
    ){
      cardDetailsRow();
    } 
    else {
      setCardData(fleetCardData);
    }
  }, []);

  const getAlerts = (errors: any) => {
    const errorDetails = Object.keys(errors).map((key) => (
      <Typography
        variant="h6"
        align="left"
        className={styles.cardDetailsErrors}
      >
        {errors[key]}
      </Typography>
    ));
    return errorDetails;
  };

  interface errorsObj {
    dailyLimit?: string;
    monthlyLimit?: string;
  }

  const validate = (values: any) => {
    const errors: errorsObj = {};

    if (
      values.limitType == "dailyMonthly" ||
      Number(values.dailyLimit) > 0 ||
      Number(values.monthlyLimit)
    ) {
      if (Number(values.dailyLimit) > Number(values.monthlyLimit)) {
        errors.dailyLimit =
          "Daily card limit cannot be greator than the monthly card limit";
      }
      if (Number(values.dailyLimit) < Number(values.dailySaleTransaction)) {
        errors.dailyLimit =
          "Daily card limit cannot be less than the daily sale transactions";
      }
      if (Number(values.monthlyLimit) < Number(values.monthlySaleTransaction)) {
        errors.monthlyLimit =
          "Monthly card limit cannot be less than the monthly sale transactions";
      }
    }

    return errors;
  };

  return (
    <Formik
      enableReinitialize
      validationSchema={Schema}
      initialValues={{
        fleetCardId: cardData.fleetCardId,
        allowedFuelTypes: cardData.allowedFuelTypes,
        limitType: limitType
          ? limitType
          : cardData.adhocLimit > 0
          ? "adhoc"
          : "dailyMonthly",
        adhocLimit: cardData.adhocLimit == 0 ? "" : cardData.adhocLimit,
        dailyLimit: cardData.dailyLimit == 0 ? "" : cardData.dailyLimit,
        monthlyLimit: cardData.monthlyLimit == 0 ? "" : cardData.monthlyLimit,
        dailySaleTransaction: cardData.dailySaleTransaction,
        monthlySaleTransaction: cardData.monthlySaleTransaction,
        cardStatus: cardData.cardStatus,
        cardWalletBalance: cardData.cardWalletBalance,
        mobileNumber: cardData.mobileNumber,
        isDisabled: disabled,
      }}
      onSubmit={(values, { setSubmitting }) => {
        setLoadData({ [fleetCardId]: true });
        handleCardDetailsUpdate(values);
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
                      <Button onClick={() => handleCardProfileClick()}>
                        <strong className={`${styles.card_link}`}>
                          &nbsp; View Card Profile
                        </strong>
                      </Button>
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
                          fuelTypeData={fuelTypeData}
                          disabled={disableFields}
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
                                checked={values.limitType == "adhoc"}
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
                                checked={values.limitType == "dailyMonthly"}
                                onChange={handleLimitTypeChange}
                                disabled={disableFields}
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
                        {values.limitType == "dailyMonthly" ? (
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
                              onChange={handleDailyLimitChange}
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
                              disabled={disableFields}
                            />
                          </Grid>
                        ) : null}
                        {values.limitType == "dailyMonthly" ? (
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
                              onChange={handleMonthlyLimitChange}
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
                              disabled={disableFields}
                            />
                          </Grid>
                        ) : null}
                        {values.limitType == "adhoc" ? (
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
                              onChange={handleAdhocLimitChange}
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
                              disabled={disableFields}
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
                              <Tooltip
                                classes={{ tooltip: styles.customWidth }}
                                title={MOBILE_TOOLTIP}
                                className={styles.tooltip}
                                placement="bottom-end"
                              >
                                <img src={info_image} alt="info_image" />
                              </Tooltip>
                            </Typography>
                            <span></span>
                          </div>
                          <div>
                            <TextField
                              className={`${styles.no_arrow}`}
                              type="string"
                              inputProps={{ className: styles.input_mobile }}
                              size="small"
                              id="mobileNumber"
                              name="mobileNumber"
                              onChange={handleMobileChange}
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
                              inputProps={{ maxLength: 10, size: 11 }}
                              disabled={disableFields}
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
                                width: "28rem",
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
                        {CARD_DETAILS_LIMIT_INFO}
                      </span>
                    </TableCell>
                    <TableCell
                      className={styles.item_pad_no_border}
                      align="right"
                    >
                      {!disableFields ? (
                        values.isDisabled ? (
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
                        )
                      ) : null}
                    </TableCell>
                    {
                      openModal ? (
                        <PopupCardProfile
                          cardDetails={cardDetails}
                          dropdownLists={dropdownLists}
                          openModal={openModal}
                          setModalOpen={setModalOpen}
                          handleCardProfileClose={handleCardProfileClose}
                          fleetCardId={fleetCardId}
                          selectedButton={selectedButton}
                          onChangeHandler={handleAllowedFuelTypeChange}
                          selectedFuelTypes={values.allowedFuelTypes}
                          fuelTypeData={fuelTypeData}
                          cardHeadersData={cardHeadersData}
                          setLoadData = {setLoadData}
                        ></PopupCardProfile>
                      ) : null}
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
