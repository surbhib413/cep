import React, { useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  Hidden,
} from "@material-ui/core";
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
import { useRouter } from "next/router";
import Link from "next/link";

const DownloadIcon = "/W_Icons_Download_gray.svg";
const ExcelIcon = "/W_Icons_Excel.svg";
const DeleteIcon = "/W_Icons_Delete.svg";
const WarningIcon = "/W_Icons_Warning.svg";
const WarningIconSolid = "/warning_red_solid.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: "none",
    },
  })
);

const BulkUploadBody = () => {
  const router = useRouter();
  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);

  const handleDrop = (acceptedFiles: any): void =>
    setSelectedFile(acceptedFiles.map((file: File) => file.name));

  const [uploadError, setUploadError] = useState(false);
  const onFileChange = (uploadedFile: File) => {
    if (Math.floor(uploadedFile.size / 1024) >= 1024 * 5) {
      setUploadError(true);
    } else {
      setSubmitDisabled(false);
      setSelectedFile(uploadedFile);
    }
  };

  const handleCancel = () => {
    router.push("/petrocorp/employee-accounts");
  };

  const [excelError, setExcelError] = useState(false);
  const [excelErrorMessage, setExcelErrorMessage] = useState("");
  const handleSubmit = () => {
    // Call bulk upload API
    //based on response
    setExcelError(true);
    setExcelErrorMessage(
      `5 employee account details are incomplete and 200 mobile numbers already exists in the database. Fill the missing details and use alternate mobile number and upload the file again.`
    );
  };

  const renderUploadContainer = () => {
    return (
      <>
        <p className={`${styles.labelText}`}>Upload the card details here</p>
        <div className={`${styles.uploadContainer}`}>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          <input
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => {
              onFileChange(e.target.files![0]);
            }}
            value={""}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<UploadIcon />}
              className={`pt-2`}
            >
              <span data-test-id="p-cea-body-upload-button" className={`pb-2`}>
                Upload
              </span>
            </Button>
          </label>

          <Typography className="py-3">
            Or drag and drop the file here
          </Typography>
          <p className={`mb-0 ${styles.uploadtext}`}>Max file size 5 MB</p>
        </div>
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
        <p className={`${styles.labelText}`}>File successfully uploaded</p>
        <Grid container spacing={4} className="pt-2 pb-4">
          <Grid item xs={12} sm={5} className="py-0">
            <div
              className={`d-flex justify-content-between align-items-center py-2 px-3 ${styles.uploadedContainer}`}
            >
              <div className="d-flex align-items-center">
                <img src={ExcelIcon} alt="excel icon" />
                <div className="d-flex flex-column ml-3">
                  <Box color="textPrimary" fontSize={13} fontWeight={600}>
                    {selectedFile!.name}
                  </Box>
                  <Box fontSize={9} className={`${styles.fileDetails}`}>
                    {timeStamp} - {Math.floor(selectedFile!.size / 1024)}
                    kB
                  </Box>
                </div>
                {excelError && (
                  <div className={`pl-3 ${styles.warningIcon}`}>
                    <CustomSvgIcon
                      iconSource={WarningIconSolid}
                      color="error"
                    />
                  </div>
                )}
              </div>

              <div className={`${styles.deleteIcon}`}>
                <CustomSvgIcon
                  iconSource={DeleteIcon}
                  color="error"
                  onClick={() => {
                    setSelectedFile(null);
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
        <Typography variant="h5" className="mb-3">
          Bulk Upload
        </Typography>
        <div>
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
              {/* <Link href="">Template.xls</Link> */}
            </span>
          </p>
        </div>

        {selectedFile && !uploadError
          ? renderFileContainer()
          : renderUploadContainer()}
        {excelError && (
          <>
            <div
              className={`d-flex align-items-center py-2 ${styles.errorPara}`}
            >
              <CustomSvgIcon iconSource={WarningIcon} />
              <div>
                <p className="mb-0">{excelErrorMessage}</p>
              </div>
            </div>
            {/* <Link href="" >
            <a className={`ml-4 mt-2 ${styles.errorlogLink}`}>
              Download Error Log
            </a>
            </Link> */}
          </>
        )}

        <Snackbar
          open={uploadError}
          autoHideDuration={6000}
          onClose={() => {
            setUploadError(false);
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
                  setUploadError(false);
                }}
              >
                <CloseIcon
                  fontSize="inherit"
                  className={`${styles.errorAlertStyle}`}
                />
              </IconButton>
            }
          >
            <span>
              The uploaded file exceeds the maximum file size limit. Upload the
              file that is smaller than 5 MB.
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
    </>
  );
};

export default BulkUploadBody;
