import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Hidden,
  makeStyles,
  createStyles,
  Theme,
  Grid,
  Button,
} from "@material-ui/core";
import styles from "./SmartfleetRegistrationForm.module.scss";
import Payment from "./Payment";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {
  CustomStepperConnector,
  CustomStepIcon,
} from "../../components/CustomStepperConnector/CustomStepperConnector";
import {
  CustomAccordion,
  CustomAccordionSummary,
  CustomAccordionDetails,
} from "../../components/CustomAccordian/CustomAccordian";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { BasicProfile } from "./BasicProfile";
import { AddressDetails } from "./AddressDetails";
import { KycDetails } from "./KycDetails";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { BusinessInformation } from "./BusinessInformation";
import { FAIdSelection } from "./FAIdSelection";

// import Alert from '@material-ui/lab/Alert';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from '@material-ui/core/DialogTitle';
import { formSections } from "./types/formSections.enum";
import { CustomStepIconMobile } from "../../components/CustomStepperConnector/CustomStepperIconMobile";
import CardManagement from "./CardManagement/CardManagement";
import { useSelector, useDispatch } from "react-redux";
import {
  unsetAssistedFlow,
  setSmartFleetApplicationNumber,
} from "../../redux/actions/actions";
import { useRouter } from "next/router";
import ApplicationStatusModal from "../SmartfleetRegistrationForm/ApplicationStatusModal";
import { postSmartFleetForm } from "../../lib/api/smartfleet/smartfleet";
import { setLoader } from "../../redux/actions/actions";

const cancelImg = "/Cancel_Icon.svg";
const SmartfleetLogoDesktop = "/Smartfleet_logo.svg";
const SmartfleetLogo = "/Smartfleet_logo_mobile.svg";
const WarningIcon = "/W_icon_warning.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootContainer: {
      [theme.breakpoints.down("xs")]: {
        padding: 0,
      },
    },
    paperContainer: {
      [theme.breakpoints.down("xs")]: {
        padding: 16,
      },
    },
    dialog: {
      // position: "absolute",
      // left: 425,
      // top: 150,
      width: 656,
      height: 305,
      X: 312,
      Y: 220,
      Radius: 4,
    },
  })
);

const SmartfleetRegistrationForm = (props: any) => {
  const router = useRouter();
  console.log("SmartfleetRegistrationForm : getServerSideProps data");

  // console.log(props);
  // console.log(props.response?.data);
  // console.log(props.response?.errors);

  const { response, dropdownLists } = props;
  // useEffect(() => {
  //   console.log(
  //     "SmartfleetRegistrationForm : getServerSideProps data IN USEeFFECT"
  //   );

  //   console.log(data);
  // }, []);
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [openFeePaidAtRO, setOpenFeePaidAtRO] = React.useState(false);
  const [
    paymentSectionDisable,
    setpaymentSectionDisable,
  ] = React.useState<boolean>(true);
  const openFeePaidAtROModal = () => {
    setOpenFeePaidAtRO(true);
  };
  const closeFeePaidAtROModal = () => {
    setOpenFeePaidAtRO(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Will change based on business type selected (b2b/b2c for now)
  // let role = "b2c";
  let role =
    store.business === "Company" || store.business === "Sole_Proprietorship"
      ? "b2b"
      : "b2c";

  const [cardType, setCardType] = React.useState("virtual");
  const [faId, setfaIdType] = React.useState("standard");

  // const activeStep = 2;
  const steps = [
    formSections.BASIC_PROFILE,
    formSections.ADDRESS_DETAILS,
    formSections.KYC_DETAILS,
    formSections.BUSINESS_INFORMATION,
    formSections.CARD_MANAGEMENT,
    formSections.FA_ID_SELECTION,
    formSections.PAYMENT,
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );
  const [incomplete, setIncomplete] = React.useState<{ [k: number]: boolean }>({
    /* 2: false, // KEEP THIS.

    // REMOVE THESE ONCE DEVELOPED
    // kept these untill Card Management and Payment are not incorporated
    4: false,
    6: false, */
  });

  const handleCompleteStep = (section: formSections, isComplete: boolean) => {
    console.log("CALLED HANDLE COMPLETE with boolean------ ", isComplete);
    const index = steps.indexOf(section);
    const newCompleted = completed;
    newCompleted[index] = isComplete;
    setCompleted(newCompleted);
  };
  const handleIncompleteStep = (
    section: formSections,
    isIncomplete: boolean
  ) => {
    const index = steps.indexOf(section);
    const newIncomplete = incomplete;
    newIncomplete[index] = isIncomplete;
    setIncomplete(newIncomplete);
  };

  const [expanded, setExpanded] = React.useState<formSections | false>(
    steps[-1]
  );

  const handleAccordianExpand = (panel: formSections) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
    console.log("panel, newExpanded");
    console.log(panel, newExpanded);

    if (formSections.CARD_MANAGEMENT === panel) {
      //Set card managementas complete when expanded
      handleCompleteStep(panel, true);
      handleIncompleteStep(panel, false);
    }
    setActiveStep(newExpanded ? steps.indexOf(panel) : 0);
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (index === 6 && paymentSectionDisable === true) {
      return;
    } else {
      setExpanded(steps[index]);
    }

    if (formSections.CARD_MANAGEMENT === steps[index]) {
      //Set card managementas complete when expanded
      handleCompleteStep(steps[index], true);
      handleIncompleteStep(steps[index], false);
    }
  };

  const onFormSubmit = async () => {
    if (!disableSubmit()) {
      const finalData = {
        termsAndConditionsSelected: termsAndConditions,
      };
      dispatch(setLoader(true));
      const res: any = await postSmartFleetForm(finalData);
      console.log("postAddressDetails res : ", res);

      if (res?.status === "success" || res?.status === "updated") {
        dispatch(setSmartFleetApplicationNumber(res?.data?.applicationNumber));
        console.log(
          "store.smartFleetPaymentMethod",
          store.smartFleetPaymentMethod
        );
        console.log(
          "response?.data?.paymentDetails?.paymentType",
          response?.data?.paymentDetails?.paymentType
        );

        const paymentType =
          response?.data?.paymentDetails?.paymentType ||
          store.smartFleetPaymentMethod;
        console.log("paymentType", paymentType);
        if (paymentType === "PAY_FEES") {
          router.push("/submit/enrolsuccess");
        } else if (paymentType === "FEE_WAIVER") {
          router.push("/submit/applicationfeewaiver");
        } else if (paymentType === "FEES_PAID") {
          router.push("/submit/applicationfeepaid");
        }
      } else {
        dispatch(setLoader(false));
        const errorObj: any = {};
      }
    }
  };

  // const myCallback = (dataFromChild: string) => {
  //   //console.log('This is data from child', dataFromChild.toString());
  //   setPaymentType(dataFromChild);
  // };

  const [termsAndConditions, setTermsAndConditions] = React.useState(false);

  const handleTermsAndConditions = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTermsAndConditions(event.target.checked);
  };

  const disableSubmit = () => {
    const sectionIncomplete: boolean = steps.some(
      (section, index) => incomplete[index] === undefined || incomplete[index]
    );

    if (!termsAndConditions) {
      return true;
      // } else if (sectionIncomplete) {
      //   return true;
    } else {
      return false;
    }
  };

  const selectedCardCallback = (dataFromChild: string) => {
    console.log("This is data from child card", dataFromChild.toString());
    setCardType(dataFromChild.toString());
  };

  const selectFaIdCallBack = (dataFromChild: string) => {
    console.log("This is data from child faId", dataFromChild.toString());
    setfaIdType(dataFromChild.toString());
  };

  const redirectToServiceRequests = () => {
    dispatch(unsetAssistedFlow());
    router.push("/submit/applicationpaylater");
  };

  const classes = useStyles();

  let isFaId =
    response &&
    response?.data &&
    response?.data?.fleetAccountDetails &&
    response?.data?.fleetAccountDetails?.isCustom;
  let isCardDetailIndividual = response?.data?.cardDetails?.isVirtual;
  let isCardDetailsBulk = response?.data?.cardDetails?.cardsBulkData?.isVirtual;
  useEffect(() => {
    if (!store.faIdType && !store.cardTypeIndividual && !store.cardTypeBulk) {
      if (
        isFaId === true ||
        isCardDetailIndividual === false ||
        isCardDetailsBulk === false
      ) {
        setpaymentSectionDisable(false);
      }
    }
  }, [isFaId, isCardDetailIndividual, isCardDetailsBulk]);

  useEffect(() => {
    paymentSectionEnableDisable(
      store.faIdType,
      store.cardTypeIndividual,
      store.cardTypeBulk
    );
  }, [store.faIdType, store.cardTypeIndividual, store.cardTypeBulk]);

  const paymentSectionEnableDisable = (
    faIdType: string,
    cardIndividual: string,
    cardBulk: string
  ) => {
    if (
      faIdType === "custom" ||
      cardIndividual === "physical" ||
      cardBulk === "physical"
    ) {
      setpaymentSectionDisable(false);
    } else if (faIdType === "" || cardIndividual === "" || cardBulk === "") {
      return;
    } else {
      setpaymentSectionDisable(true);
    }
  };

  return (
    <Container
      maxWidth="xl"
      className={`${classes.rootContainer} ${styles.container} ${store.assistedFlow ? styles.assistedContainer : ""
        }`}
    >
      <Hidden xsDown>
        <Paper
          className={`${store.assistedFlow ? styles.headerPaperAssisted : styles.headerPaper
            } ${classes.paperContainer}`}
        >
          <Container maxWidth="lg">
            {store.assistedFlow && (
              <Box component="div" className="mt-4 d-flex align-items-center">
                <ArrowBackIcon
                  className={`mr-2 ${styles.iconColor}`}
                  onClick={() => redirectToServiceRequests()}
                ></ArrowBackIcon>
                <span
                  className={`${styles.backToService}`}
                  data-test-id="back-to-service"
                >
                  Back to service requests
                </span>
              </Box>
            )}
            <div
              className={`d-flex align-items-center justify-content-between pt-4 ${styles.formTitle}`}
            >
              <div className={`d-flex align-items-center ${styles.titleLeft}`}>
                <img src={SmartfleetLogoDesktop} alt="Smartfleet logo"></img>
                <p
                  className={`mr-2 mb-0 ml-2 ${styles.formTitle}`}
                  data-test-id="registration-form"
                >
                  Registration form
                </p>
                {/* <p
                  className={`mr-2 mb-0 ${styles.formLastSaved}`}
                  data-test-id="last-saved"
                >
                  (Last saved today 05.40 pm)
                </p> */}
              </div>
              <div>
                <Typography
                  color="error"
                  variant="subtitle2"
                  data-test-id="indicated-mandatory-fields"
                >
                  * indicates mandatory fields
                </Typography>
              </div>
            </div>

            <div className="w-100">
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<CustomStepperConnector />}
                className="pt-sm-4 px-0"
              >
                {steps.map((label, index) => (
                  <Step
                    onClick={() => handleStepClick(index)}
                    key={label}
                    completed={completed[index]}
                    className={`justify-content-between ${styles.cursorPointer}`}
                  >
                    <StepLabel
                      StepIconComponent={CustomStepIcon}
                      error={incomplete[index]}
                    >
                      <span className={`${styles.stepperLabel}`}>{label}</span>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          </Container>
        </Paper>
      </Hidden>
      <Hidden smUp>
        <Paper elevation={0} square>
          <Typography
            component="div"
            variant="h4"
            color="textPrimary"
            className="p-3"
            data-test-id="registration-form"
          >
            <ArrowBackIcon
              className={`mr-2 ${styles.iconColor}`}
              onClick={() => redirectToServiceRequests()}
            ></ArrowBackIcon>
            <img src={SmartfleetLogo} alt="Smartfleet logo"></img> Registration
            Form
          </Typography>
        </Paper>
      </Hidden>
      <Paper className={`${styles.formPaper}`} elevation={0}>
        <Container className={`py-sm-4 px-0 px-sm-3`} maxWidth="lg">
          <CustomAccordion
            expanded={expanded === steps[0]}
            onChange={handleAccordianExpand(steps[0])}
            elevation={0}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[0] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-basic-profile"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 0}
                      key={formSections.BASIC_PROFILE}
                      completed={completed[0]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="1"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[0]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  Basic Profile
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-basic-profile"
                >
                  1. Basic Profile
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <BasicProfile
                role={role}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.basicProfile}
              ></BasicProfile>
            </CustomAccordionDetails>
          </CustomAccordion>
          <CustomAccordion
            expanded={expanded === steps[1]}
            onChange={handleAccordianExpand(steps[1])}
            elevation={0}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[1] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-address-details"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 1}
                      key={formSections.ADDRESS_DETAILS}
                      completed={completed[1]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="2"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[1]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  Address Details
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-address-details"
                >
                  2. Address Details
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <AddressDetails
                role={role}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.addressDetails}
              ></AddressDetails>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[2]}
            onChange={handleAccordianExpand(steps[2])}
            elevation={0}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[2] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-kyc-details"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 2}
                      key={formSections.KYC_DETAILS}
                      completed={completed[2]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="3"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[2]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  KYC Details
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-kyc-details"
                >
                  3. KYC Details
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <KycDetails
                role={role}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.kycDetails}
                dropdownLists={dropdownLists?.kycDetails}
              ></KycDetails>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[3]}
            onChange={handleAccordianExpand(steps[3])}
            elevation={0}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[3] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-business-information"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 3}
                      key={formSections.BUSINESS_INFORMATION}
                      completed={completed[3]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="4"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[3]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  Business Information
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-business-information"
                >
                  4. Business Information
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <BusinessInformation
                role={role}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.businessInfo}
                dropdownLists={dropdownLists?.businessInfo}
              ></BusinessInformation>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[4]}
            onChange={handleAccordianExpand(steps[4])}
            elevation={0}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[4] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-card-management"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 4}
                      key={formSections.CARD_MANAGEMENT}
                      completed={completed[4]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="5"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[4]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  Card Management
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-card-management"
                >
                  5. Card Management
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <CardManagement
                selectedCardCallback={selectedCardCallback}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.cardDetails}
                dropdownLists={dropdownLists?.cardManagemennt}
              ></CardManagement>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[5]}
            onChange={handleAccordianExpand(steps[5])}
            elevation={0}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[5] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-fa-id-selection"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 5}
                      key={formSections.FA_ID_SELECTION}
                      completed={completed[5]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="6"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[5]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  FA ID Selection
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-fa-id-selection"
                >
                  6. FA ID Selection
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <FAIdSelection
                faIdCallBack={selectFaIdCallBack}
                role={role}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.fleetAccountDetails}
              ></FAIdSelection>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[6]}
            onChange={handleAccordianExpand(steps[6])}
            elevation={0}
            disabled={paymentSectionDisable}
          >
            <CustomAccordionSummary
              className={store.assistedFlow ? styles.stickyAccordian : ""}
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={
                expanded === steps[6] ? (
                  <RemoveCircleOutlineOutlinedIcon />
                ) : (
                    <AddCircleOutlineOutlinedIcon />
                  )
              }
            >
              <Hidden smUp>
                <Box
                  className={` d-flex align-items-center ${styles.formSectionHeading}`}
                  data-test-id="step-payment"
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    className={`p-0 ${styles.mobileStepper}`}
                  >
                    <Step
                      active={activeStep === 6}
                      key={formSections.PAYMENT}
                      completed={completed[6]}
                      className="pl-0"
                    >
                      <StepLabel
                        icon="7"
                        StepIconComponent={CustomStepIconMobile}
                        error={incomplete[6]}
                      ></StepLabel>
                    </Step>
                  </Stepper>
                  Payment
                </Box>
              </Hidden>
              <Hidden xsDown>
                <span
                  className={`${styles.formSectionHeading}`}
                  data-test-id="step-payment"
                >
                  7. Payment
                </span>
              </Hidden>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <Payment
                // parentCallback={myCallback}
                handleIncompleteStep={handleIncompleteStep}
                handleCompleteStep={handleCompleteStep}
                initialData={response?.data?.paymentDetails}
                dropdownLists={dropdownLists?.paymentType}
                expanded={expanded === steps[6]}
              ></Payment>
            </CustomAccordionDetails>
          </CustomAccordion>
          <div className="py-4 d-flex px-4 px-sm-0">
            <div>
              <FormControlLabel
                className={`${styles.checkBoxPos}`}
                data-test-id="terms-condition-check"
                control={
                  <Checkbox
                    checked={termsAndConditions}
                    onChange={handleTermsAndConditions}
                    name="checkedB"
                    color="primary"
                  />
                }
                label=""
              />
            </div>
            <Hidden xsDown>
              <div>
                <Typography variant="body1" data-test-id="agreement-text">
                  I declare that I have read the{" "}
                  <span
                    className={`MuiTypography-colorPrimary font-weight-bold ${styles.cursorPointer}`}
                  >
                    Terms & Conditions
                  </span>{" "}
                  mentioned overleaf and I agree that by using SmartFleet I
                  accept the same. The information provided on the application
                  is correct and true to the best of my knowledge and any
                  misrepresentation of the facts will amount to termination of
                  the membership.
                </Typography>
              </div>
            </Hidden>
            <Hidden smUp>
              <div className="py-2">
                <Typography variant="body1" data-test-id="agreement-text">
                  I agree to the{" "}
                  <span
                    className={`MuiTypography-colorPrimary font-weight-bold ${styles.cursorPointer}`}
                  >
                    Terms & Conditions
                  </span>{" "}
                </Typography>
              </div>
            </Hidden>
          </div>
          <Hidden xsDown>
            <Box
              className={`d-flex justify-content-end w-100 py-3 ${styles.submitBox}`}
            >
              {/* <CustomButton
                color="primary"
                onClick={openFeePaidAtROModal}
                variant="outlined"
                className={`mr-4`}
                data-test-id="save-as-draft-button"
              >
                Save as draft
              </CustomButton> */}
              <CustomButton
                color="primary"
                variant="contained"
                className={`mr-4 ${styles.noOutlineButton}`}
                onClick={handleClickOpen}
                disabled={disableSubmit()}
                data-test-id="submit-button"
              >
                Submit
              </CustomButton>
            </Box>
          </Hidden>
          <Hidden smUp>
            <Grid container spacing={4} className="pb-4 px-4 px-sm-0">
              <Grid item xs={6} sm={4} className="py-0">
                {/* <CustomButton
                  variant="outlined"
                  color="primary"
                  className="w-100"
                  data-test-id="save-as-draft-button"
                >
                  Save as draft
                </CustomButton> */}
              </Grid>
              <Grid item xs={6} sm={4} className="py-0">
                <CustomButton
                  onClick={handleClickOpen}
                  disabled={disableSubmit()}
                  variant="contained"
                  color="primary"
                  className="w-100"
                  data-test-id="submit-button"
                >
                  Submit
                </CustomButton>
              </Grid>
            </Grid>
          </Hidden>
        </Container>
        <ApplicationStatusModal
          open={openFeePaidAtRO}
          onClose={closeFeePaidAtROModal}
        ></ApplicationStatusModal>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          // fullWidth
          classes={{
            paper: classes.dialog,
          }}
        >
          <div className={`d-flex flex-column `}>
            <div
              className={`d-flex flex-row pt-3 p-3 w-100 justify-content-between bd-highlight w-100`}
            >
              <img
                src={cancelImg}
                onClick={handleClose}
                alt="cancelImg"
                className={`${styles.noOpacity}`}
              />

              <Typography
                className={`d-flex pt-2 pt-sm-3 ${styles.dialogTitle}`}
                color="primary"
                data-test-id="confirmation-button"
              >
                Confirm Submission
              </Typography>
              <img
                className={`d-flex mr-2 pt-2 align-items-end cursor-pointer ${styles.iconColor}`}
                onClick={handleClose}
                src={cancelImg}
                alt="cancelImg"
              />
            </div>
            <DialogContent>
              <div
                className={`d-flex flex-column justify-content-center align-items-center pt-1`}
              >
                <img src={WarningIcon} alt="" />
              </div>
              <DialogContentText
                className={`d-flex pt-5 flex-column align-items-center justify-content-center`}
                id="alert-dialog-description"
              >
                <Hidden smUp>
                  <Typography className={`${styles.dialogMobileSubTitle}`}>
                    Are you sure you want to submit the registration form?
                  </Typography>
                </Hidden>
                <Hidden xsDown>
                  <Typography className={`${styles.dialogSubTitle}`}>
                    Are you sure you want to submit the registration form?
                  </Typography>
                </Hidden>
              </DialogContentText>
            </DialogContent>
            <DialogActions
              className={`d-flex flex-column justify-content-center align-items-center pt-4`}
            >
              <Hidden smUp>
                <div
                  className={`d-flex justify-content-center align-items-center`}
                >
                  <div className={`d-flex align-items-end mr-4 pd-2`}>
                    <Button
                      onClick={handleClose}
                      color="primary"
                      variant="outlined"
                      className={`${styles.mobileBtn}`}
                    >
                      No
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={onFormSubmit}
                      color="primary"
                      variant="contained"
                      className={`${styles.mobileBtn}`}
                    >
                      yes
                    </Button>
                  </div>
                </div>
              </Hidden>
              <Hidden xsDown>
                <div
                  className={`d-flex justify-content-center align-items-center`}
                >
                  <div className={`d-flex align-items-end mr-4 pd-2`}>
                    <CustomButton
                      onClick={handleClose}
                      color="primary"
                      variant="outlined"
                    >
                      No
                    </CustomButton>
                  </div>
                  <div>
                    <CustomButton
                      onClick={onFormSubmit}
                      color="primary"
                      variant="contained"
                    >
                      yes
                    </CustomButton>
                  </div>
                </div>
              </Hidden>
            </DialogActions>
          </div>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default SmartfleetRegistrationForm;
