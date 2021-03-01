import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  FormControlLabel,
  Box,
  InputAdornment,
  FormHelperText,
  FormControl,
  Modal,
  makeStyles,
  Fade,
} from "@material-ui/core";

import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import Radio from "@material-ui/core/Radio";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import styles from "./SmartfleetRegistrationForm.module.scss";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import {
  isVailidName,
  isValidCreditCardNumber,
  isValidExpiryDate,
  isValidCreditCardCVV,
} from "../../utility/validations/validations";

const WarningIcon = "/W_Icons_Warning.svg";
const PaymentSuccessIcon = "/W_Illustrations_Payment Successful.svg";
const PaymentFailIcon = "/W_Illustrations_Payment Failed.svg";
const CancelIcon = "/Cancel_Icon.svg";
const VisaIcon = "/VISA_Icon.svg";
const MasterCardIcon = "/MasterCard_Icon.svg";
const RuPayIcon = "/RuPay_Icon.svg";
const MaestroIcon = "/Maestro_Icon.svg";
const AmericanExpressIcon = "/American_Express_Icon.svg";
const CreditCards = "/Group 23482.svg";

interface IErrorMessages {
  creditCardHolderName?: string;
  creditCardNumber?: string;
  creditCardExpiryDate?: string;
  creditCardCVV?: string;
  netBankingOption?: string;
}

interface CreditCardFields {
  creditCardHolderName?: string;
  creditCardNumber?: string;
  creditCardExpiryDate?: string;
  creditCardCVV?: string;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  modalPos: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const PaymentMethods = (props: any) => {
  const classes = useStyles();
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string>(
    ""
  );
  const [disabled, setDisabled] = useState<boolean>(true);
  const [upiVal, setUpiVal] = useState<string>("");
  const [btnColor, setBtnColor] = useState<any>("default");
  const [errorMessage, setErrorMessage] = useState<IErrorMessages>({});
  //const [ccValidationFlag, setcCValidationFlag] = useState<Boolean>(false);
  const [disabledPayNow, setDisabledPayNow] = useState<boolean>(true);
  const [payNowBtnColor, setPayNowBtnColor] = useState<any>("default");

  const [creditCardDetails, setCreditCardDetails] = useState<CreditCardFields>(
    {}
  );

  const [netBankingOption, setNetBankingOption] = useState("0");
  // const [disableUpiTextbox, setDisableUpiTextbox] = useState(true);
  // const [
  //   disabledChooseBankSelectBox,
  //   setDisabledChooseBankSelectBox,
  // ] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedPaymentMethods(event.target.value);

    // setDisableUpiTextbox(false);
    setCreditCardDetails({});
    setErrorMessage({});
    setPayNowBtnColor("primary");
    setDisabledPayNow(false);
    // setDisabledChooseBankSelectBox(false);
  };

  const handleCreditCardInputFn = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    if (name === "creditCardNumber") {
      event.target.value = event.target.value
        .replace(/[^\d]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (name === "creditCardExpiryDate") {
      event.target.value = event.target.value
        .replace(/^(\d\d)(\d)$/g, "$1/$2")
        .replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2");
    }
    setCreditCardDetails({ ...creditCardDetails, [name]: event.target.value });
    setErrorMessage({ ...errorMessage, [event.target.name]: "" });
  };

  const [openPaymentSuccess, setOpenPaymentSuccess] = useState<boolean>(false);

  const openPaymentSuccessModal = () => {
    setOpenPaymentSuccess(true);
  };
  const closePaymentSuccessModal = () => {
    setOpenPaymentSuccess(false);
  };

  const [openPaymentFailure, setOpenPaymentFailure] = useState<boolean>(false);

  const openPaymentFailureModal = () => {
    setOpenPaymentFailure(true);
  };
  const closePaymentFailureModal = () => {
    setOpenPaymentFailure(false);
  };

  const paymentSuccessModal = (
    <Grid container className={`justify-content-around`}>
      <div
        className={`d-flex align-items-center justify-content-center ${styles.modal}`}
      >
        <div className={`w-80`}>
          <div
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={closePaymentSuccessModal}
          >
            <img src={CancelIcon} alt="" />
          </div>
          <Box color="primary.main" fontSize="h5.fontSize" fontWeight={600}>
            Payment Successful
          </Box>
          <img className="p-4" src={PaymentSuccessIcon} alt="PaymentSuccess" />
          <div className="p-2">
            <Box color="text.primary" fontSize="h6.fontSize" fontWeight={600}>
              Congratulations on successful payment!
            </Box>
          </div>
        </div>
      </div>
    </Grid>
  );

  const paymentFailureModal = (
    <Grid container className={`justify-content-around`}>
      <div
        className={`d-flex align-items-center justify-content-center ${styles.modal}`}
      >
        <div className={`w-80`}>
          <div
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={closePaymentFailureModal}
          >
            <img src={CancelIcon} alt="" />
          </div>
          <Box color="primary.main" fontSize="h5.fontSize" fontWeight={600}>
            Payment Failed
          </Box>
          <img className="p-4" src={PaymentFailIcon} alt="PaymentFailed" />
          <div className="p-2">
            <Box color="text.secondary" fontSize="h6.fontSize" fontWeight={400}>
              An error occurred while handling your payment
            </Box>
            <Box color="text.primary" fontSize="h6.fontSize" fontWeight={600}>
              Try again or choose another payment method
            </Box>
          </div>
        </div>
      </div>
    </Grid>
  );

  const validateCreditCardFields = useCallback(() => {
    let isError: boolean = false;

    if (!creditCardDetails.creditCardHolderName) {
      console.log("empty name");
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardHolderName: validationErrorMessage.REQUIRED,
      }));
      isError = true;
    } else if (
      creditCardDetails.creditCardHolderName &&
      !isVailidName(creditCardDetails.creditCardHolderName)
    ) {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardHolderName: validationErrorMessage.CREDIT_CARD_NAME_INVALID,
      }));
      isError = true;
    } else {
      isError = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardHolderName: "",
      }));
    }

    if (!creditCardDetails.creditCardNumber) {
      console.log("empty number");
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardNumber: validationErrorMessage.REQUIRED,
      }));
      isError = true;
    } else if (
      creditCardDetails.creditCardNumber &&
      !isValidCreditCardNumber(creditCardDetails.creditCardNumber)
    ) {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardNumber: validationErrorMessage.CREDIT_CARD_NUMBER,
      }));
      isError = true;
    } else {
      isError = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardNumber: "",
      }));
    }

    if (!creditCardDetails.creditCardExpiryDate) {
      console.log("empty exdate");
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardExpiryDate: validationErrorMessage.REQUIRED,
      }));
      isError = true;
    } else if (
      creditCardDetails.creditCardExpiryDate &&
      !isValidExpiryDate(creditCardDetails.creditCardExpiryDate)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardExpiryDate: validationErrorMessage.CREDIT_CARD_EXPIRY_DATE,
      }));
    } else {
      isError = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardExpiryDate: "",
      }));
    }

    if (!creditCardDetails.creditCardCVV) {
      console.log("empty cvv");
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardCVV: validationErrorMessage.REQUIRED,
      }));
      isError = true;
    } else if (
      creditCardDetails.creditCardCVV &&
      !isValidCreditCardCVV(creditCardDetails.creditCardCVV)
    ) {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardCVV: validationErrorMessage.CREDIT_CARD_CVV,
      }));
      isError = true;
    } else {
      isError = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        creditCardCVV: "",
      }));
    }

    if (!isError) {
      // All validations pass
      //temporary code to show payment success, change with backend integration
      openPaymentSuccessModal();
    }
  }, [creditCardDetails]);

  const validateNetBankingOption = () => {
    if (netBankingOption !== "0") {
      //change condition === 0 while integrating with backend
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        netBankingOption: validationErrorMessage.REQUIRED,
      }));
    } else {
      //temporary code to show payment failure, change with backend integration
      openPaymentFailureModal();
    }
  };

  const handlePayNow = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedPaymentMethods === "creditcard") {
      validateCreditCardFields();
    } else if (selectedPaymentMethods === "netbanking") {
      validateNetBankingOption();
    }
  };

  const handleNetBankingOption = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setNetBankingOption(event.target.value as string);
  };

  useEffect(() => {
    if (
      upiVal !== "" &&
      /^\w+@\w+$/.test(upiVal) &&
      selectedPaymentMethods === "upi"
    ) {
      setDisabled(false);
      setBtnColor("primary");
    } else {
      setDisabled(true);
      setBtnColor("default");
    }
  }, [upiVal, selectedPaymentMethods, props]);

  const renderCreditCardDetails = () => {
    return (
      <Grid container spacing={10} className="pt-5">
        <Grid item sm={4} xs={12} className="py-0">
          <CustomLabel htmlFor="payment-methods-cc-holder-name">
            Card Name
          </CustomLabel>
          <CustomTextField
            id="payment-methods-cc-holder-name"
            placeholder="John Doe"
            variant="outlined"
            value={creditCardDetails.creditCardHolderName}
            size="small"
            name="creditCardHolderName"
            error={!!errorMessage.creditCardHolderName}
            onChange={handleCreditCardInputFn}
            helperText={
              errorMessage.creditCardHolderName &&
              errorMessage.creditCardHolderName
            }
            InputProps={{
              endAdornment: errorMessage.creditCardHolderName && (
                <InputAdornment position="end">
                  <CustomSvgIcon iconsource={WarningIcon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item sm={4} xs={12} className="py-0">
          <CustomLabel htmlFor="payment-methods-cc-number">
            Credit Card number
          </CustomLabel>
          <CustomTextField
            id="payment-methods-cc-number"
            placeholder="xxxxxxxxxxxxxxxx"
            value={creditCardDetails.creditCardNumber}
            variant="outlined"
            size="small"
            name="creditCardNumber"
            onChange={handleCreditCardInputFn}
            error={!!errorMessage.creditCardNumber}
            helperText={
              errorMessage.creditCardNumber && errorMessage.creditCardNumber
            }
            inputProps={{ maxLength: 19 }}
            InputProps={{
              endAdornment: errorMessage.creditCardNumber && (
                <InputAdornment position="end">
                  <CustomSvgIcon iconsource={WarningIcon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item sm={2} xs={12} className="py-0">
          <CustomLabel htmlFor="payment-methods-cc-expiry-date">
            Expiry Date
          </CustomLabel>
          <CustomTextField
            id="payment-methods-cc-expiry-date"
            placeholder="12/30"
            variant="outlined"
            size="small"
            name="creditCardExpiryDate"
            onChange={handleCreditCardInputFn}
            error={!!errorMessage.creditCardExpiryDate}
            inputProps={{ maxLength: 5 }}
            helperText={
              errorMessage.creditCardExpiryDate &&
              errorMessage.creditCardExpiryDate
            }
            InputProps={{
              endAdornment: errorMessage.creditCardExpiryDate && (
                <InputAdornment position="end">
                  <CustomSvgIcon iconsource={WarningIcon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item sm={2} xs={12} className="py-0">
          <CustomLabel htmlFor="payment-methods-cc-cvv">CVV</CustomLabel>
          <CustomTextField
            id="payment-methods-cc-cvv"
            placeholder="9**"
            variant="outlined"
            size="small"
            name="creditCardCVV"
            onChange={handleCreditCardInputFn}
            error={!!errorMessage.creditCardCVV}
            helperText={
              errorMessage.creditCardCVV && errorMessage.creditCardCVV
            }
            inputProps={{ maxLength: 3 }}
            InputProps={{
              endAdornment: errorMessage.creditCardCVV && (
                <InputAdornment position="end">
                  <CustomSvgIcon iconsource={WarningIcon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <div>
        <Modal
          className={classes.modalPos}
          open={openPaymentSuccess}
          onClose={closePaymentSuccessModal}
        >
          <Fade in={openPaymentSuccess}>{paymentSuccessModal}</Fade>
        </Modal>
      </div>
      <div>
        <Modal
          className={classes.modalPos}
          open={openPaymentFailure}
          onClose={closePaymentFailureModal}
        >
          <Fade in={openPaymentFailure}>{paymentFailureModal}</Fade>
        </Modal>
      </div>
      <div className="mt-3 px-4 px-sm-0">
        {props.displayPaymentSection ? (
          <div>
            <Box
              color="primary.light"
              fontSize={18}
              fontWeight="fontWeightBold"
            >
              Select a Payment Method
            </Box>
            <hr className={`${styles.headerDivider}`}></hr>
            <Grid container spacing={10} className="pt-5">
              <Grid item sm={10} xs={12} className="py-0">
                <FormControlLabel
                  value="creditcard"
                  name="creditcard"
                  control={
                    <Radio
                      color="primary"
                      onChange={handleChange}
                      checked={selectedPaymentMethods === "creditcard"}
                    />
                  }
                  label={
                    <span className={`${styles.radioLabel}`}>
                      Pay via Credit Card
                    </span>
                  }
                />
                <Grid container className={`${styles.singlecreditcardimgRow}`}>
                  <Grid item sm={12} xs={12} className="py-0 pt-2.75">
                    {" "}
                    <img src={CreditCards} alt="creditcards" />
                  </Grid>
                </Grid>
                <Grid container className={`${styles.creditcardimgRow}`}>
                  <Grid item sm={2} xs={12} className="py-0 pt-2.75">
                    {" "}
                    <img src={VisaIcon} alt="visa" />
                  </Grid>
                  <Grid item sm={2} xs={12} className="py-0 pt-2.75">
                    {" "}
                    <img src={MasterCardIcon} alt="mastercard" />
                  </Grid>
                  <Grid item sm={2} xs={12} className="py-0 pt-2.75">
                    {" "}
                    <img src={RuPayIcon} alt="rupay" />
                  </Grid>
                  <Grid item sm={2} xs={12} className="py-0 pt-2.75">
                    {" "}
                    <img src={MaestroIcon} alt="maestro" />
                  </Grid>

                  <Grid item sm={2} xs={1} className="py-0 pt-2.75">
                    {" "}
                    <img src={AmericanExpressIcon} alt="express" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {selectedPaymentMethods === "creditcard" ? (
              renderCreditCardDetails()
            ) : (
                <></>
              )}
            {/* <Grid container className='pt-5'>
        <Grid item xs={10} className='pl-3'>
         
        </Grid>
      </Grid> */}
            <Grid container spacing={10} className="pt-5">
              <Grid
                item
                sm={4}
                xs={12}
                className={`py-0 ${styles.girdMarginBottom40}`}
              >
                <FormControlLabel
                  value="netbanking"
                  name="netbanking"
                  control={
                    <Radio
                      color="primary"
                      onChange={handleChange}
                      checked={selectedPaymentMethods === "netbanking"}
                    />
                  }
                  label={
                    <span className={`${styles.radioLabel}`}>
                      Pay via Net banking
                    </span>
                  }
                />
                <FormControl
                  error={!!errorMessage.netBankingOption}
                  className="w-100"
                >
                  <CustomSelect
                    labelId="demo-simple-select-outlined-label"
                    variant="outlined"
                    value={netBankingOption}
                    fullWidth
                    onChange={handleNetBankingOption}
                    error={!!errorMessage.netBankingOption}
                    className={`${!errorMessage.netBankingOption &&
                      styles.selectMarginBottom
                      }`}
                    disabled={
                      selectedPaymentMethods === "netbanking" ? false : true
                    }
                  >
                    <CustomMenuItem value="0">Choose an Option</CustomMenuItem>
                  </CustomSelect>
                  <FormHelperText>
                    {errorMessage.netBankingOption &&
                      errorMessage.netBankingOption}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container className="pt-5">
              <Grid item sm={10} xs={12} className="py-0">
                <FormControlLabel
                  value="upi"
                  name="upi"
                  control={
                    <Radio
                      color="primary"
                      onChange={handleChange}
                      checked={selectedPaymentMethods === "upi"}
                    />
                  }
                  label={
                    <span className={`${styles.radioLabel}`}>
                      Other UPI Apps
                    </span>
                  }
                />
              </Grid>
              <Grid item sm={10} xs={12} className="py-0">
                <CustomLabel htmlFor="card-mgmt-name-n-card">
                  Please enter your UPI ID
                </CustomLabel>
              </Grid>
            </Grid>

            <Grid container spacing={10} className={`pt-5 `}>
              <Grid item sm={3} xs={12} className="py-0">
                <CustomTextField
                  placeholder="Mobile No.@upi"
                  variant="outlined"
                  size="small"
                  name="payment-methods-upi"
                  value={upiVal}
                  onChange={(e: any) => setUpiVal(e.target.value)}
                  disabled={selectedPaymentMethods === "upi" ? false : true}
                />
              </Grid>
              <Grid
                item
                sm={3}
                xs={12}
                className={`py-0 ${styles.verifyBtnRow}`}
              >
                <CustomButton
                  variant="contained"
                  id="paymentmethods-verify"
                  className={`${styles.girdMarginBottom40}`}
                  color={btnColor}
                  disabled={disabled}
                >
                  {" "}
                  Verify
                </CustomButton>
              </Grid>
            </Grid>

            <Grid container className={`${styles.payNowRow}`}>
              <Grid item sm={10} xs={12}>
                <hr className={`${styles.headerDivider} `}></hr>
              </Grid>
              <Grid item xs={12} sm={1}>
                <CustomButton

                  variant="contained"
                  color={payNowBtnColor}
                  id="paymentmethods-paynow"
                  className={` ${styles.payNowBtn}  ${styles.paybuttonmargin}`}
                  onClick={(e) => handlePayNow(e)}
                  disabled={disabledPayNow}
                >
                  PAY NOW
                </CustomButton>
              </Grid>
              <Grid item sm={8} xs={12}>
                <hr className={`${styles.headerDividerMobile}`}></hr>
              </Grid>
            </Grid>
          </div>
        ) : (
            <></>
          )}
      </div>
    </React.Fragment>
  );
};

export default PaymentMethods;
