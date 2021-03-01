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
import styles from "./PetrocorporateRegistrationForm.module.scss";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { formSections } from "./types/formSections.enum";
import { CustomStepIconMobile } from "../../components/CustomStepperConnector/CustomStepperIconMobile";
// import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const cancelImg = "/Cancel_Icon.svg";
const WarningIcon = "/warning.svg";
const ClipboardIcon = "/W_Icons_Smartfleet_Clipboard.svg";

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
      width: 656,
      height: 305,
      X: 312,
      Y: 220,
      Radius: 4,
    },
  })
);

const PetrocorporateRegistrationForm = (props: {
  history: any;
  location: any;
}) => {
  const router = useRouter();
  useEffect(() => {}, [props]);

  // const dispatch = useDispatch();
  // const store: any = useSelector((state) => state);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Will change based on business type selected (b2b/b2c for now)
  let role = router.query.formType ? router.query.formType : "b2c";

  // const [formComplete, setFormComplete] = React.useState<boolean>(false);

  const steps = [
    formSections.BASIC_PROFILE,
    formSections.ADDRESS_DETAILS,
    formSections.KYC_DETAILS,
    formSections.BUSINESS_INFORMATION,
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );
  const [incomplete, setIncomplete] = React.useState<{ [k: number]: boolean }>({
    2: false, // KEEP THIS.

    // REMOVE THESE ONCE DEVELOPED
    // kept these untill Card Management and Payment are not incorporated
    4: false,
    6: false,
  });

  const handleCompleteStep = (section: formSections, isComplete: boolean) => {
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
    steps[0]
  );

  const handleAccordianExpand = (panel: formSections) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
    setActiveStep(newExpanded ? steps.indexOf(panel) : 0);
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setExpanded(steps[index]);
  };

  const onFormSubmit = (): void => {
    // props.history.push("/petrocorp/enrolsuccess");
    router.push("/petrocorp/enrolsuccess");
    // if (formComplete && termsAndConditions) {
    //   if (paymentType === "1") {
    //     props.history.push("/submit/applicationfeepaid");
    //   } else if (paymentType === "2") {
    //     props.history.push("/submit/applicationfeewaiver");
    //   } else if (paymentType === "3") {
    //     props.history.push("/submit/applicationfeepaid");
    //   } else {
    //     props.history.push("/submit/applicationpaylater");
    //   }
    // }
  };

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
    } else if (sectionIncomplete) {
      return true;
    } else {
      return false;
    }
  };
  const classes = useStyles();
  return (
    <Container
      maxWidth="xl"
      className={`${classes.rootContainer} ${styles.container}`}
    >
      <Hidden xsDown>
        <Paper className={`${styles.headerPaper} ${classes.paperContainer}`}>
          <Container maxWidth="lg">
            <div
              className={`d-flex align-items-center justify-content-between pt-4 ${styles.formTitle}`}
            >
              <div className={`d-flex align-items-center ${styles.titleLeft}`}>
                <img src={ClipboardIcon} alt="clipboard icon"></img>
                <p
                  className={`mr-2 mb-0 ml-2 ${styles.formTitle}`}
                  data-test-id="petrocorporate-form-title"
                >
                  PETROCORPORATE REGISTRATION FORM
                </p>
                <p
                  className={`mr-2 mb-0 ${styles.formLastSaved}`}
                  data-test-id="last-saved-on"
                >
                  (Last saved today 05.40 pm)
                </p>
              </div>
              <div>
                <Typography
                  color="error"
                  variant="subtitle2"
                  data-test-id="indicates-mandatory-fields"
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
                      data-test-id={`step-label-${label}`}
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
            data-test-id="petrocorporate-form-title"
          >
            Petrocorporate Registration Form
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
              ></BasicProfile>
            </CustomAccordionDetails>
          </CustomAccordion>
          <CustomAccordion
            expanded={expanded === steps[1]}
            onChange={handleAccordianExpand(steps[1])}
            elevation={0}
          >
            <CustomAccordionSummary
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
              ></AddressDetails>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[2]}
            onChange={handleAccordianExpand(steps[2])}
            elevation={0}
          >
            <CustomAccordionSummary
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
              ></KycDetails>
            </CustomAccordionDetails>
          </CustomAccordion>

          <CustomAccordion
            expanded={expanded === steps[3]}
            onChange={handleAccordianExpand(steps[3])}
            elevation={0}
          >
            <CustomAccordionSummary
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
              ></BusinessInformation>
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
                  mentioned overleaf and I agree that by using Petrocorporate I
                  accept the same. The information provided on the application
                  is correct and true to the best of my knowledge and any
                  misrepresentation of the facts will amount to termination of
                  the membership.
                </Typography>
              </div>
            </Hidden>
            <Hidden smUp>
              <div className="mt-1">
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
              <CustomButton
                color="primary"
                variant="outlined"
                className={`mr-4`}
                data-test-id="save-as-draft"
              >
                Save as draft
              </CustomButton>
              <CustomButton
                color="primary"
                variant="contained"
                className={`mr-4 ${styles.noOutlineButton}`}
                onClick={handleClickOpen}
                disabled={disableSubmit()}
                data-test-id="submit"
              >
                Submit
              </CustomButton>
            </Box>
          </Hidden>
          <Hidden smUp>
            <Grid container spacing={4} className="pb-4 px-4 px-sm-0">
              <Grid item xs={6} sm={4} className="py-0">
                <CustomButton
                  variant="outlined"
                  color="primary"
                  className="w-100"
                  data-test-id="save-as-draft"
                >
                  Save as draft
                </CustomButton>
              </Grid>
              <Grid item xs={6} sm={4} className="py-0">
                <CustomButton
                  onClick={handleClickOpen}
                  disabled={disableSubmit()}
                  variant="contained"
                  color="primary"
                  className="w-100"
                  data-test-id="submit"
                >
                  Submit
                </CustomButton>
              </Grid>
            </Grid>
          </Hidden>
        </Container>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
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

export default PetrocorporateRegistrationForm;
