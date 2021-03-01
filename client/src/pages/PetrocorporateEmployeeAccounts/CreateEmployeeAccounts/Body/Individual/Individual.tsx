import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  Paper,
  Container,
  Typography,
  Grid,
  Radio,
  Hidden,
} from "@material-ui/core";
import styles from "./Individual.module.scss";
import CustomDateField from "../../../../../components/CustomDateField/CustomDateField";
import { CustomButton } from "../../../../../components/CustomButton/CustomButton";
import { CustomLabel } from "../../../../../components/CustomTextField/CustomLabel";
import CustomTextField from "../../../../../components/CustomTextField/CustomTextField";
import validator from "validator";
import { validationErrorMessage } from "../../../../../utility/validations/validationErrorMessages";
import {
  isVailidName,
  isValidMobileNumber,
  isValidEmailAddress
} from "../../../../../utility/validations/validations";
import moment from "moment";

import { Popup1 } from "../../../../../components/CustomPopups/Popup1/Popup1";
import { Popup2 } from "../../../../../components/CustomPopups/Popup2/Popup2";
import { useRouter } from "next/router";

import Icon from "@material-ui/core/Icon"
const UserIcon = "/W_Icon_User.svg";
const CalendarIcon = "/W_Icons_Calendar.svg";
// import { useSelector } from "react-redux";

interface IErrorMessages {
  name?: string;
  mobileNumber?: string;
  email?: string;
  dateOfBirth?: string;
}

const Individual = (props: any) => {
  const { open, close } = props;
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSubmitSuccessfulModal, setOpenSubmitSuccessfulModal] = useState(
    false
  );
  const initFields = {
    name: "",
    mobileNumber: "",
    employeeID: "",
    designation: "",
    dateOfBirth: "",
    email: "",
    gender: "",
  };

  const [fields, setFields] = useState(initFields);
  const [isNameEmpty, setIsNameEmpty] = useState(true);
  const [isMobileEmpty, setIsMobileEmpty] = useState(true);
  const [isEmailEmpty, setIsEmailEmpty] = useState(true);
  let maxValidDate = useRef("");
  if (maxValidDate.current === "") {
    let eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    maxValidDate.current = eighteenYearsAgo.toISOString().substring(0, 10);
    // console.log(maxValidDate);
  }

  const handleDatefieldChange = (date: Date) => {
    // console.log(date);
    setSelectedDate(date);
    if (date !== null && !isNaN(date.getTime())) {
      // Valid Date
      let changedDate = moment(date).format("DD/MM/YYYY");
      setFields({ ...fields, dateOfBirth: changedDate });
    }
  };

  const handleEmailfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.name === "email") {
      event.target.value ? setIsEmailEmpty(false) : setIsEmailEmpty(true);
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        email: "",
      }));
    }
    setFields({ ...fields, [event.target.name]: event.target.value });
  }

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    console.log(event.target.name, event.target.value);
    if (event.target.name === "mobileNumber") {
      const regexMobileNumber = /^[0-9]*$/;
      if (regexMobileNumber.test(event.target.value)) {
        setFields({ ...fields, [event.target.name]: event.target.value });
        event.target.value ? setIsMobileEmpty(false) : setIsMobileEmpty(true);
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          mobileNumber: "",
        }));
      }
    } else {
      if (event.target.name === "name") {
        event.target.value ? setIsNameEmpty(false) : setIsNameEmpty(true);
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          name: "",
        }));
      }
      setFields({ ...fields, [event.target.name]: event.target.value });
    }
  };

  const showDateError = (error: ReactNode): void => {
    // console.log(error);
    if (error) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const validate = (): Boolean => {
    let isError: boolean = false;

    // Validate Name
    if (!fields.name) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        name: validationErrorMessage.REQUIRED,
      }));
    } else if (!isVailidName(fields.name)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        name: validationErrorMessage.INVALID_NAME,
      }));
    }

    // Validate Mobile Number
    if (!fields.mobileNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        mobileNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidMobileNumber(fields.mobileNumber)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        mobileNumber: validationErrorMessage.MOBILE_NUMBER,
      }));
    }

    // Validate Email
    if (fields.email && !isValidEmailAddress(fields.email)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        email: validationErrorMessage.EMAIL,
      }));
    }

    // Validate Date of Birth
    if (
      fields.dateOfBirth !== null &&
      Date.parse(maxValidDate.current) < Date.parse(fields.dateOfBirth!)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        dateOfBirth: validationErrorMessage.DATE_OF_BIRTH,
      }));
    }
    console.log(isError, dateError);
    if (!isError && !dateError) {
      // If all validations pass
      // console.log("All validations pass-----");
      setErrorMessage({});
    }
    return isError || dateError;
  };

  const handleSave = (event: React.MouseEvent<HTMLElement>): void => {
    // let finalData = { ...checkboxState, othersDesc: othersDesc };
    setErrorMessage({});
    event.preventDefault();
    let hasError = validate();
    if (!hasError) {
      console.log("fields in handleSave");
      console.log(fields);
      setOpenSubmitSuccessfulModal(true);
    }
  };

  const handleCancel = () => {
    setOpenConfirmModal(true);
  };
  const handleCloseAndSubmitConfirmModal = () => {
    router.push("/petrocorp/employee-accounts");
  };

  const handleDoneModal = () => {
    router.push("/petrocorp/employee-accounts");
  };

  //disable save button if no reason is given
  const saveButtonDisabled = () => {
    return isNameEmpty || isMobileEmpty ? true : false;
  };

  // const store: any = useSelector((state) => state);
  return (
    <>
      <Container maxWidth="lg" className={`px-0`}>
        <div className={`py-2 py-sm-3 ${styles.headerPaper}`}>
          <Hidden smUp>
            <div
              className={`w-100 d-flex align-items-center justify-content-end`}
            >
              <Typography
                color="error"
                variant="body1"
                data-test-id="indicates-mandatory-fields"
              >
                * indicates mandatory fields
              </Typography>
            </div>
          </Hidden>
          <form className="w-100" autoComplete="off">
            <div className={`w-100 ${styles.content}`}>
              <div
                className={`w-100 d-flex align-items-center justify-content-between ${styles.contentHeader}`}
              >
                <div className="d-flex align-items-center ">
                  <img
                    className="p-3"
                    src={UserIcon}
                    data-test-id="user-icon-img"
                  ></img>
                  <Typography
                    color="primary"
                    variant="h5"
                    data-test-id="employee-details-title"
                  >
                    Employee Details
                  </Typography>
                </div>
                <Hidden xsDown>
                  <div className="px-3">
                    <Typography
                      color="error"
                      variant="body1"
                      data-test-id="indicates-mandatory-fields"
                    >
                      * indicates mandatory fields
                    </Typography>
                  </div>
                </Hidden>
              </div>
              <Grid container className="py-3">
                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="name">Employee Name *</CustomLabel>
                  <CustomTextField
                    id="name"
                    placeholder="John Doe"
                    variant="outlined"
                    error={!!errorMessage.name}
                    name="name"
                    value={fields.name}
                    onChange={handleTextfieldChange}
                    helperText={errorMessage.name && errorMessage.name}
                    inputProps={{ maxLength: 100 }}
                    className={`${styles.inputBoxSizing}`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="mobile-number">
                    Mobile No. *
                  </CustomLabel>
                  <CustomTextField
                    id="mobile-number"
                    placeholder="9820098200"
                    variant="outlined"
                    error={!!errorMessage.mobileNumber}
                    name="mobileNumber"
                    value={fields.mobileNumber}
                    onChange={handleTextfieldChange}
                    helperText={errorMessage.mobileNumber && errorMessage.mobileNumber}
                    inputProps={{ maxLength: 10 }}
                    className={`${styles.inputBoxSizing}`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="employee-id">Employee ID</CustomLabel>
                  <CustomTextField
                    id="employee-id"
                    placeholder="123456"
                    variant="outlined"
                    name="employeeID"
                    value={fields.employeeID}
                    onChange={handleTextfieldChange}
                    inputProps={{ maxLength: 100 }}
                    className={`${styles.inputBoxSizing}`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="designation">Designation</CustomLabel>
                  <CustomTextField
                    id="designation"
                    placeholder="Manager"
                    variant="outlined"
                    name="designation"
                    value={fields.designation}
                    onChange={handleTextfieldChange}
                    inputProps={{ maxLength: 100 }}
                    className={`${styles.inputBoxSizing}`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="date-of-birth">
                    Date of Birth (DD/MM/YYYY)
                  </CustomLabel>
                  <CustomDateField
                    autoOk
                    variant="dialog"
                    cancelLabel=""
                    okLabel=""
                    inputVariant="outlined"
                    format="dd/MM/yyyy"
                    id="date-of-birth"
                    value={selectedDate}
                    placeholder="20/10/1990"
                    onChange={handleDatefieldChange}
                    maxDate={maxValidDate.current}
                    maxDateMessage={
                      validationErrorMessage.DATE_EIGHTEEN_YEARS_OLD
                    }
                    onError={showDateError}
                    keyboardIcon={<img src={CalendarIcon} />}
                    className={`${styles.inputBoxSizing}`}
                  />
                </Grid>

                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="email">Email ID</CustomLabel>
                  <CustomTextField
                    id="email"
                    placeholder="johndoe@example.com"
                    variant="outlined"
                    error={!!errorMessage.email}
                    name="email"
                    value={fields.email}
                    onChange={handleEmailfieldChange}
                    helperText={errorMessage.email && errorMessage.email}
                    inputProps={{ maxLength: 256 }}
                    className={`${styles.inputBoxSizing}`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className="px-3">
                  <CustomLabel htmlFor="gender">Gender</CustomLabel>
                  <div className="d-flex align-items-center">
                    <div className="pr-2">
                      <Radio
                        checked={fields.gender === "male"}
                        onChange={handleTextfieldChange}
                        value="male"
                        color="primary"
                        name="gender"
                        className="pl-0 pr-1"
                      />
                      <CustomLabel className={`${styles.radioLabel}`}>
                        Male
                      </CustomLabel>
                    </div>
                    <div className="pr-2">
                      <Radio
                        checked={fields.gender === "female"}
                        onChange={handleTextfieldChange}
                        value="female"
                        color="primary"
                        name="gender"
                        className="pl-0 pr-1"
                      />
                      <CustomLabel className={`${styles.radioLabel}`}>
                        Female
                      </CustomLabel>
                    </div>
                    <div className="pr-2">
                      <Radio
                        checked={fields.gender === "other"}
                        onChange={handleTextfieldChange}
                        value="other"
                        color="primary"
                        name="gender"
                        className="pl-0 pr-1"
                      />
                      <CustomLabel className={`${styles.radioLabel}`}>
                        Other
                      </CustomLabel>
                    </div>
                  </div>
                </Grid>
              </Grid>
              {/* ACTION BUTTONS */}
              <div className="w-100 p-3 d-flex justify-content-sm-end justify-content-between align-items-center">
                <CustomButton
                  onClick={handleCancel}
                  variant="outlined"
                  color="primary"
                  className={`${styles.backToEnrolmentBtn} mx-sm-4`}
                >
                  CANCEL
                </CustomButton>
                <CustomButton
                  onClick={(e) => handleSave(e)}
                  variant="contained"
                  color="primary"
                  disabled={saveButtonDisabled()}
                  data-test-id="submit-button"
                // className="mr-4"
                >
                  SUBMIT
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </Container>
      <Popup1
        open={openConfirmModal}
        close={() => setOpenConfirmModal(false)}
        closeAndSubmit={handleCloseAndSubmitConfirmModal}
        title="Are you sure you want to cancel ?"
        description="Any details provided so far will be deleted. "
      ></Popup1>
      <Popup2
        open={openSubmitSuccessfulModal}
        close={() => setOpenSubmitSuccessfulModal(false)}
        closeAndSubmit={handleDoneModal}
        title="Submission Successful"
        description="Employee account successfully created."
      ></Popup2>
    </>
  );
};

export default Individual;
