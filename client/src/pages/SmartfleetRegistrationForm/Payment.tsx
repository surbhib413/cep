import React, { useEffect, useState } from "react";
import {
  Modal,
  makeStyles,
  Box,
  Fade,
  Grid,
  InputAdornment,
  Typography,
  TextareaAutosize,
  Hidden,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import {
  setLoader,
  setSmartFleetPaymentMethod,
} from "../../redux/actions/actions";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { CustomInputAdornment } from "../../components/CustomTextField/CustomInputAdorment";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import styles from "./SmartfleetRegistrationForm.module.scss";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import PaymentMethods from "./PaymentMethods";
import { formSections } from "./types/formSections.enum";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { isValidTransactionRefNo } from "../../utility/validations/validations";
import { useSelector, useDispatch } from "react-redux";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";
import { postPayment, getFees } from "../../lib/api/smartfleet/smartfleet";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const RejectedImage = "/Rejected.svg";
const WarningRedImage = "/Warning_Red.svg";
const WarningYellowImage = "/Warning_Yellow.svg";
const CancelIcon = "/Cancel_Icon.svg";
const InfoIcon = "/W_Icons_Info.svg";
const WarningIcon = "/W_Icons_Warning.svg";

interface IErrorMessages {
  feeWaiverRequestReason?: string;
  transactionRefNumber?: string;
  paymentTypeErrorDiscription?: string;
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

const initPaymentFields = {
  transactionRefNumber: "",
  feeWaiverRequestReason: "",
  paymentTypeErrorDiscription: "",
};

const Payment = (props: any): JSX.Element => {
  const { handleCompleteStep, handleIncompleteStep, dropdownLists, initialData } = props;
  const [errorMessage, setErrorMessage] = useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const classes = useStyles();

  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const [openFeeWaiverRejected, setOpenFeeWaiverRejected] = useState<boolean>(
    false
  );
  const [openReviewPaymentAmount, setReviewPaymentAmount] = useState<boolean>(
    false
  );
  const [openPaymentConfirmation, setPaymentConfirmation] = useState<boolean>(
    false
  );
  const [showApplicationId, setApplicationId] = useState<boolean>(false);
  const [showFeeWaiverSection, setShowFeeWaiverSection] = useState<boolean>(
    false
  );
  const [amountToBePaid, setAmountToBePaid] = useState("100");

  const [
    displayPaymentMethodSection,
    setDisplayPaymentMethodSection,
  ] = useState(false);

  const [showPayLaterSection, setShowPayLaterSection] = useState<boolean>(
    false
  );
  const [applicationID, setApplicationID] = React.useState(
    initialData?.applicationID || ""
  );
  const [showPaidAlreadySection, setShowPaidAlreadySection] = useState<boolean>(
    false
  );
  const [isSectionEditable, setIsSectionEditable] = React.useState(true);
  const dispatch = useDispatch();
  const [paymentType, setPaymentType] = useState<string>("0");
  const [paymentFields, setPaymentFields] = useState(initPaymentFields);
  const [paymentMethodFlag, setPaymentMethodFlag] = useState<boolean>(false);
  const [
    feeWaiverTextAreaPlacehoder,
    setFeeWaiverTextAreaPlacehoder,
  ] = useState<string>("Type your reason for requesting Fee Waiver");
  // Fee waiver request rejected handler
  const openFeeWaiverRejectedModal = () => {
    setOpenFeeWaiverRejected(true);
  };
  const closeFeeWaiverRejectedModal = () => {
    setOpenFeeWaiverRejected(false);
  };
  // Review payment handler
  // const openReviewPaymentAmountModal = () => {
  //   setIsValidApplicationId(true);
  //   setReviewPaymentAmount(true);
  // };
  const closeReviewPaymentAmountModal = () => {
    setReviewPaymentAmount(false);
  };

  const handleAmountToBePaid = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAmountToBePaid(event.target.value);
  };

  useEffect(() => {
    // console.log(props);
    if (props.role === "b2b") {
      setFeeWaiverTextAreaPlacehoder(
        "Company is waiting for government funding. Need 20 days to make the transaction."
      );
    }
  }, [props.role]);

  useEffect(() => {
    async function anyNameFunction() {
      const finalData = {
      };
      const res: any = await getFees(finalData);
      console.log("getFees res in PAYMENT FILE................... : ", res);
      if (res?.status === "success") {
        setAmountToBePaid(res.data.feesToPay);
      }
    }
    if (props.expanded) {
      anyNameFunction();
    }
  }, [props.expanded]);

  const enableonvaluechange = (value: any) => {
    switch (value) {
      case "PAY_FEES":
        setShowFeeWaiverSection(false);
        setApplicationId(false);
        setPaymentMethodFlag(true);
        setShowPayLaterSection(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(false);
        break;
      case "FEE_WAIVER":
        setShowFeeWaiverSection(true);
        setApplicationId(false);
        setShowPayLaterSection(false);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(false);
        break;
      case "FEES_PAID":
        setShowFeeWaiverSection(false);
        setApplicationId(true);
        setShowPayLaterSection(false);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(true);
        break;
      case "4":
        setShowFeeWaiverSection(false);
        setApplicationId(false);
        setShowPayLaterSection(true);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(false);
        break;
      default:
        setShowFeeWaiverSection(false);
        setApplicationId(false);
        setShowPayLaterSection(false);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(false);
        setShowPaidAlreadySection(false);
    }
  };

  useEffect(() => {
    async function anyNameFunction() {
      if (!store.customerId) {
        return;
      }
      const finalData = {
        customerId: store.customerId,
        channel: "Web",
        customerType: "Company",
      };
      const res: any = await getFees(finalData);
      console.log("getFees res : ", res);
      if (res?.status === "success") {
        setAmountToBePaid(res.data.feesToPay);
      }
    }

    // anyNameFunction();
    const { initialData } = props;
    //console.log("initialData", initialData);
    //setAmountToBePaid(initialData?.feesToPay),
    if (!initialData) {
      return;
    }
    if (!initialData.feesToPay) {
      anyNameFunction();
    } else {
      setAmountToBePaid(initialData.feesToPay);
    }

    if (initialData.paymentType) {
      setPaymentType(initialData.paymentType);
      enableonvaluechange(initialData.paymentType);
    }
    const initPaymentFields = {
      transactionRefNumber: "",
      feeWaiverRequestReason: initialData.reasonForRequest,
      paymentTypeErrorDiscription: "",
    };
    initialData.reasonForRequest && setPaymentFields(initPaymentFields);
    setIsSectionEditable(initialData?.editable || true);
    setPaymentFields(initPaymentFields);
    if (initialData?.completed) {
      handleCompleteStep(formSections.PAYMENT, true);
      handleIncompleteStep(formSections.PAYMENT, false);
    }
  }, [props.initialData]);

  const renderPaymentMethodSection = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <PaymentMethods
            displayPaymentSection={displayPaymentMethodSection}
          ></PaymentMethods>
        </Grid>
      </Grid>
    );
  };
  // Payment confirmation handler
  // const openPaymentConfirmationModal = () => {
  //   // setIsValidApplicationId(true);
  //   setPaymentConfirmation(true);
  // };
  const closePaymentConfirmationModal = () => {
    setPaymentConfirmation(false);
  };
  // select payment type

  const selectPaymentType = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = event.target;
    // if (value === "1" || value === "2" || value === "3" || value==="4") {
    //   setDisplayPaymentMethodSection(true);
    //   return;
    // }
    if (value !== "0") {
      const errorObj: any = {};
      errorObj.paymentTypeErrorDiscription = "";
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        ...errorObj,
      }));
    }
    // props.parentCallback(value);
    dispatch(setSmartFleetPaymentMethod(value));
    setPaymentType(value as string);
    setDisplayPaymentMethodSection(false);

    switch (value) {
      case "PAY_FEES":
        setShowFeeWaiverSection(false);
        setApplicationId(false);
        setPaymentMethodFlag(true);
        setShowPayLaterSection(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(false);
        break;
      case "FEE_WAIVER":
        setShowFeeWaiverSection(true);
        setApplicationId(false);
        setShowPayLaterSection(false);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(false);
        break;
      case "FEES_PAID":
        setShowFeeWaiverSection(false);
        setApplicationId(true);
        setShowPayLaterSection(false);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(true);
        break;
      case "4":
        setShowFeeWaiverSection(false);
        setApplicationId(false);
        setShowPayLaterSection(true);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(true);
        setShowPaidAlreadySection(false);
        break;
      default:
        setShowFeeWaiverSection(false);
        setApplicationId(false);
        setShowPayLaterSection(false);
        setPaymentMethodFlag(false);
        setDisplayPaymentMethodSection(false);
        setShowPaidAlreadySection(false);
    }
  };
  const handleTextfieldChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setPaymentFields({
      ...paymentFields,
      [event.target.name]: event.target.value,
    });
    if (paymentFields.feeWaiverRequestReason) {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        feeWaiverRequestReason: "",
      }));
    }
  };
  const handleClear = () => {
    //openFeeWaiverRejectedModal();
    setPaymentFields(initPaymentFields);
    setPaymentType("0");
  };

  const validate = () => {
    console.log("validate called");
    console.log("value........", paymentFields.transactionRefNumber);
    let isError: boolean = false;
    if (showFeeWaiverSection && !paymentFields.feeWaiverRequestReason) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        feeWaiverRequestReason: validationErrorMessage.REQUIRED,
      }));
    }

    if (showApplicationId && !paymentFields.transactionRefNumber) {
      if (!isValidTransactionRefNo(paymentFields.transactionRefNumber)) {
        isError = true;
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          transactionRefNumber: validationErrorMessage.REQUIRED,
        }));
      }
    }

    if (paymentFields.transactionRefNumber) {
      if (!isValidTransactionRefNo(paymentFields.transactionRefNumber)) {
        isError = true;
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          transactionRefNumber: validationErrorMessage.TRANSACTION_REF_INVALID,
        }));
      } else {
        //if the FA ID is Available -- backend logic here
        if (paymentFields.transactionRefNumber === "AQWE78179170") {
          isError = true;
          setErrorMessage((errorMessage) => ({
            ...errorMessage,
            transactionRefNumber:
              validationErrorMessage.TRANSACTION_REF_NOT_AVAILABLE,
          }));
        } else {
          isError = false;
          setErrorMessage((errorMessage) => ({
            ...errorMessage,
            transactionRefNumber: "",
          }));
        }
      }
    }

    if (!isError) {
      handleCompleteStep(formSections.PAYMENT, true);
      handleIncompleteStep(formSections.PAYMENT, false);
    } else {
      handleIncompleteStep(formSections.PAYMENT, true);
    }
    return isError;
  };
  //
  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const isError = validate();
    if (paymentType === "0") {
      const errorObj: any = {};
      errorObj.paymentTypeErrorDiscription = "* Required";
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        ...errorObj,
      }));
      //
      return;
    }
    if (!isError) {
      dispatch(setLoader(true));
      const finalData = {
        customerId: store.customerId,
        channel: "Web",
        customerType: "Company",
        feesToPay: amountToBePaid,
        paymentType: paymentType,
        reasonForRequest: paymentFields.feeWaiverRequestReason,
        referenceNumber: paymentFields.transactionRefNumber,
        applicationID: applicationID
      };
      const res: any = await postPayment(finalData);
      console.log("postPayment res : ", res);

      if (res?.status === "success") {
        setErrorMessage({});
        setShowSnackbar(true);
        setSnackbarMessage(res?.message);
        setAlertType("success");
        setApplicationID(res?.data?.applicationID);
        handleCompleteStep(formSections.PAYMENT, true);
        handleIncompleteStep(formSections.PAYMENT, false);
      } else {
        if (res?.errors) {
          const errorObj: any = {};
          res?.errors.forEach((element: any) => {
            if (!element.hasOwnProperty("subject")) {
              setApiOtherErrorMessage(element?.message);
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.type);
              setAlertType("error");
            } else {
              if (element?.subject === "customerId") {
                setShowSnackbar(true);
                setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
                setAlertType("error");
              }
              if (element.subject === "organizationName") {
                errorObj.primaryUserOrganizationName = element.message;
              }
              errorObj[element.subject] = element.message;
            }
          });
          setErrorMessage((errorMessage) => ({
            ...errorMessage,
            ...errorObj,
          }));
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
        handleIncompleteStep(formSections.PAYMENT, true);
      }

      dispatch(setLoader(false));
    }
  };

  const store: any = useSelector((state) => state);
  const feeWaiverRejectedModal = (
    <Grid container className={`justify-content-around`}>
      <div
        className={`d-flex align-items-center justify-content-center ${styles.modal}`}
      >
        <div className={`w-80`}>
          <div
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={closeFeeWaiverRejectedModal}
          >
            <img src={CancelIcon} alt="" />
          </div>
          <Box
            className="px-5"
            color="primary.main"
            fontSize="h5.fontSize"
            fontWeight={600}
          >
            Fee Waiver Request Rejected
          </Box>
          <img className="p-4" src={RejectedImage} alt="Rejected" />
          <div className="p-2">
            <Box color="text.primary" fontSize="h6.fontSize" fontWeight={600}>
              Your request for fee waiver has been rejected
            </Box>
            <Box className="pt-2" color="text.secondary" fontSize="h6.fontSize">
              Resubmit the form by using an{" "}
              <span className="font-weight-bold">alternate payment method</span>
            </Box>
          </div>
        </div>
      </div>
    </Grid>
  );

  const reviewPaymentAmountModal = (
    <div className={styles.modal}>
      <div
        className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
        onClick={closeReviewPaymentAmountModal}
      >
        <img src={CancelIcon} alt="" />
      </div>
      <Box color="primary.main" fontSize="h5.fontSize" fontWeight={600}>
        Review Payment Amount
      </Box>
      <img className="p-4" src={WarningRedImage} alt="Rejected" />
      <div className="p-2">
        <Box className="px-5" color="text.primary" fontSize="h6.fontSize">
          Fees paid as per the Application ID is &#8377; 100 and does not cover
          amount of &#8377; 200 required to be paid
        </Box>
        <Box
          className="p-3 font-weight-bold"
          color="text.primary"
          fontSize="h6.fontSize"
        >
          We suggest you to change the number of cards to 10
        </Box>
        <div className={`pt-3 ${styles["px-10"]}`}>
          <CustomButton
            variant="contained"
            color="primary"
            className={`w-100`}
            onClick={openFeeWaiverRejectedModal}
          >
            Go to card management
          </CustomButton>
        </div>
      </div>
    </div>
  );

  const paymentConfirmationModal = (
    <div className={styles.modal}>
      <div
        className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
        onClick={closePaymentConfirmationModal}
      >
        <img src={CancelIcon} alt="" />
      </div>
      <Box color="primary.main" fontSize="h5.fontSize" fontWeight={600}>
        Payment Confirmation
      </Box>
      <img className="p-4" src={WarningYellowImage} alt="Rejected" />
      <div className="p-2">
        <Box className="px-5" color="text.primary" fontSize="h6.fontSize">
          Fees paid as per the Application ID is &#8377; 100 and is more than
          the amount of &#8377; 200 required to be paid.
        </Box>
        <Box
          className="p-3"
          color="text.primary"
          fontSize="h6.fontSize"
          fontWeight={600}
        >
          Please confirm if you still want to go ahead with lesser number of
          physical cards, in which case the balance amount gets credited to your
          CMS wallet
        </Box>
        <div className="d-flex bd-highlight mt-3 mb-4 justify-content-center">
          <div className={`align-items-center justify-content-center pr-3`}>
            <CustomButton variant="outlined" color="primary" disableElevation>
              Deny
            </CustomButton>
          </div>
          <div className={`align-items-center justify-content-center`}>
            <CustomButton variant="contained" color="primary" disableElevation>
              Confirm
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
  //console.log(errorMessage);
  return (
    <React.Fragment>
      {/* FEE WAIVER REQUESTED */}
      <div>
        <Modal
          className={classes.modalPos}
          open={openFeeWaiverRejected}
          onClose={closeFeeWaiverRejectedModal}
        >
          <Fade in={openFeeWaiverRejected}>{feeWaiverRejectedModal}</Fade>
        </Modal>
      </div>
      {/* REVIEW PAYMENT AMOUNT */}
      <div>
        <Modal
          className={classes.modalPos}
          open={openReviewPaymentAmount}
          onClose={closeReviewPaymentAmountModal}
        >
          <Fade in={openReviewPaymentAmount}>{reviewPaymentAmountModal}</Fade>
        </Modal>
      </div>
      {/* PAYMENT CONFIRMATION */}
      <div>
        <Modal
          className={classes.modalPos}
          open={openPaymentConfirmation}
          onClose={closePaymentConfirmationModal}
        >
          <Fade in={openPaymentConfirmation}>{paymentConfirmationModal}</Fade>
        </Modal>
      </div>
      {/* PAYMENT FORM */}
      <form className="w-100">
        <Grid container spacing={10} className="py-5 px-4 px-sm-0">
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="amount">Fees to be Paid</CustomLabel>
            <FormControl fullWidth>
              <CustomTextField
                disabled
                id="amount"
                variant="outlined"
                size="small"
                value={amountToBePaid}
                onChange={handleAmountToBePaid}
                className="paymentAmount"
                InputProps={{
                  startAdornment: (
                    <CustomInputAdornment position="start">
                      &#8377;
                    </CustomInputAdornment>
                    // <InputAdornment position="end">₹</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel
              htmlFor="primary-user-name"
              id="demo-simple-select-outlined-label"
            >
              Payment Type
            </CustomLabel>
            <FormControl
              className={`w-100 pb-2`}
              error={!!errorMessage.paymentTypeErrorDiscription}
            >
              <CustomSelect
                //error={!!errorMessage.paymentTypeErrorDiscription}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={paymentType}
                onChange={selectPaymentType}
                variant="outlined"
                fullWidth
              >
                <CustomMenuItem value="0">Select Type</CustomMenuItem>
                {dropdownLists &&
                  dropdownLists?.map((list: any, index: number) => {
                    return (
                      <CustomMenuItem key={list.code} value={list.code}>
                        {list.displayName}
                      </CustomMenuItem>
                    );
                  })}
              </CustomSelect>

              <FormHelperText>
                {errorMessage.paymentTypeErrorDiscription &&
                  errorMessage.paymentTypeErrorDiscription}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        {/* PAYMENT TYPE - REQUEST FOR FEE WAIVER */}
        {showFeeWaiverSection ? (
          <div className="px-4 px-sm-0">
            <ul className="pl-4">
              <li>
                <Typography>
                  {store.assistedFlow ? "Customer" : "Your"} enrolment would be
                  subject to Bharat Petroleum's approval
                </Typography>
              </li>
            </ul>
            <hr className={`${styles.headerDivider}`}></hr>
            <Box
              className="mb-2"
              color="primary.light"
              fontSize="body1.fontSize"
              fontWeight={600}
            >
              Fill the reason for requesting for Fee Waiver *
            </Box>
            <FormControl
              className={`w-100 pb-2`}
              error={!!errorMessage.feeWaiverRequestReason}
            >
              <TextareaAutosize
                className={`${!!errorMessage.feeWaiverRequestReason
                    ? styles.redTextArea
                    : styles.textArea
                  }`}
                rowsMax={2}
                aria-label="maximum height"
                placeholder={feeWaiverTextAreaPlacehoder}
                maxLength={100}
                name="feeWaiverRequestReason"
                value={paymentFields.feeWaiverRequestReason}
                onChange={handleTextfieldChange}
              />
              <FormHelperText>
                {errorMessage.feeWaiverRequestReason &&
                  errorMessage.feeWaiverRequestReason}
              </FormHelperText>
            </FormControl>
          </div>
        ) : null}
        {/* PAYMENT TYPE - FEES ALREADY PAID */}
        {showApplicationId ? (
          <Grid container spacing={10} className="py-5 px-4 px-sm-0">
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="transaction-ref-number">
                Transaction Reference No.
                <CustomTooltip
                  enterTouchDelay={0}
                  disableFocusListener
                  title="The transaction reference number received for making the payment for the SmartFleet registration at the fuel station."
                  placement="right-start"
                >
                  <img
                    src={InfoIcon}
                    alt="Info for Authorized Signatory"
                    className={`${styles.infoRight}`}
                  ></img>
                </CustomTooltip>
              </CustomLabel>
              <CustomTextField
                error={!!errorMessage.transactionRefNumber}
                id="transaction-ref-number"
                variant="outlined"
                size="small"
                name="transactionRefNumber"
                value={paymentFields.transactionRefNumber}
                placeholder="Enter Transaction Reference No."
                helperText={errorMessage.transactionRefNumber}
                InputProps={{
                  endAdornment: errorMessage.transactionRefNumber && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: 20 }}
                onChange={handleTextfieldChange}
              />
            </Grid>
          </Grid>
        ) : null}
        {/* PAYMENT TYPE - PAY LATER AT RETAIL OUTLET USING CASH/EDC */}
        {/* {showPayLaterSection ? (
          <div className="px-4 px-sm-0">
            <ul className="pl-4">
              <li>
                <Typography>
                  {store.assistedFlow ? "Customer" : "Your"} enrolment would be
                  subject to payment at nearby Bharat Petroleum fuel station
                </Typography>
              </li>
            </ul>
          </div>
        ) : null} */}

        {/* PAYMENT TYPE - FEES PAID ALREADY */}
        {showPaidAlreadySection ? (
          <div className="px-4 px-sm-0">
            <ul className="pl-4">
              <li>
                <Typography>
                  The Transaction Reference Number shall be subject to
                  verification.
                </Typography>
              </li>
            </ul>
          </div>
        ) : null}

        {/* COMMON SECTION */}
        <Hidden smUp>
          <Grid container spacing={4} className="my-0 px-4 px-sm-0">
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={handleClear}
                variant="outlined"
                id="payment-clear"
                color="primary"
                className="w-100"
                data-test-id="sf-p-clear-button"
              >
                Clear
              </CustomButton>
            </Grid>
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                variant="contained"
                id="payment-save"
                color="primary"
                className="w-100"
                onClick={(e) => handleSave(e)}
                data-test-id="sf-p-save-button"
              >
                Save
              </CustomButton>
            </Grid>
          </Grid>
        </Hidden>
        <Hidden xsDown>
          <div className="w-100 d-flex justify-content-between align-items-center">
            <hr className={`${styles.headerDivider} w-75 mx-0`}></hr>
            <CustomButton
              variant="outlined"
              id="payment-clear"
              color="primary"
              className="mx-4"
              onClick={handleClear}
              data-test-id="sf-p-clear-button"
            >
              Clear
            </CustomButton>
            <CustomButton
              variant="contained"
              id="payment-save"
              color="primary"
              className="mr-4"
              disableElevation
              onClick={(e) => handleSave(e)}
              data-test-id="sf-p-save-button"
            >
              Save
            </CustomButton>
          </div>
        </Hidden>
        <div className="w-100 d-flex justify-content-between align-items-center">
          {paymentMethodFlag ? renderPaymentMethodSection() : <></>}
        </div>
        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>
      </form>
    </React.Fragment>
  );
};
export default Payment;
