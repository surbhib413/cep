import React, { useEffect, useState } from "react";
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import CardDetails from "./CardDetails";
//import PopupCardProfile from "../../SFCardManagement/CardProfile"
import CardManagementHeader from "./CardManagementHeader";
import DeletePopUp from "./DeletePopUp";
import CardDetailsUpload from "./CardDetailsUpload";
import CardDetailsHeader from "./CardDetailsHeader";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  // setPAYMENT_ISPAYMENTAPPLICABLE,
  setLoader,
  setPaymentCardBulk,
} from "src/redux/actions/actions";
import CustomSnackbar from "src/components/CustomSnackbar/CustomSnackbar";
import lodash from "lodash";
export const CardsContext = React.createContext<any>(0);
import { getTemplateUrl } from "src/lib/api/smartfleet/cardmanagement";
import { formSections } from "../types/formSections.enum";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import {
  deleleteCards,
  cardBulkUpload,
} from "src/lib/api/smartfleet/cardmanagement";
import CardType from "./CardType";

const CardManagement = (props: any) => {
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();

  const { handleIncompleteStep, handleCompleteStep, dropdownLists } = props;
  const { Provider } = CardsContext;
  const initCardCounter = {
    val: [1],
    count: 1,
  };
  const initCardObj = {
    selectedCardId: 1,
    deletedCardId: 0,
  };

  const initUrlForTemplates = {
    sampleCardURL: "",
    virtualTemplateURL: "",
    physicalTemplateURL: "",
  };
  // const successMsgs = "";

  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [cardObj, setCardObj] = useState(initCardObj);
  const [showPopUp, setShowPopUp] = useState(false);
  const [deletedCardNumber, setDeletedCardNumber] = useState(0);
  const [section, setSection] = useState(true);
  const [showSampleCard, setShowSampleCard] = useState(false);
  const [lastCardStatus, setLastCardStatus] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>(
    props.initialData?.isVirtual ? "virtual" : "physical"
  );
  const [selectedCardTypeBulk, setSelectedCardTypeBulk] = useState<string>(
    "virtual"
  );

  const [urlForTemplates, setUrlForTemplates] = useState(initUrlForTemplates);
  const [isSectionEditable, setIsSectionEditable] = React.useState(true);
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
  const [navigationFlag, setnavigationFlag] = React.useState(true);
  const preLoad = async () => {
    const response = await getTemplateUrl();
    if (response?.errors) {
      console.log("Error caught", response.errors);
    } else {
      setUrlForTemplates({
        physicalTemplateURL: response?.data?.physicalTemplate,
        sampleCardURL: response?.data?.sampleCard,
        virtualTemplateURL: response?.data?.virtualTemplate,
      });
    }
  };

  useEffect(() => {
    preLoad();
  }, []);

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

  useEffect(() => {
    const { initialData } = props;
    if (initialData) {
      console.log("initialData", initialData);
      if (initialData?.cards) {
        const newCard: any = { cards: [] };
        initialData.cards.forEach((card: any, index: number) => {
          let newCardFieldsCopy: any = lodash.cloneDeep(individualCard);
          for (let key of Object.keys(newCardFieldsCopy)) {
            newCardFieldsCopy.fleetCardId = card.fleetCardId;
            newCardFieldsCopy.errorStatus = card.errorStatus || "";
            newCardFieldsCopy.isPrimary = card.isPrimary;
            newCardFieldsCopy.mobileNumber.value = card.mobileNumber || "";
            newCardFieldsCopy.selectedNameOfCard.value =
              card.selectedNameOfCard || "";
            newCardFieldsCopy.vehicleNumber.value = card.vehicleNumber || "";
            newCardFieldsCopy.vehicleMake.value = card.vehicleMake || "Select";
            newCardFieldsCopy.vehicleType.value = card.vehicleType || "Select";
            newCardFieldsCopy.yearOfReg.value = card.yearOfReg || "";
            newCardFieldsCopy.fuelType.value = card.fuelType || "";
            newCardFieldsCopy.cardPersonalization.value =
              card.cardPersonalization || "";
            newCardFieldsCopy.nameOnCard.value = card.nameOnCard || "";
          }
          newCard.cards.push(newCardFieldsCopy);

          if (
            index !== 0 &&
            decrementCardCounter.val.length < initialData.cards.length
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

        if (initialData?.isVirtual) {
          setSelectedCardType("virtual");
        } else {
          setSelectedCardType("physical");
        }
      }
      if (initialData?.cardsBulkData) {
        if (initialData?.cardsBulkData?.isVirtual) {
          setSelectedCardTypeBulk("virtual");
        } else {
          setSelectedCardTypeBulk("physical");
        }
        if (
          initialData?.cardsBulkData?.filename &&
          initialData?.cardsBulkData?.uploadedRecords
        ) {
          setSelectedExcelFile(initialData?.cardsBulkData?.filename);
          setSuccessMsg(`${initialData?.cardsBulkData?.uploadedRecords}`);
        }
        if (initialData?.cardsBulkData?.incompletedRecords) {
          setErrorMsgLog((state) => ({
            lineOne: `${initialData?.cardsBulkData?.incompletedRecords}`,
            lineTwo: ``,
            link: ``,
          }));
        }
      }

      setIsSectionEditable(initialData?.editable || true);
      if (initialData?.completed) {
        handleCompleteStep(formSections.CARD_MANAGEMENT, true);
        handleIncompleteStep(formSections.CARD_MANAGEMENT, false);
      }
    }
  }, []);

  /* ---------------------------------------------------- */

  //getting id of selected card from CardDetailsNavigation Componen
  const getSelectedCardId = (selectedCardId: number) => {
    //console.log("getSelectedCardId");
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

  // increment handler fn
  const handleIncrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    // console.log("handleIncrement");
    // console.log(cardFields);
    individualCard.isPrimary = false;
    // console.log("value for is orimary %%%", individualCard.isPrimary);
    const newCardFields = lodash.cloneDeep(cardFields);
    newCardFields.cards.push(individualCard); 
    setCardFields(newCardFields);

    setIncrementCardCounter((state) => ({
      ...state,
      count: decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
    }));
    setDecrementCardCounter((state) => ({
      ...state,
      val: [...state.val, state.val[state.val.length - 1] + 1],
      count: decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
    }));

    setCardObj((state) => ({
      ...state,
      selectedCardId:
        decrementCardCounter.val[decrementCardCounter.val.length - 1] + 1,
      deletedCardId: 0,
    }));

    setSelectedCardDetails(individualCard);
  };

  //virtual/physical option handler
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   setSelectedCardType(event.target.value);

  //   props.selectedCardCallback(event.target.value);
  // };

  //handles confirmation box
  const openConfirmationBox = (selectedCardId: number) => {
    //e.persist();

    setShowPopUp(true);
    setDeletedCardNumber(selectedCardId);
    return;
  };
  //closes confirmation box
  const closeConfirmationBox = () => {
    setShowPopUp(false);
  };

  //delete selected card
  const deleteCard = (selectedCardId: number) => {
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

    // let nextselectedCardId = 1;
    // if(cardObj.selectedCardId >= selectedCardId){
    //   nextselectedCardId = selectedCardId - 1;
    // }else{
    //   nextselectedCardId = selectedCardId;
    // }

    setCardObj((state) => ({
      ...state,
      deletedCardId: selectedCardId,
      // selectedCardId: selectedCardId - 1,
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
      // console.log("decrementCardCounter.count-->", decrementCardCounter.count);
      // setDeletedCardNumber(decrementCardCounter.count);
    }
    return true;
    //openConfirmationBox(event:React.MouseEvent<HTMLButtonElement>, finalVal[finalVal.length - 1]);
  };

  const getCardDetailsFields = (cardDetailsFields: any) => {
    if (cardDetailsFields.length == 0) {
      setLastCardStatus(false);
    } else {
      setLastCardStatus(true);
    }
  };

  //individual/bulk upload handler
  const showSection = (val: boolean) => {
    // console.log("val---", val);
    setSection(val);
  };
  const selectedCardCallbackIndividual = (dataFromChild: string) => {
    console.log(
      "This is data from child card setSelectedCardType",
      dataFromChild.toString()
    );
    // console.log("selectedCardType", selectedCardType);

    setSelectedCardType(dataFromChild.toString());
  };
  const selectedCardCallbackBulk = (dataFromChild: string) => {
    console.log(
      "This is data from child card setSelectedCardTypeBulk ",
      dataFromChild.toString()
    );
    // console.log("selectedCardType", selectedCardType);
    setSelectedCardTypeBulk(dataFromChild.toString());
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
    // console.log(cardFields);
    setCardFields(allCards);
    // console.log(cardFields);
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
      formData.append("applicationType", "Enrollment");
      formData.append("bulkUpload", "true");
      formData.append("customerType", "");
      formData.append("cardsExcel", excelFileUploads);

      const response: any = await cardBulkUpload(formData);
  
      if (response?.data?.status === "Success") {
        if (response?.data?.completed) {
          handleCompleteStep(formSections.CARD_MANAGEMENT, true);
          handleIncompleteStep(formSections.CARD_MANAGEMENT, false);
          setisFileSaved(true);
          setShowSnackbar(true);
          setSnackbarMessage(response?.data?.message);
          setAlertType("success");
          setErrorMessage("");
          setErrorMsgLog({
            lineOne: "",
            lineTwo: "",
            link: "",
          });
          setSuccessMsg(`${response?.data?.uploadedRecords}`);
          dispatch(setPaymentCardBulk(selectedCardTypeBulk));
        } else {
          handleCompleteStep(formSections.CARD_MANAGEMENT, false);
          handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
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
            handleCompleteStep(formSections.CARD_MANAGEMENT, false);
            handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
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
      customerId: store.customerId,
    };
    dispatch(setLoader(true));
    const res: any = await deleleteCards(finalData);
    if (res?.status === "success") {
      clearUploadSection();
      setShowSnackbar(true);
      setSnackbarMessage(res?.data?.message);
      setAlertType("success");
      setisFileSaved(false);
      handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
      dispatch(setPaymentCardBulk("virtual"));
    } else {
      console.log("Error caught", res.errors);
      if (res?.errors) {
        res?.errors.forEach((element: any) => {
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
    dispatch(setLoader(false));
  };

  const renderSection = () => {
    let sectionContent = <></>;
    if (section) {
      sectionContent = (
        <>
          <CardType
            selectedCardCallback={props.selectedCardCallback}
            selectedCardType={selectedCardType}
            selectedCardCallbackBulk={selectedCardCallbackBulk}
            selectedCardCallbackIndividual={selectedCardCallbackIndividual}
            section={section}
            selectedCardTypeBulk={selectedCardTypeBulk}
            navigationFlag={navigationFlag}
          ></CardType>
          <CardDetailsHeader></CardDetailsHeader>
          <CardDetails
            getCardDetailsFields={getCardDetailsFields}
            getAllCardsList={getAllCardsList}
            cardFields={cardFields}
            updateSelectedCardDetails={updateSelectedCardDetails}
            updateAllCardDetails={updateAllCardDetails}
            resetCardDetails={resetCardDetails}
          ></CardDetails>
          {/* <PopupCardProfile
            getCardDetailsFields={getCardDetailsFields}
            getAllCardsList={getAllCardsList}
            cardFields={cardFields}
            updateSelectedCardDetails={updateSelectedCardDetails}
            updateAllCardDetails={updateAllCardDetails}
            resetCardDetails={resetCardDetails}
          ></PopupCardProfile> */}
        </>
      );
    } else {
      sectionContent = (
        <>
          <CardType
            selectedCardCallback={props.selectedCardCallback}
            selectedCardTypeBulk={selectedCardTypeBulk}
            selectedCardCallbackBulk={selectedCardCallbackBulk}
            selectedCardCallbackIndividual={selectedCardCallbackIndividual}
            selectedCardType={selectedCardType}
            navigationFlag={navigationFlag}
            section={section}
          ></CardType>
          <CardDetailsHeader></CardDetailsHeader>
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
    <div className="w-100 mt-0  px-4 px-sm-2">
      <CardManagementHeader
        cardVal={incrementCardCounter.count}
        showSection={showSection}
        handleDecrement={handleDecrement}
        resetCardDetails={resetCardDetails}
        selectedCardType={selectedCardType}
        deleteCard={deleteCard}
        selectedCardTypeBulk={selectedCardTypeBulk}
      ></CardManagementHeader>

      <div className={`w-100 d-flex flex-column `}>
        <form className={`w-100`}>
          <div>
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
                selectedCardTypeBulk: selectedCardTypeBulk,
                handleIncompleteStep: handleIncompleteStep,
                handleCompleteStep: handleCompleteStep,
                dropdownLists: dropdownLists,
                isFileSaved: isFileSaved,
              }}
            >
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
          </div>
        </form>
        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>
      </div>
    </div>
  );
};

export default CardManagement;
