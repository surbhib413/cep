import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Hidden,
  withStyles,
  Box,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import styles from "./Individual.module.scss";
import { CustomButton } from "../../../../../components/CustomButton/CustomButton";
import { Popup1 } from "../../../../../components/CustomPopups/Popup1/Popup1";
import { Popup2 } from "../../../../../components/CustomPopups/Popup2/Popup2";
import { useRouter } from "next/router";
import { CustomTooltip } from "../../../../../components/CustomTooltip/CustomTooltip";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { Popup4 } from "../../../../../components/CustomPopups/Popup4/Popup4";
import { CardsContextAddCard } from "../../AddCards";
import SampleCardModal from "../../../../SmartfleetRegistrationForm/CardManagement/SampleCardModal";
import lodash from "lodash";
import { useSelector } from "react-redux";
import { validationErrorMessage } from "../../../../../utility/validations/validationErrorMessages";
import CloseIcon from "@material-ui/icons/Close";
import {
  isVailidName,
  isValidVehicleNumber,
  isValidYearOfRegistration,
  isValidMobileNumber,
} from "../../../../../utility/validations/validations";
import Alert from "@material-ui/lab/Alert";
import CardDetailsFields from "src/pages/SmartfleetRegistrationForm/CardManagement/CardDetailsFields";
import { useDispatch } from "react-redux";
import CustomSnackbar from "src/components/CustomSnackbar/CustomSnackbar";
import { setLoader, setPaymentCardIndividual } from "src/redux/actions/actions";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import {
  deleleteCards,
  postCardData,
} from "src/lib/api/smartfleet/cardmanagement";

const cardIcon = "/W_Icon_Credit_Mgmnt.svg";
const deleteIcon = "/W_Icons_Delete.svg";
const editIcon = "/W_Icon_Edit.svg";
const InfoIcon = "/W_Icons_Info.svg";
const noCardsIcon = "/WM_Illus-B2B_Add-Individual-Card.svg";
const CreditCardIcon = "/credit-card.svg";
const CreditCardIconError = "/credit-card-error.svg";
const CreditCardIconSelected = "/credit-card-selected.svg";

const Accordion = withStyles({
  root: {
    //border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
      border: "2px solid rgba(0, 0, 0, .125)",
      borderRadius: "4px",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    padding: "0px",
    backgroundColor: "rgba(0, 0, 0, .03)",
    minHeight: "auto !important",
    "& .MuiAccordionSummary-content": {
      margin: "0px",
    },
  },
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const Individual = (props: any) => {
  const CARD_CONTEXT = useContext(CardsContextAddCard);
  const [selectedCardNumber, setSelectedCardNumber] = useState<number>(0);
  const router = useRouter();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSubmitSuccessfulModal, setOpenSubmitSuccessfulModal] = useState(
    false
  );
  //NEW STATE ADDONS
  // const [expanded, setExpanded] = React.useState<string | false>("0");
  const [expanded, setExpanded] = React.useState<string | false>(() => {
    return CARD_CONTEXT.selectedCardId
      ? (CARD_CONTEXT.selectedCardId - 1).toString()
      : "0";
  });
  const dispatch = useDispatch();
  // const [cardDetails, setCardDetails] = useState([]);
  const [errorDetails, setErrorDetails] = useState({});
  const [cardNumber, setCardNumber] = useState([]);
  const [showSampleCard, setShowSampleCard] = useState(false);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [uploadSnackbarError, setUploadSnackbarError] = useState(false);
  // const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");
  const store: any = useSelector((state) => state);
  const [navigationFlag, setnavigationFlag] = React.useState(false);

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [responseCardData, setresponseCardData] = useState({});

  // const handleCloseAndSubmitConfirmModal = () => {
  //   setOpenConfirmModal(false);
  //   props.resetCardDetails();
  //   // router.push("/cam/card-management/add-card");
  // };

  const handleCloseAndSubmitConfirmModal = async () => {
    // console.log("cardFeilds", props.cardFields);

    const cardData = [...props.cardFields.cards];

    const fleetCardIds: any = [];
    cardData.map((obj: any, i: any) => {
      for (let prop of Object.keys(obj)) {
        if (prop === "fleetCardId") {
          if (obj[prop] === null || obj[prop] === undefined) {
          } else {
            fleetCardIds.push(obj[prop]);
          }
        }
      }
      console.log("fleetCardIds to be deleted", fleetCardIds);
    });

    const finalData = {
      fleetCardIds,
      bulkUpload: false,
    };
    dispatch(setLoader(true));
    if (fleetCardIds.length > 0) {
      const res: any = await deleleteCards(finalData);
      if (res?.status === "success") {
        setOpenConfirmModal(false);
        props.resetCardDetails();
        console.log("Cards deleted successfully.");

        setShowSnackbar(true);
        setSnackbarMessage(res?.data?.message);
        setAlertType("success");

        // CARDS_CONTEXT.handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
      } else {
        console.log("Error caught", res.errors);
        if (res?.errors) {
          res?.errors.forEach((element: any) => {
            if (element.hasOwnProperty("subject")) {
              if (element?.subject === "customerId") {
                setShowSnackbar(true);
                setOpenConfirmModal(false);
                setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
                setAlertType("error");
              }
            }
          });
        } else {
          setShowSnackbar(true);
          //TODO Change and check with eknath if backend down
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
    } else {
      setOpenConfirmModal(false);
      props.resetCardDetails();
      setShowSnackbar(true);
      setSnackbarMessage(SnackbarMessage.CARD_DELETE);
      setAlertType("success");
    }
    dispatch(setLoader(false));
  };

  const handleDoneModal = () => {
    if (CARD_CONTEXT.selectedCardType === "physical") {
      router.push("/cam/card-management/payment");
    } else {
      router.push("/cam/card-management/add-card");
    }
    setOpenSubmitSuccessfulModal(false);
  };

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleCancel = () => {
    setOpenConfirmModal(true);
  };

  //handles active-inactive color styling
  const renderActiveInactiveStyle = (cardIndex: number, flag?: string) => {
    let style =
      cardIndex === selectedCardNumber
        ? styles.cardDetailsNavCardsActive
        : styles.cardDetailsNavCards;
    return style;
  };

  //checks for cards errorStatus
  const checkCardState = (
    e: React.MouseEvent<HTMLImageElement>,
    cardId: number
  ) => {
    const card = props.cardFields.cards[cardId - 1];
    let isCardEmpty = true;
    for (let key in card) {
      if (
        key !== "errorStatus" &&
        key !== "fuelType" &&
        key !== "selectedNameOfCard" &&
        key !== "fleetCardId"
      ) {
        isCardEmpty = false;
      }
    }
    if (isCardEmpty) {
      CARD_CONTEXT.deleteCard(cardId);
    } else {
      CARD_CONTEXT.openConfirmationBox(cardId);
    }
  };

  // gets id of clicked /selected card
  const passSelectedCardId = (selectedCardId: number) => {
    CARD_CONTEXT.getSelectedCardId(selectedCardId);
    setSelectedCardNumber(selectedCardId);
  };

  const closeSampleCardPopUp = () => {
    setShowSampleCard(false);
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    // console.log("handlesave");
    event.preventDefault();

    const isErrorCardPresent: boolean = validateCardFields(event, null);
    console.log("isErrorCardPresent :", isErrorCardPresent);
    dispatch(setLoader(true));
    if (!isErrorCardPresent) {
    }
    // console.log(
    //   "Final Data :",
    //   props.cardFields,
    //   JSON.stringify(props.cardFields)
    // );

    let isVirtual = true;
    if (CARD_CONTEXT.selectedCardType === "virtual") {
      isVirtual = true;
    } else {
      isVirtual = false;
    }

    const cardData = [...props.cardFields.cards];
    const newCards: any = [];
    cardData.forEach((obj: any, i: any) => {
      const card: any = {};
      for (let prop of Object.keys(obj)) {
        if (obj[prop] === null || obj[prop] === undefined) {
          card[prop] = null;
        } else if (obj[prop].value === "Select") {
        } else if (obj[prop].value === "" || obj[prop].value) {
          card[prop] = obj[prop].value;
        } else if (obj[prop]) {
          card[prop] = obj[prop];
        } else {
          card[prop] = obj[prop];
        }
      }
      // console.log("card value", card, JSON.stringify(card));
      newCards.push(card);
    });

    const finalData = {
      cards: newCards,
      isVirtual: isVirtual,
      applicationType: "AddCard",
    };

    const res: any = await postCardData(finalData);
    console.log(res?.status);
    // console.log(res?.data.status);

    if (res?.status === "success") {
        if (res?.data.status === "success") {
        if (res?.data?.completed) {
          setOpenSubmitSuccessfulModal(true);
          // setShowSnackbar(true);
          // setSnackbarMessage(SnackbarMessage.CARD_API_SUCCESS);
          // setAlertType("success");
          // dispatch(setPaymentCardIndividual(CARD_CONTEXT.selectedCardType));
          const cardResponceData = res?.data.cards;
          setresponseCardData(cardResponceData);
          const cardFieldsCopy = lodash.cloneDeep(props.cardFields);
          cardFieldsCopy.cards.forEach((card: any, index: number) => {
            cardFieldsCopy.cards[index].fleetCardId =
              cardResponceData[index].fleetCardId;
            cardFieldsCopy.cards[index].cardPersonalization.value =
              cardResponceData[index].cardPersonalization.value;
            cardFieldsCopy.cards[index].cardPersonalization.error =
              cardResponceData[index].cardPersonalization.error;
            cardFieldsCopy.cards[index].nameOnCard.value =
              cardResponceData[index].nameOnCard.value;
            cardFieldsCopy.cards[index].nameOnCard.error =
              cardResponceData[index].nameOnCard.error;
            cardFieldsCopy.cards[index].vehicleNumber.value =
              cardResponceData[index].vehicleNumber.value;
            cardFieldsCopy.cards[index].vehicleNumber.error =
              cardResponceData[index].vehicleNumber.error;
            cardFieldsCopy.cards[index].yearOfReg.value =
              cardResponceData[index].yearOfReg.value;
            cardFieldsCopy.cards[index].yearOfReg.error =
              cardResponceData[index].yearOfReg.error;
            cardFieldsCopy.cards[index].mobileNumber.value =
              cardResponceData[index].mobileNumber.value;
            cardFieldsCopy.cards[index].mobileNumber.error =
              cardResponceData[index].mobileNumber.error;
            card.errorStatus = false;
          });
          // console.log(cardFieldsCopy.cards);
          props.updateAllCardDetails(cardFieldsCopy);
        }
      }
    } else {
      if (res?.errors) {
        const errorObj: any = {};
        res?.errors.forEach((element: any) => {
          if (element.hasOwnProperty("subject")) {
            if (element?.subject === "customerId") {
              setShowSnackbar(true);
              setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
              setAlertType("error");
            }
          }
        });
      } else if (res?.status === "failure") {
        console.log("We are in a error block");
        const cardResponceData = res?.data.cards;
        const cardFieldsCopy = lodash.cloneDeep(props.cardFields);
        cardFieldsCopy.cards.forEach((card: any, index: number) => {
          cardFieldsCopy.cards[index].fleetCardId =
            cardResponceData[index].fleetCardId;
          cardFieldsCopy.cards[index].cardPersonalization.value =
            cardResponceData[index].cardPersonalization.value;
          cardFieldsCopy.cards[index].cardPersonalization.error =
            cardResponceData[index].cardPersonalization.error;
          cardFieldsCopy.cards[index].nameOnCard.value =
            cardResponceData[index].nameOnCard.value;
          cardFieldsCopy.cards[index].nameOnCard.error =
            cardResponceData[index].nameOnCard.error;
          cardFieldsCopy.cards[index].vehicleNumber.value =
            cardResponceData[index].vehicleNumber.value;
          cardFieldsCopy.cards[index].vehicleNumber.error =
            cardResponceData[index].vehicleNumber.error;
          cardFieldsCopy.cards[index].yearOfReg.value =
            cardResponceData[index].yearOfReg.value;
          cardFieldsCopy.cards[index].yearOfReg.error =
            cardResponceData[index].yearOfReg.error;
          cardFieldsCopy.cards[index].mobileNumber.value =
            cardResponceData[index].mobileNumber.value;
          cardFieldsCopy.cards[index].mobileNumber.error =
            cardResponceData[index].mobileNumber.error;
        });
        // console.log(cardFieldsCopy);
        props.updateAllCardDetails(cardFieldsCopy);
        const isErrorCardPresent: boolean = validateCardFields(
          event,
          cardFieldsCopy
        );
      } else {
        setShowSnackbar(true);
        //TODO Change and check with eknath if backend down
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
    dispatch(setLoader(false));
  };

  //validation for card fields
  const validateCardFields = (event: any, cardfields: any) => {
    let isErrorCardPresent: boolean = false;
    let isPreviousData = true;
    if (cardfields === null) {
      isPreviousData = true;
    } else {
      isPreviousData = false;
    }
    const cardFieldsCopy = lodash.cloneDeep(
      isPreviousData ? props.cardFields : cardfields
    );

    // console.log(cardFieldsCopy);
    const uniqueMobileNumbersArr: any = [];
    cardFieldsCopy.cards.forEach((card: any, index: number) => {
      let isError: boolean = false;
      let isMobileNumberError: boolean = false;

      if (
        !card?.nameOnCard.value &&
        card?.selectedNameOfCard.value === "CustomCardName"
      ) {
        card.nameOnCard.error = validationErrorMessage.REQUIRED;
        isError = true;
      } else {
        card.nameOnCard.error = "";
      }
      if (
        !card?.vehicleNumber.value &&
        card?.selectedNameOfCard.value === "VehicleNumber"
      ) {
        card.vehicleNumber.error = validationErrorMessage.REQUIRED;
        isError = true;
      } else if (
        card?.vehicleNumber.value &&
        !isValidVehicleNumber(card?.vehicleNumber.value)
      ) {
        card.vehicleNumber.error =
          validationErrorMessage.VEHICLE_NUMBER_INVALID;
        isError = true;
      } else {
        card.vehicleNumber.error = "";
      }
      if (card?.mobileNumber.value) {
        // Check if its unique among all cards.
        if (uniqueMobileNumbersArr.indexOf(card?.mobileNumber.value) !== -1) {
          // Mobile number exist in uniqueMobileNumbersArr
          card.mobileNumber.error =
            validationErrorMessage.MOBILE_NUMBER_DUPLICATE_FE;
          isError = true;
          isMobileNumberError = true;
        } else {
          uniqueMobileNumbersArr.push(card?.mobileNumber.value);
        }
      }

      // if (CARDS_CONTEXT.selectedCardType === "physical") {
      //   //error states for card personalization
      //   if (
      //     card?.cardPersonalization.value &&
      //     !isVailidName(card?.cardPersonalization.value)
      //   ) {
      //     card.cardPersonalization.error =
      //       validationErrorMessage.CUSTOM_CARD_PERSONALIZATION_INVALID;
      //     isError = true;
      //   } else {
      //     card.cardPersonalization.error = "";
      //   }
      // } else {
      //   card.cardPersonalization.error = "";
      // }
      // console.log("uniqueMobileNumbersArr", uniqueMobileNumbersArr);

      if (
        CARD_CONTEXT.selectedCardType === "virtual" &&
        !card?.mobileNumber.value
      ) {
        // if (!card?.mobileNumber.value) {
        // console.log("empty number");
        card.mobileNumber.error = validationErrorMessage.REQUIRED;
        isError = true;
        isMobileNumberError = true;
      } else if (
        card.mobileNumber.value &&
        !isValidMobileNumber(card.mobileNumber.value)
      ) {
        card.mobileNumber.error = validationErrorMessage.MOBILE_NUMBER;
        isError = true;
        isMobileNumberError = true;
      } else if (
        card.mobileNumber.error ===
        "This mobile number already exists in the database. Try another mobile number."
      ) {
        card.mobileNumber.error =
          validationErrorMessage.MOBILE_NUMBER_DUPLICATE;
        isError = true;
        isMobileNumberError = true;
      }
      // }
      if (!isMobileNumberError) {
        card.mobileNumber.error = "";
      }

      if (
        card?.yearOfReg.value &&
        !isValidYearOfRegistration(card?.yearOfReg.value)
      ) {
        card.yearOfReg.error = validationErrorMessage.YEAR_OF_REGISTRATION;
        isError = true;
      } else if (card?.yearOfReg.error !== "") {
        card.yearOfReg.error = validationErrorMessage.YEAR_OF_REGISTRATION;
        isError = true;
      } else {
        card.yearOfReg.error = "";
      }

      if (card?.fuelType.value.length === 0) {
        card.fuelType.error = validationErrorMessage.REQUIRED;
        isError = true;
      } else {
        card.fuelType.error = "";
      }

      if (isError) {
        card.errorStatus = true;
        isErrorCardPresent = true;
      } else {
        card.errorStatus = false;
      }
    });
    // console.log("cardFieldsCopy in validateCardFields after validation");
    // console.log(cardFieldsCopy.cards);
    props.updateAllCardDetails(cardFieldsCopy);
    return isErrorCardPresent;
  };

  useEffect(() => {
    setSelectedCardNumber(CARD_CONTEXT.cardObj.selectedCardId);
    setExpanded(() => {
      return (CARD_CONTEXT.cardObj.selectedCardId - 1).toString();
    });
  }, [CARD_CONTEXT.cardObj.selectedCardId]);

  useEffect(() => {}, [props.cardFields.cards.length]);

  useEffect(() => {
    setCardNumber(CARD_CONTEXT.cardCounter.val);
    // setFlag(false);
    // console.log('CARD_CONTEXT.cardCounter.val', CARD_CONTEXT.cardCounter.count - 1);
    // let count = CARD_CONTEXT.cardCounter.count - 1;
    // setExpanded(count.toString());
  }, [CARD_CONTEXT.cardCounter.val, props.cardFields.cards]);

  const renderCards = () => {
    return cardNumber.map((item: number, index: number) => {
      return (
        <div key={index} data-id={index + 1} className={`mb-2`}>
          {/* <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}> */}
          <Accordion
            square
            expanded={expanded === index.toString()}
            onChange={handleChange(index.toString())}
          >
            {/* <AccordionSummary aria-controls="panel1d-content" id="panel1d-header"> */}
            <AccordionSummary
              aria-controls={index.toString()}
              id={index.toString()}
              onClick={(e) => passSelectedCardId(index + 1)}
            >
              <div
                className={`w-100 d-flex align-items-center justify-content-between ${
                  expanded === index.toString() ? null : styles.contentHeader
                } ${renderActiveInactiveStyle(index + 1)}`}
              >
                <div className="d-flex align-items-center ">
                  {/* <img
                    className="p-3"
                    src={cardIcon}
                    data-test-id="card-icon-img"
                  ></img> */}
                  <img
                    className="p-3"
                    src={
                      props.cardFields.cards[index]?.errorStatus ||
                      props.cardFields.cards[index]?.errorStatus === null
                        ? CreditCardIconError
                        : CreditCardIconSelected
                    }
                    alt="icon"
                  />
                  <Typography
                    color="primary"
                    variant="h5"
                    data-test-id="employee-details-title"
                    className={`${
                      props.cardFields.cards[index]?.errorStatus ||
                      props.cardFields.cards[index]?.errorStatus ===
                        styles.normalText
                        ? styles.redText
                        : ""
                    }`}
                  >
                    <Hidden xsDown>{`Card #${index + 1} `}</Hidden>

                    <Hidden smUp>
                      {expanded === index.toString()
                        ? `Card #${index + 1} `
                        : `#${index + 1} `}
                    </Hidden>
                  </Typography>
                  {expanded === index.toString() ? null : (
                    <div className={`pl-2 ml-2 ${styles.label}`}>
                      {`${
                        props.cardFields.cards[index]?.selectedNameOfCard
                          .value === "VehicleNumber"
                          ? props.cardFields.cards[index]?.vehicleNumber.value
                            ? props.cardFields.cards[index]?.vehicleNumber.value
                            : ""
                          : props.cardFields.cards[index]?.nameOnCard.value
                          ? props.cardFields.cards[index]?.nameOnCard.value
                          : ""
                      }`}
                    </div>
                  )}
                </div>

                <div className="px-3">
                  {expanded === index.toString() ? null : (
                    <img
                      src={editIcon}
                      alt="delete-icon"
                      className={`mr-4`}
                      onClick={(e) => {
                        handleChange(index.toString());
                      }}
                    ></img>
                  )}

                  <img
                    src={deleteIcon}
                    alt="delete-icon"
                    onClick={(e) => {
                      checkCardState(e, index + 1);
                    }}
                  ></img>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                item
                xs={12}
                sm={12}
                className={styles.cardDetailsFieldsArea}
              >
                <CardDetailsFields
                  // fetchCardDetails={fetchCardDetails}
                  // fetchErrorDetails={fetchErrorDetails}
                  // index={index}
                  // handleSaveDetails={handleSaveDetails}
                  // enableSubmit={enableSubmit}
                  cardFields={props.cardFields}
                  updateSelectedCardDetails={props.updateSelectedCardDetails}
                  navigationFlag={navigationFlag}
                  dropdownLists={props.dropdownLists}
                ></CardDetailsFields>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      );
    });
  };

  return (
    <>
      <Container maxWidth="lg" className={`px-0`}>
        <div
          className={`d-flex align-items-center justify-content-between mb-3`}
        >
          <Typography variant="h5">
            Individual Cards &nbsp;&nbsp;&nbsp;
            <CustomTooltip
              enterTouchDelay={0}
              disableFocusListener
              title=" Add up to 9 cards in individual cards section."
              placement="right-start"
            >
              <img
                src={InfoIcon}
                alt="Info for Vehicle Number"
                className={`${styles.infoRight}`}
              ></img>
            </CustomTooltip>
          </Typography>
        </div>
        {cardNumber.length > 0 ? (
          <div
            className={`w-100 d-flex align-items-center ${styles.positionText}`}
          >
            <Typography
              color="error"
              variant="body1"
              data-test-id="indicates-mandatory-fields"
            >
              * indicates mandatory fields
            </Typography>
          </div>
        ) : null}

        <div className={`py-2 py-sm-3 ${styles.headerPaper}`}>
          <form className="w-100" autoComplete="off">
            <div className={`w-100 ${styles.content}`}>
              {cardNumber.length > 0 ? (
                renderCards()
              ) : (
                <div
                  className={`mb-5 pt-2 d-flex flex-column align-items-center justify-content-center`}
                >
                  <img
                    className={`d-flex justify-content-center`}
                    src={noCardsIcon}
                    alt="no-cards-Icon"
                  />
                  <span
                    className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                  >
                    You don't have any cards added yet.
                  </span>
                  <CustomButton
                    onClick={(event) => CARD_CONTEXT.handler(event)}
                    variant="contained"
                    color="primary"
                    className={`d-flex justify-content-center mt-4 mb-2 ${styles.btnStyle}`}
                    data-test-id="add-button"
                  >
                    Add card
                  </CustomButton>
                </div>
              )}
            </div>
          </form>
        </div>
      </Container>
      <>
        {showSampleCard ? (
          <>
            <SampleCardModal
              closeSampleCardPopUp={closeSampleCardPopUp}
            ></SampleCardModal>
          </>
        ) : (
          <></>
        )}
      </>

      {cardNumber.length > 0 ? (
        <div className={`d-flex ${styles.addLinkDiv}`}>
          <Typography
            variant="body1"
            className={`mb-4 ${styles.addLinkStyle}`}
            onClick={(event) => CARD_CONTEXT.handler(event)}
          >
            + Add Card
          </Typography>{" "}
        </div>
      ) : null}

      <Snackbar
        open={uploadSnackbarError}
        autoHideDuration={6000}
        onClose={() => {
          setUploadSnackbarError(false);
        }}
      >
        <Alert
          className={`align-items-center ${styles.errorAlertStyle}`}
          severity="error"
          action={
            <IconButton
              aria-label="close"
              size="small"
              className={`${styles.errorAlertStyle} ${styles.borderButton}`}
              onClick={() => {
                setUploadSnackbarError(false);
              }}
            >
              <CloseIcon
                fontSize="inherit"
                className={`${styles.errorAlertStyle}`}
              />
            </IconButton>
          }
        >
          <span className={`${styles.errorAlertAlign}`}>
            {/* {snackbarErrorMessage} */}
            An error occurred while handling your application. Try again after
            making the required changes.
          </span>
        </Alert>
      </Snackbar>

      <Box className={`d-flex w-100 py-3 mt-auto ${styles.submitBox}`}>
        <CustomButton
          color="primary"
          variant="outlined"
          className={`mr-4 ml-auto`}
          onClick={handleCancel}
          data-test-id="cancel-button"
        >
          Cancel
        </CustomButton>
        <CustomButton
          color="primary"
          variant="contained"
          className={`mr-4 ${styles.noOutlineButton}`}
          data-test-id="submit-button"
          onClick={handleSave}
        >
          Submit
        </CustomButton>
      </Box>
      <Popup1
        open={openConfirmModal}
        close={() => setOpenConfirmModal(false)}
        closeAndSubmit={handleCloseAndSubmitConfirmModal}
        title="Are you sure you want to cancel ?"
        description="Any details provided so far will be deleted. "
      ></Popup1>
      <Popup4
        open={openSubmitSuccessfulModal}
        close={() => setOpenSubmitSuccessfulModal(false)}
        closeAndSubmit={handleDoneModal}
        title="Submission Successful"
        description={`${CARD_CONTEXT.cardCounter.val.length} cards successfully added.`}
        btnText={
          CARD_CONTEXT.selectedCardType === "physical"
            ? "Proceed to Payment"
            : "Back to Card Management"
        }
      ></Popup4>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </>
  );
};

export default Individual;
