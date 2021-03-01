import React, { useEffect, useState } from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import styles from "./AddCards.module.scss";
import { useRouter } from "next/router";
import Individual from "./Body/Individual/Individual";
import lodash from "lodash";
import CardDetailsUpload from "src/pages/SmartfleetRegistrationForm/CardManagement/CardDetailsUpload";
import CardManagementHeader from "src/pages/SmartfleetRegistrationForm/CardManagement/CardManagementHeader";
import CardType from "src/pages/SmartfleetRegistrationForm/CardManagement/CardType";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/actions/actions";
import {
  cardBulkUpload,
  deleleteCards,
  getTemplateUrl,
  getBulkUploadDetails,
  getindividualCardDetails,
} from "src/lib/api/smartfleet/cardmanagement";
import CustomSnackbar from "src/components/CustomSnackbar/CustomSnackbar";
import DeletePopUp from "src/pages/SmartfleetRegistrationForm/CardManagement/DeletePopUp";
import { Popup4 } from "src/components/CustomPopups/Popup4/Popup4";
export const CardsContextAddCard = React.createContext<any>(0);
export const AddCards = (props: any): JSX.Element => {
  const { Provider } = CardsContextAddCard;
  const initCardCounter = {
    val: [1],
    count: 1,
  };
  const initCardObj = {
    selectedCardId: 1,
    deletedCardId: 0,
  };

  const router = useRouter();
  const [section, setSection] = useState(true);
  const [createMode, setCreateMode] = useState("individual");
  // const [createMode, setCreateMode] = useState(() => {
  //   return Object.keys(router.query).length != 0 ? router.query.createMode : "individual";
  // });
  // const [selectedCardType, setSelectedCardType] = useState("virtual");
  const [openSubmitSuccessfulModal, setOpenSubmitSuccessfulModal] = useState(
    false
  );
  const [selectedCardType, setSelectedCardType] = useState<string>("virtual");
  const [selectedCardTypeBulk, setSelectedCardTypeBulk] = useState<string>(
    "virtual"
  );

  // const [urlForTemplates, setUrlForTemplates] = useState(initUrlForTemplates);
  const [isFileSaved, setisFileSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileErrorStatus, setfileErrorStatus] = useState(false);
  /* ------------STATE OBJECTS OF COMPONENT for Bulk Upload-------------- */
  const [selectedExcelFile, setSelectedExcelFile] = useState<string>("");
  const [excelFileUploads, setexcelFileUploads] = React.useState<File>();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [errorMsgLog, setErrorMsgLog] = useState({
    lineOne: "",
    lineTwo: "",
    link: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useDispatch();

  const initUrlForTemplates = {
    sampleCardURL: "",
    virtualTemplateURL: "",
    physicalTemplateURL: "",
  };

  // const [selectedCardType, setSelectedCardType] = useState(() => {
  //   return Object.keys(router.query).length != 0 && router.query.cardType != undefined ? router.query.cardType : "virtual";
  // });
  const [urlForTemplates, setUrlForTemplates] = useState(initUrlForTemplates);

  const [navigationFlag, setnavigationFlag] = React.useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [deletedCardNumber, setDeletedCardNumber] = useState(0);
  const [lastCardStatus, setLastCardStatus] = useState(false);
  const [cardObj, setCardObj] = useState(initCardObj);
  const [showSampleCard, setShowSampleCard] = useState(false);

  const [decrementCardCounter, setDecrementCardCounter] = useState(
    initCardCounter
  );

  const [incrementCardCounter, setIncrementCardCounter] = useState(
    initCardCounter
  );

  const individualCard = {
    fleetCardId: null,

    selectedNameOfCard: {
      value: "VehicleNumber",
      error: "",
    },
    nameOnCard: {
      value: "",
      error: "",
    },
    vehicleNumber: {
      value: "",
      error: "",
    },
    mobileNumber: {
      value: "",
      error: "",
    },
    vehicleMake: {
      value: "Select",
      error: "",
    },
    vehicleType: {
      value: "Select",
      error: "",
    },
    yearOfReg: {
      value: "",
      error: "",
    },
    fuelType: {
      value: ["All"],
      error: "",
    },
    cardPersonalization: {
      value: "",
      error: "",
    },
    errorStatus: false,
    isPrimary: true,
  };

  const initCardFields = {
    cards: [individualCard],
  };

  const [cardFields, setCardFields] = useState(initCardFields);
  const [selectedCardDetails, setSelectedCardDetails] = useState(
    individualCard
  );
  const { dropdownLists } = props;

  //----------------------------------------------------------------------

  const handleDoneModal = () => {
    if (selectedCardTypeBulk === "physical") {
      router.push("/cam/card-management/payment");
    } else {
      router.push("/cam/card-management/add-card");
    }
    setOpenSubmitSuccessfulModal(false);
  };

  const getTemplateURLCall = async () => {
    const response = await getTemplateUrl();
    if (response?.status === "success") {
      setUrlForTemplates({
        physicalTemplateURL: response?.data?.physicalTemplate,
        sampleCardURL: response?.data?.sampleCard,
        virtualTemplateURL: response?.data?.virtualTemplate,
      });
    } else {
      console.log("Error caught", response?.errors);
      if (response?.errors) {
        response?.errors.forEach((element: any) => {
          if (element.hasOwnProperty("subject")) {
            if (element?.subject === "customerId") {
              setShowSnackbar(true);
              setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
              setAlertType("error");
            }
          }
        });
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  const getBulkUploadData = async () => {
    const response = await getBulkUploadDetails();
    console.log(response);
    if (response?.status === "success") {
      if (response?.data?.isVirtual) {
        setSelectedCardTypeBulk("virtual");
      } else {
        setSelectedCardTypeBulk("physical");
      }
      if (response?.data?.filename && response?.data?.uploadedRecords !== "0") {
        setSelectedExcelFile(response?.data?.filename);
        setSuccessMsg(`${response?.data?.uploadedRecords}`);
      }
      if (response?.data?.incompletedRecords) {
        setErrorMsgLog((state) => ({
          lineOne: `${response?.data?.incompletedRecords}`,
          lineTwo: ``,
          link: ``,
        }));
      }
    } else {
      console.log("Error caught", response.errors);
      if (response?.errors) {
        response?.errors.forEach((element: any) => {
          if (element.hasOwnProperty("subject")) {
            if (element?.subject === "customerId") {
              setShowSnackbar(true);
              setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
              setAlertType("error");
            }
          }
        });
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  const getIndividualCardData = async () => {
    const response = await getindividualCardDetails();
    console.log(response);
    if (response?.status === "success") {
      console.log("response", response);
      if (response?.data?.fleetCards) {
        const newCard: any = { cards: [] };
        response?.data?.fleetCards.forEach((card: any, index: number) => {
          let newCardFieldsCopy: any = lodash.cloneDeep(individualCard);
          for (let key of Object.keys(newCardFieldsCopy)) {
            newCardFieldsCopy.fleetCardId = card.fleetCardId;
            newCardFieldsCopy.errorStatus = card.errorStatus || "";
            newCardFieldsCopy.isPrimary = card.isPrimary || false;
            newCardFieldsCopy.mobileNumber.value = card.mobileNo || "";
            newCardFieldsCopy.selectedNameOfCard.value =
              card.selectedNameOfCard || "";
            newCardFieldsCopy.vehicleNumber.value = card.vehicleNumber || "";
            newCardFieldsCopy.vehicleMake.value = card.vehicleMake || "Select";
            newCardFieldsCopy.vehicleType.value = card.vehicleType || "Select";
            newCardFieldsCopy.yearOfReg.value = card.yearOfReg || "";
            newCardFieldsCopy.fuelType.value = card.fuelType || "";
            newCardFieldsCopy.cardPersonalization.value =
              card.cardPersonalization || "";
            newCardFieldsCopy.nameOnCard.value = card.customCardName || "";
          }
          newCard.cards.push(newCardFieldsCopy);

          if (
            index !== 0 &&
            decrementCardCounter.val.length < response?.data?.fleetCards.length
          ) {
            setIncrementCardCounter((state) => ({
              ...state,
              count:
                decrementCardCounter.val[decrementCardCounter.val.length - 1] +
                1,
            }));
            setDecrementCardCounter((state) => ({
              ...state,
              val: [...state.val, state.val[state.val.length - 1] + 1],
              count:
                decrementCardCounter.val[decrementCardCounter.val.length - 1] +
                1,
            }));
          }
        });
        updateAllCardDetails(newCard);
        setCardFields(newCard);

        if (response?.data?.fleetCards[0].cardType == "Virtual") {
          setSelectedCardType("virtual");
        } else {
          setSelectedCardType("physical");
        }
      }
    } else {
      console.log("Error caught", response.errors);
      if (response?.errors) {
        response?.errors.forEach((element: any) => {
          if (element.hasOwnProperty("subject")) {
            if (element?.subject === "customerId") {
              setShowSnackbar(true);
              setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
              setAlertType("error");
            }
          }
        });
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  useEffect(() => {
    getTemplateURLCall();
    getBulkUploadData();
    getIndividualCardData();
  }, []);

  const closeSampleCardPopUp = () => {
    setShowSampleCard(false);
  };

  //individual/bulk upload handler
  const showSection = (val: boolean) => {
    // console.log("val---", val);
    setSection(val);
  };

  const toggleCreateMode = () => {
    if (createMode === "bulk") {
      setCreateMode("individual");
    } else {
      setCreateMode("bulk");
    }
  };

  const initializeState = () => {
    setIncrementCardCounter((state) => ({
      ...state,
      count: 1,
    }));

    setDecrementCardCounter((state) => ({
      ...state,
      val: [1],
      count: 1,
    }));

    setCardObj((state) => ({
      ...state,
      selectedCardId: 1,
      deletedCardId: 0,
    }));
  };

  const selectedCardCallbackIndividual = (dataFromChild: string) => {
    console.log(
      "This is data from child card setSelectedCardType",
      dataFromChild.toString()
    );
    // console.log("selectedCardTypeBulk", selectedCardTypeBulk);
    // console.log("selectedCardType", selectedCardType);

    setSelectedCardType(dataFromChild.toString());
  };
  const selectedCardCallbackBulk = (dataFromChild: string) => {
    console.log(
      "This is data from child card setSelectedCardTypeBulk ",
      dataFromChild.toString()
    );
    // console.log("selectedCardTypeBulk", selectedCardTypeBulk);
    // console.log("selectedCardType", selectedCardType);
    setSelectedCardTypeBulk(dataFromChild.toString());
  };

  // increment handler fn
  const handleIncrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event?.preventDefault();
    // // console.log('decrementCardCounter..................', decrementCardCounter.val.length);
    // //check for no cards and re-initialize the counter
    // if (decrementCardCounter.val.length === 0) {
    //   initializeState();
    // } else {
    //   setIncrementCardCounter((state) => ({
    //     ...state,
    //     count: decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
    //   }));
    //   setDecrementCardCounter((state) => ({
    //     ...state,
    //     val: [...state.val, state.val[state.val.length - 1] + 1],
    //     count: decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
    //   }));

    //   setCardObj((state) => ({
    //     ...state,
    //     selectedCardId:
    //       decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
    //     deletedCardId: 0,
    //   }));
    // }

    event?.preventDefault();
    console.log("handleIncrement");
    if (decrementCardCounter.val.length === 0) {
      //initializeState();
      resetCardDetails();
    } else {
      const newCardFields = lodash.cloneDeep(cardFields);
      newCardFields.cards.push(individualCard);

      setCardFields(newCardFields);
      setIncrementCardCounter((state) => ({
        ...state,
        count:
          decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
      }));
      setDecrementCardCounter((state) => ({
        ...state,
        val: [...state.val, state.val[state.val.length - 1] + 1],
        count:
          decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
      }));

      setCardObj((state) => ({
        ...state,
        selectedCardId:
          decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
        deletedCardId: 0,
      }));

      setSelectedCardDetails(individualCard);
    }
  };

  //delete selected card
  const deleteCard = (selectedCardId: number) => {
    setShowPopUp(false);
    // console.log("deleteCard", selectedCardId);
    let arr = [...decrementCardCounter.val];
    let index = arr.indexOf(selectedCardId - 1);

    arr.splice(index, 1);

    arr.map((item, index) => {
      arr[index] = index + 1;
    });

    setDecrementCardCounter((state) => ({
      ...state,
      val: arr,
      count: arr.length,
    }));
    setIncrementCardCounter((state) => ({
      ...state,
      val: arr,
      count: arr.length,
    }));

    setCardObj((state) => ({
      ...state,
      deletedCardId: selectedCardId,
      // selectedCardId: selectedCardId - 1,  uncomment this code below is from Bhavin
      selectedCardId:
        cardObj.selectedCardId >= selectedCardId
          ? cardObj.selectedCardId - 1
          : cardObj.selectedCardId,
    }));

    const cardFieldsCopy = lodash.cloneDeep(cardFields);
    cardFieldsCopy.cards.splice(selectedCardId - 1, 1);
    // console.log(
    //   "delete card : cardFieldsCopy",
    //   cardObj.selectedCardId,
    //   selectedCardId
    // );
    // console.log(cardFieldsCopy);
    // console.log(selectedCardDetails);
    if (cardObj.selectedCardId === selectedCardId) {
      setSelectedCardDetails(cardFieldsCopy.cards[selectedCardId - 2]);
    }
    setCardFields(cardFieldsCopy);

    setShowPopUp(false);
    return;
  };

  //decrement cardhandler
  const handleDecrement = (
    event: React.MouseEvent<HTMLButtonElement>
  ): boolean => {
    event?.preventDefault();
    //console.log("handleDecrement");

    let lastVal = decrementCardCounter.val[decrementCardCounter.val.length - 1];
    let finalVal = decrementCardCounter.val.filter((item) => {
      return item !== lastVal;
    });
    if (incrementCardCounter.count === 1) return false;

    if (lastCardStatus) {
      openConfirmationBox(lastVal);
    } else {
      setIncrementCardCounter((state) => ({
        ...state,
        count: finalVal[finalVal.length - 1],
      }));
      setDecrementCardCounter((state) => ({
        ...state,
        val: finalVal,
        count: finalVal[finalVal.length - 1],
      }));

      setCardObj((state) => ({
        ...state,
        selectedCardId: finalVal[finalVal.length - 1],
        deletedCardId: decrementCardCounter.count,
      }));
    }
    return true;
  };

  const getSelectedCardId = (selectedCardId: number) => {
    setCardObj((state) => ({
      ...state,
      selectedCardId: selectedCardId,
      deletedCardId: 0,
    }));

    // console.log("CardManagement: getSelectedCardId ");
    // console.log(selectedCardId);
    // console.log(cardFields);
    const data = cardFields.cards[selectedCardId - 1];
    // console.log(data);
    setSelectedCardDetails(data);

    //setDeletedCardNumber(0);
  };

  //handles confirmation box
  const openConfirmationBox = (selectedCardId: number) => {
    setShowPopUp(true);
    setDeletedCardNumber(selectedCardId);
    return;
  };

  //closes confirmation box
  const closeConfirmationBox = () => {
    setShowPopUp(false);
  };

  const getCardDetailsFields = (cardDetailsFields: any) => {
    if (cardDetailsFields.length == 0) {
      setLastCardStatus(false);
    } else {
      setLastCardStatus(true);
    }
  };

  const getAllCardsList = () => {
    // console.log("getAllCardsList");
    // console.log(cardFields);
    return cardFields;
  };

  const updateSelectedCardDetails = (currentCard: any) => {
    // console.log("updateSelectedCardDetails");
    // console.log(currentCard);
    const cardFieldsCopy = lodash.cloneDeep(cardFields);
    cardFieldsCopy.cards[cardObj.selectedCardId - 1] = currentCard;
    setSelectedCardDetails(currentCard);
    // console.log(cardFieldsCopy);
    setCardFields(cardFieldsCopy);
  };

  const updateAllCardDetails = (allCards: any) => {
    // console.log("updateAllCardDetails");
    setSelectedCardDetails(allCards.cards[cardObj.selectedCardId - 1]);
    // console.log(allCards);
    setCardFields(allCards);
  };

  const resetCardDetails = () => {
    setDeletedCardNumber(0);
    setCardObj(initCardObj);
    setDecrementCardCounter(initCardCounter);
    setIncrementCardCounter(initCardCounter);
    setSelectedCardDetails(individualCard);
    setCardFields(initCardFields);
  };

  const handleDrop = (acceptedFiles: any): void => {
    setSelectedExcelFile(acceptedFiles[0].name);
    setfileErrorStatus(false);
    onExcelFileChange(acceptedFiles[0]);
  };

  const onExcelFileChange = (uploadedFile: File) => {
    if (!excelFileUploads) {
      if (Math.floor(uploadedFile.size / 5120) >= 1023) {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.CARD_FILE_SIZE);
        setAlertType("error");
        setSelectedExcelFile("");
        setexcelFileUploads(undefined);
        setfileErrorStatus(true);
      } else if (
        uploadedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.KYC_FILE_TYPE);
        setAlertType("error");
        setSelectedExcelFile("");
        setexcelFileUploads(undefined);
        setfileErrorStatus(true);
      } else {
        setfileErrorStatus(false);
        setSelectedExcelFile(uploadedFile.name);
        setexcelFileUploads(uploadedFile);
      }
    }
  };

  const deleteExcelFile = (event: React.MouseEvent<HTMLImageElement>): void => {
    setSelectedExcelFile("");
    setexcelFileUploads(undefined);
    setErrorMsgLog({
      lineOne: "",
      lineTwo: "",
      link: "",
    });
    setSuccessMsg("");
  };

  const clearUploadSection = (): void => {
    setSelectedExcelFile("");
    setexcelFileUploads(undefined);
    setSuccessMsg("");
    setisFileSaved(false);
    setErrorMsgLog({
      lineOne: "",
      lineTwo: "",
      link: "",
    });
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setLoader(true));
    if (excelFileUploads) {
      let isVirtual = true;
      let formData = new FormData();
      if (selectedCardTypeBulk === "virtual") {
        isVirtual = true;
        formData.append("isVirtual", "true");
      } else {
        isVirtual = false;
        formData.append("isVirtual", "false");
      }

      formData.append("channel", "WEB");
      formData.append("applicationType", "AddCard");
      formData.append("bulkUpload", "true");
      formData.append("customerType", "");
      formData.append("cardsExcel", excelFileUploads);

      const response: any = await cardBulkUpload(formData);
      console.log(response);

      if (response?.data?.status === "Success") {
        if (response?.data?.completed) {
          setOpenSubmitSuccessfulModal(true);
          setisFileSaved(true);
          setErrorMessage("");
          setErrorMsgLog({
            lineOne: "",
            lineTwo: "",
            link: "",
          });
          setSuccessMsg(`${response?.data?.uploadedRecords}`);
        } else {
          setisFileSaved(true);
          setShowSnackbar(true);
          setSnackbarMessage(response?.data?.message);
          setAlertType("success");
          setErrorMessage("");

          setSuccessMsg(`${response?.data?.uploadedRecords}`);
          if (response?.data?.incompletedRecords) {
            setErrorMsgLog((state) => ({
              lineOne: `${response?.data?.incompletedRecords}`,
              lineTwo: ``,
              link: ``,
            }));
          } else {
            setErrorMsgLog((state) => ({
              lineOne: ``,
              lineTwo: ``,
              link: ``,
            }));
          }
        }
      } else {
        if (response?.status === "failure") {
          if (response?.data?.status === "Failure") {
            setSuccessMsg("");
            setisFileSaved(false);
            setErrorMessage("");
            if (
              response?.data?.incompletedRecords &&
              response?.data?.errorRecords
            ) {
              setErrorMsgLog((state) => ({
                lineOne: `${response?.data?.incompletedRecords}`,
                lineTwo: `${response?.data?.errorRecords}`,
                link: `${
                  process.env.NEXT_PUBLIC_API_URL +
                  response?.data?.errorLogFileUrl
                }`,
              }));
            } else if (response?.data?.errorRecords) {
              setErrorMsgLog((state) => ({
                lineOne: ``,
                lineTwo: `${response?.data?.errorRecords}`,
                link: `${
                  process.env.NEXT_PUBLIC_API_URL +
                  response?.data?.errorLogFileUrl
                }`,
              }));
            } else if (
              response?.data?.incompletedRecords &&
              response?.data?.errorRecords
            ) {
              setErrorMsgLog((state) => ({
                lineOne: `${response?.data?.incompletedRecords}`,
                lineTwo: `${response?.data?.errorRecords}`,
                link: `${
                  process.env.NEXT_PUBLIC_API_URL +
                  response?.data?.errorLogFileUrl
                }`,
              }));
            } else {
              setErrorMsgLog((state) => ({
                lineOne: `${response?.data?.message}`,
                lineTwo: ``,
                link: ``,
              }));
            }
          } else {
            setShowSnackbar(true);
            setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
            setAlertType("error");
          }
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
          console.log(response?.error);
        }
      }
    } else {
      setShowSnackbar(true);
      setisFileSaved(false);
      setSnackbarMessage(SnackbarMessage.FILE_REQUIRED);
      setAlertType("error");
    }
    dispatch(setLoader(false));
  };

  const clearData = async () => {
    const finalData = {
      bulkUpload: true,
    };
    dispatch(setLoader(true));
    const res: any = await deleleteCards(finalData);
    if (res?.status === "success") {
      clearUploadSection();
      setShowSnackbar(true);
      setSnackbarMessage(res?.data?.message);
      setAlertType("success");
      setisFileSaved(false);

    } else {
      console.log("Error caught", res.errors);
      if (res?.errors) {
        res?.errors.forEach((element: any) => {
          if (element.hasOwnProperty("subject")) {
            if (element?.subject === "customerId") {
              setShowSnackbar(true);
              // setClearPopup(false);
              setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
              setAlertType("error");
            }
          }
        });
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
    dispatch(setLoader(false));
  };

  const renderSection = () => {
    let sectionContent = <></>;
    if (section) {
      sectionContent = (
        <>
          <CardType
            selectedCardTypeBulk={selectedCardTypeBulk}
            selectedCardCallbackBulk={selectedCardCallbackBulk}
            selectedCardCallbackIndividual={selectedCardCallbackIndividual}
            selectedCardType={selectedCardType}
            section={section}
            navigationFlag={navigationFlag}
            dropdownLists={dropdownLists}
          ></CardType>
          <Individual
            getCardDetailsFields={getCardDetailsFields}
            getAllCardsList={getAllCardsList}
            cardFields={cardFields}
            updateSelectedCardDetails={updateSelectedCardDetails}
            updateAllCardDetails={updateAllCardDetails}
            resetCardDetails={resetCardDetails}
            dropdownLists={dropdownLists}
          ></Individual>
        </>
      );
    } else {
      sectionContent = (
        <>
          <CardType
            selectedCardType={selectedCardType}
            section={section}
            navigationFlag={navigationFlag}
            dropdownLists={dropdownLists}
            selectedCardTypeBulk={selectedCardTypeBulk}
            selectedCardCallbackBulk={selectedCardCallbackBulk}
            selectedCardCallbackIndividual={selectedCardCallbackIndividual}
          ></CardType>
          <Typography variant="h5">Bulk Upload</Typography>
          <CardDetailsUpload
            excelFileUploads={excelFileUploads}
            selectedExcelFile={selectedExcelFile}
            onExcelFileChange={onExcelFileChange}
            handleDrop={handleDrop}
            deleteExcelFile={deleteExcelFile}
            clearUploadSection={clearUploadSection}
            handleSave={handleSave}
            successMsg={successMsg}
            errorMsgLog={errorMsgLog}
            clearData={clearData}
            fileErrorStatus={fileErrorStatus}
            navigationFlag={navigationFlag}
          ></CardDetailsUpload>
        </>
      );
    }
    return sectionContent;
  };

  useEffect(() => {
    renderSection();
  }, [decrementCardCounter.count]);

  useEffect(() => {
    setLastCardStatus(false);
  }, [incrementCardCounter.count]);

  return (
    <Container maxWidth="lg" className={`px-0 px-sm-4`}>
      <Paper className={`px-3 px-sm-5 py-2 py-sm-3 ${styles.headerPaper}`}>
        <Provider
          value={{
            urlForTemplates: urlForTemplates,
            handler: handleIncrement,
            cardCounter: decrementCardCounter,
            deleteCard: deleteCard,
            getSelectedCardId: getSelectedCardId,
            selectedCardDetails: selectedCardDetails,
            cardObj: cardObj,
            openConfirmationBox: openConfirmationBox,
            closeConfirmationBox: closeConfirmationBox,
            selectedCardType: selectedCardType,
            dropdownLists: dropdownLists,
            selectedCardTypeBulk: selectedCardTypeBulk,
          }}
        >
          <Typography className={styles.addCardText}>Add Cards</Typography>
          <CardManagementHeader
            showSection={showSection}
            createMode={createMode}
            decrementCardCounter={decrementCardCounter}
            handleDecrement={handleDecrement}
            cardVal={incrementCardCounter.count}
            resetCardDetails={resetCardDetails}
            deleteCard={deleteCard}
          >
            {" "}
          </CardManagementHeader>
          <CustomSnackbar
            open={showSnackbar}
            close={setShowSnackbar}
            type={alertType}
            message={snackbarMessage}
          ></CustomSnackbar>

          <Popup4
            open={openSubmitSuccessfulModal}
            close={() => setOpenSubmitSuccessfulModal(false)}
            closeAndSubmit={handleDoneModal}
            title="Submission Successful"
            description={successMsg}
            btnText={
              selectedCardTypeBulk === "physical"
                ? "Proceed to Payment"
                : "Back to Card Management"
            }
          ></Popup4>
          <>
            {showPopUp ? (
              <div>
                <DeletePopUp
                  selectedCardNumber={deletedCardNumber}
                  cardFields={cardFields}
                  navigationFlag={navigationFlag}
                ></DeletePopUp>
              </div>
            ) : (
              <></>
            )}
          </>
          {renderSection()}
        </Provider>
      </Paper>
    </Container>
  );
};

export default AddCards;
