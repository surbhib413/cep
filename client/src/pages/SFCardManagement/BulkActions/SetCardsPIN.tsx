import {
  React,
  useEffect,
  useRouter,
  useSelector,
  useDispatch,
  makeStyles,
  Typography,
  Button,
  isEmpty,
  Hidden,
  Container,
  Alert
} from "../../../utility/general-imports";

import SetCardPinTable from "./SetCardPinTable";
import SideNav from "../../../components/SideNav/SideNav";
import { getCardForBulkAction } from "../../../lib/api/SFCardManagement/sfcardmanagement";
import { setLoader } from "../../../redux/actions/actions";
import CustomSnackbar from "../../../../src/components/CustomSnackbar/CustomSnackbar";
import styles from "../../SFCardManagement/CardManagement.module.scss";
import OtpMobile from "../BulkActions/dialogs/OtpMobile";
import {
  sendOTP,
  validateOTP,
  setPinForCards,
} from "../../../lib/api/SFCardManagement/sfcardmanagement";
import { SetPINSuccessful } from "../../../components/CardManagement/SetPINSuccessful";
import {
  getSearchResultsCardMgt,
  getOrderedData,
} from "../../../utility/utils";
import {
  CARD_NOT_DELIVERED_ERROR_DESCRIPTION
} from "../constants"

const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff",
  },
  container: {
    padding: "1rem",
    height: "100%",
    backgroundColor: "#f9fbff",
  },
  header: {
    padding: "1rem 0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&: .MuiButton-label": {
      fontSize: "14px",
    },
  },
});

const cross_icon = "/cross_icon.svg";

export default function BulkPinSet(props: any) {
  const classes = useStyles();
  const [cardData, setCardData] = React.useState([""]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [orderBy, setOrderBy] = React.useState("asc");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [cardDataPersistent, setCardDataPersistent] = React.useState([""]);
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
  const [openOTPModal, setOpenOTPModal] = React.useState(false);
  const router = useRouter();
  const [PINData, setPINData] = React.useState([{}]);
  const [openSetPINResponseModal, setOpenSetPINResponseModal] = React.useState(
    false
  );
  const [resendMsg, setResendMsg] = React.useState(false);
  const [invalidPinErrorMsg, setInvalidPinErrorMsg] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [failedMessage, setFailedMessage] = React.useState([]);
  const [failedCards, setFailedCards] = React.useState([]);
  const [showPinError, setShowPinError] = React.useState(false);

  const resendOTP = () => {
    setResendMsg(true);
    setInvalidPinErrorMsg(false);
    getOTP();
  };

  const OTPAttempt = () => {
    setInvalidPinErrorMsg(true);
  };

  const BackToCardManagement = () => {
    router.push("/sfcardmanagement");
  };

  const cardHeadersData = () => {
    const purpose = store.actionType == 'reset' ? 'resetpin' : 'setpin'
    dispatch(setLoader(true));
    getCardForBulkAction({
      cards: store.selectedFleetCardsForBulkAction,
      purpose: purpose,
    }).then((response) => {
      if (
        response?.status == "success" &&
        response?.data &&
        response?.data?.fleetCards
      ) {
        setCardData(response.data.fleetCards);
        setCardDataPersistent(response.data.fleetCards);
        const data = response.data.fleetCards.map((value:any,index:number) => {
          return {
            cardId: value.fleetCardId,
            pin: '',
            confirmPin: '',
            slNo: value.slNo,
            cardName: value.cardname,
          }
        });
        setPINData(data);
      } else {
        setCardData([]);
        if (response?.errors) {
          setSnackbarMessage(response?.errors[0]?.message);
          setShowSnackbar(true);
        }
        if (
          response?.message == CARD_NOT_DELIVERED_ERROR_DESCRIPTION
        ) {
        }
      }
      dispatch(setLoader(false));
    });
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const getOTP = () => {
    const otpData = {
      channel: "Web",
      isNotificationEnabled: true,
      otpChannel: "MOBILE",
      otpType: "BULK_SET_PIN",
    };
    sendOTP({ ...otpData }).then((resp) => {
      console.log(resp);
      if (resp.status == "success") {
        console.log("otp created successfully");
        setOpenOTPModal(true);
      }
    });
  };

  const handleOtpVerify = (otp: any) => {
    const validateOTPData = {
      channel: "Web",
      isNotificationEnabled: true,
      otpChannel: "MOBILE",
      otpType: "BULK_SET_PIN",
      otp: otp,
    };
    console.log(otp);
    validateOTP({ ...validateOTPData }).then((resp) => {
      console.log(
        "respnse from otp validation",
        resp,
        resp?.status,
        resp?.data?.otpAuthToken
      );
      if (resp?.message == "OTP validated successfully") {
        handleSetPIN(resp?.data?.otpAuthToken);
      }
      console.log(resp?.status == "error");
      if (
        resp?.status == "error" &&
        resp?.errors &&
        resp?.errors[0]?.message == "invalid.otp"
      ) {
        setInvalidPinErrorMsg(true);
      }
      // Call the API to set PIN
    });
  };

  const handleSetPIN = (otpAuthToken: string) => {
    const PINDataFinal = PINData.filter((value) => !isEmpty(value));
    setPinForCards({
      fleetCards: PINDataFinal,
      otpAuthToken: otpAuthToken,
      otpType: "BULK_SET_PIN",
    }).then((resp) => {
      console.log("Set pin response", resp);
      setOpenSetPINResponseModal(true);
      setOpenOTPModal(false);
      setSuccessMessage(
        resp?.data?.successMessage ? resp.data.successMessage : ""
      );
      setFailedMessage(
        resp?.data?.failureMessage ? resp.data.failureMessage : []
      );
      setFailedCards(resp?.data?.failedCards ? resp.data.failedCards : []);
    });
  };

  const handleCloseAndSubmitConfirmModal = () => {
    let filterCardData;
    const filterPINData = PINData.filter((value:any,index:number) => {
      let found = failedCards.filter((obj:any,ind:number) => {
        return obj.cardId == value.cardId
      })
      return found.length ? true : false
    })
    if(failedCards.length){
      filterCardData = cardData.filter((value:any,index:number) => {
        let found = failedCards.filter((obj:any,ind:number) => {
          return obj.cardId == value.fleetCardId
        })
        return found.length ? true : false
      })
    }
    else{
      filterCardData = cardData;
    }

    //console.log(failedCards,PINData,filterPINData,cardData,filterCardData);
    setOpenSetPINResponseModal(false);
    setCardData(filterCardData);
    setPINData(filterPINData);
    setShowPinError(true);
  };

  const handleNewPINChange = (event: any, row: any) => {
    const currentTarget = event.target;

    if (isNaN(currentTarget.value)) {
      currentTarget.value = "";
      return false;
    }

    setPINData((prevState: any) => {
      const current = prevState.filter((value: any, index: number) => {
        return value.cardId != row.fleetCardId;
      });
      const rest = prevState.filter((value: any, index: number) => {
        return value.cardId == row.fleetCardId;
      });
      const pinValue = rest.length ? rest[0].confirmPin : "";
      return [
        ...current,
        {
          cardId: row.fleetCardId,
          pin: currentTarget.value,
          confirmPin: pinValue,
          slNo: row.slNo,
          cardName: row.cardname,
        },
      ];
    });
  };

  const handleConfirmPINChange = (event: any, row: any) => {
    const currentTarget = event.target;

    if (isNaN(currentTarget.value)) {
      currentTarget.value = "";
      return false;
    }

    setPINData((prevState: any) => {
      const current = prevState.filter((value: any, index: number) => {
        return value.cardId != row.fleetCardId;
      });
      const rest = prevState.filter((value: any, index: number) => {
        return value.cardId == row.fleetCardId;
      });
      const pinValue = rest.length ? rest[0].pin : "";
      return [
        ...current,
        {
          cardId: row.fleetCardId,
          pin: pinValue,
          confirmPin: currentTarget.value,
          slNo: row.slNo,
          cardName: row.cardname,
        },
      ];
    });
  };

  useEffect(() => {
    cardHeadersData();
  }, []);

  useEffect(() => {
    if (openOTPModal) {
      getOTP();
    }
  }, [openOTPModal]);

  useEffect(() => {
    setCardData((prevState: any) => {
      return getSearchResultsCardMgt(searchText, cardDataPersistent);
    });
  }, [searchText]);

  useEffect(() => {
    setCardData((prevState: any) => {
      return getOrderedData(prevState, "slNo", orderBy);
    });
  }, [orderBy]);

  return (
    <React.Fragment>
      <Hidden smDown>
        <Container
          className={`pl-1 pr-2 d-flex w-25 mw-100 flex-column bd-highlight`}
        >
          <SideNav></SideNav>
        </Container>
      </Hidden>
      <Container
        className={`${classes.root} p-0 mr-4 ml-3 d-flex mw-100 flex-column`}
      >
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography
              variant="h3"
              className={styles.headerTitleSetPIN}
              gutterBottom
            >
              {store.actionType == "reset" ? "Reset PIN" : "Set PIN"}
            </Typography>
          </div>

          <SetCardPinTable
            cardData={cardData}
            handleSearchTextChange={handleSearchTextChange}
            searchText={searchText}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            setOpenOTPModal={setOpenOTPModal}
            handleNewPINChange={handleNewPINChange}
            handleConfirmPINChange={handleConfirmPINChange}
            showPinError={showPinError}
          />
          {
           false &&  <Alert icon={<img src={cross_icon} className={styles.pointerStyle} onClick={(event) => setOrderBy("desc")}/>} 
                      className={styles.errorStyleSetPIN} onClose={() => {}}  severity="error">
                        PIN do not match. Try again.
                      </Alert>
          }
        </div>
        <div className={"d-flex justify-content-end mt-3 mb-3"}>
        <span>
              <Button
                variant="outlined"
                color="primary"
                className={styles.backCardMgt}
                onClick={BackToCardManagement}
              >
                BACK TO CARD MANAGEMENT
              </Button>
            </span>
            <span>
              <Button
                variant="outlined"
                color="primary"
                className={styles.Submit}
                onClick={() => setOpenOTPModal(true)}
              >
                SUBMIT
              </Button>
            </span>
            </div>
        <OtpMobile
          open={openOTPModal}
          handleOtpClose={() => setOpenOTPModal(false)}
          customerMobile={9344879873}
          handleOtpVerify={handleOtpVerify}
          resendOTP={resendOTP}
          OTPAttempt={OTPAttempt}
          resendMsg={resendMsg}
          setResendMsg={setResendMsg}
          errorMsg={invalidPinErrorMsg}
          setErrorMsg={setInvalidPinErrorMsg}
          openOTPModal={openOTPModal}
        />
        <SetPINSuccessful
          open={openSetPINResponseModal}
          close={() => setOpenSetPINResponseModal(false)}
          closeAndSubmit={handleCloseAndSubmitConfirmModal}
          title={"PIN set successfully"}
          successMessage={successMessage}
          failedMessage={failedMessage}
          failedCards={failedCards}
          BackToCardManagement={BackToCardManagement}
        />
        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>
      </Container>
    </React.Fragment>
  );
}
