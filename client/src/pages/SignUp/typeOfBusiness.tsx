import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import styles from "./Signup.module.scss";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Snackbar, Hidden } from "@material-ui/core";
import CustomCard from "../../components/CustomCard/CustomCard";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setBusiness, setLoader } from "../../redux/actions/actions";
import { postBusinessType } from "../../lib/api/signup/signup";
import { useHistory } from "react-router-dom";
import { Popup3 } from "src/components/CustomPopups/Popup3/Popup3";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const solePropImg = "/soleProp.svg";
const individualImg = "/individual.svg";
const companyImg = "/company.svg";
const partnershipMobile = "/partnership_mobile.svg";
const individualMobile = "/individual_mobile.svg";
const companyMobile = "/company_mobile.svg";
const InfoIcon = "/W_Icons_Info.svg";

const TypeOfBusiness = () => {
  const router = useRouter();
  const store: any = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  console.log(store);
  const [card, setCard] = useState(store.business ? store.business : "");
  const [showPopup, setShowPopup] = useState(false);
  console.log("router", router);
  console.log("history", history);
  const changeColor = (selectedCard: any) => {
    setCard(selectedCard);
  };

  const redirectToSignUp = () => {
    // props.history.push("/signup/");
    router.push("/signup");
  };

  const redirectBack = () => {
    // props.history.push("/otp/");
    router.push("/business-programme");
  };
  const redirectToRegistration = async (card: any) => {
    const finalData = {
      businessProgram: store.businessProgram,
      customerType: card,
      businessType: card,
    };

    console.log("BUSINESS TYPE SELECTION", finalData);
    dispatch(setLoader(true));
    dispatch(setBusiness(card));

    const res: any = await postBusinessType(finalData);

    console.log("BUSINESS TYPE SELECTION : res", res);
    if (res?.status === "success") {
      router.push("/registration/smartfleet");
    } else {
      console.log("ERROR", res?.errors);
      dispatch(setLoader(false));
      if (res?.errors) {
        res?.errors.forEach((element: any) => {
          console.log(element?.subject);
          if (!element.hasOwnProperty("subject")) {
            console.log(element?.subject);
            // setApiOtherErrorMessage(element?.message);
          } else {
            if (element?.subject === "customerId") {
              if (element?.reason === "missing") {
                // setUsernameErrorMessage(element?.message);
              } else if (element?.reason === "invalid") {
                // setUsernameErrorMessage(validationErrorMessage.EMAIL_OR_MOBILE);
              }
            } else if (element?.subject === "businessType") {
              if (element?.reason === "missing") {
              } else if (element?.reason === "invalid") {
              }
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

  const popupredirectToRegistration = (card: any) => {
    console.log("card value is", card);
    if (!store.business || (store.business && card === store.business)) {
      redirectToRegistration(card);
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <React.Fragment>
      <Container
        maxWidth="sm"
        className={`p-0 d-flex flex-column justify-content-between ${styles.signUpContainer}`}
      >
        {console.log("STORE>BUSINESS", store.business)}
        <CustomCard
          className={`my-0 my-sm-4 px-3 d-flex flex-column justify-content-between ${styles.otpCard} ${styles.root}`}
        >
          <div className="d-flex flex-column">
            <div
              className={`d-flex align-items-center justify-content-center pt-4`}
            >
              <div
                className={`align-items-between pl-0 mr-auto justify-content-start`}
              >
                <ArrowBackIcon
                  className={`${styles.iconColor}`}
                  onClick={() => redirectBack()}
                  data-test-id="business-back-btn"
                ></ArrowBackIcon>
              </div>
              <div
                className={`d-flex align-items-center justify-content-center w-100`}
              >
                <span
                  className={`${styles.businessTypeHeader}`}
                  data-test-id="business-businessType-lbl"
                >
                  Choose your Business Type
                </span>
              </div>
              <div className={`${styles.noOpacity}`}>
                <ArrowBackIcon
                  className={`${styles.iconColor}`}
                ></ArrowBackIcon>
              </div>
            </div>

            <div
              className={`d-flex align-items-center justify-content-around pt-2 pt-sm-5`}
            >
              <span
                className={`${styles.businessSubHeader}`}
                data-test-id="business-clickBusiness-lbl"
              >
                Click on your business type for SmartFleet Registration
              </span>
            </div>
          </div>

          <div
            className={`d-flex flex-column flex-sm-row align-items-center justify-content-around px-4 px-sm-0 pt-sm-5 mt-5 pb-sm-5 ${styles.selectionContainer} `}
          >
            <div
              className={`d-flex flex-sm-column align-items-center h-100 px-3 py-3 justify-content-sm-around justify-content-start ${
                styles.card
              } ${
                card === "Individual"
                  ? styles.activeSelectionContainer
                  : styles.inactiveSelectionContainer
              }`}
              onClick={() => changeColor("Individual")}
              data-test-id="business-individual-div"
            >
              <div
                className={`d-flex align-items-center justify-content-center mb-sm-3 ${
                  styles.imgContainer
                } ${
                  card === "Individual"
                    ? styles.activeImgContainer
                    : styles.inactiveImgContainer
                }`}
              >
                <Hidden xsDown>
                  <img src={individualImg} alt="Sole Proprietorship" />
                </Hidden>
                <Hidden smUp>
                  <img src={individualMobile} alt="Sole Proprietorship" />
                </Hidden>
              </div>
              <span
                className={`ml-3 ml-sm-0 ${styles.businessLabel}`}
                data-test-id="business-individual-lbl"
              >
                Individual
                {card === "Individual" ? (
                  ""
                ) : (
                  <Hidden xsDown>
                    <CustomTooltip
                      enterTouchDelay={0}
                      disableFocusListener
                      title="Select this if you are an Individual"
                      placement="bottom"
                      data-test-id="individual-info-lbl"
                    >
                      <img
                        className="pl-2"
                        src={InfoIcon}
                        alt="Info for New Password"
                        data-test-id="individual-info-img"
                      ></img>
                    </CustomTooltip>
                  </Hidden>
                )}
              </span>
            </div>

            <div
              className={`d-flex flex-sm-column align-items-center h-100 px-3 py-3 pb-sm-0 justify-content-sm-around justify-content-start ${
                styles.card
              } ${
                card === "Sole_Proprietorship"
                  ? styles.activeSelectionContainer
                  : styles.inactiveSelectionContainer
              }`}
              onClick={() => changeColor("Sole_Proprietorship")}
              data-test-id="business-soleProp-div"
            >
              <div
                className={`d-flex align-items-center justify-content-center mb-sm-3 p-3 p-sm-0 ${
                  styles.imgContainer
                } ${
                  card === "Sole_Proprietorship"
                    ? styles.activeImgContainer
                    : styles.inactiveImgContainer
                }`}
              >
                <Hidden xsDown>
                  <img src={solePropImg} alt="Sole Proprietorship" />
                </Hidden>
                <Hidden smUp>
                  <img src={partnershipMobile} alt="Sole Proprietorship" />
                </Hidden>
              </div>
              <Hidden xsDown>
                <p
                  className={`mb-0 ${styles.businessLabel}`}
                  data-test-id="business-soleProp-lbl-1"
                >
                  Sole Proprietorship /{" "}
                  {card === "Sole_Proprietorship" ? (
                    ""
                  ) : (
                    <CustomTooltip
                      enterTouchDelay={0}
                      disableFocusListener
                      title='Select this if you are a Firm, registered under State / Central Govt. Act as a "Limited Liable Partnership (LLP)" or as a "Sole Proprietorship and Govt. Dept. / Co-operative Society / Trust / Association.'
                      placement="bottom"
                      data-test-id="soleProp-info-lbl"
                    >
                      <img
                        className="pl-2"
                        src={InfoIcon}
                        alt="Info for New Password"
                        data-test-id="soleProp-info-img"
                      ></img>
                    </CustomTooltip>
                  )}
                </p>
                <p
                  className={`mb-0 pr-3 ${styles.businessLabel}`}
                  data-test-id="business-soleProp-lbl-2"
                >
                  Partnership
                </p>
              </Hidden>
              <Hidden smUp>
                <p
                  className={`ml-3 ml-sm-0 ${styles.businessLabel}`}
                  data-test-id="business-soleProp-lbl-3"
                >
                  Sole Proprietorship / Partnership{" "}
                </p>
              </Hidden>
            </div>
            <div
              className={`d-flex flex-sm-column align-items-center h-100 px-3 py-3 justify-content-sm-around justify-content-start ${
                styles.card
              } ${
                card === "Company"
                  ? styles.activeSelectionContainer
                  : styles.inactiveSelectionContainer
              }`}
              onClick={() => changeColor("Company")}
              data-test-id="business-company-div"
            >
              <div
                className={`d-flex align-items-center justify-content-center mb-sm-3 ${
                  styles.imgContainer
                }
                             ${
                               card === "Company"
                                 ? styles.activeImgContainer
                                 : styles.inactiveImgContainer
                             }`}
              >
                <Hidden xsDown>
                  <img src={companyImg} alt="Sole Proprietorship" />
                </Hidden>
                <Hidden smUp>
                  <img src={companyMobile} alt="Sole Proprietorship" />
                </Hidden>
              </div>
              <span
                className={`ml-3 ml-sm-0 ${styles.businessLabel}`}
                data-test-id="signup-company-lbl"
              >
                Company
                {card === "Company" ? (
                  ""
                ) : (
                  <Hidden xsDown>
                    <CustomTooltip
                      enterTouchDelay={0}
                      disableFocusListener
                      title='Select this if you are an Organization, registered as a "Private Limited Company" or as a "Public Limited Company" or as a "One Person Company" under Companies Act.'
                      placement="bottom"
                      data-test-id="company-info-lbl"
                    >
                      <img
                        className="pl-2"
                        src={InfoIcon}
                        alt="Info for New Password"
                        data-test-id="company-info-img"
                      ></img>
                    </CustomTooltip>
                  </Hidden>
                )}
              </span>
            </div>
          </div>
          <div
            className={`d-flex flex-column justify-content-center mt-auto pb-4`}
          >
            <div
              className={`d-flex w-100 align-items-center justify-content-center mt-3 ${styles.buttonContainer}`}
            >
              <CustomButton
                variant="contained"
                disabled={card === "" ? true : false}
                className={`w-100 ${styles.buttonStyle}
                          ${
                            card === ""
                              ? styles.inactiveButton
                              : styles.activeButton
                          }`}
                onClick={() => popupredirectToRegistration(card)}
                data-test-id="business-proceed-btn"
              >
                PROCEED
              </CustomButton>
            </div>
            {/* <div
              className={`d-flex align-items-center justify-content-center pt-3`}
            >
              <span
                className={`${styles.backToLabel}`}
                data-test-id="business-backTo-lbl"
              >
                Back to{" "}
                <span
                  className={`${styles.signUpLabel}`}
                  onClick={() => redirectToSignUp()}
                  data-test-id="business-signup-lbl"
                >
                  Sign In
                </span>
              </span>
            </div> */}
          </div>
          {/* <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => {
              setOpen(false);
            }}
            data-test-id="business-snackBar"
            className={`${styles.alertStyle}`}
          >
            <Alert
              className={`align-items-center ${styles.alertBackground}`}
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  className={`${styles.alertBackground}`}
                  data-test-id="business-close-iconBtn"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon
                    fontSize="inherit"
                    className={`${styles.alertBackground}`}
                    data-test-id="business-closeIcon"
                  />
                </IconButton>
              }
              data-test-id="business-alert-lbl"
            >
              Your OTP is verified! Please go ahead and complete your SmartFleet
              registration.
            </Alert>
          </Snackbar> */}
        </CustomCard>
        <Popup3
          open={showPopup}
          close={() => setShowPopup(false)}
          closeAndSubmit={() => redirectToRegistration(card)}
          title={`Are you sure you want to proceed?`}
          description={`You have selected ${card} as business type`}
        ></Popup3>
      </Container>
    </React.Fragment>
  );
};

export default TypeOfBusiness;
