import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomCard from "../../components/CustomCard/CustomCard";
import {
  Typography,
  Container,
  InputAdornment,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import styles from "./EnrollCustomer.module.scss";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import validator from "validator";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import { useDispatch } from "react-redux";
import { isValidMobileNumber, isValidEmailAddress } from "../../utility/validations/validations";
import {
  assignAssistedCustomerUser,
  unsetAssistedFlow,
} from "../../redux/actions/actions";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const NoteTakingImage = "/Note_Taking.svg";
const WarningIcon = "/W_Icons_Warning.svg";

const useStyles = makeStyles({
  root: {
    // padding: "2rem 4rem",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 600,
  },
  label: {
    lineHeight: 1.36,
    textAlign: "left",
  },
  btnLarge: {
    width: "100%",
    height: "50px",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.6px",
  },
  bold: {
    fontWeight: 600,
  },
  cursorPointer: {
    cursor: "pointer",
  },
});

const EnrollCustomer = (): JSX.Element => {
  const router = useRouter();
  const store: any = useSelector((state) => state);
  const classes = useStyles();
  const [isBusinessTypeSelected, setIsBusinessTypeSelected] = useState<boolean>(
    false
  );
  const dispatch = useDispatch();
  // username is mobile number or email
  const [username, setUsername] = React.useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [
    businessTypeErrorMessage,
    setBusinessTypeErrorMessage,
  ] = React.useState("");

  // customer name
  const [customerName, setCustomerName] = useState("");

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
    setUsernameErrorMessage("");
  };

  const dispatchAssistecCustomerUsername = (
    username: string,
    customerName: string
  ) => {
    dispatch(assignAssistedCustomerUser(username, customerName));
  };

  const validate = (): void => {
    let isError: boolean = false;
    // Validate email or mobile number
    const isUsernameValid: boolean =
      //validator.isMobilePhone(username, ["en-IN"]) ||
      isValidMobileNumber(username) || isValidEmailAddress(username);

    if (!isBusinessTypeSelected) {
      isError = true;
      setBusinessTypeErrorMessage(validationErrorMessage.REQUIRED);
    }

    if (!isUsernameValid) {
      isError = true;
      setUsernameErrorMessage(validationErrorMessage.EMAIL_OR_MOBILE);
    }

    // If all validations pass
    if (!isError) {
      setUsernameErrorMessage("");
      setBusinessTypeErrorMessage("");
      console.log("ASSISTED CUSTOMER USERNAME ------ ", username);
      dispatchAssistecCustomerUsername(username, customerName);
      redirectToOtp();
    }
  };

  const redirectToOtp = (): void => {
    // props.history.push({
    //   pathname: "/otp",
    //   state: { redirectedFrom: "enrollCustomer", formType: businessType },
    // });
    router.push({
      pathname: "/otp",
      query: { redirectedFrom: "enrollCustomer", formType: businessType },
    });
  };

  const redirectToServiceRequest = (): void => {
    dispatch(unsetAssistedFlow());
    // props.history.push("/service-requests");
    router.push("/service-requests");
  };

  const handleGetOtp = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    validate();
  };

  const [businessType, setBusinessType] = React.useState("");
  // select payment type
  const selectBusinessType = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === "1" || event.target.value === "2") {
      setBusinessType("b2b");
    } else if (event.target.value === "3") {
      setBusinessType("b2c");
    }
    setIsBusinessTypeSelected(true);
    setBusinessTypeErrorMessage("");
  };
  console.log(store);
  return (
    <>
      <Container
        maxWidth="sm"
        className={`p-0 d-flex flex-column justify-content-between ${styles.businessContainer
          } ${store.assistedFlow ? "h-100" : ""}`}
      >
        <CustomCard
          className={`d-flex flex-column justify-content-between ${styles.otpCard}`}
        >
          <div className={`d-flex flex-column pt-3`}>
            <div className={`d-flex align-items-center pt-2`}>
              <div
                className={`d-flex p-1 w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography
                  className={`pl-1 text-align: center ${styles.title}`}
                  color="primary"
                >
                  Enroll a Customer
                </Typography>
              </div>
            </div>
          </div>
          <img className="p-3" src={NoteTakingImage} alt="NoteTakingImage" />
          <div
            className={`d-flex flex-column justify-content-center align-items-center pt-4 text-left`}
          >
            <form
              noValidate
              autoComplete="off"
              className={`${styles.formContainer}`}
            >
              <CustomLabel className={classes.label} color="primary">
                Type of Business *
              </CustomLabel>
              <FormControl
                className={`w-100 pb-2`}
                error={businessTypeErrorMessage ? true : false}
              >
                <CustomSelect
                  id="enroll-cust-select-business"
                  variant="outlined"
                  defaultValue="none"
                  onChange={selectBusinessType}
                >
                  <CustomMenuItem value="none" disabled hidden>
                    Select Type of Business
                  </CustomMenuItem>
                  <CustomMenuItem value="1">Company</CustomMenuItem>
                  <CustomMenuItem value="2">
                    Sole Proprietorship / Partnership
                  </CustomMenuItem>
                  <CustomMenuItem value="3">Individual</CustomMenuItem>
                </CustomSelect>
                <FormHelperText>
                  {businessTypeErrorMessage && businessTypeErrorMessage}
                </FormHelperText>
              </FormControl>
              <CustomLabel
                className={classes.label}
                color="primary"
                htmlFor="signup"
              >
                Mobile No. or Email ID *
              </CustomLabel>
              <CustomTextField
                id="enroll-cust-mobile-number-or-email"
                placeholder="9820098200 / johndoe@example.com"
                variant="outlined"
                value={username}
                onChange={handleUsername}
                error={!!usernameErrorMessage}
                name="userId"
                helperText={usernameErrorMessage && usernameErrorMessage}
                inputProps={{ maxLength: 256 }}
                InputProps={{
                  endAdornment: usernameErrorMessage && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
              ></CustomTextField>

              <CustomLabel
                className={`${classes.label}`}
                color="primary"
                htmlFor="customer-name"
              >
                Customer Name
              </CustomLabel>
              <CustomTextField
                id="enroll-cust-customer-name"
                placeholder="John Doe"
                variant="outlined"
                value={customerName}
                onChange={(e: any) => {
                  setCustomerName(e.target.value);
                }}
                inputProps={{ maxLength: 100 }}
              ></CustomTextField>
            </form>
          </div>
          <div
            className={`d-flex flex-column justify-content-center mt-auto pb-4`}
          >
            <div
              className={`d-flex w-100 align-items-center justify-content-center ${styles.buttonContainer}`}
            >
              <CustomButton
                className={`p-3 ${styles.buttonStyle}`}
                variant="contained"
                color="primary"
                disableElevation
                onClick={(e) => handleGetOtp(e)}
              >
                Get OTP
              </CustomButton>
            </div>

            <div
              className={`d-flex align-items-center justify-content-center pt-3 pb-3`}
            >
              <Typography className="mt-2" variant="caption">
                <span
                  className={`MuiTypography-colorPrimary ${classes.cursorPointer} ${classes.bold}`}
                >
                  <span
                    className={`${styles.BackToLginpLabel}`}
                    onClick={() => redirectToServiceRequest()}
                  >
                    Back to Service Requests
                  </span>
                </span>
              </Typography>
            </div>
          </div>
        </CustomCard>
      </Container>
    </>
  );
};

export default EnrollCustomer;
