import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  InputAdornment,
  Hidden,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import styles from "./SmartfleetRegistrationForm.module.scss";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import { isValidFAId } from "../../utility/validations/validations";
import { formSections } from "./types/formSections.enum";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  // setPAYMENT_ISPAYMENTAPPLICABLE,
  setLoader,
  setPaymentFAID,
} from "src/redux/actions/actions";
import {
  postFleetAccount,
  postFleetAccountAvailability,
  postFleetAccountReset,
} from "../../lib/api/smartfleet/smartfleet";
import { id } from "date-fns/esm/locale";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const AvailableIcon = "/W_Icons_Tick.svg";
const WarningIcon = "/W_Icons_Warning.svg";

export const FAIdSelection = (props: any) => {
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const { handleCompleteStep, handleIncompleteStep } = props;
  const [selectedValue, setSelectedValue] = React.useState("standard");
  const initFields = {
    isCustom: false,
    newFAId: "",
    fullFAId: "",
    hasFAId: false,
  };
  const [fields, setFields] = React.useState(initFields);
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const [isSectionEditable, setIsSectionEditable] = React.useState(true);

  const [
    faidAvailableMessage,
    setFaidAvailableMessage,
  ] = React.useState<string>("");
  const [faidErrorMessage, setFaidErrorMessage] = React.useState<string>("");

  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  useEffect(() => {
    const { initialData } = props;
    if (initialData) {
      console.log("initialData", initialData);
      let initialFields = { ...initFields };
      if (initialData?.isCustom) {
        initialFields = {
          isCustom: initialData?.isCustom,
          newFAId: initialData?.fleetAccountId
            ? initialData?.fleetAccountId.substr(
                initialData?.fleetAccountId.length - 4
              )
            : "",
          fullFAId: initialData?.fleetAccountId,
          hasFAId: initialData?.fleetAccountId ? true : false,
        };
      }
      console.log("initialFields", initialFields);
      const selection = initialData?.isCustom ? "custom" : "standard";
      setSelectedValue(selection);
      props.faIdCallBack(selection);
      setIsSectionEditable(initialData?.editable || true);
      setFields(initialFields);
      if (initialData?.completed) {
        handleCompleteStep(formSections.FA_ID_SELECTION, true);
        handleIncompleteStep(formSections.FA_ID_SELECTION, false);
      }
    }
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    console.log("event.target.name", (event.target as HTMLInputElement).value);
    console.log("event.target.checked", event.target.checked);
    setSelectedValue((event.target as HTMLInputElement).value);
    //props.faIdCallBack(event.target.checked);
    props.faIdCallBack((event.target as HTMLInputElement).value);
    setFields({
      ...fields,
      isCustom: event.target.value === "custom" ? true : false,
    });
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFields({ ...fields, [event.target.name]: event.target.value });
    // setFaidErrorMessage("");
  };

  const checkFAIDAvailability = async (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (!isSectionEditable) {
      return false;
    }
    event.preventDefault();
    const isError = validate("checkAvailability");
    console.log("isError", isError);

    if (!isError) {
      // If all validations pass, API call.
      console.log("All validations pass-----");

      const finalData = {
        ...fields,
      };
      console.log(finalData);

      const res: any = await postFleetAccountAvailability(finalData);
      console.log("postFleetAccount res : ", res);

      if (res?.status === "success" || res?.status === "updated") {
        setFaidErrorMessage("");
        setFaidAvailableMessage(validationErrorMessage.FA_ID_AVAILABLE);
        setFields({
          ...fields,
          fullFAId: res?.data?.fleetAccountId,
        });
      } else if (res?.status === "failure") {
        setFaidErrorMessage(res?.message);
        setFaidAvailableMessage("");
      } else {
        if (res?.errors) {
          res?.errors.forEach((element: any) => {
            if (!element.hasOwnProperty("subject")) {
              console.log("key not present : ", element?.subject);
              setApiOtherErrorMessage(element?.message);
            } else {
              // setFaidErrorMessage(element?.message);
              setFaidErrorMessage(validationErrorMessage.FA_ID_NOT_AVAILABLE);
            }
          });
          setFaidAvailableMessage("");
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
    }
  };

  const validate = (trigger: any) => {
    let isError: boolean = false;
    console.log(fields);
    if (selectedValue === "custom") {
      if (
        (trigger === "checkAvailability" && !isValidFAId(fields.newFAId)) ||
        (trigger === "handleSave" && fields.fullFAId === "")
      ) {
        isError = true;
        setFaidAvailableMessage("");
        setFaidErrorMessage(validationErrorMessage.FA_ID_INVALID);
      }
    }

    // if (
    //   selectedValue === "custom" &&
    //   (fields.fullFAId === "" || !isValidFAId(fields.newFAId))
    // ) {
    //   isError = true;
    //   setFaidAvailableMessage("");
    //   setFaidErrorMessage(validationErrorMessage.FA_ID_INVALID);
    // }
    return isError;
  };

  const handleClear = async (event: React.MouseEvent<HTMLElement>) => {
    // setFields(initFields);
    event.preventDefault();
    if (!isSectionEditable) {
      return false;
    }
    if (fields.isCustom) {
      if (fields.hasFAId && fields.fullFAId !== "") {
        const finalData = {
          ...fields,
        };
        console.log(finalData);

        const res: any = await postFleetAccountReset(finalData);
        console.log("postFleetAccount res : ", res);

        if (res?.status === "success" || res?.status === "updated") {
          setFaidErrorMessage("");
          setFaidAvailableMessage(res?.message);
          setFields({
            ...fields,
            hasFAId: false,
            newFAId: "",
            fullFAId: "",
          });
          handleIncompleteStep(formSections.FA_ID_SELECTION, true);
        } else if (res?.status === "failure") {
          setFaidErrorMessage(res?.message);
          setFaidAvailableMessage("");
        } else {
          if (res?.errors) {
            res?.errors?.forEach((element: any) => {
              if (!element.hasOwnProperty("subject")) {
                console.log("key not present : ", element?.subject);
                setApiOtherErrorMessage(element?.message);
              } else {
                // setFaidErrorMessage(element?.message);
                setFaidErrorMessage(validationErrorMessage.FA_ID_NOT_AVAILABLE);
              }
            });
            setFaidAvailableMessage("");
          } else {
            setShowSnackbar(true);
            setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
            setAlertType("error");
          }
        }
      } else {
        setFaidErrorMessage("");
        setFaidAvailableMessage("");
        setFields({
          ...fields,
          hasFAId: false,
          newFAId: "",
          fullFAId: "",
        });
      }
    }
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable || (selectedValue === "custom" && fields.hasFAId)) {
      return false;
    }
    event.preventDefault();
    const isError = validate("handleSave");
    // If all validations pass
    if (!isError) {
      // If all validations pass, API call to submit basic profile data
      console.log("All validations pass-----");

      dispatch(setLoader(true));
      const finalData = {
        ...fields,
      };
      console.log(finalData);

      const res: any = await postFleetAccount(finalData);
      console.log("postFleetAccount res : ", res);
      if (res?.status === "success" || res?.status === "updated") {
        setFaidErrorMessage("");
        setFaidAvailableMessage("");
        if (selectedValue === "custom") {
          setFields({
            ...fields,
            hasFAId: true,
          });
        } else {
          setFields({
            isCustom: false,
            hasFAId: false,
            newFAId: "",
            fullFAId: "",
          });
        }
        setShowSnackbar(true);
        setSnackbarMessage(res?.message);
        setAlertType("success");
        dispatch(setPaymentFAID(selectedValue));
      } else if (res?.status === "failure") {
        setFaidErrorMessage(res?.message);
        setFaidAvailableMessage("");
        setShowSnackbar(true);
        setSnackbarMessage(res?.message);
        setAlertType("error");
      } else {
        if (res?.errors) {
          const errorObj: any = {};
          res?.errors.forEach((element: any) => {
            if (!element.hasOwnProperty("subject")) {
              console.log("key not present : ", element?.subject);
              setApiOtherErrorMessage(element?.message);
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.subject);
              setAlertType("error");
            } else {
              // setFaidErrorMessage(element?.message);
              setFaidErrorMessage(validationErrorMessage.FA_ID_NOT_AVAILABLE);
            }
            setShowSnackbar(true);
            setSnackbarMessage(element?.message + " " + element?.subject);
            setAlertType("error");
          });
          setFaidAvailableMessage("");
        } else {
          setShowSnackbar(true);
          //TODO Change and check with eknath if backend down
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      dispatch(setLoader(false));
      if (res?.data?.completed) {
        handleCompleteStep(formSections.FA_ID_SELECTION, true);
        handleIncompleteStep(formSections.FA_ID_SELECTION, false);
      } else {
        handleIncompleteStep(formSections.FA_ID_SELECTION, true);
      }
    } else {
      handleIncompleteStep(formSections.FA_ID_SELECTION, true);
    }
    //
  };

  return (
    <form className="w-100">
      <div
        className="mt-0 mt-sm-3 px-4 px-sm-0"
        data-test-id="my-account-my-id"
      >
        <Typography color="primary" variant="h5">
          My Account My ID
        </Typography>
        <hr className={`mt-3 ${styles.headerDivider}`}></hr>
        <Typography variant="body1">
          With Bharat Petroleum SmartFleet Loyalty Program,{" "}
          {store.assistedFlow ? "customer" : "you"} can now select an account
          number of {store.assistedFlow ? "their" : "your own"} choice.
        </Typography>
        <Typography variant="body1">
          {store.assistedFlow ? "They" : "You"} can choose the last 4 digits of
          the {store.assistedFlow ? "Smartfleet Account ID" : "FA ID"}.
        </Typography>

        <hr className={`mt-3 ${styles.headerDivider}`}></hr>
        <Box className="d-flex align-items-center mb-3">
          <RadioGroup
            aria-label="faIdSelection"
            name="isCustom"
            value={selectedValue}
            onChange={handleCheckboxChange}
          >
            <FormControlLabel
              value="standard"
              data-test-id="standard-faid"
              control={<Radio color="primary" />}
              label={
                store.assistedFlow
                  ? "Customer wants a standard FA ID"
                  : "I want a standard FA ID"
              }
            />
            <FormControlLabel
              value="custom"
              data-test-id="custom-faid"
              control={<Radio color="primary" />}
              label={
                store.assistedFlow
                  ? "Customer wants a custom FA ID"
                  : "I want a custom FA ID"
              }
            />
            <Typography className={styles.alignTextRadio} variant="body1">
              This feature is available at a cost of{" "}
              <span className={`${styles.boldText}`}>&#8377; 100</span>
            </Typography>
          </RadioGroup>
        </Box>
        {selectedValue === "custom" && (
          <hr className={`mt-2 ${styles.headerDivider}`}></hr>
        )}
      </div>

      {selectedValue === "custom" && (
        <div className="mt-3 px-4 px-sm-0">
          <Typography
            color="primary"
            variant="h5"
            data-test-id="choose-your-own-faid"
          >
            Choose your own FA ID
          </Typography>
          <Grid
            container
            spacing={5}
            alignItems="center"
            className="py-4 py-sm-5"
          >
            <Grid item sm={4} xs={10} className="py-0">
              <CustomLabel htmlFor="new-fa-id">New FA ID</CustomLabel>
              <CustomTextField
                disabled={fields.hasFAId || !isSectionEditable}
                className="mb-0"
                id="new-fa-id"
                placeholder="XXXX"
                variant="outlined"
                error={!!faidErrorMessage}
                name="newFAId"
                value={fields.newFAId}
                onChange={handleTextfieldChange}
                helperText={
                  faidAvailableMessage
                    ? faidAvailableMessage && faidAvailableMessage
                    : faidErrorMessage && faidErrorMessage
                }
                inputProps={{ maxLength: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">FA XXXXXX</InputAdornment>
                  ),
                  endAdornment: faidErrorMessage ? (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ) : faidAvailableMessage ===
                    "FA ID is available. Please click on save to use your new FA ID." ? (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={AvailableIcon} />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
                }}
              />
            </Grid>

            {/* Check avail and reset button for desktop */}
            <Hidden xsDown>
              <Grid
                item
                className={`p-0 ${
                  faidAvailableMessage || faidErrorMessage
                    ? ""
                    : "align-self-end"
                }`}
              >
                <CustomButton
                  disabled={fields.hasFAId}
                  onClick={checkFAIDAvailability}
                  variant="outlined"
                  color="primary"
                  data-test-id="check-availability-button"
                >
                  Check Availability
                </CustomButton>
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={2}
                className={`${
                  faidAvailableMessage || faidErrorMessage ? "" : "pb-0"
                }`}
              >
                <span
                  onClick={resetNewFAIdField}
                  className={`${styles.link}`}
                  data-test-id="reset-button"
                >
                  Reset
                </span>
              </Grid> */}
            </Hidden>

            {/* Check avail and reset button  for mobile */}
            <Hidden smUp>
              {/* <Grid
                item
                xs={2}
                sm={2}
                className={`pl-0 ${
                  faidAvailableMessage || faidErrorMessage ? "" : "pb-0"
                }`}
              >
                <span
                  onClick={resetNewFAIdField}
                  className={`${styles.link}`}
                  data-test-id="reset-button"
                >
                  Reset
                </span>
              </Grid> */}
              <Grid
                xs={12}
                item
                className={`pb-0 ${
                  faidAvailableMessage || faidErrorMessage
                    ? ""
                    : "align-self-end"
                }`}
              >
                <CustomButton
                  disabled={fields.hasFAId}
                  onClick={checkFAIDAvailability}
                  variant="outlined"
                  color="primary"
                  className="w-100"
                  data-test-id="check-availability-button"
                >
                  Check Availability
                </CustomButton>
              </Grid>
            </Hidden>
          </Grid>
        </div>
      )}
      {/* For Mobile */}
      <Hidden smUp>
        <Grid container spacing={4} className="mb-0 px-4 px-sm-0 pt-2">
          <Grid item xs={6} sm={4} className="py-0">
            <CustomButton
              onClick={(e) => handleClear(e)}
              variant="outlined"
              color="primary"
              className="w-100"
              data-test-id="sf-fs-clear-button"
            >
              Clear
            </CustomButton>
          </Grid>
          <Grid item xs={6} sm={4} className="py-0">
            <CustomButton
              // disabled={fields.isCustom && fields.hasFAId}
              disabled={fields.isCustom && fields.fullFAId === ""}
              onClick={(e) => handleSave(e)}
              variant="contained"
              color="primary"
              className="w-100"
              data-test-id="sf-fs-save-button"
            >
              Save
            </CustomButton>
          </Grid>
        </Grid>
      </Hidden>

      {/* For Desktops */}
      <Hidden xsDown>
        <div className="w-100 mt-2 d-flex justify-content-between align-items-center">
          <hr className={`${styles.headerDivider} w-75 mx-0`}></hr>
          <CustomButton
            onClick={(e) => handleClear(e)}
            variant="outlined"
            color="primary"
            className="mx-4"
            data-test-id="sf-fs-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            // disabled={fields.isCustom && fields.hasFAId}
            disabled={fields.isCustom && fields.fullFAId === ""}
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="sf-fs-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Hidden>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </form>
  );
};
