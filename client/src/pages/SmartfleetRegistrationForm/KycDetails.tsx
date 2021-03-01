import React, { useEffect } from "react";
import styles from "./SmartfleetRegistrationForm.module.scss";
import {
  Grid,
  Typography,
  Box,
  InputAdornment,
  Hidden,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { setLoader } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
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
import { useSelector } from "react-redux";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "../../utility/Snackbar/SnackbarMessages";
import { postKYCDetail } from "../../lib/api/smartfleet/smartfleet";

const UploadIcon = "/W_Icon_Upload.svg";
const PdfIcon = "/W_Icons_PDF.svg";
const DeleteIcon = "/W_Icons_Delete.svg";
const WarningIcon = "/W_Icons_Warning.svg";

interface IErrorMessages {
  businessPanNumber?: string;
  gstinNumber?: string;
  idNumber?: string;
  addressProofType?: string;
  identityProofType?: string;
}

export const KycDetails = (props: any) => {
  const {
    role,
    handleCompleteStep,
    handleIncompleteStep,
    dropdownLists,
    initialData,
  } = props;
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log("initi dataaaa: ", initialData);
  const [poaDocument, setPoaDocument] = React.useState<File | null>();
  const [identityDocument, setIdentityDocument] = React.useState<File | null>();
  const [idProofUploadName, setIDProofUploadName] = React.useState<string>("");

  const initFields = {
    businessPanNumber: "",
    gstinNumber: "",
    idNumber: "",
    addressProofType: "",
    identityProofType: "",
    poaDocument,
    identityDocument,
  };

  //Fields and Error Messages
  const [fields, setFields] = React.useState(initFields);
  const [isSectionEditable, setIsSectionEditable] = React.useState(true);
  const [validateUpload, setValidateUpload] = React.useState(true);

  useEffect(() => {
    const { initialData } = props;
    if (initialData) {
      const initialFields = {
        businessPanNumber: initialData?.idNumber || "",
        gstinNumber: initialData?.gstin || "",
        idNumber: initialData?.idNumber || "",
        addressProofType: initialData?.proofOfAddressType,
        identityProofType: initialData?.proofOfIdentityType,
        poaDocument: initialData?.poaDocument,
        identityDocument: initialData?.identityDocument,
      };
      setIsSectionEditable(initialData?.editable || true);
      setFields(initialFields);
      if (initialData?.completed) {
        handleCompleteStep(formSections.KYC_DETAILS, true);
        handleIncompleteStep(formSections.KYC_DETAILS, false);
      } else {
        handleIncompleteStep(formSections.KYC_DETAILS, true);
      }
      if (initialData?.customerType === "Company") {
        setBusinessPanUpload(initialData?.idProofAvailable);
        setBusinessPANUploadName(initialData?.idProofName);
      } else {
        setIdNumberUpload(initialData?.idProofAvailable);
        setIDProofUploadName(initialData?.idProofName);
      }
      setAddressProofUpload(initialData?.addressProofAvailable);
      setAddressProofUploadName(initialData?.addressProofName);
      if ((initialData?.addressProofAvailable) || (initialData?.idProofAvailable)) {
        setValidateUpload(false);
        setPoaDocument(initialData?.addressProofName);
        setIdentityDocument(initialData?.idProofName);
      } else {
        setValidateUpload(true);
        setPoaDocument(addressProofUpload);
        if (initialData?.customerType === "Company") {
          setIdentityDocument(businessPanUpload);
        } else {
          setIdentityDocument(idNumberUpload)
        }
      }
    }
  }, []);

  const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");

  //Cascading dropdown
  const [addressProofType, setAdressProofType] = React.useState(
    initialData?.proofOfAddressType || "0"
  );
  const [identityProofType, setIdentityProofType] = React.useState("PAN");

  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  // File Upload Fields
  const [uploadedIdentityProof, setUploadedIdentityProof] = React.useState(
    false
  );
  const [uploadedBusinessPAN, setUploadedBusinessPAN] = React.useState(false);
  const [uploadedAddressProof, setUploadedAddressProof] = React.useState(false);

  // Validate Uploaded file
  const validateUploadedFile = () => {
    let validateFile = false;

    if (initialData?.idProofAvailable || initialData?.addressProofAvailable) {
      if ((initialData?.addressProofName === businessPANUploadName) && (initialData?.idProofName === idProofUploadName)) {
        validateFile = true
      } else if ((poaDocument !== null && (initialData?.addressProofName === null || addressProofUploadName === null))
        || (identityDocument !== null && (initialData?.idProofName === null || idProofUploadName === null))) {
        validateFile = false;
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.FILE_REQUIRED);
        setAlertType("error");
      } else if ((initialData?.addressProofName !== null && poaDocument === null)
        || (initialData?.idProofName !== null && identityDocument === null)) {
        validateFile = false;
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.FILE_REQUIRED);
        setAlertType("error");
      } else {
        validateFile = true;
      }
      return validateFile;
    } else if (role === "b2c") {
      if (uploadedIdentityProof && uploadedAddressProof) {
        setShowSnackbar(false);
        validateFile = true;
      } else {
        validateFile = false;
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.FILE_REQUIRED);
        setAlertType("error");
      }
      return validateFile;
    } else {
      if (uploadedBusinessPAN && uploadedAddressProof) {
        setShowSnackbar(false);
        validateFile = true;
      } else {
        validateFile = false;
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.FILE_REQUIRED);
        setAlertType("error");
      }
      return validateFile;
    }
  };

  // Proof of Identity Upload
  const [idNumberUpload, setIdNumberUpload] = React.useState<File | null>(null);

  const [idNumberUploadError, setIdNumberUploadError] = React.useState(false);
  const handleIdNumberUpload = (uploadedFile: File) => {
    if (Math.floor(uploadedFile.size / 1024) >= 1023) {
      setShowSnackbar(true);
      setIdNumberUploadError(true);
      setSnackbarMessage(SnackbarMessage.KYC_FILE_SIZE);
      setAlertType("error");
    } else if (
      !(
        uploadedFile.type === "image/jpeg" ||
        uploadedFile.type === "image/jpg" ||
        uploadedFile.type === "application/pdf" ||
        uploadedFile.type === "image/tiff" ||
        uploadedFile.type === "image/tif" ||
        uploadedFile.type === "image/png"
      )
    ) {
      setShowSnackbar(true);
      setIdNumberUploadError(true);
      setSnackbarMessage(SnackbarMessage.KYC_FILE_TYPE);
      setAlertType("error");
    } else {
      setUploadedIdentityProof(true);
      setShowSnackbar(false);
      setIdNumberUploadError(false);
      setIdNumberUpload(uploadedFile);
      setIdentityDocument(uploadedFile);
    }
  };

  // Business PAN Upload
  const [businessPanUpload, setBusinessPanUpload] = React.useState<File | null>(
    null
  );
  const [businessPANUploadName, setBusinessPANUploadName] = React.useState<string>("");
  const [businessPanUploadError, setBusinessPanUploadError] = React.useState(
    false
  );
  const handleBusinessPanUpload = (uploadedFile: File) => {
    if (Math.floor(uploadedFile.size / 1024) >= 1023) {
      setShowSnackbar(true);
      setBusinessPanUploadError(true);
      setSnackbarMessage(SnackbarMessage.KYC_FILE_SIZE);
      setAlertType("error");
    } else if (
      !(
        uploadedFile.type === "image/jpeg" ||
        uploadedFile.type === "image/jpg" ||
        uploadedFile.type === "application/pdf" ||
        uploadedFile.type === "image/tiff" ||
        uploadedFile.type === "image/tif" ||
        uploadedFile.type === "image/png"
      )
    ) {
      setShowSnackbar(true);
      setBusinessPanUploadError(true);
      setSnackbarMessage(SnackbarMessage.KYC_FILE_TYPE);
      setAlertType("error");
    } else {
      setUploadedBusinessPAN(true);
      setShowSnackbar(false);
      setBusinessPanUploadError(false);
      setBusinessPanUpload(uploadedFile);
      setIdentityDocument(uploadedFile);
    }
  };

  // Address Proof Upload
  const [
    addressProofUpload,
    setAddressProofUpload,
  ] = React.useState<File | null>(null);
  const [addressProofUploadName, setAddressProofUploadName] = React.useState<string>("");
  const [addressProofUploadError, setAddressProofUploadError] = React.useState(
    false
  );
  const handleAddressProofUpload = (uploadedFile: File) => {
    if (Math.floor(uploadedFile.size / 1024) >= 1020) {
      setShowSnackbar(true);
      setAddressProofUploadError(true);
      setSnackbarMessage(SnackbarMessage.KYC_FILE_SIZE);
      setAlertType("error");
    } else if (
      !(
        uploadedFile.type === "image/jpeg" ||
        uploadedFile.type === "image/jpg" ||
        uploadedFile.type === "application/pdf" ||
        uploadedFile.type === "image/tiff" ||
        uploadedFile.type === "image/tif" ||
        uploadedFile.type === "image/png"
      )
    ) {
      setShowSnackbar(true);
      setAddressProofUploadError(true);
      setSnackbarMessage(SnackbarMessage.KYC_FILE_TYPE);
      setAlertType("error");
    } else {
      setUploadedAddressProof(true);
      setShowSnackbar(false);
      setAddressProofUploadError(false);
      setAddressProofUpload(uploadedFile);
      setPoaDocument(uploadedFile);
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
    console.log("setAdressProofType", event.target.value);
    setAdressProofType(event.target.value as string);
    setErrorMessage((errorMessage) => ({
      ...errorMessage,
      addressProofType: "",
    }));
  };

  const validate = (): boolean => {
    let isError: boolean = false;

    // Validate businessPanNumber
    if (role === "b2b" && !fields.businessPanNumber) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        businessPanNumber: validationErrorMessage.REQUIRED,
      }));
    } else if (role === "b2b" && !isValidPan(fields.businessPanNumber)) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        businessPanNumber: validationErrorMessage.PAN_CARD,
      }));
    }

    // Validate gstinNumber
    if (
      role === "b2b" &&
      fields.gstinNumber &&
      !isValidGstin(fields.gstinNumber)
    ) {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        gstinNumber: validationErrorMessage.GSTIN_NUMBER,
      }));
    }

    // Validate ID number required
    if (role === "b2c") {
      if (!fields.idNumber) {
        isError = true;
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          idNumber: validationErrorMessage.REQUIRED,
        }));
      }
      // validate ID number based on proof type section

      if (identityProofType === "PAN") {
        //PAN
        if (!isValidPan(fields.idNumber)) {
          isError = true;
          setErrorMessage((errorMessage) => ({
            ...errorMessage,
            idNumber: validationErrorMessage.PAN_CARD,
          }));
        }
      }
    }

    // Validate proof of address
    if (addressProofType === "0") {
      isError = true;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        addressProofType: validationErrorMessage.REQUIRED,
      }));
    }

    return isError;
  };

  const handleClear = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setFields(initFields);
    setErrorMessage({});
    setAdressProofType("0");
    setIdNumberUpload(null);
    setBusinessPanUpload(null);
    setAddressProofUpload(null);
    setIDProofUploadName("");
    setBusinessPANUploadName("");
    setAddressProofUploadName("");
    setValidateUpload(true);
  };

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isSectionEditable) {
      return false;
    }
    setErrorMessage({});
    event.preventDefault();
    const isError = validate();
    const isFileUploaded = validateUploadedFile();

    if (!isError && isFileUploaded) {
      // If all validations pass, API call to submit KYC data
      console.log("All KYC validations pass-----");
      dispatch(setLoader(true));
      let formData = new FormData();

      //Address proof type dropdown value
      formData.append("proofOfAddressType", addressProofType);
      //Identity proof type by default PAN for both
      formData.append("proofOfIdentityType", "PAN");
      //Address proof upload value
      if (initialData?.addressProofAvailable || poaDocument !== null) {
        if (initialData?.addressProofName === addressProofUploadName) {
          console.log("Address proof already available and same, hence no new file passed");
        } else {
          formData.append("poaDocument", poaDocument);
        }
      } else {
        formData.append("poaDocument", addressProofUpload);
      }
      //ID proof upload value
      if (role === "b2b") {
        if (initialData?.idProofAvailable || identityDocument !== null) {
          if (initialData?.idProofName === businessPANUploadName) {
            console.log("Identity proof already available and same, hence no new file passed");
          } else {
            formData.append("identityDocument", identityDocument);
          }
        } else {
          formData.append("identityDocument", businessPanUpload);
        }
        formData.append("customerType", "Company");
        formData.append("idNumber", fields.businessPanNumber);
        formData.append("gstin", fields.gstinNumber);
      } else {
        if (initialData?.idProofAvailable || identityDocument !== null) {
          if (initialData?.idProofName === idProofUploadName) {
            console.log("Identity proof already available and same, hence no new file passed");
          } else {
            formData.append("identityDocument", identityDocument);
          }
        } else {
          formData.append("identityDocument", idNumberUpload);
        }
        formData.append("customerType", "Individual");
        formData.append("idNumber", fields.idNumber);
        formData.append("gstin", "");
      }

      const res: any = await postKYCDetail(formData);
      console.log("KYC DETAILS response !! : ", res);

      if (
        res?.status === "success" ||
        res?.status === "updated" ||
        res?.status == 200
      ) {
        setErrorMessage({});
        if (res?.data?.completed) {
          handleCompleteStep(formSections.KYC_DETAILS, true);
          handleIncompleteStep(formSections.KYC_DETAILS, false);
          setShowSnackbar(true);
          setSnackbarMessage(res?.data?.message);
          setAlertType("success");
        } else {
          handleIncompleteStep(formSections.KYC_DETAILS, true);
        }
      } else {
        if (res?.error || res?.errors) {
          console.log("ERROR RESPONSE", res?.errors);
          const errorObj: any = {};
          res?.errors.forEach((element: any) => {
            console.log(element?.message);
            if (!element.hasOwnProperty("subject")) {
              setApiOtherErrorMessage(element?.message);
              setShowSnackbar(true);
              setSnackbarMessage(element?.message + " " + element?.subject);
              setAlertType("error");
            } else {
              if (element?.subject === "customerId") {
                setShowSnackbar(true);
                setSnackbarMessage(SnackbarMessage.CUST_ID_NOT_AVAILABLE);
                setAlertType("error");
              }
              if (element?.subject === "proofOfAddressType") {
                setErrorMessage((errorMessage) => ({
                  ...errorMessage,
                  addressProofType: element?.message,
                }));
              }
              if (element?.subject === "idNumber") {
                setErrorMessage((errorMessage) => ({
                  ...errorMessage,
                  businessPanNumber: element?.message,
                }));
              }
              if (element?.subject === "gstin") {
                setErrorMessage((errorMessage) => ({
                  ...errorMessage,
                  gstinNumber: element?.message,
                }));
              }
              errorObj[element?.subject] = element?.message;
            }
          });
          setErrorMessage((errorMessage) => ({
            ...errorMessage,
            ...errorObj,
          }));
          handleIncompleteStep(formSections.KYC_DETAILS, false);
        } else {
          setShowSnackbar(true);
          setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
          setAlertType("error");
        }
      }
      dispatch(setLoader(false));
    }
  };

  return (
    <form className="w-100">
      <div className="py-0 py-sm-3 px-4 px-sm-0">
        {role === "b2b" && (
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
                  style={{ display: "none" }}
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
                  className={`w-100 ${errorMessage.businessPanNumber ? "mb-3" : "mb-0"
                    }`}
                >
                  <CustomButton
                    variant="contained"
                    color="primary"
                    startIcon={<CustomSvgIcon iconsource={UploadIcon} />}
                    className="w-100"
                    data-test-id="sf-upload-pan"
                    aria-required
                  >
                    Upload
                  </CustomButton>
                </label>
              </Grid>
              <Hidden smUp>
                {(businessPanUpload) && !businessPanUploadError && (
                  <Grid item xs={12} sm={4} className="pb-0">
                    <div
                      className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                    >
                      <div className="d-flex">
                        <img src={PdfIcon} alt="pdf icon" />
                        <div className="d-flex flex-column ml-3">
                          <Box
                            color="textPrimary"
                            fontSize={13}
                            fontWeight={600}
                          >
                            {businessPANUploadName ? businessPANUploadName : businessPanUpload.name}
                          </Box>
                        </div>
                      </div>
                      <div className={`${styles.deleteIcon}`}>
                        <CustomSvgIcon
                          iconsource={DeleteIcon}
                          color="error"
                          onClick={() => {
                            setBusinessPanUpload(null);
                            setUploadedBusinessPAN(false);
                            setBusinessPANUploadName("");
                            setIdentityDocument(null);
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                )}
              </Hidden>
              <Grid item sm={6} xs={12}>
                <ul className={`mb-0 pl-3 ${styles.uploadButtonMargin}`}>
                  <li>
                    <Typography
                      variant="caption"
                      data-test-id="upload-pan-instruction-1"
                    >
                      {role === "b2b"
                        ? "Name on Business PAN should exactly match with the Organization Name"
                        : "Name on Proof of Identity should exactly match with the Name"}
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
                          <Box
                            color="textPrimary"
                            fontSize={13}
                            fontWeight={600}
                          >
                            {businessPANUploadName ? businessPANUploadName : businessPanUpload.name}
                          </Box>
                        </div>
                      </div>
                      <div className={`${styles.deleteIcon}`}>
                        <CustomSvgIcon
                          iconsource={DeleteIcon}
                          color="error"
                          onClick={() => {
                            setBusinessPanUpload(null);
                            setUploadedBusinessPAN(false);
                            setBusinessPANUploadName("");
                            setIdentityDocument(null);
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
        )}

        {role === "b2c" && (
          <>
            <Grid
              container
              spacing={4}
              alignItems="center"
              className="pt-4 py-sm-4"
            >
              <Grid item xs={12} sm={4} className="py-0">
                <CustomLabel htmlFor="id-number">PAN *</CustomLabel>
                <CustomTextField
                  id="id-number"
                  placeholder="Enter ID Number"
                  variant="outlined"
                  error={!!errorMessage.idNumber}
                  name="idNumber"
                  value={fields.idNumber}
                  onChange={handleTextfieldChange}
                  helperText={errorMessage.idNumber && errorMessage.idNumber}
                  inputProps={{ maxLength: 20 }}
                  InputProps={{
                    endAdornment: errorMessage.idNumber && (
                      <InputAdornment position="end">
                        <CustomSvgIcon iconsource={WarningIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item sm={2} xs={12} className="py-0">
                <input
                  style={{ display: "none" }}
                  id="id-number-upload"
                  type="file"
                  accept="application/pdf,image/x-png,image/jpeg,image/tif,image/tiff,.tif"
                  onChange={(e) => {
                    handleIdNumberUpload(e.target.files![0]);
                  }}
                  value={""}
                />
                <label
                  htmlFor="id-number-upload"
                  className={`w-100 ${errorMessage.idNumber ? "mb-3" : "mb-0"}`}
                >
                  <CustomButton
                    variant="contained"
                    color="primary"
                    startIcon={<CustomSvgIcon iconsource={UploadIcon} />}
                    className="w-100"
                    data-test-id="sf-upload-business-pan"
                  >
                    Upload
                  </CustomButton>
                </label>
              </Grid>
              <Hidden smUp>
                {idNumberUpload && !idNumberUploadError && (
                  <Grid item xs={12} sm={4} className="py-0">
                    <div
                      className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                    >
                      <div className="d-flex">
                        <img src={PdfIcon} alt="pdf icon" />
                        <div className="d-flex flex-column ml-3">
                          <Box
                            color="textPrimary"
                            fontSize={13}
                            fontWeight={600}
                          >
                            {idProofUploadName ? idProofUploadName : idNumberUpload.name}
                          </Box>
                        </div>
                      </div>
                      <div className={`${styles.deleteIcon}`}>
                        <CustomSvgIcon
                          iconsource={DeleteIcon}
                          color="error"
                          onClick={() => {
                            setIdNumberUpload(null);
                            setUploadedIdentityProof(false);
                            setIDProofUploadName("");
                            setIdentityDocument(null);
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                )}
              </Hidden>

              <Grid item sm={6} xs={12}>
                <ul className={`mb-0 pl-3 ${styles.uploadButtonMargin}`}>
                  <li>
                    <Typography
                      variant="caption"
                      data-test-id="upload-pan-instruction-1"
                    >
                      {role === "b2b"
                        ? "Name on Business PAN should exactly match with the Organization Name"
                        : "Name on Proof of Identity should exactly match with the Name"}
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      variant="caption"
                      data-test-id="upload-pan-instruction-2"
                    >
                      Acceptable file type: JPEG (or JPG), PDF, PNG, TiFF{" "}
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
            <Hidden xsDown>
              {idNumberUpload && !idNumberUploadError && (
                <Grid container spacing={4} className="pt-2 pb-4">
                  <Grid item xs={12} sm={4} className="py-0">
                    <div
                      className={`d-flex justify-content-between p-2 ${styles.uploadedContainer}`}
                    >
                      <div className="d-flex">
                        <img src={PdfIcon} alt="pdf icon" />
                        <div className="d-flex flex-column ml-3">
                          <Box
                            color="textPrimary"
                            fontSize={13}
                            fontWeight={600}
                          >
                            {idProofUploadName ? idProofUploadName : idNumberUpload.name}
                          </Box>
                        </div>
                      </div>
                      <div className={`${styles.deleteIcon}`}>
                        <CustomSvgIcon
                          iconsource={DeleteIcon}
                          color="error"
                          onClick={() => {
                            setIdNumberUpload(null);
                            setUploadedIdentityProof(false);
                            setIDProofUploadName("");
                            setIdentityDocument(null);
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
        )}

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
                className={`${!errorMessage.addressProofType && styles.selectMarginBottom
                  }`}
              >
                <CustomMenuItem value="0">Select</CustomMenuItem>
                {role === "b2c"
                  ? dropdownLists?.individualAddressProofs && dropdownLists?.individualAddressProofs?.map(
                    (list: any, index: number) => {
                      return (
                        <CustomMenuItem key={list.code} value={list.code}>
                          {list.displayName}
                        </CustomMenuItem>
                      );
                    }
                  )
                  : dropdownLists?.businessAddressProofs && dropdownLists?.businessAddressProofs?.map(
                    (list: any, index: number) => {
                      return (
                        <CustomMenuItem key={list.code} value={list.code}>
                          {list.displayName}
                        </CustomMenuItem>
                      );
                    }
                  )}
              </CustomSelect>
              <FormHelperText>
                {errorMessage.addressProofType && errorMessage.addressProofType}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={2} xs={12} className="py-0">
            <input
              style={{ display: "none" }}
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
                data-test-id="sf-upload-address-proof"
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
                        {addressProofUploadName ? addressProofUploadName : addressProofUpload.name}
                      </Box>
                    </div>
                  </div>
                  <div className={`${styles.deleteIcon}`}>
                    <CustomSvgIcon
                      iconsource={DeleteIcon}
                      color="error"
                      onClick={() => {
                        setAddressProofUpload(null);
                        setUploadedAddressProof(false);
                        setAddressProofUploadName("");
                        setPoaDocument(null);
                      }}
                    />
                  </div>
                </div>
              </Grid>
            )}
          </Hidden>
          <Grid item sm={6} xs={12}>
            <ul className={`mb-0 pl-3 ${styles.uploadButtonMargin}`}>
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
                        {addressProofUploadName ? addressProofUploadName : addressProofUpload.name}
                      </Box>
                    </div>
                  </div>
                  <div className={`${styles.deleteIcon}`}>
                    <CustomSvgIcon
                      iconsource={DeleteIcon}
                      color="error"
                      onClick={() => {
                        setAddressProofUpload(null);
                        setUploadedAddressProof(false);
                        setAddressProofUploadName("");
                        setPoaDocument(null);
                      }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
        </Hidden>
        {role === "b2b" && (
          <Grid
            container
            spacing={4}
            alignItems="center"
            className="pt-4 py-sm-4"
          >
            <hr className={`${styles.headerDivider}`}></hr>
            <Grid item xs={12} sm={4} className="py-0">
              <div className="d-flex justify-content-between w-100">
                <CustomLabel htmlFor="gstin-number">GSTIN No.</CustomLabel>
              </div>
              <CustomTextField
                id="gstin-number"
                placeholder="22AAAAA0000A1Z5"
                variant="outlined"
                error={!!errorMessage.gstinNumber}
                name="gstinNumber"
                value={fields.gstinNumber}
                onChange={handleTextfieldChange}
                helperText={
                  errorMessage.gstinNumber && errorMessage.gstinNumber
                }
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
        )}
        <Hidden smUp>
          <Grid container spacing={4} className="mb-0  pt-4">
            <Grid item xs={6} sm={4} className="py-0">
              <CustomButton
                onClick={(e) => handleClear(e)}
                variant="outlined"
                color="primary"
                className="w-100"
                data-test-id="sf-kd-clear-button"
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
                data-test-id="sf-kd-save-button"
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
            data-test-id="sf-kd-clear-button"
          >
            Clear
          </CustomButton>
          <CustomButton
            onClick={(e) => handleSave(e)}
            variant="contained"
            color="primary"
            className="mr-4"
            data-test-id="sf-kd-save-button"
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