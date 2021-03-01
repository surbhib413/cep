import React, { useContext, useState } from "react";
import { Grid, Hidden, Typography, Link, Box } from "@material-ui/core";
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import styles from "./CardManagement.module.scss";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Dropzone, { useDropzone } from "react-dropzone";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import ErrorLogPopUp from "./ErrorLoPopUp";
import { Popup3 } from "../../../components/CustomPopups/Popup3/Popup3";
import { downloadErrorLog } from "src/lib/api/smartfleet/cardmanagement";
import fileDownload from "js-file-download";
const DownloadIcon = "/W_Icons_Download.svg";
const ExcelIcon = "/W_Icons_Excel.svg";
const DeleteIcon = "/W_Icons_Delete.svg";
const cardUploadIcon = "/card_upload_Icon.svg";
import { useRouter } from "next/router";
import { CardsContextAddCard } from "src/pages/CAMCardManagement/AddCards/AddCards";
import { CardsContext } from "./CardManagement";
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

const CardDetailsUpload = (props: any) => {
  const {
    selectedExcelFile,
    onExcelFileChange,
    handleDrop,
    deleteExcelFile,
    handleSave,
    successMsg,
    errorMsgLog,
    clearData,
    fileErrorStatus,
  } = props;

  const classes = useStyles();

  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const CARD_CONTEXT = props.navigationFlag
    ? useContext(CardsContext)
    : useContext(CardsContextAddCard);
    const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorLogPopUp, setShowErrorLogPopUp] = useState(false);
  const [clearPopup, setClearPopup] = useState(false);

  const physicalTemplateLink = CARD_CONTEXT.urlForTemplates.physicalTemplateURL;
  const virtualTemplateLink = CARD_CONTEXT.urlForTemplates.virtualTemplateURL;

  const finalPhysicalUrl =
    process.env.NEXT_PUBLIC_API_URL_BE + physicalTemplateLink;

  const finalVirtualUrl =
    process.env.NEXT_PUBLIC_API_URL_BE + virtualTemplateLink;

  console.log("FILES UPDALOADED", selectedExcelFile);

  const download = async (url: string, filename: string) => {
    const response = await downloadErrorLog(url);
    // console.log("response in downloadErrorLog", response);
    fileDownload(response.data, "errorLogFile.xls");
  };

  const closePopUp = () => {
    setShowErrorLogPopUp(false);
  };


  const processedToPayment = () => {
   
      router.push("/cam/card-management/payment");
   
  };

  const handleOpenClearPopup = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    selectedExcelFile ? setClearPopup(true) : null;
  };

  /* ------------DELETE API CALL FOR BULK DELETE-------------- */
  const handleCloseAndClearCards = () => {
    clearData();
    setClearPopup(false);
  };

  //primary render method for upload
  const renderUploadContainer = () => {
    return (
      <>
        <Grid
          container
          className={`
            ${
              fileErrorStatus
                ? styles.uploadContainerError
                : styles.uploadContainer
            }
          `}
        >
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({ className: "dropzone" })}
                className={`${styles.dropzone}`}
              >
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>

          <Grid item xs={12} sm={12}>
            <div className={`d-flex flex-column justify-content-center`}>
              <div className={`d-flex justify-content-center`}>
                <input
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e) => {
                    onExcelFileChange(e.target.files![0]);
                  }}
                  value={""}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={
                      <img src={cardUploadIcon} alt="UploadIcon"></img>
                    }
                    className={`${styles.uploadBtn}`}
                    data-test-id="sf-cm-cdu-upload-button"
                  >
                    Upload
                  </Button>
                </label>
              </div>

              <div className={`d-flex justify-content-center`}>
                <Hidden xsDown>
                  <Typography className={`${styles.uploadInstructionText}`}>
                    Or drag and drop the file here
                  </Typography>
                </Hidden>
                <Typography className={`${styles.uploadInstructionSubText}`}>
                  Max file size 5MB
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
        <div className={styles.uploadErrorMessage}>{errorMessage}</div>
        <div>
          <span className={`${styles.cardInfoStyle}`}>
            You can add maximum 9,999 cards under the SmartFleet Program.
          </span>
        </div>
      </>
    );
  };

  //primary render function to display the uploaded file
  const renderFileContainer = () => {
    // console.log("CARDS_CONTEXT.isFileSelected", CARDS_CONTEXT.isFileSelected);
    return (
      <>
        <Grid container className={`${styles.fileContainer}`}>
          <Grid item xs={2} sm={2} className={`${styles.fileImgStyle} pl-2`}>
            <img src={ExcelIcon} alt="excel-icon"></img>
          </Grid>
          <Grid item xs={9} sm={9} className={`${styles.fileImgStyle} `}>
            <CustomLabel className={`${styles.fileName}`}>
              {" "}
              {selectedExcelFile}
            </CustomLabel>
          </Grid>
          <Grid
            item
            xs={1}
            sm={1}
            className={`${styles.deleteImgStyle} ${styles.cursorPointer}`}
          >
            {successMsg ? (
              <></>
            ) : (
              <img
                src={DeleteIcon}
                alt="delete-icon"
                className={`pb-1 pr-1`}
                onClick={deleteExcelFile}
              />
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <span className={styles.successCardLbl}>{successMsg}</span>
          </Grid>
        </Grid>
      </>
    );
  };
  return (
    <div>
      {showErrorLogPopUp ? (
        <ErrorLogPopUp closePopUp={closePopUp}></ErrorLogPopUp>
      ) : (
        <></>
      )}

      <Popup3
        open={clearPopup}
        close={() => setClearPopup(false)}
        closeAndSubmit={handleCloseAndClearCards}
        title={`Are you sure you want to clear?`}
        description={`Any details entered so far will be deleted.`}
      ></Popup3>
      <div className="mt-3">
        <Grid container className="py-1">
          <Grid item xs={12} sm={12} className="pt-1 pb-3">
            {/* {props.navigationFlag ? <> </>:   (<Grid item xs={12} sm={4} className="py-0">
          <CustomLabel htmlFor="card-mgmt-num-of-cards">
           Bulk Upload
          </CustomLabel>
        </Grid>)} */}

            <CustomLabel htmlFor="card-mgmt-name-n-card">
              Download standard template:{" "}
              <img src={DownloadIcon} alt="download" className=""></img>
              <span className={`${styles.downloadFileName}`}>
                {CARD_CONTEXT.selectedCardTypeBulk === "virtual" ? (
                  <a href={finalVirtualUrl}>Virtual Card Template.xls</a>
                ) : (
                  <a href={finalPhysicalUrl}> Physical Card Template.xls </a>
                )}
              </span>
            </CustomLabel>
          </Grid>
        </Grid>

        {/* {CARDS_CONTEXT.isFileSelected
          ? renderFileContainer()
          : renderUploadContainer()} */}

        {selectedExcelFile ? renderFileContainer() : renderUploadContainer()}

        <Grid container>
          <Grid item xs={12} sm={6} className={styles.uploadErrorMessage}>
            {errorMsgLog.lineOne}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={11} sm={8} className={styles.uploadErrorMessage}>
            {errorMsgLog.lineTwo}

            {errorMsgLog.link ? (
              <Link
                onClick={() => download(errorMsgLog.link, "errorfile.abc")}
                color="primary"
                className={styles.viewErrorLogLink}
                data-test-id="sf-cm-cd-clear-button"
              >
                Download Error Log
              </Link>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </div>
      <div>
        {props.navigationFlag ? (
          <Grid container className={`${styles.saveClearBtnContainer}`}>
            <div className={`${styles.actionButtonsContainer} w-100 `}>
              <Hidden xsDown>
                <hr className={`${styles.headerDivider} w-75 ml-0 mr-3`}></hr>
              </Hidden>
              <CustomButton
                onClick={handleOpenClearPopup}
                variant="outlined"
                color="primary"
                className={`${styles.backToEnrolmentBtn} mr-3`}
                data-test-id="sf-cm-cd-clear-button"
              >
                Clear
              </CustomButton>
              <CustomButton
                // onClick={(e) => handleSave(e)}
                onClick={handleSave}
                variant="contained"
                color="primary"
                data-test-id="sf-cm-cd-save-button"
                disabled={successMsg ? true : false}
              >
                Save
              </CustomButton>
            </div>
          </Grid>
        ) : (
          <Box className={`d-flex w-100 py-3 mt-3 ${styles.submitBox}`}>
            <CustomButton
              color="primary"
              variant="outlined"
              className={`mr-4 ml-auto`}
              onClick={handleOpenClearPopup}
              data-test-id="cancel-button"
            >
              Cancel
            </CustomButton>
          
            {successMsg ? (
              <CustomButton
                color="primary"
                variant="contained"
                className={`mr-4 ${styles.noOutlineButton}`}
                data-test-id="submit-button"
                onClick={processedToPayment}
              >
                Proceed To Payment
              </CustomButton>
            ) : (
              <CustomButton
                color="primary"
                variant="contained"
                className={`mr-4 ${styles.noOutlineButton}`}
                data-test-id="submit-button"
                onClick={handleSave}
              >
                Submit
              </CustomButton>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default CardDetailsUpload;
