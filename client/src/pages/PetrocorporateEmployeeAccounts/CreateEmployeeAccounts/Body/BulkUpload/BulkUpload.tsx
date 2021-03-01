import React, { useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  Hidden,
} from "@material-ui/core";
import { CustomLabel } from "../../../../../components/CustomTextField/CustomLabel";
import styles from "./BulkUploadBody.module.scss";
import UploadIcon from "../../../../../components/CustomIcons/UploadIcon";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Dropzone from "react-dropzone";
import moment from "moment";
import { CustomSvgIcon } from "../../../../../components/CustomSvgIcon/CustomSvgIcon";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import { CustomButton } from "../../../../../components/CustomButton/CustomButton";
import { Popup1 } from "../../../../../components/CustomPopups/Popup1/Popup1";
import { Popup2 } from "../../../../../components/CustomPopups/Popup2/Popup2";
import CancelIcon from "@material-ui/icons/Cancel";
import { useRouter } from "next/router";
import Link from "next/link";

const DownloadIcon = "/W_Icons_Download_gray.svg";
const ExcelIcon = "/W_Icons_Excel.svg";
const DeleteIcon = "/W_Icons_Delete.svg";

const BulkUploadBody = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [uploadSnackbarError, setUploadSnackbarError] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");

  const validateUploadedFile = (uploadedFile: File) => {
    let validationError = false;
    //validate file type
    if (
      !(
        uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        uploadedFile.type === "application/vnd.ms-excel" ||
        uploadedFile.type === ".csv"
      )
    ) {
      validationError = true;
      setUploadSnackbarError(true);
      setSnackbarErrorMessage(
        "Invalid file or file format is not supported. Download the standard template and upload it again."
      );
    } else if (Math.floor(uploadedFile.size / 1024) >= 1024 * 5) {
      validationError = true;
      setUploadSnackbarError(true);
      setSnackbarErrorMessage(
        "The uploaded file exceeds the maximum file size limit. Upload the file that is smaller than 5 MB."
      );
    }

    if (!validationError) {
      setSubmitDisabled(false);
      setSelectedFile(uploadedFile);
    }
  };

  const handleDrop = (acceptedFiles: any): void => {
    console.log(acceptedFiles[0]);
    validateUploadedFile(acceptedFiles[0]);
  };

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleCancel = () => {
    setOpenConfirmModal(true);
  };
  const handleCloseAndSubmitConfirmModal = () => {
    router.push("/petrocorp/employee-accounts/create");
  };

  // Submission
  const [openSubmitSuccessfulModal, setOpenSubmitSuccessfulModal] = useState(
    false
  );
  const [excelError, setExcelError] = useState(false);
  const [excelErrorMessage, setExcelErrorMessage] = useState([""]);
  const handleSubmit = () => {
    // Call bulk upload API

    let error = true; //set error based on backend API response
    if (error) {
      setExcelError(true);
      setExcelErrorMessage([
        "5 employee account details are incomplete",
        "200 mobile numbers already exist in the database",
      ]);
    } else {
      setOpenSubmitSuccessfulModal(true);
    }
  };
  const handleDoneModal = () => {
    router.push("/petrocorp/employee-accounts");
  };

  const renderUploadContainer = () => {
    return (
      <>
        <p className={`mb-2 ${styles.labelText}`}>
          Upload the employee accounts details here
        </p>
        <Dropzone onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <div className={`${styles.uploadContainer}`}>
              <div
                {...getRootProps({
                  className: "d-flex flex-column align-items-center w-100",
                })}
              >
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<UploadIcon />}
                    className={`pt-2`}
                  >
                    <span data-test-id="p-cea-upload-button">Upload</span>
                  </Button>
                </label>
                <input {...getInputProps()} />
                <Typography className="py-sm-3 py-2">
                  Or drag and drop the file here
                </Typography>
                <p className={`mb-0 ${styles.uploadtext}`}>
                  Max file size 5 MB
                </p>
              </div>
            </div>
          )}
        </Dropzone>
        <p className={`mt-2 ${styles.uploadtext}`}>
          You can add maximum 15,000 employees under the PetroCorporate Loyalty
          Program.
        </p>
      </>
    );
  };
  const timeStamp = moment(new Date()).format("Do MMM YYYY");

  const renderFileContainer = () => {
    return (
      <>
        <p className={`${styles.labelText}`}>File uploaded successfully</p>
        <Grid container spacing={4} className="pt-2 pb-4">
          <Grid item xs={12} sm={4} className="py-0">
            <div
              className={`d-flex justify-content-between align-items-center py-2 px-3 ${styles.uploadedContainer}`}
            >
              <div className="d-flex align-items-center">
                <img src={ExcelIcon} alt="excel icon" />
                <div className="d-flex flex-column ml-3">
                  <Box color="textPrimary" fontSize={13} fontWeight={600}>
                    <CustomLabel className={`${styles.fileNameStyle}`}>
                      {" "}
                      {selectedFile!.name}
                    </CustomLabel>
                  </Box>
                  <Box fontSize={9} className={`${styles.fileDetails}`}>
                    {timeStamp} - {Math.floor(selectedFile!.size / 1024)}
                    kB
                  </Box>
                </div>
              </div>

              <div className={`${styles.deleteIcon}`}>
                <img
                  src={DeleteIcon}
                  alt="delete icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setExcelError(false);
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      <div className="h-100">
        {/* <Typography variant="h5" className="mb-3">
          Bulk Upload
        </Typography> */}
        <div>
          <Hidden xsDown>
            <p>
              <span className={`mr-2 ${styles.labelText}`}>
                Download standard template:
              </span>

              <img
                src={DownloadIcon}
                alt="download"
                className={`mb-1 ${styles.downloadIcon}`}
              ></img>
              <span className={`pl-1 ${styles.downloadFileName}`}>
                <Link href="">Template.xls</Link>
              </span>
            </p>
          </Hidden>
          <Hidden smUp>
            <p>
              <span className={`mr-2 ${styles.labelText}`}>
                Download standard template:
              </span>
            </p>
            <div
              className={`d-flex justify-content-between align-items-center px-3 py-2 mb-3 ${styles.mobileExcelTemplateBox}`}
            >
              <span className={`${styles.downloadFileName}`}>
                <Link href="">Template.xls</Link>
              </span>
              <img
                src={DownloadIcon}
                alt="download"
                className={`mb-1 ${styles.downloadIcon}`}
              ></img>
            </div>
          </Hidden>
        </div>

        {selectedFile && !uploadSnackbarError
          ? renderFileContainer()
          : renderUploadContainer()}
        {excelError && (
          <>
            <Hidden xsDown>
              <div className={`d-flex flex-column mb-3 ${styles.errorPara}`}>
                <div className="d-flex align-items-center p-3">
                  <CancelIcon className={`${styles.rejectIcon}`} />
                  <ul className={`pl-2 m-0 ${styles.errorPara__list}`}>
                    {excelErrorMessage.map((errorMessage, index) => (
                      <li className={`${styles.errorTextFont}`} key={index}>
                        <span className={`${styles.reasonsList}`}></span>
                        {errorMessage}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className={`ml-5 mb-2 ${styles.errorTextFont}`}>
                  Upload the file after making the required changes
                </p>
              </div>
            </Hidden>
            <Hidden smUp>
              <div
                className={`d-flex flex-column mb-2 ${styles.responsiveErrorContainer}`}
              >
                <div className="d-flex align-items-center p-2">
                  <CancelIcon className={`${styles.rejectIcon}`} />
                  <ul className={`pl-3 m-0`}>
                    {excelErrorMessage.map((errorMessage, index) => (
                      <li className={`${styles.errorTextFont}`} key={index}>
                        <span className={`${styles.reasonsList}`}></span>
                        {errorMessage}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className={`ml-5 mb-2 ${styles.errorTextFont}`}>
                  Upload the file after making the required changes
                </p>
              </div>
            </Hidden>
            <Link href="">
              <a className={`pt-2 ${styles.errorlogLink}`}>
                View Error Log
              </a>
            </Link>
          </>
        )}

        <Snackbar
          open={uploadSnackbarError}
          autoHideDuration={6000}
          onClose={() => {
            setUploadSnackbarError(false);
          }}
        >
          <Alert
            className={`align-items-center ${styles.errorAlertStyle}`}
            severity="error"
            action={
              <IconButton
                aria-label="close"
                size="small"
                className={`${styles.errorAlertStyle} ${styles.borderButton}`}
                onClick={() => {
                  setUploadSnackbarError(false);
                }}
              >
                <CloseIcon
                  fontSize="inherit"
                  className={`${styles.errorAlertStyle}`}
                />
              </IconButton>
            }
          >
            <span className={`${styles.errorAlertAlign}`}>
              {snackbarErrorMessage}
            </span>
          </Alert>
        </Snackbar>
      </div>

      <Hidden xsDown>
        <Box
          className={`d-flex justify-content-end w-100 py-3 ${styles.submitBox}`}
        >
          <CustomButton
            color="primary"
            variant="outlined"
            className={`mr-4`}
            onClick={handleCancel}
            data-test-id="cancel-button"
          >
            Cancel
          </CustomButton>
          <CustomButton
            color="primary"
            variant="contained"
            className={`mr-4 ${styles.noOutlineButton}`}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            data-test-id="submit-button"
          >
            Submit
          </CustomButton>
        </Box>
      </Hidden>
      <Hidden smUp>
        <Box className={`d-flex justify-content-between w-100 py-3`}>
          <CustomButton
            variant="outlined"
            color="primary"
            className="w-100 mr-4"
            onClick={handleCancel}
            data-test-id="cancel-button"
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            variant="contained"
            color="primary"
            className="w-100"
            data-test-id="submit-button"
          >
            Submit
          </CustomButton>
        </Box>
      </Hidden>
      <Popup1
        open={openConfirmModal}
        close={() => setOpenConfirmModal(false)}
        closeAndSubmit={handleDoneModal}
        title="Are you sure you want to cancel ?"
        description="Any details provided so far will be deleted. "
      ></Popup1>
      <Popup2
        open={openSubmitSuccessfulModal}
        close={() => setOpenSubmitSuccessfulModal(false)}
        closeAndSubmit={handleDoneModal}
        title="Submission Successful"
        description="20 Employee Accounts were successfully created"
      ></Popup2>
    </>
  );
};

export default BulkUploadBody;
