import React, { useState, useContext } from "react";
import { Grid, Hidden } from "@material-ui/core";
import CardDetailsNavigation from "./CardDetailsNavigation";
import CardDetailsFields from "./CardDetailsFields";
import CardDetailsHeader from "./CardDetailsHeader";
import styles from "./CardManagement.module.scss";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { CardsContext } from "./CardManagement";
import lodash, { isArray } from "lodash";
import { Popup3 } from "../../../components/CustomPopups/Popup3/Popup3";
import {
  isValidVehicleNumber,
  isValidYearOfRegistration,
  isValidMobileNumber,
} from "../../../utility/validations/validations";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";
import { useSelector } from "react-redux";
import { formSections } from "../types/formSections.enum";
import { postCardData } from "src/lib/api/smartfleet/cardmanagement";
import { getParsedCommandLineOfConfigFile } from "typescript";
import { deleleteCards } from "src/lib/api/smartfleet/cardmanagement";
import { es } from "date-fns/esm/locale";
import CustomSnackbar from "src/components/CustomSnackbar/CustomSnackbar";
import { setLoader, setPaymentCardIndividual } from "src/redux/actions/actions";
import { useDispatch } from "react-redux";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const CardDetails = (props: any) => {
  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const [clearPopup, setClearPopup] = useState(false);
  const [responseCardData, setresponseCardData] = useState({});
  /* ---------------------------------------------------- */
  const CARDS_CONTEXT = useContext(CardsContext);
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  // const [dropdownList, setDropdownList] = useState()
  // const [uploadSnackbarError, setUploadSnackbarError] = React.useState(false);
  // const [snackbarErrorMessage, setSnackbarErrorMessage] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [navigationFlag, setnavigationFlag] = React.useState(true);
  // //checks f list card is empty or not
  // useEffect(() => {
  //   const lastCard = cardDetails[cardDetails.length - 1];
  //   // console.log("------>", lastCard);
  //   for (let key in lastCard) {
  //     if (lastCard[key] !== "") {
  //       props.getCardDetailsFields(lastCard[key]);
  //       break;
  //     } else {
  //       props.getCardDetailsFields(lastCard[key]);
  //       break;
  //     }
  //   }
  //   props.getAllCardsList(cardDetails);
  //   console.log("card detail list in CardDetails.tsx..........", cardDetails);
  // }, [cardDetails]);

  //save individual card
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
    if (CARDS_CONTEXT.selectedCardType === "virtual") {
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
      applicationType : "Enrollment",
    };

    const res: any = await postCardData(finalData);
    console.log(res?.status);
    // console.log(res?.data.status);

    if (res?.status === "success") {
      if (res?.data?.status === "success") {
        if (res?.data?.completed) {
          CARDS_CONTEXT.handleCompleteStep(formSections.CARD_MANAGEMENT, true);
          CARDS_CONTEXT.handleIncompleteStep(
            formSections.CARD_MANAGEMENT,
            false
          );
          setShowSnackbar(true);
          setSnackbarMessage(res?.data?.message);
          setAlertType("success");
          dispatch(setPaymentCardIndividual(CARDS_CONTEXT.selectedCardType))
          const cardResponceData = res?.data?.cards;
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
        const cardResponceData = res?.data?.cards;
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
        console.log(cardFieldsCopy);
        props.updateAllCardDetails(cardFieldsCopy);
        const isErrorCardPresent: boolean = validateCardFields(
          event,
          cardFieldsCopy
        );
        if (isErrorCardPresent) {
          CARDS_CONTEXT.handleIncompleteStep(
            formSections.CARD_MANAGEMENT,
            true
          );
        }
      } else {
        setShowSnackbar(true);
        //TODO Change and check with eknath if backend down
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
    dispatch(setLoader(false));
  };

  //clear form fields
  const handleOpenClearPopup = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setClearPopup(true);
  };

  const handleCloseAndClearCards = async () => {
    console.log("cardFeilds", props.cardFields);

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
        setClearPopup(false);
        props.resetCardDetails();
        console.log("Cards deleted successfully.");

        setShowSnackbar(true);
        setSnackbarMessage(res?.data?.message);
        setAlertType("success");
        dispatch(setPaymentCardIndividual("virtual"));
        CARDS_CONTEXT.handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
      } else {
        console.log("Error caught", res.errors);
        if (res?.errors) {
          res?.errors.forEach((element: any) => {
            if (element.hasOwnProperty("subject")) {
              if (element?.subject === "customerId") {
                setShowSnackbar(true);
                setClearPopup(false);
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
      setClearPopup(false);
      props.resetCardDetails();
      setShowSnackbar(true);
      setSnackbarMessage(SnackbarMessage.CARD_DELETE);
      setAlertType("success");
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

    console.log(cardFieldsCopy);
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
        CARDS_CONTEXT.selectedCardType === "virtual" &&
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
      } else if (card.mobileNumber.error === "This mobile number already exists in the database. Try another mobile number.") {

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

  return (
    <div>
      {/*<CardDetailsHeader></CardDetailsHeader> */}
      <Grid container>
        <Grid
          item
          xs={12}
          sm={3}
          className={`${styles.cardDetailsNavContainer} ${styles.cardDetailsNavArea}`}
        >
          <CardDetailsNavigation
            cardFields={props.cardFields}
            responseCardData={responseCardData}
            updateSelectedCardDetails={props.updateSelectedCardDetails}
            navigationFlag = {navigationFlag}
          />
        </Grid>

        <Hidden xsDown>
          <Grid item xs={12} sm={9} className={styles.cardDetailsFieldsArea}>
            <CardDetailsFields
              cardFields={props.cardFields}
              responseCardData={responseCardData}
              updateSelectedCardDetails={props.updateSelectedCardDetails}
              navigationFlag = {navigationFlag}
            ></CardDetailsFields>
          </Grid>
        </Hidden>
        <div className={`${styles.actionButtonsContainer} w-100 `}>
          <Hidden xsDown>
            <hr className={`${styles.headerDivider} w-75 ml-0 mr-3`}></hr>
          </Hidden>
          <CustomButton
            onClick={handleOpenClearPopup}
            variant="outlined"
            color="primary"
            className={`${styles.backToEnrolmentBtn} mr-3`}
            data-test-id="sf-cm-cd-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={handleSave}
            variant="contained"
            color="primary"
            // disabled={!(approveKYC || rejectKYC)}
            data-test-id="sf-cm-cd-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Grid>

      <Popup3
        open={clearPopup}
        close={() => setClearPopup(false)}
        closeAndSubmit={handleCloseAndClearCards}
        title={`Are you sure you want to clear?`}
        description={`Any details entered so far will be deleted.`}
      ></Popup3>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </div>
  );
};

export default CardDetails;
