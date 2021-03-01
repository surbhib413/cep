import React from "react";
import styles from "./PetrocorporateRegistrationForm.module.scss";
import {
  Grid,
  Typography,
  Box,
  InputAdornment,
  Hidden,
  FormControl,
  FormHelperText,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import { CustomSvgIcon } from "../../components/CustomSvgIcon/CustomSvgIcon";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import moment from "moment";
import { validationErrorMessage } from "../../utility/validations/validationErrorMessages";
import {
  isValidPan,
  isValidGstin,
} from "../../utility/validations/validations";
import { formSections } from "./types/formSections.enum";
import Alert from "@material-ui/lab/Alert";

const UploadIcon = "/W_Icon_Upload.svg";
const PdfIcon = "/W_Icons_PDF.svg";
const DeleteIcon = "/W_Icons_Delete.svg";
const WarningIcon = "/W_Icons_Warning.svg";

interface IErrorMessages {
  businessPanNumber?: string;
  gstinNumber?: string;
  addressProofType?: string;
}

export const KycDetails = (props: any) => {
  const { handleCompleteStep, handleIncompleteStep } = props;

  const initFields = {
    businessPanNumber: "",
    gstinNumber: "",
  };

  //Fields and Error Messages
  const [fields, setFields] = React.useState(initFields);
  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});

  //Cascading dropdowns
  const [addressProofType, setAdressProofType] = React.useState("0");

  // File Upload Fields
  const [uploadError, setUploadError] = React.useState(false);
  // PAN Upload
  const [businessPanUpload, setBusinessPanUpload] = React.useState<File | null>(
    null
  );
  const [businessPanUploadError, setBusinessPanUploadError] = React.useState(
    false
  );
  const handleBusinessPanUpload = (uploadedFile: File) => {
    if (Math.floor(uploadedFile.size / 1024) >= 1023) {
      setUploadError(true);
      setBusinessPanUploadError(true);
    } else {
      setBusinessPanUploadError(false);
      setBusinessPanUpload(uploadedFile);
    }
  };
  // Address Proof Upload
  const [
    addressProofUpload,
    setAddressProofUpload,
  ] = React.useState<File | null>(null);
  const [addressProofUploadError, setAddressProofUploadError] = React.useState(
    false
  );
  const handleAddressProofUpload = (uploadedFile: File) => {
    if (Math.floor(uploadedFile.size / 1024) >= 1023) {
      setUploadError(true);
      setAddressProofUploadError(true);
    } else {
      setAddressProofUploadError(false);
      setAddressProofUpload(uploadedFile);
    }
  };

  const timeStamp = moment(new Date()).format("Do MMM YYYY");

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFields({ ...fields, [event.target.name]: event.target.value });
    setErrorMessage({ ...errorMessage, [event.target.name]: "" });
  };

  // select address  proof type
  const selectAddressProofType = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAdressProofType(event.target.value as string);
    setErrorMessage((errorMessage) => ({
      ...errorMessage,
      addressProofType: "",
    }));
  };

  const validate = (): void => {
    let isError: boolean = false;

    // Validate businessPanNumber
    if (!fields.businessPanNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        businessPanNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (!isValidPan(fields.businessPanNumber)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        businessPanNumber: validationErrorMessage.PAN_CARD,
      }));
    }

    // Validate gstinNumber
    if (fields.gstinNumber && !isValidGstin(fields.gstinNumber)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        gstinNumber: validationErrorMessage.GSTIN_NUMBER,
      }));
    }

    // Validate proof of address
    if (addressProofType === "0") {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        addressProofType: validationErrorMessage.REQUIRED,
      }));
    }

    // If all validations pass
    if (!isError) {
      setErrorMessage({});
      handleCompleteStep(formSections.KYC_DETAILS, true);
      handleIncompleteStep(formSections.KYC_DETAILS, false);
    } else {
      handleIncompleteStep(formSections.KYC_DETAILS, true);
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLElement>): void => {
    setFields(initFields);
    setErrorMessage({});
    setAdressProofType("0");
  };

  const handleSave = (event: React.MouseEvent<HTMLElement>): void => {
    setErrorMessage({});
    event.preventDefault();
    validate();
    //
  };

  return (
    <form className="w-100">
      <div className="py-0 py-sm-3 px-4 px-sm-0">
        <>
          <Grid container spacing={4} alignItems="center" className="pt-4">
            <Grid item xs={12} sm={4} className="py-0">
              <CustomLabel htmlFor="business-pan">Business PAN *</CustomLabel>
              <CustomTextField
                id="business-pan"
                placeholder="AAAAA0000A"
                variant="outlined"
                error={!!errorMessage.businessPanNumber}
                name="businessPanNumber"
                value={fields.businessPanNumber}
                onChange={handleTextfieldChange}
                helperText={
                  errorMessage.businessPanNumber &&
                  errorMessage.businessPanNumber
                }
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  endAdornment: errorMessage.businessPanNumber && (
                    <InputAdornment position="end">
                      <CustomSvgIcon iconsource={WarningIcon} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item sm={2} xs={12} className="py-0">
              <input
                className={`${styles.displayNone}`}
                id="business-pan-upload"
                type="file"
                accept="application/pdf,image/x-png,image/jpeg,image/tif,image/tiff,.tif"
                onChange={(e) => {
                  handleBusinessPanUpload(e.target.files![0]);
                }}
                value={""}
              />
              <label
                htmlFor="business-pan-upload"
                className={`w-100 ${
                  errorMessage.businessPanNumber ? "mb-3" : "mb-0"
                }`}
              >
                <CustomButton
                  variant="contained"
                  color="primary"
                  startIcon={<CustomSvgIcon iconsource={UploadIcon} />}
                  className="w-100"
                  data-test-id="p-upload-pan"
                >
                  Upload
                </CustomButton>
              </label>
            </Grid>
            <Hidden smUp>
              {businessPanUpload && !businessPanUploadError && (
                <Grid item xs={12} sm={4} className="pb-0">
                  <div
                    className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                  >
                    <div className="d-flex">
                      <img src={PdfIcon} alt="pdf icon" />
                      <div className="d-flex flex-column ml-3">
                        <Box color="textPrimary" fontSize={13} fontWeight={600}>
                          {businessPanUpload.name}
                        </Box>
                        <Box fontSize={9} className={`${styles.fileDetails}`}>
                          {timeStamp} -{" "}
                          {Math.floor(businessPanUpload.size / 1024)}kB
                        </Box>
                      </div>
                    </div>
                    <div className={`${styles.deleteIcon}`}>
                      <CustomSvgIcon
                        iconsource={DeleteIcon}
                        color="error"
                        onClick={() => {
                          setBusinessPanUpload(null);
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              )}
            </Hidden>
            <Grid item sm={6} xs={12}>
              <ul className="mb-0 pl-3">
                <li>
                  <Typography
                    variant="caption"
                    data-test-id="upload-pan-instruction-1"
                  >
                    Name on Business PAN should exactly match with the
                    Organization Name
                  </Typography>
                </li>
                <li>
                  <Typography
                    variant="caption"
                    data-test-id="upload-pan-instruction-2"
                  >
                    Acceptable file type: JPEG (or JPG), PDF, PNG, TIFF{" "}
                  </Typography>
                </li>
                <li>
                  <Typography
                    variant="caption"
                    data-test-id="upload-pan-instruction-3"
                  >
                    Maximum file size 1 MB
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>

          {/* UPLOADED FILE DETAILS */}
          <Hidden xsDown>
            {businessPanUpload && !businessPanUploadError && (
              <Grid container spacing={4} className="pt-2 pb-4">
                <Grid item xs={12} sm={4} className="py-0">
                  <div
                    className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                  >
                    <div className="d-flex">
                      <img src={PdfIcon} alt="pdf icon" />
                      <div className="d-flex flex-column ml-3">
                        <Box color="textPrimary" fontSize={13} fontWeight={600}>
                          {businessPanUpload.name}
                        </Box>
                        <Box fontSize={9} className={`${styles.fileDetails}`}>
                          {timeStamp} -{" "}
                          {Math.floor(businessPanUpload.size / 1024)}kB
                        </Box>
                      </div>
                    </div>
                    <div className={`${styles.deleteIcon}`}>
                      <CustomSvgIcon
                        iconsource={DeleteIcon}
                        color="error"
                        onClick={() => {
                          setBusinessPanUpload(null);
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}
          </Hidden>
          <hr className={`${styles.headerDivider}`}></hr>
        </>

        <Grid
          container
          spacing={4}
          alignItems="center"
          className="pt-4 py-sm-4"
        >
          <Grid item xs={12} sm={4} className="py-0">
            <CustomLabel htmlFor="proof-of-address" id="proof-of-address-id">
              Proof of Address *
            </CustomLabel>
            <FormControl
              error={!!errorMessage.addressProofType}
              className="w-100"
            >
              <CustomSelect
                labelId="proof-of-address-id"
                id="proof-of-address"
                name="addressProofType"
                value={addressProofType}
                error={!!errorMessage.addressProofType}
                onChange={selectAddressProofType}
                variant="outlined"
                fullWidth
                className={`${
                  !errorMessage.addressProofType && styles.selectMarginBottom
                }`}
              >
                <CustomMenuItem value="0">Select</CustomMenuItem>
                <CustomMenuItem value={1}>
                  Letter of Incorporation
                </CustomMenuItem>

                <CustomMenuItem value={2}>Telephone Bill</CustomMenuItem>
                <CustomMenuItem value={3}>Electricity Bill</CustomMenuItem>
                <CustomMenuItem value={4}>Water Bill</CustomMenuItem>
                <CustomMenuItem value={5}>Bank Certificate</CustomMenuItem>
                <CustomMenuItem value={6}>Bank Statement</CustomMenuItem>
              </CustomSelect>
              <FormHelperText>
                {errorMessage.addressProofType && errorMessage.addressProofType}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={2} xs={12} className="py-0">
            <input
              className={`${styles.displayNone}`}
              id="proof-of-address-upload"
              type="file"
              accept="application/pdf,image/x-png,image/jpeg,image/tif,image/tiff,.tif"
              onChange={(e) => {
                handleAddressProofUpload(e.target.files![0]);
              }}
              value={""}
            />
            <label htmlFor="proof-of-address-upload" className="w-100 mb-0">
              <CustomButton
                variant="contained"
                color="primary"
                startIcon={<CustomSvgIcon iconsource={UploadIcon} />}
                className="w-100"
                data-test-id="p-upload-address-proof"
              >
                Upload
              </CustomButton>
            </label>
          </Grid>
          <Hidden smUp>
            {addressProofUpload && !addressProofUploadError && (
              <Grid item xs={12} sm={4} className="pb-0">
                <div
                  className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                >
                  <div className="d-flex">
                    <img src={PdfIcon} alt="pdf icon" />
                    <div className="d-flex flex-column ml-3">
                      <Box color="textPrimary" fontSize={13} fontWeight={600}>
                        {addressProofUpload.name}
                      </Box>
                      <Box fontSize={9} className={`${styles.fileDetails}`}>
                        {timeStamp} -{" "}
                        {Math.floor(addressProofUpload.size / 1024)}
                        kB
                      </Box>
                    </div>
                  </div>
                  <div className={`${styles.deleteIcon}`}>
                    <CustomSvgIcon
                      iconsource={DeleteIcon}
                      color="error"
                      onClick={() => {
                        setAddressProofUpload(null);
                      }}
                    />
                  </div>
                </div>
              </Grid>
            )}
          </Hidden>
          <Grid item sm={6} xs={12}>
            <ul className="mb-0 pl-3">
              <li>
                <Typography
                  variant="caption"
                  data-test-id="upload-address-proof-instruction-1"
                >
                  Proof of address details have to match the registered address
                </Typography>
              </li>
              <li>
                <Typography
                  variant="caption"
                  data-test-id="upload-address-proof-instruction-2"
                >
                  Acceptable file type: JPEG (or JPG), PDF, PNG, TiFF{" "}
                </Typography>
              </li>
              <li>
                <Typography
                  variant="caption"
                  data-test-id="upload-address-proof-instruction-3"
                >
                  Maximum file size 1 MB
                </Typography>
              </li>
            </ul>
          </Grid>
        </Grid>
        <Hidden xsDown>
          {addressProofUpload && !addressProofUploadError && (
            <Grid container spacing={4} className="pt-2 pb-4">
              <Grid item xs={12} sm={4} className="py-0">
                <div
                  className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                >
                  <div className="d-flex">
                    <img src={PdfIcon} alt="pdf icon" />
                    <div className="d-flex flex-column ml-3">
                      <Box color="textPrimary" fontSize={13} fontWeight={600}>
                        {addressProofUpload.name}
                      </Box>
                      <Box fontSize={9} className={`${styles.fileDetails}`}>
                        {timeStamp} -{" "}
                        {Math.floor(addressProofUpload.size / 1024)}
                        kB
                      </Box>
                    </div>
                  </div>
                  <div className={`${styles.deleteIcon}`}>
                    <CustomSvgIcon
                      iconsource={DeleteIcon}
                      color="error"
                      onClick={() => {
                        setAddressProofUpload(null);
                      }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
        </Hidden>
        <hr className={`${styles.headerDivider}`}></hr>

        <Grid
          container
          spacing={4}
          alignItems="center"
          className="pt-4 py-sm-4"
        >
          <Grid item xs={12} sm={4} className="py-0">
            <div className="d-flex justify-content-between w-100">
              <CustomLabel htmlFor="gstin-number">GSTIN No.</CustomLabel>
            </div>
            <CustomTextField
              id="gstin-number"
              placeholder="22AAAA0000A1Z5"
              variant="outlined"
              error={!!errorMessage.gstinNumber}
              name="gstinNumber"
              value={fields.gstinNumber}
              onChange={handleTextfieldChange}
              helperText={errorMessage.gstinNumber && errorMessage.gstinNumber}
              inputProps={{ maxLength: 15 }}
              InputProps={{
                endAdornment: errorMessage.gstinNumber && (
                  <InputAdornment position="end">
                    <CustomSvgIcon iconsource={WarningIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Hidden smUp>
          <Grid container spacing={4} className="mb-0  pt-4">
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={(e) => handleClear(e)}
                variant="outlined"
                color="primary"
                className="w-100"
                data-test-id="p-kd-clear-button"
              >
                Clear
              </CustomButton>
            </Grid>
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={(e) => handleSave(e)}
                variant="contained"
                color="primary"
                className="w-100"
                data-test-id="p-kd-save-button"
              >
                Save
              </CustomButton>
            </Grid>
          </Grid>
        </Hidden>
      </div>

      <Hidden xsDown>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <hr className={`${styles.headerDivider} w-75 mx-0`}></hr>
          <CustomButton
            onClick={(e) => handleClear(e)}
            variant="outlined"
            color="primary"
            className="mx-4"
            data-test-id="p-kd-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="p-kd-save-button"
          >
            Save
          </CustomButton>
        </div>
      </Hidden>
      <Snackbar
        open={uploadError}
        autoHideDuration={6000}
        onClose={() => {
          setUploadError(false);
        }}
        // className={`${styles.errorAlertStyle}`}
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
          <Hidden xsDown>
            <span>
              {" "}
              The uploaded file exceeds the size limit. Please re-upload the
              file within 1 MB.
            </span>
          </Hidden>
          <Hidden smUp>
            <span className={styles.alertMobileTitle}>
              {" "}
              The uploaded file exceeds the size limit. Please re-upload the
              file within 1 MB.
            </span>
          </Hidden>
        </Alert>
      </Snackbar>
    </form>
  );
};
