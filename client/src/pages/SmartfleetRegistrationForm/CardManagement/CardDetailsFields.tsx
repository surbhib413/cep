import React, { useState, useEffect, useContext } from "react";
import styles from "./CardManagement.module.scss";
import {
  Grid,
  Typography,
  InputAdornment,
  FormControlLabel,
  Radio,
  Hidden,
  FormHelperText,
  FormControl,
  withStyles,
  Theme,
  createStyles,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";

import {
  isVailidName,
  isValidVehicleNumber,
  isValidYearOfRegistration,
  isValidMobileNumber,
  isOnlyNumbers,
} from "../../../utility/validations/validations";
import { validationErrorMessage } from "../../../utility/validations/validationErrorMessages";

import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../../components/CustomMenu/CustomMenu";
import { CardsContext } from "./CardManagement";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { CustomTooltip } from "../../../components/CustomTooltip/CustomTooltip";

import { CustomSvgIcon } from "../../../components/CustomSvgIcon/CustomSvgIcon";

import { useSelector } from "react-redux";
import validator from "validator";
import lodash from "lodash";
import { formSections } from "../types/formSections.enum";
import { CardsContextAddCard } from "src/pages/CAMCardManagement/AddCards/AddCards";

const WarningIcon = "/W_Icons_Warning.svg";
const NextIcon = "/Next_Icon.svg";
const NextIconDisable = "/Next_Icon_Disable.svg";
const InfoIcon = "/W_Icons_Info.svg";

// const fuelTypes = [
//   "All",
//   // 'CNG',
//   // 'LNG',
//   "Diesel",
//   "Petrol",
//   "Speed",
//   //'Lubricants',
//   "High Speed Diesel",
//   "Speed 97",
// ];
// console.log("##FuelType##",fuelTypes);
const StyledMenuItem = withStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  })
)(MenuItem);

const CardDetailsFields = (props: any) => {
  const [navigationFlag, setnavigationFlag] = React.useState(
    props.navigationFlag
  );
  const CARD_CONTEXT = navigationFlag
    ? useContext(CardsContext)
    : useContext(CardsContextAddCard);
  const selectedCardDetails = CARD_CONTEXT.selectedCardDetails;
  const [selectedCardNumber, setSelectedCardNumber] = useState<number>(1);
  const store: any = useSelector((state) => state);
  const [dropdownLists, setdropdownLists] = useState(
    navigationFlag ? CARD_CONTEXT.dropdownLists : props.dropdownLists
  );

  /* ---------------------------------------------------- */

  //previous card navigation
  function previousCard(event: React.MouseEvent<HTMLImageElement>) {
    event.preventDefault();
    if (selectedCardNumber > 1) {
      CARD_CONTEXT.getSelectedCardId(selectedCardNumber - 1);
      setSelectedCardNumber(selectedCardNumber - 1);
    } else {
      return false;
    }
  }

  //next card navigation
  const nextCard = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();

    if (CARD_CONTEXT.cardCounter.val.length === selectedCardNumber) {
      return false;
    } else {
      CARD_CONTEXT.getSelectedCardId(selectedCardNumber + 1);
      setSelectedCardNumber(selectedCardNumber + 1);
    }
  };

  const handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    const testArray = (value as unknown) as string[];
    let arr;

    if (
      selectedCardDetails?.fuelType.value.includes("All") &&
      value.includes("All")
    ) {
      arr = testArray.filter((e) => e != "All");
    } else if (value.includes("All")) {
      arr = ["All"];
    } else {
      arr = value;
    }
    let copyCardFields = lodash.cloneDeep(selectedCardDetails);
    copyCardFields = {
      ...copyCardFields,
      [name]: { value: arr, error: "" },
    };
    props.updateSelectedCardDetails(copyCardFields);
  };

  const selectedValues = (fields: any) => {
    let newFields: any = [];
    fields.forEach((key: string) => {
      {
        dropdownLists?.fuelType && dropdownLists?.fuelType.forEach((list: any) => {
          if (list.code === key) {
            newFields.push(list.displayName);
          }
        });
      }
    });
    return (newFields as string[]).join(", ");
  };
  //get field input values
  const getInputValues = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { name, value } = event.currentTarget;

    let copyCardFields = lodash.cloneDeep(selectedCardDetails);
    if (
      event.target.name === "mobileNumber" ||
      event.target.name === "yearOfReg"
    ) {
      if (isOnlyNumbers(event.target.value)) {
        copyCardFields = {
          ...copyCardFields,

          [name]: { value: value, error: "" },
        };
      }
    } else {
      copyCardFields = {
        ...copyCardFields,
        [name]: { value: value, error: "" },
      };
    }

    props.updateSelectedCardDetails(copyCardFields);
    if (props.navigationFlag) {
      if (value) {
        CARD_CONTEXT.handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
      }
    }
  };

  //get dropdown values
  const getSelectValues = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    let copyCardFields = lodash.cloneDeep(selectedCardDetails);
    copyCardFields = {
      ...copyCardFields,
      [name]: { value: value, error: "" },
    };
    props.updateSelectedCardDetails(copyCardFields);
    if (props.navigationFlag) {
      if (value) {
        CARD_CONTEXT.handleIncompleteStep(formSections.CARD_MANAGEMENT, true);
      }
    }
  };

  //render function for all card fields
  const renderCardFields = () => {
    // console.log("selectedCardDetails");
    // console.log(
    //   "selectedCardDetails",
    //   store.smartfleetPrimaryMobileNumber,
    //   selectedCardDetails
    // );

    let mobileNumberCustomTextField: any = "";
    // if (CARD_CONTEXT.cardObj.selectedCardId === 1) {
    //   mobileNumberCustomTextField = (
    //     <>
    //       <CustomLabel htmlFor="card-mgmt-name-n-card">
    //         Mobile Number{" "}
    //         {CARD_CONTEXT.selectedCardType === "virtual" ? "*" : ""}
    //         &nbsp;&nbsp;&nbsp;
    //         <CustomTooltip
    //           enterTouchDelay={0}
    //           disableFocusListener
    //           title=" Mobile Number of the Primary User in the Basic Profile section"
    //           placement="bottom-start"
    //         >
    //           <img
    //             src={InfoIcon}
    //             alt="Info for Vehicle Number"
    //             className={`${styles.infoRight}`}
    //           ></img>
    //         </CustomTooltip>
    //       </CustomLabel>
    //       <CustomTextField
    //         disabled={true}
    //         id="card-mgmt-mobile-number"
    //         // placeholder="9820098200"
    //         variant="outlined"
    //         size="small"
    //         name="mobileNumber"
    //         className={`m-0`}
    //         inputProps={{ maxLength: 10 }}
    //         // onChange={(e: any) => getInputValues(e)}
    //         error={!!selectedCardDetails?.mobileNumber.error}
    //         helperText={
    //           selectedCardDetails?.mobileNumber.error &&
    //           selectedCardDetails?.mobileNumber.error
    //         }
    //         InputProps={{
    //           endAdornment: selectedCardDetails?.mobileNumber.error && (
    //             <InputAdornment position="end">
    //               <CustomSvgIcon iconsource={WarningIcon} />
    //             </InputAdornment>
    //           ),
    //           className: styles.mobileNumberDisabled,
    //         }}
    //         value={
    //           store.smartfleetPrimaryMobileNumber !== ""
    //             ? store.smartfleetPrimaryMobileNumber
    //             : ""
    //         }
    //       />
    //     </>
    //   );
    // } else {
    mobileNumberCustomTextField = (
      <>
        <CustomLabel
          htmlFor="card-mgmt-name-n-card"
          className={`d-flex justify-content-between`}
        >
          Mobile Number {CARD_CONTEXT.selectedCardType === "virtual" ? "*" : ""}
          &nbsp;&nbsp;&nbsp;
          {CARD_CONTEXT.selectedCardType === "physical" ? (
            <CustomTooltip
              enterTouchDelay={0}
              disableFocusListener
              title=" Make fuel transactions using this mobile number and OTP."
              placement="bottom-start"
            >
              <img
                src={InfoIcon}
                alt="Info for Mobile Number"
                className={`${styles.infoRight}`}
              ></img>
            </CustomTooltip>
          ) : null}
        </CustomLabel>
        <CustomTextField
          // disabled={
          //   validator.isMobilePhone(store.username, ["en-IN"]) ||
          //   validator.isMobilePhone(store.assistedCustomerUsername, ["en-IN"])
          // }
          id="card-mgmt-mobile-number"
          placeholder="9820098200"
          variant="outlined"
          size="small"
          name="mobileNumber"
          className={`m-0`}
          inputProps={{ maxLength: 10 }}
          onChange={(e: any) => getInputValues(e)}
          error={!!selectedCardDetails?.mobileNumber.error}
          helperText={
            selectedCardDetails?.mobileNumber.error &&
            selectedCardDetails?.mobileNumber.error
          }
          InputProps={{
            endAdornment: selectedCardDetails?.mobileNumber.error && (
              <InputAdornment position="end">
                <CustomSvgIcon iconsource={WarningIcon} />
              </InputAdornment>
            ),
            // className:
            //   validator.isMobilePhone(store.username, ["en-IN"]) ||
            //   validator.isMobilePhone(store.assistedCustomerUsername, ["en-IN"])
            //     ? styles.disableInput
            //     : null,
          }}
          value={
            selectedCardDetails?.mobileNumber.value !== ""
              ? selectedCardDetails?.mobileNumber.value
              : ""
          }
        />
      </>
    );
    // }
    return (
      <React.Fragment>
        <div className={styles.cardDetailsFieldsSubContainer}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <CustomLabel htmlFor="card-mgmt-name-n-card">
                Name of Card * &nbsp;&nbsp;&nbsp;
                <CustomTooltip
                  enterTouchDelay={0}
                  disableFocusListener
                  title=' Select either "Custom Card Name" or "Vehicle Number"  to identify your card'
                  placement="bottom-start"
                >
                  <img
                    src={InfoIcon}
                    alt="Info for custom card name"
                    className={`${styles.infoRight}`}
                  ></img>
                </CustomTooltip>
              </CustomLabel>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} sm={3}>
              {/* <FormControlLabel
                value="vehicleNumber"
                name="selectedNameOfCard"
                control={
                  <Radio
                    color="primary"
                    checked={
                      selectedCardDetails?.selectedNameOfCard.value ===
                      "vehicleNumber"
                    }
                    onChange={(e: any) => getInputValues(e)}
                  />
                }
                label={
                  <span className={`${styles.radioLabel}`}>Vehicle Number</span>
                }
              /> */}

              {dropdownLists?.nameOfCards && dropdownLists?.nameOfCards.map((list: any, index: number) => {
                if (index == 0) {
                  return (
                    <FormControlLabel
                      value="VehicleNumber"
                      name="selectedNameOfCard"
                      key={list.code}
                      control={
                        <Radio
                          color="primary"
                          checked={
                            selectedCardDetails?.selectedNameOfCard.value ===
                            "VehicleNumber"
                          }
                          onChange={(e: any) => getInputValues(e)}
                        />
                      }
                      label={
                        <span className={`${styles.radioLabel}`}>
                          {" "}
                          {list.displayName}{" "}
                        </span>
                      }
                    />
                  );
                }
              })}
            </Grid>
            <Grid item xs={6} sm={3}>
              {dropdownLists?.nameOfCards && dropdownLists?.nameOfCards.map((list: any, index: number) => {
                if (index == 1) {
                  return (
                    <FormControlLabel
                      value="CustomCardName"
                      name="selectedNameOfCard"
                      key={list.code}
                      className={`mr-0`}
                      control={
                        <Radio
                          color="primary"
                          checked={
                            selectedCardDetails?.selectedNameOfCard.value ===
                            "CustomCardName"
                          }
                          onChange={(e: any) => getInputValues(e)}
                        />
                      }
                      label={
                        <span className={`${styles.radioLabel}`}>
                          {list.displayName}{" "}
                        </span>
                      }
                    />
                  );
                }
              })}
            </Grid>
          </Grid>
          <Grid
            container
            direction={"row"}
            spacing={3}
            id={`grid-${selectedCardNumber}`}
          >
            <Grid item xs={12} sm={6}>
              <CustomLabel
                htmlFor="card-mgmt-name-n-card"
                className={`d-flex justify-content-between`}
              >
                Custom Card Name{" "}
                {selectedCardDetails?.selectedNameOfCard.value ===
                "CustomCardName"
                  ? "*"
                  : ""}
                &nbsp;&nbsp;&nbsp;
                <CustomTooltip
                  enterTouchDelay={0}
                  disableFocusListener
                  title=" Enter a custom card name (Ex: Org Name_01, Branch Name_01, Driver Name / Route No. etc.)"
                  placement="bottom-start"
                >
                  <img
                    src={InfoIcon}
                    alt="Info for custom card name"
                    className={`${styles.infoRight}`}
                  ></img>
                </CustomTooltip>
              </CustomLabel>
              <CustomTextField
                id={`card-mgmt-name-n-card-${selectedCardNumber}`}
                placeholder="John Doe"
                variant="outlined"
                size="small"
                name="nameOnCard"
                className={`m-0`}
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
            <Grid item xs={12} sm={6}>
              {mobileNumberCustomTextField}
            </Grid>
            {/* </Grid>
          <Grid container direction={"row"} spacing={3}> */}
            <Grid item xs={12} sm={6}>
              <CustomLabel
                htmlFor="card-mgmt-name-n-card"
                className={`d-flex justify-content-between`}
              >
                Vehicle Number
                {selectedCardDetails?.selectedNameOfCard.value ===
                "VehicleNumber"
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
                </CustomTooltip>
              </CustomLabel>

              <CustomTextField
                id={`card-mgmt-vehicle-number-${selectedCardNumber}`}
                placeholder="MH01AB1111"
                variant="outlined"
                size="small"
                name="vehicleNumber"
                className={`m-0`}
                inputProps={{ maxLength: 13 }}
                error={!!selectedCardDetails?.vehicleNumber.error}
                helperText={
                  selectedCardDetails?.vehicleNumber.error &&
                  selectedCardDetails?.vehicleNumber.error
                }
                InputProps={{
                  endAdornment: selectedCardDetails?.vehicleNumber.error && (
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

            <Grid item xs={12} sm={6}>
              <CustomLabel htmlFor="card-mgmt-name-n-card">
                Vehicle Make
              </CustomLabel>
              <CustomSelect
                labelId="demo-simple-select-outlined-label"
                id="vehicle-make"
                variant="outlined"
                fullWidth
                name="vehicleMake"
                onChange={(e: any) => getSelectValues(e)}
                value={
                  selectedCardDetails?.vehicleMake.value
                    ? selectedCardDetails?.vehicleMake.value
                    : ""
                }
              >
                <CustomMenuItem value="Select">Select</CustomMenuItem>
                {dropdownLists?.vehicleMake &&  dropdownLists?.vehicleMake.map((list: any, index: number) => {
                  return (
                    <CustomMenuItem key={list.code} value={list.code}>
                      {list.displayName}
                    </CustomMenuItem>
                  );
                })}

                {/* <CustomMenuItem value="Select">Select</CustomMenuItem>
                <CustomMenuItem value="Tata Motors">Tata Motors</CustomMenuItem>
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
                <CustomMenuItem value="SML / ISUZU">SML / ISUZU</CustomMenuItem>
                <CustomMenuItem value="Bharat Benz">Bharat Benz</CustomMenuItem>
                <CustomMenuItem value="Scania">Scania</CustomMenuItem>
                <CustomMenuItem value="Volvo">Volvo</CustomMenuItem>
                <CustomMenuItem value="Maruthi Suzuki">
                  Maruthi Suzuki
                </CustomMenuItem>
                <CustomMenuItem value="Hyundai">Hyundai</CustomMenuItem>
                <CustomMenuItem value="Hyundai">Honda</CustomMenuItem>
                <CustomMenuItem value="Toyota">Toyota</CustomMenuItem>
                <CustomMenuItem value="Renault">Renault</CustomMenuItem>
                <CustomMenuItem value="Ford India">Ford India</CustomMenuItem>
                <CustomMenuItem value="Nissan">Nissan</CustomMenuItem>
                <CustomMenuItem value="Volkswagen">Volkswagen</CustomMenuItem>
                <CustomMenuItem value="Skoda">Skoda</CustomMenuItem>
                <CustomMenuItem value="Others">Others</CustomMenuItem> */}
              </CustomSelect>
            </Grid>
            {/* </Grid>

          <Grid container direction={"row"} spacing={3}> */}
            <Grid item xs={12} sm={6}>
              <CustomLabel htmlFor="card-mgmt-vehicle-type">
                Vehicle Type
              </CustomLabel>
              <CustomSelect
                labelId="demo-simple-select-outlined-label"
                id="vehicle-type"
                variant="outlined"
                fullWidth
                name="vehicleType"
                onChange={(e: any) => getSelectValues(e)}
                value={
                  selectedCardDetails?.vehicleType.value
                    ? selectedCardDetails?.vehicleType.value
                    : ""
                }
              >
                <CustomMenuItem value="Select">Select</CustomMenuItem>
                {dropdownLists?.vehicleType && dropdownLists?.vehicleType.map((list: any, index: number) => {
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
                })}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomLabel htmlFor="card-mgmt-year-of-reg">
                Year of Registration
              </CustomLabel>
              <CustomTextField
                id="card-mgmt-year-of-reg"
                placeholder="2012"
                variant="outlined"
                size="small"
                name="yearOfReg"
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
            {/* </Grid>

          <Grid container direction={"row"} spacing={3}> */}
            <Grid item xs={12} sm={6}>
              <CustomLabel
                htmlFor="card-mgmt-fuel-type"
                className={`d-flex justify-content-between`}
              >
                Fuel Type *&nbsp;&nbsp;&nbsp;
                <CustomTooltip
                  enterTouchDelay={0}
                  disableFocusListener
                  title="Select Fuel Type(s) that should be allowed for this Card."
                  placement="bottom-start"
                >
                  <img
                    src={InfoIcon}
                    alt="Info for Vehicle Number"
                    className={`${styles.infoRight}`}
                  ></img>
                </CustomTooltip>
              </CustomLabel>
              <FormControl
                //error={!!errorMessage.identityProofType}
                error={!!selectedCardDetails?.fuelType.error}
                className="w-100"
              >
                <CustomSelect
                  labelId="demo-simple-select-outlined-label"
                  id="fuel-type"
                  variant="outlined"
                  fullWidth
                  name="fuelType"
                  onChange={(e: any) => handleChangeEvent(e)}
                  // onChange={handleChangeEvent}
                  renderValue={(fields: any) => selectedValues(fields)}
                  multiple
                  error={!!selectedCardDetails?.fuelType.error}
                  // className={`${!selectedCardDetails?.fuelType.error &&
                  //   styles.selectMarginBottom
                  //   }`}
                  value={
                    selectedCardDetails?.fuelType.value
                      ? selectedCardDetails?.fuelType.value
                      : [""]
                  }
                >
                  {/* {fuelTypes.map((name:any) => (
                    <StyledMenuItem key={name} value={name}>
                      <Checkbox
                        color="primary"
                        checked={
                          selectedCardDetails?.fuelType.value.indexOf(name) > -1
                        }
                      />
                      <ListItemText primary={name} />
                    </StyledMenuItem>
                  ))} */}

                  {dropdownLists?.fuelType && dropdownLists?.fuelType.map((list: any, index: number) => {
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
                  })}
                </CustomSelect>
                <FormHelperText>
                  {selectedCardDetails?.fuelType.error &&
                    selectedCardDetails?.fuelType.error}
                </FormHelperText>
              </FormControl>
            </Grid>

            {CARD_CONTEXT.selectedCardType === "physical" ? (
              <Grid item xs={12} sm={6}>
                <CustomLabel
                  htmlFor="card-mgmt-year-of-reg"
                  className={`d-flex justify-content-between`}
                >
                  Advance Card Personalization &nbsp;&nbsp;&nbsp;
                  <CustomTooltip
                    enterTouchDelay={0}
                    disableFocusListener
                    title=" Add a personalized engravings on your physical card (Ex. Nick Name, Branch Name, Tag Name etc.)"
                    placement="bottom-start"
                  >
                    <img
                      src={InfoIcon}
                      alt="Info for card Personalization"
                      className={`${styles.infoRight}`}
                    ></img>
                  </CustomTooltip>
                </CustomLabel>
                <CustomTextField
                  id="card-mgmt-card-personal"
                  placeholder=""
                  variant="outlined"
                  size="small"
                  name="cardPersonalization"
                  className={`m-0`}
                  // error={!!selectedCardDetails?.cardPersonalization.error}
                  // helperText={
                  //   selectedCardDetails?.cardPersonalization.error &&
                  //   selectedCardDetails?.cardPersonalization.error
                  // }
                  // InputProps={{
                  //   endAdornment: selectedCardDetails?.cardPersonalization
                  //     .error && (
                  //       <InputAdornment position="end">
                  //         <CustomSvgIcon iconsource={WarningIcon} />
                  //       </InputAdornment>
                  //     ),
                  // }}
                  inputProps={{ maxLength: 30 }}
                  onChange={(e: any) => getInputValues(e)}
                  value={
                    selectedCardDetails?.cardPersonalization.value
                      ? selectedCardDetails?.cardPersonalization.value
                      : ""
                  }
                />
                {/* <p className={`mt-1 ${styles.uploadtext}`}>
                  Maximum of 30 characters.
                </p> */}
              </Grid>
            ) : null}
          </Grid>
        </div>
      </React.Fragment>
    );
    // }
    // });
  };

  useEffect(() => {
    // console.log("in CardDetailsFields");
    setSelectedCardNumber(CARD_CONTEXT.cardObj.selectedCardId);
  }, [CARD_CONTEXT.cardObj]);

  return (
    <>
      <div>
        <Grid
          container
          className={
            props.navigationFlag
              ? styles.cardDetailsMainContainer
              : styles.cardDetailsMainContainerAddCards
          }
        >
          {props.navigationFlag ? (
            <Hidden xsDown>
              <Grid item xs={5}>
                <img
                  src={selectedCardNumber === 1 ? NextIconDisable : NextIcon}
                  onClick={(e) => previousCard(e)}
                  className={`${styles.cardDetailsPreviousIcon} ${
                    selectedCardNumber === 1 ? styles.prevNextBgDisabled : ""
                  }`}
                />
              </Grid>
              <Grid item xs={5}>
                <Typography color="textPrimary" variant="h5">
                  {`Card  #${selectedCardNumber}`}
                </Typography>
              </Grid>
              <Grid item xs={2} className={styles.textAlignEnd}>
                <img
                  src={
                    CARD_CONTEXT.cardCounter.val.length === selectedCardNumber
                      ? NextIconDisable
                      : NextIcon
                  }
                  onClick={(e) => nextCard(e)}
                  className={`${styles.prevNextBg}  ${
                    CARD_CONTEXT.cardCounter.val.length === selectedCardNumber
                      ? styles.prevNextBgDisabled
                      : ""
                  }`}
                />
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  &nbsp;
                </Grid>
              </Grid>
            </Hidden>
          ) : (
            <></>
          )}

          {renderCardFields()}
        </Grid>
      </div>
    </>
  );
};

export default CardDetailsFields;
