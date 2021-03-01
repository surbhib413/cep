import React from "react";
import styles from "./CustomiseTablePopup.module.scss";
import {
  Checkbox,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import CustomDialogComponent from "../../components/Dialog/Dialog";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useSelector } from "react-redux";

const moveImage = "/Move.svg";
const closeIcon = "/close_Icon.svg";

const CustomiseTable = (props: any) => {
  const store: any = useSelector((state) => state);
  const { customiseTableDialogOpen, closeCustomiseTableDialog } = props;
  const [state, setState] = React.useState({
    applicationId: true,
    applicationDate: true,
    organizationName: true,
    paymentStatus: true,
    mobileNo: false,
    pincode: false,
    emailId: false,
    paymentAmount: false,
    userId: false,
    kycStatus: true,
    cardType: false,
    noOfCards: false,

    customerName: true,
    loyalityType: false,
  });

  // let soState = {
  //     applicationId: true,
  //     applicationDate: true,
  //     organizationName: true,
  //     kycStatus: true,
  //     customerName: true,
  //     pincode: false,
  //     emailId: false,
  //     mobileNo: false,
  //     userId: false,
  //     loyalityType: false,
  // }

  const [columns, setColumns] = React.useState<Array<any>>(props.columns);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    if (event.target.checked) {
      let idField, labelField;
      if (event.target.name === "applicationId") {
        labelField = "Application Id";
        idField = "id";
      } else if (event.target.name === "applicationDate") {
        labelField = "Application Date";
        idField = "title";
      } else if (event.target.name === "organizationName") {
        labelField = "Organization Name";
        idField = "title";
      } else if (event.target.name === "mobileNo") {
        labelField = "Mobile No";
        idField = "title";
      } else if (event.target.name === "pincode") {
        labelField = "Pincode";
        idField = "title";
      } else if (event.target.name === "emailId") {
        labelField = "Email Id";
        idField = "title";
      } else if (event.target.name === "paymentStatus") {
        labelField = "Payment Status";
        idField = "completed";
      } else if (event.target.name === "paymentAmount") {
        labelField = "Payment Amount";
        idField = "title";
      } else if (event.target.name === "userId") {
        labelField = "User ID";
        idField = "title";
      } else if (event.target.name === "kycStatus") {
        labelField = "KYC Status";
        idField = "completed";
      } else if (event.target.name === "cardType") {
        labelField = "Card Type";
        idField = "title";
      } else if (event.target.name === "noOfCards") {
        labelField = "No of Cards";
        idField = "title";
      } else if (event.target.name === "customerName") {
        labelField = "Customer Name";
        idField = "title";
      } else if (event.target.name === "loyalityType") {
        labelField = "Loyality Type";
        idField = "title";
      }

      columns.push({
        id: idField,
        label: labelField,
        minWidth: 250,
        name: event.target.name,
      });
    } else {
      setColumns(columns.filter((item) => item.name !== event.target.name));
    }
  };

  const applyChanges = (event: any) => {
    console.log("Apply Changes in popup ", columns);
    if (columns.length > 0) {
      props.customiseTableColumn(columns);
    }
    props.closeCustomiseTableDialog();
  };

  return (
    <CustomDialogComponent
      scroll="paper"
      aria-labelledby="simple-dialog-title"
      open={customiseTableDialogOpen}
    >
      <DialogTitle>
        <div className="d-flex bd-highlight">
          <div
            className={`p-2 w-100 align-items-center justify-content-center`}
          >
            <span
              className={`${styles.title}`}
              data-test-id="serviceReq-customiseTbl-lbl"
            >
              Customise Table
            </span>
          </div>
          <div className={`p-2 justify-content-end `}>
            <img
              className={`${styles.closeIcon}`}
              data-test-id="serviceReq-customiseTbl-closeImg"
              src={closeIcon}
              alt="closeIcon"
              onClick={closeCustomiseTableDialog}
            />
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div
          className={`d-flex flex-column justify-content-center pt-3 ${styles.selectionDiv}`}
        >
          <div
            className={`d-flex align-items-center  ${
              state.applicationId
                ? styles.activeTableCard
                : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.applicationId}
              onChange={handleChange}
              name="applicationId"
              color="primary"
              disabled
              data-test-id="serviceReq-applicationId-chk"
            />
            <span data-test-id="serviceReq-applicationId-lbl">
              Application ID
            </span>
          </div>
          <div
            className={`d-flex align-items-center  mt-3 ${
              state.applicationDate
                ? styles.activeTableCard
                : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.applicationDate}
              onChange={handleChange}
              name="applicationDate"
              color="primary"
              data-test-id="serviceReq-applicationDate-chk"
            />
            <span data-test-id="serviceReq-applicationDate-lbl">
              Application Date
            </span>
          </div>
          <div
            className={`d-flex align-items-center  mt-3 ${
              state.organizationName
                ? styles.activeTableCard
                : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.organizationName}
              onChange={handleChange}
              name="organizationName"
              color="primary"
              data-test-id="serviceReq-organizationName-chk"
            />
            <span data-test-id="serviceReq-organizationName-lbl">
              Organization Name
            </span>
          </div>

          {store.role === "SO" ? (
            <div
              className={`d-flex align-items-center mt-3 ${
                state.customerName
                  ? styles.activeTableCard
                  : styles.inactiveTableCard
              }`}
            >
              <img
                className={`pl-2 pr-3`}
                src={moveImage}
                alt="MoveImage"
              ></img>
              <Checkbox
                checked={state.customerName}
                onChange={handleChange}
                name="customerName"
                color="primary"
                data-test-id="serviceReq-customerName-chk"
              />
              <span data-test-id="serviceReq-customerName-lbl">
                Customer Name
              </span>
            </div>
          ) : null}

          <div
            className={`d-flex align-items-center mt-3 ${
              state.kycStatus
                ? styles.activeTableCard
                : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.kycStatus}
              onChange={handleChange}
              name="kycStatus"
              color="primary"
              data-test-id="serviceReq-kycStatus-chk"
            />
            <span data-test-id="serviceReq-kycStatus-lbl">KYC Status</span>
          </div>

          {store.role === "SO" ? (
            <div
              className={`d-flex align-items-center mt-3 ${
                state.loyalityType
                  ? styles.activeTableCard
                  : styles.inactiveTableCard
              }`}
            >
              <img
                className={`pl-2 pr-3`}
                src={moveImage}
                alt="MoveImage"
              ></img>
              <Checkbox
                checked={state.loyalityType}
                onChange={handleChange}
                name="loyalityType"
                color="primary"
                data-test-id="serviceReq-loyalityType-chk"
              />
              <span data-test-id="serviceReq-loyalityType-lbl">
                Loyality Type
              </span>
            </div>
          ) : null}

          <div
            className={`d-flex align-items-center  mt-3 ${
              state.pincode ? styles.activeTableCard : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.pincode}
              onChange={handleChange}
              name="pincode"
              color="primary"
              data-test-id="serviceReq-pincode-chk"
            />
            <span data-test-id="serviceReq-pincode-lbl">Pin Code</span>
          </div>

          <div
            className={`d-flex align-items-center  mt-3 ${
              state.emailId ? styles.activeTableCard : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.emailId}
              onChange={handleChange}
              name="emailId"
              color="primary"
              data-test-id="serviceReq-emailId-chk"
            />
            <span data-test-id="serviceReq-emailId-lbl">Email ID</span>
          </div>

          {store.role !== "SO" ? (
            <div
              className={`d-flex align-items-center  mt-3 ${
                state.paymentStatus
                  ? styles.activeTableCard
                  : styles.inactiveTableCard
              }`}
            >
              <img
                className={`pl-2 pr-3`}
                src={moveImage}
                alt="MoveImage"
              ></img>
              <Checkbox
                checked={state.paymentStatus}
                onChange={handleChange}
                name="paymentStatus"
                color="primary"
                data-test-id="serviceReq-paymentStatus-chk"
              />
              <span data-test-id="serviceReq-paymentStatus-lbl">
                Payment Status
              </span>
            </div>
          ) : null}

          {store.role !== "SO" ? (
            <div
              className={`d-flex align-items-center  mt-3 ${
                state.paymentAmount
                  ? styles.activeTableCard
                  : styles.inactiveTableCard
              }`}
            >
              <img
                className={`pl-2 pr-3`}
                src={moveImage}
                alt="MoveImage"
              ></img>
              <Checkbox
                checked={state.paymentAmount}
                onChange={handleChange}
                name="paymentAmount"
                color="primary"
                data-test-id="serviceReq-paymentAmount-chk"
              />
              <span data-test-id="serviceReq-paymentAmount-lbl">
                Payment Amount
              </span>
            </div>
          ) : null}

          <div
            className={`d-flex align-items-center  mt-3 ${
              state.userId ? styles.activeTableCard : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.userId}
              onChange={handleChange}
              name="userId"
              color="primary"
              data-test-id="serviceReq-customerId-chk"
            />
            <span data-test-id="serviceReq-customerId-lbl">User ID</span>
          </div>

          <div
            className={`d-flex align-items-center  mt-3 ${
              state.mobileNo ? styles.activeTableCard : styles.inactiveTableCard
            }`}
          >
            <img className={`pl-2 pr-3`} src={moveImage} alt="MoveImage"></img>
            <Checkbox
              checked={state.mobileNo}
              onChange={handleChange}
              name="mobileNo"
              color="primary"
              data-test-id="serviceReq-mobileNo-chk"
            />
            <span data-test-id="serviceReq-mobileNo-lbl">Mobile No.</span>
          </div>

          {store.role !== "SO" ? (
            <>
              <div
                className={`d-flex align-items-center mt-3 ${
                  state.cardType
                    ? styles.activeTableCard
                    : styles.inactiveTableCard
                }`}
              >
                <img
                  className={`pl-2 pr-3`}
                  src={moveImage}
                  alt="MoveImage"
                ></img>
                <Checkbox
                  checked={state.cardType}
                  onChange={handleChange}
                  name="cardType"
                  color="primary"
                  data-test-id="serviceReq-cardType-chk"
                />
                <span data-test-id="serviceReq-cardType-lbl">Card Type</span>
              </div>

              <div
                className={`d-flex align-items-center mt-3 ${
                  state.noOfCards
                    ? styles.activeTableCard
                    : styles.inactiveTableCard
                }`}
              >
                <img
                  className={`pl-2 pr-3`}
                  src={moveImage}
                  alt="MoveImage"
                ></img>
                <Checkbox
                  checked={state.noOfCards}
                  onChange={handleChange}
                  name="noOfCards"
                  color="primary"
                  data-test-id="serviceReq-noOfCards-chk"
                />
                <span
                  className={styles.label}
                  data-test-id="serviceReq-noOfCards-lbl"
                >
                  No. of Cards
                </span>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
      <DialogActions>
        <CustomButton
          color="primary"
          variant="contained"
          onClick={applyChanges}
          data-test-id="serviceReq-apply-btn"
        >
          APPLY
        </CustomButton>
      </DialogActions>
    </CustomDialogComponent>
  );
};

export default CustomiseTable;
