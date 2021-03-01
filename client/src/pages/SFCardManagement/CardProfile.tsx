import React, { useState, useEffect, useContext } from "react";
import styles from "./CardManagement.module.scss";
import {
  Grid,
  InputAdornment,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  Hidden,
  makeStyles,
  Theme,
  createStyles,
  useTheme,
  FormControl,
  FormHelperText,
  ListItemText,
  Checkbox,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { CardsContext } from "../SmartfleetRegistrationForm/CardManagement/CardManagement";
import { formSections } from "../../pages/SmartfleetRegistrationForm/types/formSections.enum";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import AddCards from "../CAMCardManagement/AddCards/AddCards";
import {
  isVailidName,
  isValidVehicleNumber,
  isValidYearOfRegistration,
  isValidMobileNumber,
  isOnlyNumbers,
} from "../../utility/validations/validations";
// import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";

// import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";

import { CardsContextAddCard } from "src/pages/CAMCardManagement/AddCards/AddCards";

import { useSelector } from "react-redux";
import validator from "validator";

const WarningIcon = "/W_Icons_Warning.svg";
const NextIcon = "/Next_Icon.svg";
const PreviousIcon = "/Previous_Icon.svg";
const InfoIcon = "/W_Icons_Info.svg";
import lodash from "lodash";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { getCardDropDowns } from "../../lib/api/SFCardManagement/sfcardmanagement";
import {
  postPopupProfile,
  getDropdown,
} from "../../lib/api/smartfleet/smartfleet";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import { setLoader } from "../../redux/actions/actions";

const StyledMenuItem = withStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  })
)(MenuItem);

const dialogBoxStyles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    filterTitle: {
      fontFamily: "OpenSans",
      fontSize: "28px",
      fontWeight: "bold",
      fontStretch: "normal",
      fontStyle: "normal",
      lineHeight: "1.36",
      letterSpacing: "normal",
      textAlign: "left",
      color: "#0369dd",
    },
    filledItem: {
      color: "#0369dd",
    },
  });

const useStyles = makeStyles((theme) => ({
  dialogCustomizedWidth: {
    "max-width": "60%",
  },
}));

export interface DialogTitleProps extends WithStyles<typeof dialogBoxStyles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(dialogBoxStyles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4" className={`pl-3 ${classes.filterTitle}`}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    overflow: "Hidden",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface IErrorMessages {
  customCardName?: string;
  vehicleNumber?: string;
  yearOfRegistration?: string;
  vehicleMake?: string;
  vehicleType?: string;
  fuelType?: string;
  cardPersonalization?: string;
}

export const PopupCardProfile = (props: any) => {
  const [navigationFlag, setnavigationFlag] = React.useState(
    props.navigationFlag
  );
  const CARD_CONTEXT = navigationFlag
    ? useContext(CardsContext)
    : useContext(CardsContextAddCard);
  const selectedCardDetails = CARD_CONTEXT.selectedCardDetails;
  const [selectedCardNumber, setSelectedCardNumber] = useState<number>(1);
  const store: any = useSelector((state) => state);
  // const [dropdownLists, setdropdownLists] = useState(
  //   navigationFlag ? CARD_CONTEXT.dropdownLists : props.dropdownLists
  // );
  const [hideButton, setHideButton] = useState<boolean>(false);

  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState(props.initialData);
  const [validInput, setValidInput] = useState(false);
  const [cardFields, setCardFields] = useState(props.cardFields);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const {
    openModal = false,
    handleCardProfileClose = null,
    filterCardData,
  } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSubmitSuccessfulModal, setOpenSubmitSuccessfulModal] = useState(
    false
  );
  const { dropdownLists } = props;

  const initFields = {
    customCardNumber: "",
    vehicleNumber: "",
    registrationYear: "",
    vehicleMake: "",
    vehicleType: "",
    fuelType: "",
    cardPersonalization: "",
    editable: false,
  };
  const { handleSave } = props;
  const [fields, setFields] = React.useState(initFields);
  const [originalState, setOriginalState] = React.useState<any | {}>(
    initFields
  );
  const [isSectionEditable, setIsSectionEditable] = React.useState(
    initFields.editable
  );
  const [isEditIcon, setIsEditIcon] = React.useState(true);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState<IErrorMessages>({});

  // useEffect(() => {

  //   const { initialData } = props;

  //     if (initialData) {
  //       console.log("initialData", initialData);

  //       const initialFields = {
  //         customCardNumber: initialData?.customCardNumber,
  //         vehicleNumber: initialData?.vehicleNumber,
  //         registrationYear: initialData?.registrationYear,
  //         vehicleMake: initialData?.vehicleMake,
  //         vehicleType: initialData?.vehicleType,
  //         fuelType: initialData?.fuelType,
  //         cardPersonalization: initialData?.cardPersonalization,
  //         editable: initialData?.editable,
  //       };
  //       setFields(initialFields);
  //       setOriginalState(initialFields);
  //       setIsSectionEditable(initialData?.editable);
  //     }
  //   }, []);

  //   const handleTextfieldChange = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ): void => {
  //     if (
  //       originalState[event.target.name] !== event.target.value

  //       ) {
  //       setIsSectionEditable(true);
  //     } else {
  //       setIsSectionEditable(false);
  //     }
  //     setValidInput(true);
  //     setFields({ ...fields, [event.target.name]: event.target.value });
  //   };

  //    //Handle Edit

  //    const handleEdit =(event: React.MouseEvent<HTMLElement>) =>{
  //     setIsSectionEditable(true);
  //     setIsEditIcon(false);

  //   }

  //   const handleClear = (event: React.MouseEvent<HTMLElement>) => {
  //     if (!isSectionEditable) {
  //       return false;
  //     }
  //     // setFields(initFields);
  //     setInitialData(originalState);
  //     setFields(originalState);
  //    // setErrorMessage({});
  //     setIsSectionEditable(false);
  //     setIsEditIcon(true);

  //   };

  //   const validate = (): boolean => {

  //     let isError: boolean = false;
  //     console.log("VVVVVVVVValidation");
  //     // setErrorMessage({});
  //     // Validate Name
  //     if (!fields.customCardNumber) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         name: validationErrorMessage.REQUIRED,
  //       }));
  //     } else if (!isVailidName(fields.customCardNumber)) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         customCardNumber: validationErrorMessage.INVALID_NAME,
  //       }));
  //     }
  //     console.log("VVVVVVVVValidation name");
  //     // Validate Designation
  //     if (!initialData.vehicleNumber) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         vehicleNumber: validationErrorMessage.REQUIRED,
  //       }));
  //     } else if (!isVailidName(initialData.vehicleNumber)) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         vehicleNumber: validationErrorMessage.INVALID_NAME,
  //       }));
  //     }

  //     // Validate Mobile
  //     if (!initialData.cardPersonalization) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         cardPersonalization: validationErrorMessage.REQUIRED,
  //       }));
  //     } else if (!isValidMobileNumber(initialData.cardPersonalization)) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         cardPersonalization: validationErrorMessage.MOBILE_NUMBER,
  //       }));
  //     }

  //     // Validate Email
  //     if (!initialData.email) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         email: validationErrorMessage.REQUIRED,
  //       }));
  //     } else if (!isValidEmailAddress(initialData.email)) {
  //       isError = true;
  //       setErrorMessage((errorMessage) => ({
  //         ...errorMessage,
  //         email: validationErrorMessage.EMAIL,
  //       }));
  //     }
  //     console.log("ssssssssssss");
  //     return isError;

  //   };

  //   const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
  //     if (!isSectionEditable) {
  //       return false;
  //     }
  //     setErrorMessage({});
  //     event.preventDefault();
  //     const isError = validate();
  //     //setLoader(true);
  //     console.log("Authsign isError", isError);
  //     console.log("Authsign fields", fields);
  //     console.log("Authsign errorMessage", errorMessage);
  //     if (!isError) {
  //       // If all validations pass, API call to submit basic profile data
  //       console.log("All validations pass-----");
  //       console.log(fields);
  //       dispatch(setLoader(true));
  //       const finalData = {
  //         ...fields,
  //       };
  //       // console.log("store", store);
  //       console.log("finalData", finalData);
  //       const res: any = await postPopupProfile(finalData);

  //       console.log("postAuthorisedSignature res : ", res);

  //       if (res?.status === "success" || res?.status === "updated") {
  //         //setErrorMessage({});
  //         setShowSnackbar(true);
  //         setSnackbarMessage(SnackbarMessage.SAVE_API_SUCCESS);
  //         setAlertType("success");
  //         setIsSectionEditable(false);
  //       } else {
  //         if (res?.errors) {
  //           const errorObj: any = {};
  //           res?.errors.forEach((element: any) => {
  //             console.log(element?.subject);
  //             if (!element.hasOwnProperty("subject")) {
  //               setApiOtherErrorMessage(element?.message);
  //               setShowSnackbar(true);
  //               setSnackbarMessage(element?.message + " " + element?.subject);
  //               setAlertType("error");
  //             } else {
  //               //check if customerId exists
  //               // if (element?.subject === "customerId") {
  //               //   setShowSnackbar(true);
  //               //   setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
  //               //   setAlertType("error");
  //               // }
  //               if (element?.subject === "organizationName") {
  //                 errorObj.primaryUserOrganizationName = element?.message;
  //               }
  //               errorObj[element?.subject] = element?.message;
  //             }
  //             setErrorMessage((errorMessage) => ({
  //               ...errorMessage,
  //               ...errorObj,
  //             }));
  //           });
  //         } else {
  //           setShowSnackbar(true);
  //           setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
  //           setAlertType("error");
  //         }
  //       }
  //       //setLoader(false);
  //       dispatch(setLoader(false));

  //     }

  //   };

  /* ---------------------------------------------------- */

  // //previous card navigation
  // function previousCard(event: React.MouseEvent<HTMLImageElement>) {
  //   event.preventDefault();
  //   if (selectedCardNumber > 1) {
  //     CARD_CONTEXT.getSelectedCardId(selectedCardNumber - 1);
  //     setSelectedCardNumber(selectedCardNumber - 1);
  //   } else {
  //     return false;
  //   }
  // }

  // //next card navigation
  // const nextCard = (event: React.MouseEvent<HTMLImageElement>) => {
  //   event.preventDefault();

  //   if (CARD_CONTEXT.cardCounter.val.length === selectedCardNumber) {
  //     return false;
  //   } else {
  //     CARD_CONTEXT.getSelectedCardId(selectedCardNumber + 1);
  //     setSelectedCardNumber(selectedCardNumber + 1);
  //   }
  // };

  // const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   const { name, value } = event.target;
  //   const testArray = (value as unknown) as string[];
  //   let arr;

  //   if (
  //     selectedCardDetails?.fuelType.value.includes("All") &&
  //     value.includes("All")
  //   ) {
  //     arr = testArray.filter((e) => e != "All");
  //   } else if (value.includes("All")) {
  //     arr = ["All"];
  //   } else {
  //     arr = value;
  //   }

  //   let copyCardFields = lodash.cloneDeep(selectedCardDetails);
  //   copyCardFields = {
  //     ...copyCardFields,
  //     [name]: { value: arr, error: "" },
  //   };
  //   props.updateSelectedCardDetails(copyCardFields);
  // };

  // //get field input values
  // const getInputValues = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();

  //   const { name, value } = event.currentTarget;

  //   let copyCardFields = lodash.cloneDeep(selectedCardDetails);
  //   if (
  //     event.target.name === "mobileNumber" ||
  //     event.target.name === "yearOfReg"
  //   ) {
  //     if (isOnlyNumbers(event.target.value)) {
  //       copyCardFields = {
  //         ...copyCardFields,

  //         [name]: { value: value, error: "" },
  //       };
  //     }
  //   } else {
  //     copyCardFields = {
  //       ...copyCardFields,
  //       [name]: { value: value, error: "" },
  //     };
  //   }

  //   props.updateSelectedCardDetails(copyCardFields);
  //   if (props.navigationFlag) {
  //     if (value) {
  //       CARD_CONTEXT.handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
  //     }
  //   }
  // };

  // //get dropdown values
  // const getSelectValues = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   const { name, value } = event.target;
  //   let copyCardFields = lodash.cloneDeep(selectedCardDetails);
  //   copyCardFields = {
  //     ...copyCardFields,
  //     [name]: { value: value, error: "" },
  //   };
  //   props.updateSelectedCardDetails(copyCardFields);
  //   if (props.navigationFlag) {
  //     if (value) {
  //       CARD_CONTEXT.handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
  //     }
  //   }
  // };

  const handleClose = () => {
    setOpen(false);
  };
  const [disabled, setDisabled] = useState(true);

  function handleGameClick() {
    setDisabled(!disabled);
    setHideButton(true);
  }

  const [state, setState] = useState({
    vehicleNumber: "",
    vehicleMake: "",
    vehicleType: "",
    fuelType: "",
    yearOfRegistration: "",
  });
  const handleProfileChange = (e: any) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //render function for all card fields
  const renderCardFields = () => {
    console.log("selectedCardDetails");
    //console.log(store.smartfleetPrimaryMobileNumber, selectedCardDetails);

    console.log(dropdownLists);
    return (
      <React.Fragment>
        <div className={styles.cardDetailsFieldsSubContainer}>
          <Dialog
            fullWidth={true}
            classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
            onClose={handleCardProfileClose}
            aria-labelledby="customized-dialog-title"
            open={openModal}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={handleCardProfileClose}
            >
              Card Profile
            </DialogTitle>
            <DialogContent className={"pl-5 pr-5"}>
              <Grid
                container
                direction={"row"}
                spacing={3}
                id={`grid-${selectedCardNumber}`}
              >
                <Grid item xs={12} sm={4} id={"filledItem"}>
                  <CustomLabel
                    htmlFor="card-mgmt-name-n-card"
                    className={`d-flex justify-content-between`}
                  >
                    Custom Card Name
                  </CustomLabel>
                  <CustomTextField
                    id={`card-mgmt-name-n-card-${selectedCardNumber}`}
                    placeholder="John Doe"
                    variant="outlined"
                    size="small"
                    name="nameOnCard"
                    className={`m-0`}
                    disabled
                    // value={fields.customCardNumber}
                    // onChange={handleTextfieldChange}
                    error={!!selectedCardDetails?.nameOnCard.error}
                    helperText={
                      selectedCardDetails?.nameOnCard.error &&
                      selectedCardDetails?.nameOnCard.error
                    }
                    InputProps={{
                      endAdornment: selectedCardDetails?.nameOnCard.error && (
                        <InputAdornment position="end">
                          <CustomSvgIcon iconsource={WarningIcon} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e: any) => getInputValues(e)}
                    value={
                      selectedCardDetails?.nameOnCard.value
                        ? selectedCardDetails?.nameOnCard.value
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-name-n-card"
                    className={`d-flex justify-content-between`}
                  >
                    Vehicle Number
                    {/* {selectedCardDetails?.selectedNameOfCard.value ===
                  "vehicleNumber"
                  ? " *"
                  : ""}
                  &nbsp;&nbsp;&nbsp;
                  <CustomTooltip
                  enterTouchDelay={0}
                  disableFocusListener
                  title=" Enter vehicle number without special characters or spaces."
                  placement="bottom-start"
                >
                  <img
                    src={InfoIcon}
                    alt="Info for Vehicle Number"
                    className={`${styles.infoRight}`}
                  ></img>
                </CustomTooltip> */}
                  </CustomLabel>

                  <CustomTextField
                    id={`card-mgmt-vehicle-number-${selectedCardNumber}`}
                    placeholder="MH01AB1111"
                    variant="outlined"
                    size="small"
                    name="vehicleNumber"
                    className={`m-0`}
                    // value={fields.vehicleNumber}
                    // disabled={disabled}
                    // onChange={handleTextfieldChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!selectedCardDetails?.vehicleNumber.error}
                    helperText={
                      selectedCardDetails?.vehicleNumber.error &&
                      selectedCardDetails?.vehicleNumber.error
                    }
                    InputProps={{
                      endAdornment: selectedCardDetails?.vehicleNumber
                        .error && (
                          <InputAdornment position="end">
                            <CustomSvgIcon iconsource={WarningIcon} />
                          </InputAdornment>
                        ),
                    }}
                    onChange={(e: any) => getInputValues(e)}
                    value={
                      selectedCardDetails?.vehicleNumber.value
                        ? selectedCardDetails?.vehicleNumber.value
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomLabel htmlFor="card-mgmt-year-of-reg">
                    Year of Registration
                  </CustomLabel>
                  <CustomTextField
                    id="card-mgmt-year-of-reg"
                    placeholder="2012"
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                    name="yearOfReg"
                    // value={fields.registrationYear}
                    // onChange={handleTextfieldChange}
                    className={`m-0`}
                    error={!!selectedCardDetails?.yearOfReg.error}
                    helperText={
                      selectedCardDetails?.yearOfReg.error &&
                      selectedCardDetails?.yearOfReg.error
                    }
                    InputProps={{
                      endAdornment: selectedCardDetails?.yearOfReg.error && (
                        <InputAdornment position="end">
                          <CustomSvgIcon iconsource={WarningIcon} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e: any) => getInputValues(e)}
                    value={
                      selectedCardDetails?.yearOfReg.value
                        ? selectedCardDetails?.yearOfReg.value
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomLabel htmlFor="card-mgmt-name-n-card">
                    Vehicle Make
                  </CustomLabel>
                  <CustomSelect
                    labelId="demo-simple-select-outlined-label"
                    id="vehicle-make"
                    variant="outlined"
                    fullWidth
                    placeholder="TATA Motors"
                    name="vehicleMake"
                    disabled={disabled}
                    // onChange={(e: any) => getSelectValues(e)}
                    // value={
                    //   selectedCardDetails?.vehicleMake.value
                    //     ? selectedCardDetails?.vehicleMake.value
                    //     : ""
                    // }
                    value={state.vehicleMake}
                    onChange={handleProfileChange}
                  >
                    {/* <CustomMenuItem value="0">Select</CustomMenuItem>
                    {dropdownLists.vehicleMake(
                      (list: any, index: number) => {
                        return (
                          // <CustomMenuItem key={list.code} value={list.code}>
                          //   {list.displayName}
                          // </CustomMenuItem>
                          //console.log(dropdownLists.vehicleMake[0].code)
                        )
                      }
                    )} */}

                    <CustomMenuItem value="" disabled selected>
                      Select
                    </CustomMenuItem>
                    <CustomMenuItem value="Tata Motors">
                      Tata Motors
                    </CustomMenuItem>
                    <CustomMenuItem value="Ashok Leyland">
                      Ashok Leyland
                    </CustomMenuItem>
                    <CustomMenuItem value="Mahindra & Mahindra">
                      Mahindra & Mahindra
                    </CustomMenuItem>
                    <CustomMenuItem value="Eicher Motors">
                      Eicher Motors
                    </CustomMenuItem>
                    <CustomMenuItem value="Force Motors">
                      Force Motors
                    </CustomMenuItem>
                    <CustomMenuItem value="SML / ISUZU">
                      SML / ISUZU
                    </CustomMenuItem>
                    <CustomMenuItem value="Bharat Benz">
                      Bharat Benz
                    </CustomMenuItem>
                    <CustomMenuItem value="Scania">Scania</CustomMenuItem>
                    <CustomMenuItem value="Volvo">Volvo</CustomMenuItem>
                    <CustomMenuItem value="Maruthi Suzuki">
                      Maruthi Suzuki
                    </CustomMenuItem>
                    <CustomMenuItem value="Hyundai">Hyundai</CustomMenuItem>
                    <CustomMenuItem value="Hyundai">Honda</CustomMenuItem>
                    <CustomMenuItem value="Toyota">Toyota</CustomMenuItem>
                    <CustomMenuItem value="Renault">Renault</CustomMenuItem>
                    <CustomMenuItem value="Ford India">
                      Ford India
                    </CustomMenuItem>
                    <CustomMenuItem value="Nissan">Nissan</CustomMenuItem>
                    <CustomMenuItem value="Volkswagen">
                      Volkswagen
                    </CustomMenuItem>
                    <CustomMenuItem value="Skoda">Skoda</CustomMenuItem>
                    <CustomMenuItem value="Others">Others</CustomMenuItem>

                    {/* <CustomMenuItem value="Select">Select</CustomMenuItem>
                {dropdownLists.vehicleMake.map((list: any, index: number) => {
                  return (
                    <CustomMenuItem key={list.code} value={list.code}>
                      {list.displayName}
                    </CustomMenuItem>
                  );
                })} */}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-vehicle-type"
                    className={`d-flex justify-content-between`}
                  >
                    Vehicle Type
                  </CustomLabel>
                  <FormControl className="w-100">
                    <CustomSelect
                      labelId="demo-simple-select-outlined-label"
                      id="vehicle-type"
                      variant="outlined"
                      fullWidth
                      disabled={disabled}
                      name="vehicleType"
                      value={state.vehicleType}
                      onChange={handleProfileChange}

                    // onChange={(e: any) => getSelectValues(e)}
                    // value={
                    //   selectedCardDetails?.vehicleType.value
                    //     ? selectedCardDetails?.vehicleType.value
                    //     : ""
                    // }
                    >
                      <CustomMenuItem value="Select">Select</CustomMenuItem>
                      <CustomMenuItem value="hcv">HCV</CustomMenuItem>
                      <CustomMenuItem value="mcv">MCV</CustomMenuItem>
                      <CustomMenuItem value="lcv">LCV</CustomMenuItem>
                      <CustomMenuItem value="suv">SUV</CustomMenuItem>
                      <CustomMenuItem value="muv">MUV</CustomMenuItem>
                      <CustomMenuItem value="car">Car</CustomMenuItem>
                      <CustomMenuItem value="multi-axle">
                        Multi Axle
                      </CustomMenuItem>
                      <CustomMenuItem value="trailer">Trailer</CustomMenuItem>
                      <CustomMenuItem value="others">Others</CustomMenuItem>

                      {/* <CustomMenuItem value="Select">Select</CustomMenuItem>
                {dropdownLists.vehicleType.map((list: any, index: number) => {
                  if (list.displayName) {
                    return (
                      <CustomMenuItem key={list.code} value={list.code}>
                        {list.displayName}
                      </CustomMenuItem>
                    );
                  } else {
                    return (
                      <CustomMenuItem key={list.code} value={list.code}>
                        {list.code}
                      </CustomMenuItem>
                    );
                  }
                })} */}
                    </CustomSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-fuel-type"
                    className={`d-flex justify-content-between`}
                  >
                    Fuel Type
                  </CustomLabel>
                  <FormControl
                    className="w-100"
                    error={!!selectedCardDetails?.fuelType.error}
                  >
                    <CustomSelect
                      labelId="demo-simple-select-outlined-label"
                      id="fuel-type"
                      variant="outlined"
                      fullWidth
                      disabled={disabled}
                      name="fuelType"
                      value={state.fuelType}
                      onChange={handleProfileChange}

                    // onChange={(e: any) => handleChangeEvent(e)}
                    // // onChange={handleChangeEvent}
                    // renderValue={(selected) => (selected as string[]).join(", ")}
                    // multiple
                    // error={!!selectedCardDetails?.fuelType.error}
                    // // className={`${!selectedCardDetails?.fuelType.error &&
                    // //   styles.selectMarginBottom
                    // //   }`}
                    // value={
                    //   selectedCardDetails?.fuelType.value
                    //     ? selectedCardDetails?.fuelType.value
                    //     : [""]
                    // }
                    >
                      <CustomMenuItem value="Select">Select</CustomMenuItem>
                      <CustomMenuItem value="all">ALL</CustomMenuItem>
                      <CustomMenuItem value="petrol">Petrol</CustomMenuItem>
                      <CustomMenuItem value="diesel">Diesel</CustomMenuItem>
                      <CustomMenuItem value="speed">Speed</CustomMenuItem>
                      <CustomMenuItem value="speed-97">Speed 97</CustomMenuItem>
                      <CustomMenuItem value="high">
                        High Speed Diesel
                      </CustomMenuItem>

                      {/* {dropdownLists.fuelType.map((list: any, index: number) => {
                    if (list.displayName) {
                      return (
                        <StyledMenuItem key={list.code} value={list.code}>
                          <Checkbox
                            color="primary"
                            checked={
                              selectedCardDetails?.fuelType.value.indexOf(
                                list.code
                              ) > -1
                            }
                          />
                          <ListItemText primary={list.displayName} />
                        </StyledMenuItem>
                      );
                    } else {
                      return (
                        <StyledMenuItem key={list.code} value={list.code}>
                          <Checkbox
                            color="primary"
                            checked={
                              selectedCardDetails?.fuelType.value.indexOf(
                                list.code
                              ) > -1
                            }
                          />
                          <ListItemText primary={list.code} />
                        </StyledMenuItem>
                      );
                    }
                  })} */}
                    </CustomSelect>

                    <FormHelperText>
                      {selectedCardDetails?.fuelType.error &&
                        selectedCardDetails?.fuelType.error}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {CARD_CONTEXT.selectedCardType === "physical" ? (
                  <Grid item xs={12} sm={4}>
                    <CustomLabel
                      htmlFor="card-mgmt-year-of-reg"
                      className={`d-flex justify-content-between`}
                    >
                      Card Personalization
                    </CustomLabel>
                    <CustomTextField
                      id="card-mgmt-card-personal"
                      placeholder="Mumbai Route"
                      variant="outlined"
                      size="small"
                      disabled
                      name="cardPersonalization"
                      className={`m-0`}
                      inputProps={{ maxLength: 30 }}
                      onChange={(e: any) => getInputValues(e)}
                      value={
                        selectedCardDetails?.cardPersonalization.value
                          ? selectedCardDetails?.cardPersonalization.value
                          : ""
                      }
                    />
                  </Grid>
                ) : null}
              </Grid>
            </DialogContent>
            <DialogActions className={"pr-5 pb-3"}>
              {!hideButton && (
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleGameClick}
                  color="primary"
                >
                  EDIT
                </Button>
              )}
              {hideButton && (
                <>
                  <Button
                    autoFocus
                    variant="outlined"
                    className={"mr-3"}
                    onClick={handleCardProfileClose}
                    color="primary"
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="contained"
                    data-test-id="submit-button"
                    onClick={handleSave}
                    color="primary"
                  >
                    SAVE
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
    // }
    // });
  };

  // useEffect(() => {
  //   console.log("in PopupCardProfile");
  //   setSelectedCardNumber(CARD_CONTEXT.cardObj.selectedCardId);
  //   // setDeletedCardNum(CARD_CONTEXT.cardObj.deletedCardId);
  //   if (CARD_CONTEXT.cardObj.deletedCardId !== 0) {
  //     let copyCardFields = [...cardFields.cards];
  //     copyCardFields.splice(CARD_CONTEXT.cardObj.deletedCardId - 1, 1);
  //     setCardFields({ cards: copyCardFields });
  //   }
  // }, [CARD_CONTEXT.cardObj]);

  return (
    <div>
      <Grid container className={styles.cardDetailsMainContainer}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            &nbsp;
          </Grid>
        </Grid>
        {renderCardFields()}
      </Grid>
    </div>
  );
};
export default PopupCardProfile;
