import React, { useEffect, useState } from 'react';
import { Grid, Typography, Radio, RadioGroup, FormControlLabel, InputAdornment, } from '@material-ui/core';
import { RadioProps } from "@material-ui/core/Radio";
import { withStyles } from '@material-ui/core/styles';
import { CustomLabel } from '../../../components/CustomTextField/CustomLabel';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import LockIcon from '@material-ui/icons/Lock';
import CustomTextField from '../../../components/CustomTextField/CustomTextField';
import { CustomButton } from 'src/components/CustomButton/CustomButton';
import { CustomTooltip } from "src/components/CustomTooltip/CustomTooltip";
import { CustomSvgIcon } from "src/components/CustomSvgIcon/CustomSvgIcon";
import { setLoader } from "src/redux/actions/actions";
import { useDispatch } from "react-redux";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OtpMobile from './dialogs/OtpMobile';
import PaymentSuccess from './dialogs/PaymentSuccess';
import { getPincodeData, postCardDeliveryAddress, postResendOTP, postVerifyOTP ,postValidateOTP, sendOTP, postRequestPaymentOption } from '../../../lib/api/smartfleet/cardpayment'
import CustomSnackbar from 'src/components/CustomSnackbar/CustomSnackbar';
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";
import { isOnlyNumbers, isVailidName, isValidAddress, isValidMobileNumber} from 'src/utility/validations/validations';
import { validationErrorMessage } from 'src/utility/validations/validationErrorMessages';


const EditIcon = '/Edit_Icon.svg';
const InfoIcon = '/information.svg'
const WarningIcon = "/W_Icons_Warning.svg";
const BackIcon = '/Back_Icon.svg'

var regex = new RegExp('^[a-zA-Z0-9]+$') // Regex for allowing only alphabets and numeric

export const getFormattedNumber = (num: number | string = 0, decimal: number = 2) => {
    const num_parts = Number(num)
        ? String(Number(num).toFixed(decimal)).replace(
              /^(\d*)(\d{3})(\.*\d*)$/,
              (_, a, b, c) => a.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + `${a ? ',' : ''}` + b + c
          )
        : num;
    return num_parts;
};

export const getMaskedMobileNumber = (num: number | string = 0) => {
    const num_parts = num.toString().replace(num.toString().slice(2, 6),"****")
    return num_parts;
};

// Overriding the radio color to Blue
const BlueRadio = withStyles({
	root: {
		'&$checked': {
			color: '#0369dd',
		},
	},
	checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
	vl: {
		borderLeft: '1px solid #6e7a93',
		height: '50px',
		position: 'absolute',
		left: '16%',
		bottom: '9%',

		[theme.breakpoints.up('lg')]: {
			left: '16%'
		},
		[theme.breakpoints.between('sm', 'md')]: {
			left: '16%'
		},
		[theme.breakpoints.up('sm')]: {
			left: '25%'
		},
		[theme.breakpoints.down('xs')]: {
			left: '45%'
		},
		[theme.breakpoints.between('md', 'lg')]: {
			left: '16%'
		}
	},
	paymentText: {
		paddingBottom: 24,
		fontSize: 28,
		color: '#0369dd'
	},
	form: {
		backgroundColor: '#ffffff',
		width: '100%',
		padding: 20,
		['@media (min-width:767px)']: {
			padding: 40,
		}
	},
	AccordionContainer: {
		marginBottom: '24px',
		fontWeight:"bold",
	},
	accordionIcon: {
		marginRight: '10px',
		color: '#0369dd'
	},
	accordionTitle: {
		fontSize: '16px',
		fontWeight: 'bold',
		color: '#0369dd'
	},
	accordionIconDisabled: {
		marginRight: '10px',
		color: '#bbc5c9'
	},
	accordionTitleDisabled: {
		fontSize: '16px',
		fontWeight: 'bold',
		color: '#bbc5c9'
	},
	noOfCards: {
		fontSize: '14px',
		fontWeight: 700
	},
	amountToBePaid: {
		fontSize: '14px',
		fontWeight: 700,
		whiteSpace: 'nowrap'
	},
	name: {
		fontSize: '16px',
		color: '#354463',
		borderRight: '1px solid #6e7a93',
		paddingRight: '16px',
		whiteSpace: 'nowrap',
		['@media (max-width:767px)']: {
			paddingRight: '10px',
		},
		// '&::before': {
		// 	content: "xxx",
		// 	position: 'relative',
		// 	bottom: 0,
		// 	left: 0,
		// 	right: 0,
		// 	width:'5px',
		// 	height: '0.5em',
		// 	border: '10px solid black',
		// 	zIndex: '1',
		// 	// width: 0,
		// 	// height: '22px',
		// 	// opacity: 0.8,
		// 	// border: 'solid 1px #6e7a93',
		// },
	},
	mobNo: {
		fontSize: '16px',
		paddingLeft: '16px',
		paddingRight: '16px',
		color: '#354463',
		borderRight: '1px solid #6e7a93',
		textAlign: 'center',
		['@media (max-width:767px)']: {
			paddingRight: '10px',
			paddingLeft: '10px',
		}
	},
	address: {
		fontSize: '16px', color: '#354463', paddingLeft: '20px',
		['@media (max-width:767px)']: {
			paddingLeft: '0px',
			marginTop: '8px',
		}
	},
	lock: {
		color: '#354463',
		fontSize: '13px'
	},
	lockIcon: {
		width: '20px',
		height: '20px'
	},
	availableBal: {
		paddingLeft: '2.2rem',
		fontSize: '13px',
		fontWeight: 600,
		paddingBottom: '16px'
	},
	paymentAccordion: {
		border: '1.5px solid #cddae0',
		boxShadow: 'none',
		borderRadius: '4px',
	},
	accordionDetails: {
		paddingRight: '16px',
		paddingLeft: '16px',
		['@media (min-width:767px)']: {
			paddingRight: '24px',
			paddingLeft: '24px',
		},

	},
	radiobtnGroup: {
		root: {
			'&$checked': {
				color: '#0369dd !important',
				fontWeight: 'bold'
			}
		},

	},
	paymentAccordionSummary: {
		backgroundColor: '#e6f1fe',
		paddingRight: '16px',
		paddingLeft: '16px',
		['@media (min-width:767px)']: {
			paddingRight: '24px',
			paddingLeft: '24px',
		}
	},
	payNowContainer: {
		paddingLeft: '2.2rem',
		paddingBottom: '16px'
	},
	inputContainer: {
		paddingLeft: '2.2rem',
		paddingBottom: '16px',
		display: 'block',
	},
	infoRight: {
		float: 'right',
	},
	transationRefrenceNo: {
		width: '100%',
		marginBottom: '0px',
		['@media (min-width:767px)']: {
			width: '278px',
		},
		textTransform: 'uppercase'
	},
	paidFuelStationCaption: {
		fontSize: '12px',
		color: '#ff6c00',
		marginBottom: '16px',
		marginTop: '8px',
	},
	paidFuelCash: {
		display: 'block',
	},
	transationRefrenTitle: {
		width: '100%',
		['@media (min-width:767px)']: {
			width: '278px',
		}
	},
	resoneForFreeTextarea: {
		alignItems: 'flex-start',
		width: '100%',
		'& .MuiOutlinedInput-multiline': {
			height: '150px',
			width: '100%',
		},
		'& .MuiInputBase-root': {
			alignItems: 'flex-start',
		}
	},
	resonReject: {
		position: 'relative',
		'& p': {
			position: 'absolute',
			bottom: '10px',
			right: '16px',
			color: '#97a2a8',
			fontSize: '14px'
		}
	},
	btnSubmit: {
		width: '100%',
		['@media (min-width:767px)']: {
			width: 'auto',
		}
	},
	customSidebar: {
		width: '240px',
		height: 'auto',
		backgroundColor: '#fff',
		marginRight: '20px',
		['@media screen and (max-width:767px)']: {
			display: 'none',
			width: '240px',
		}
	},
	disabledtext: {
		backgroundColor: '#eff1f6 !important',
		color: '#354463 !important'
	},
	paymentInline: {
		display: 'flex'
	},
	paymentBack: {
		display: 'none',
		paddingBottom: '24px',
		marginRight: '16px',
		['@media screen and (max-width:767px)']: {
			display: 'block',
		}
	},
	pinInput: {
		'&:-webkit-outer-spin-button': {
			'-webkit-appearance': 'none',
			'-moz-appearance': 'none',
			'appearance': 'none',
			margin: '0'
		},
		'&:-webkit-inner-spin-button': {
			'-webkit-appearance': 'none',
			'-moz-appearance': 'none',
			'appearance': 'none',
			margin: '0'
		}
	},
	cmsWalletError: {
		fontSize: "14px",
		marginTop: "8px",
		'& p':{
			color: "red",
		},
		'& a':{
			"text-decoration": "underline",
			"font-weight": "600"
		}
	},
	petromilesError: {
		marginBottom: "1rem",
		marginLeft: "2.2rem", 
	},
	paymentOptionLabel:{
		width: '40%',
		[theme.breakpoints.down('sm')]:{
			width: '100%',
		},
		fontSize:"2.2rem",
	},
	paymentOptionLabel1:{
		width: '40%',
		[theme.breakpoints.down('sm')]:{
			width: '100%',
		},
		fontSize:"2.2rem",
		'& .MuiTypography-body1' : {
			fontWeight: 'bold'
		}

	}
}));


interface IErrorMessages {
	receiverName?: string;
	receiverMobileNumber?: string;
	line1?: string;
	line2?: string;
	pincode?: string;
	city?: string;
	state?: string;
}

interface IFields {
	receiverName?: string;
	receiverMobileNumber?: string;
	line1?: string;
	line2?: string;
	pincode?: string;
	city?: string;
	state?: string;
}

export enum paymentOptions {
	PAY_BY_CMS_WALLET = "PAY_BY_CMS_WALLET",
	PAY_BY_PETROMILES = "PAY_BY_PETROMILES",
	FEES_PAID = "FEES_PAID",
	FEE_WAIVER = "FEE_WAIVER",
	DEBIT = "DEBIT",
	UPI= "UPI",
	WALLETS = "WALLETS",
}

const getRadioLabel = (type: paymentOptions) => {
	switch (type) {
		case paymentOptions.PAY_BY_CMS_WALLET:
			return "CMS Wallet";
		case paymentOptions.PAY_BY_PETROMILES:
			return "Petromiles";
		case paymentOptions.FEE_WAIVER:
			return "Request for fee waiver";
		case paymentOptions.FEES_PAID:
			return "Paid at Fuel Station";
		case paymentOptions.DEBIT:
			return "Debit Card / Credit Card";
		case paymentOptions.UPI:
			return "UPI";
		case paymentOptions.WALLETS:
			return "Wallets";
		default:
			return;
	}
}

interface ApiResponse {
	status?: any
	data? : any,
	message? : string,
	errors? : any
}

interface ApplicationDetails {
	applicationNumber?: string
	amountToBePaid?: number
	cardType?: string
	cmsWalletBalance?: number
	customerEmail?: string
	numberOfCards?: string
	petromilesPoints?: string
	receiverMobileNumber?: string
	receiverName?: string
	requiredPetroMilesPoints?: string
	statusCode?: string
	statusMessage?: string
}

interface AddressDetails {
	addressType?: string
	cardDelSameAsCorres?: boolean
	city?: string
	corresSameAsReg?: boolean
	firstName?: string
	formattedAddress?: string
	id?: string
	lastName?: string
	line1?: string
	line2?: string
	phone1?: string
	pincode?: string
	state?: string,
	receiverName?: string,
	receiverMobileNumber?: string
}


const Payment = (props: any) => {
	const classes = useStyles();
	const response : ApiResponse = props?.response
	const responseAddress : ApiResponse = props?.responseAddress;
	const dispatch = useDispatch();
	
	// State for maintaining radio button selection
	const [paymentOptionValue, setPaymentOptionValue] = React.useState<paymentOptions>(paymentOptions.PAY_BY_CMS_WALLET);

	// State for storing data received from getApplicationsummary api
	const [applicationSummary, setApplicationSummary] = React.useState<ApplicationDetails>({});

	// State for storing data received from getAddress api
	const [address, setAddress] = React.useState<AddressDetails>({});

	// State for Input fields of Payment Option
	const [cashTransRefno, setCashTransRefno] = React.useState<string>('');
	const [waiverReasonFee, setWaiverReasonFee] = React.useState<string>('');
	//Card Delivery Address
	const [isCardDeliveryEditable, setCardDeliveryEditable] = React.useState(false);

	// Pament Option Click to Card Deliver Edit Payment Body Disable Address
	const [isPaymentOption, setPaymentOption] = React.useState(true);

	const [paymentSuccessResponse, setPaymentSuccessResponse] = React.useState({});

	const [cardDeliveryAddressBackup, setCardDeliveryAddressBackup] = React.useState<IFields>({});
	const [fields, setFields] = React.useState<IFields>({});
	const [errorMessage, setErrorMessage] = React.useState<IErrorMessages>({});
	
	const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
	const [isAmountToBePaid , setIsAmountToBePaid ] = React.useState(false)
	const CHARACTER_LIMIT = 20;
	//Show snackbar for API response
	const [showSnackbar, setShowSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("");
	const [alertType, setAlertType] = React.useState("error");
	const [errorMsg, setErrorMsg] = React.useState(false)

	const [openOtpModal, setOpenOtpModal] = React.useState(false);
	const [openPaymentSuccessfull, setOpenPaymentSuccessfull] = React.useState(false);
	

	useEffect(() => {
		// Get Data from API
		
		if(response?.status === "success" && response.data){

			if(response?.data) {
				if(response?.data.amountToBePaid <= 0) {
					setIsAmountToBePaid(true);
				}
			}

			let applicationDetail : ApplicationDetails = response.data;
			setApplicationSummary(applicationDetail)
			if (responseAddress?.status === "success" && responseAddress.data && responseAddress.data.addresses.length) {
				
				let cardDeliveryAddress: AddressDetails = responseAddress.data.addresses[0];
				cardDeliveryAddress.receiverName = cardDeliveryAddress.firstName ? cardDeliveryAddress.firstName : applicationDetail.receiverName
				cardDeliveryAddress.receiverMobileNumber = cardDeliveryAddress.phone1 ? cardDeliveryAddress.phone1 : applicationDetail.receiverMobileNumber
				setCardDeliveryAddressBackup({...cardDeliveryAddress})
				setFields({ ...cardDeliveryAddress })
				
			} else {
				setAddress({})
				showAlert(SnackbarMessage.API_DOWNTIME,true)
			}
		}else{
			setApplicationSummary({})
			setErrorMessage({});
			showAlert(SnackbarMessage.API_DOWNTIME,true)
		}
	}, [])

	/** APPLICATION SUMMARY & PAYMENT OPTION*/

	const handlePaymentOptionFieldChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, name } = event.target
		switch (name) {
			case 'cashTransRefno': {
				regex.test(value) || value === '' ? setCashTransRefno(value.toUpperCase()) : null
			}
				break;
			case 'waiverReasonFee': { setWaiverReasonFee(value) }
				break;
			default: return ''
		}
	}

	const handleRadioChange = (event: any) => {
		setPaymentOptionDefault();
		setPaymentOptionValue(event.target.value);
	};

	const handlePayNow = async (radioBtnValue : paymentOptions) => {
		let response : ApiResponse = await sendOTP({
			otpType: radioBtnValue,
			otpChannel: 'MOBILE',
			customerId:""
		});
		if(response?.status === "success" || response?.status === 200) {
			setOpenOtpModal(true);
		}
		else if(response?.status === "failure" || response?.status === "error") {
			showAlert(response?.errors[0].message,true);
		}
		// setOpenOtpModal(response?.status === "success" || response?.status === 200);
		// setOpenOtpModal(true);
	};

	const handleOtpClose = () => {
		setOpenOtpModal(false);
		setOpenPaymentSuccessfull(false);
	};

	const handleOtpVerify = async (otp: String) => {
		dispatch(setLoader(true));
		let response : ApiResponse = await postValidateOTP({
			isNotificationEnabled: true,
			otp: otp,
			otpType: paymentOptionValue,
			otpChannel: "WEB",
		});
		if (response?.status === "success") {
			dispatch(setLoader(false));
			console.log("OTP Verify Response ", response)
			setOpenOtpModal(false);
			dispatch(setLoader(true));
			let paymentResponse : ApiResponse = await postRequestPaymentOption({
				applicationID: applicationSummary.applicationNumber,
				otpAuthToken: response.data.otpAuthToken,
				paymentType: paymentOptionValue,
				feesToPay: applicationSummary.amountToBePaid,
				numberOfCards: applicationSummary.numberOfCards
			});
			if (paymentResponse?.status === "success" || paymentResponse?.status == 200) {
				dispatch(setLoader(false));
				setPaymentSuccessResponse(paymentResponse.data);
				setOpenPaymentSuccessfull(true);
			}else if (paymentResponse?.status === "error") {
				dispatch(setLoader(false))
				console.log("PAYMENT API ERROR => ", paymentResponse?.errors[0].message, paymentResponse?.errors[0]);
				showAlert(paymentResponse?.errors[0].message,true);
			}
			else {
				dispatch(setLoader(false))
			}
		}
		else {
			dispatch(setLoader(false))
		}
	}
	
	const handlePaymentSuccessClose = () => {
		setOpenPaymentSuccessfull(false);
	}

	const helperTextChange = (event) => {
		
		const wordLenWord = waiverReasonFee.split(' ');
		if(wordLenWord.length > CHARACTER_LIMIT ) {
			if ( event.keyCode == 46 || event.keyCode == 8 ){

			}
			else if (event.keyCode < 48 || event.keyCode > 57 ) {
				event.preventDefault();
			}
		}
		
		const helperText = waiverReasonFee ? (CHARACTER_LIMIT - wordLenWord.length) : CHARACTER_LIMIT;

		return helperText;
	};

	/** CARD DELIVERY ADDRESS */

	const handleInputfieldChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		
		if (event.target.name === 'receiverMobileNumber'){
			if (isOnlyNumbers(event.target.value)){
				setFields({
					...fields,
					[event.target.name]: event.target.value,
				})
				setErrorMessage({
					...errorMessage,
					[event.target.name]: '',})
			}
		}
		else if (event.target.name == 'pincode' && event.target.value.trim().length === 6) {
			const pinCode = event.target.value;
			const response = await getPincodeData(event.target.value);
			if (response?.errors) {
				setErrorMessage((errorMessage) => ({
					...errorMessage,
					pincode: response?.errors[0].message,
					city: '',
					state: '',
				}));
				setFields({
					...fields,
					city: '',
					state: '',
					pincode: pinCode,
				
				})
			}
			 else {
				setFields({
					...fields,
					city: response?.data?.city,
					state: response?.data?.state,
					pincode: response?.data?.pincode
				})
				setErrorMessage((errorMessage) => ({
					...errorMessage,
					pincode: '',
					city: '',
					state: '',
				}));
			}
		}else if (event.target.name == 'pincode' && event.target.value.trim().length < 6) {
			if (isOnlyNumbers(event.target.value)){
				setFields({
					...fields,
					city: '',
					state: '',
					pincode: event.target.value
				})
				setErrorMessage((errorMessage) => ({
					...errorMessage,
					pincode: '',
					city: '',
					state: '',
				}));
			}
		} 
		else {
			setFields({
				...fields,
				[event.target.name]: event.target.value
			})
			setErrorMessage({
			...errorMessage,
			[event.target.name]: '',
		});
		}

		
	};
	
	// Button click on Edit Accordian
	const handleEdit = () => {
		setPaymentOptionDefault();
		setCardDeliveryEditable(true);
		setPaymentOption(false);
	};

	// Button click on Updating Address SAVE
	const handleSave = async () => {
		console.log("Update Fields", fields);
		if (validate()) {
			return null;
		} else {
			const response = await postCardDeliveryAddress(
				{
					addresses:
					{
						firstName: fields.receiverName?.trim(),
						// middleName: fields.receiverMiddleName,
						lastName: "",
						phone1: fields.receiverMobileNumber,
						id: responseAddress?.data?.addresses[0].id,
						applicationNumber: "",
						// receiverName: fields.receiverName,
						// receiverMobileNumber: fields.receiverMobileNumber,
						line1: fields.line1?.trim(),
						line2: fields.line2?.trim(),
						pincode: fields.pincode,
						city: fields.city,
						state: fields.state,
						addressType: "CARD",
					}
				});
			if (response?.status === "success" || response?.status === "updated") {
				setCardDeliveryEditable(false);
				setErrorMessage({});
				setPaymentOption(true);
				setShowSnackbar(true);
				setSnackbarMessage(SnackbarMessage.SAVE_API_SUCCESS)
				setAlertType("success");
			} else {
				const errorObj: any = {};
				response?.errors.forEach((element: any) => {
					if (!element.hasOwnProperty("subject")) {
						console.log("key not present : ", element?.subject);
						setApiOtherErrorMessage(element?.message);
					} else {
						errorObj[element?.subject] = element?.message;
					}
				});

				setErrorMessage((errorMessage) => ({
					...errorMessage,
					...errorObj,
				}));

				setErrorMessage({});
				setShowSnackbar(true);
				setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
				setAlertType("error");
			}
		}
	};

	// Button click on Updating Address CANCEL
	const handleCancel = () => {
		setFields({
			...fields,
			...cardDeliveryAddressBackup
		})
		setErrorMessage({})
		setCardDeliveryEditable(false);
		setPaymentOption(true);
	};

	/** UTILS FUNC */

	// Common Function for Showing success or error snakbar
	const showAlert = (message:string,isError : boolean) => {
		setShowSnackbar(true);
		setSnackbarMessage(message);
		setAlertType(isError ? "error" : "success");
	}

	const handleSubmit = async (type: any) => {
		event?.preventDefault();
		dispatch(setLoader(true));
		let response: ApiResponse = {};
		if(type === 'cashTransRefno'){
			response = await postRequestPaymentOption({
				applicationID: applicationSummary.applicationNumber,
				otpAuthToken: "",
				paymentType: "FEES_PAID",
				referenceNumber: cashTransRefno,
				feesToPay: applicationSummary.amountToBePaid,
				reasonForRequest:"",
				numberOfCards: applicationSummary.numberOfCards
			});
		}else if(type === 'waiverReasonFee'){
			response = await postRequestPaymentOption({
				applicationID: applicationSummary.applicationNumber,
				otpAuthToken: "",
				paymentType: "FEE_WAIVER",
				referenceNumber: "",
				feesToPay: applicationSummary.amountToBePaid,
				reasonForRequest:waiverReasonFee,
				numberOfCards: applicationSummary.numberOfCards
			});
		}

		if (response?.status === "success" || response?.status == 'true') {
			dispatch(setLoader(false));
			setPaymentSuccessResponse(response.data);
			showAlert(SnackbarMessage.SAVE_API_SUCCESS, false);
			setOpenPaymentSuccessfull(true);
			setCashTransRefno('');
			setWaiverReasonFee('');
		}
		else if (response?.status === "error") {
			dispatch(setLoader(false));
			showAlert(response?.errors[0].message, true);
			setCashTransRefno('');
			setWaiverReasonFee('');
		}
		else {
			dispatch(setLoader(false));
		}

	}
	//payment Option selected by default
	const setPaymentOptionDefault = () => {
		setCashTransRefno('');
		setWaiverReasonFee('');
	}

	const validate = (): boolean => {
		let isError: boolean = false;
	
		// validate receiverName
		if (!fields.receiverName) {
		  isError = true;
		  setErrorMessage((errorMessage) => ({
			...errorMessage,
			receiverName: validationErrorMessage.REQUIRED,
		  }));
		} else if (!validateRefName(fields.receiverName)) {
		  isError = true;
		  setErrorMessage((errorMessage) => ({
			...errorMessage,
			receiverName: validationErrorMessage.INVALID_NAME,
		  }));
		}
	
		// validate receiverMobileNumber
		if (!fields.receiverMobileNumber) {
		  isError = true;
		  setErrorMessage((errorMessage) => ({
			...errorMessage,
			receiverMobileNumber: validationErrorMessage.REQUIRED,
		  }));
		} else if (
		  // !validator.isMobilePhone(fields.receiverMobileNumber, ["en-IN"])
		  !isValidMobileNumber(fields.receiverMobileNumber)
		) {
		  isError = true;
		  setErrorMessage((errorMessage) => ({
			...errorMessage,
			receiverMobileNumber: validationErrorMessage.MOBILE_NUMBER,
		  }));
		}

		// validate Address
		if (!fields.line1) {
			isError = true;
			setErrorMessage((errorMessage) => ({
			  ...errorMessage,
			  line1: validationErrorMessage.REQUIRED,
			}));
		  } else if (
			!validateAddress(fields.line1)
		  ) {
			isError = true;
			setErrorMessage((errorMessage) => ({
			  ...errorMessage,
			  line1: validationErrorMessage.ADDRESSLINE,
			}));
		  }

		if(fields.line2 && !validateAddress(fields.line2)){
			isError = true;
			setErrorMessage((errorMessage) => ({
			  ...errorMessage,
			  line2: validationErrorMessage.ADDRESSLINE,
			}));
		}
		return isError;
	};

	const numberWithCommas = (value: any) => {
		const parts = value?.toString().split(".");
		parts[0] = parts[0].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	const validateRefName = (value: any) => {
		const regexName = /^[^\s][a-zA-Z ]*[^\s]$/;
		if (regexName.test(value)) {
			return true;
		} else {
			return false;
		}
	}

	const validateAddress = (value: any) => {
		const regexAddress = /^[^\s][a-zA-Z\s0-9,\.]*[^\s]$/;
		if (regexAddress.test(value)) {
			return true;
		} else {
			return false;
		}
	}

	return (
		<React.Fragment>
			<div className={classes.customSidebar}></div>
			<form className={classes.form}>
				<div className={classes.paymentInline}>
					<img src={BackIcon} className={classes.paymentBack} onClick={handleEdit} />
					<Typography className={classes.paymentText}>Payment</Typography>
				</div>
				<div className={classes.AccordionContainer}>
					<Accordion expanded className={classes.paymentAccordion}>
						<AccordionSummary className={classes.paymentAccordionSummary}>
							<DescriptionOutlinedIcon className={classes.accordionIcon} />
							<Typography className={classes.accordionTitle}>Application Summary</Typography>
						</AccordionSummary>
						<AccordionDetails className={classes.accordionDetails}>
							<Grid container spacing={2}>
								<Grid item xs={6} sm={4} md={2}>
									<CustomLabel htmlFor="no-of-cards" className={classes.noOfCards}>
										No. of Cards
									</CustomLabel>
									<Typography> {applicationSummary.numberOfCards} Physical Cards</Typography>
								</Grid>
								<span className={classes.vl}></span>

								<Grid item xs={6} sm={4} md={3}>
									<CustomLabel htmlFor="amount-to-be-paid" className={classes.amountToBePaid}>
										Amount to be paid
									</CustomLabel>
									<Typography>₹ {getFormattedNumber(applicationSummary.amountToBePaid,2)}</Typography>
								</Grid>
							</Grid>
						</AccordionDetails>
					</Accordion>
				</div>

				{/* CORRESPONDENCE ADDRESS SECTION */}
				<div className={classes.AccordionContainer}>
					<Accordion expanded className={classes.paymentAccordion}>
						<AccordionSummary className={classes.paymentAccordionSummary}>
							<PersonOutlineOutlinedIcon className={classes.accordionIcon} />
							<Typography className={classes.accordionTitle}>Card Delivery Address</Typography>
							<span className="ml-auto">
								<Typography className={classes.lock}>
									{!isCardDeliveryEditable && (
										<img src={EditIcon} className={classes.lockIcon} onClick={handleEdit} />
									)}
								</Typography>
							</span>
						</AccordionSummary>
						<AccordionDetails className={classes.accordionDetails}>
							{!isCardDeliveryEditable ? (
								<Grid container spacing={0}>
									<Grid item >
										<Typography className={classes.name}>{fields.receiverName}</Typography>
									</Grid>
									{/* <span className={classes.vl}></span> */}
									<Grid item >
										<Typography className={classes.mobNo}>{fields.receiverMobileNumber}</Typography>
									</Grid>
									<Grid item xs={12} sm={8}>
										<Typography className={classes.address}>
											{' '}
											{fields.line1 ? fields.line1 + ', ' : ''}
											{fields.line2 ? fields.line2 + ', ' : ''}
											{fields.city ? fields.city + ', ' : ''}
											{fields.state ? fields.state + ',' : ''}
											{fields.pincode ? fields.pincode : ''}
										</Typography>
									</Grid>
								</Grid>
							) : (
									<div>
										<Grid container spacing={10} className="py-5">
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="receiverName">Name *</CustomLabel>
												<CustomTextField
													id="receiverName"
													placeholder="Enter your name"
													variant="outlined"
													name="receiverName"
													inputProps={{ maxLength: 256 }}
													onChange={handleInputfieldChange}
													value={fields.receiverName}
													error={!!errorMessage.receiverName}
													helperText={errorMessage.receiverName && errorMessage.receiverName}
													InputProps={{
														endAdornment: errorMessage.receiverName && (
															<InputAdornment position="end">
																<CustomSvgIcon iconsource={WarningIcon} />
															</InputAdornment>
														)
													}}
												/>
											</Grid>
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="receiverMobileNumber">Mobile Number *</CustomLabel>
												<CustomTextField
													id="receiverMobileNumber"
													placeholder="Enter your no."
													variant="outlined"
													name="receiverMobileNumber"
													inputProps={{ maxLength: 10 }}
													value={fields.receiverMobileNumber}
													onChange={handleInputfieldChange}
													error={!!errorMessage.receiverMobileNumber}
													helperText={errorMessage?.receiverMobileNumber}
													InputProps={{
														endAdornment: errorMessage?.receiverMobileNumber && (
															<InputAdornment position="end">
																<CustomSvgIcon iconsource={WarningIcon} />
															</InputAdornment>
														)
													}}
												/>
											</Grid>
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="line1">Address Line 1 *</CustomLabel>
												<CustomTextField
													id="line1"
													placeholder="Building No, Floor, Office"
													variant="outlined"
													name="line1"
													inputProps={{ maxLength: 256 }}
													onChange={handleInputfieldChange}
													value={fields.line1}
													error={!!errorMessage.line1}
													helperText={errorMessage?.line1}
													InputProps={{
														endAdornment: errorMessage?.line1 && (
															<InputAdornment position="end">
																<CustomSvgIcon iconsource={WarningIcon} />
															</InputAdornment>
														)
													}}
												/>
											</Grid>
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="line2">Address Line 2</CustomLabel>
												<CustomTextField
													id="line2"
													placeholder="Building No, Floor, Office"
													variant="outlined"
													name="line2"
													inputProps={{ maxLength: 256 }}
													onChange={handleInputfieldChange}
													value={fields.line2}
													error={!!errorMessage.line2}
													helperText={errorMessage?.line2}
													InputProps={{
														endAdornment: errorMessage?.line2 && (
															<InputAdornment position="end">
																<CustomSvgIcon iconsource={WarningIcon} />
															</InputAdornment>
														)
													}}
												/>
											</Grid>
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="pincode">Pin Code *</CustomLabel>
												<CustomTextField
													id="pincode"
													placeholder="560100"
													variant="outlined"
													type="text"
													name="pincode"
													className={classes.pinInput}
													inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
													onChange={handleInputfieldChange}
													value={fields.pincode}
													error={!!errorMessage.pincode}
													helperText={errorMessage?.pincode}
													InputProps={{
														endAdornment: errorMessage?.pincode && (
															<InputAdornment position="end">
																<CustomSvgIcon iconsource={WarningIcon} />
															</InputAdornment>
														)
													}}
												/>
											</Grid>
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="city">City *</CustomLabel>
												<CustomTextField
													id="city"
													placeholder="Bangalore"
													variant="outlined"
													name="city"
													className={classes.disabledtext}
													inputProps={{ maxLength: 256 }}
													onChange={handleInputfieldChange}
													value={fields.city}
													disabled
												/>
											</Grid>
											<Grid item xs={12} sm={4} className="py-0">
												<CustomLabel htmlFor="state">State *</CustomLabel>
												<CustomTextField
													id="state"
													placeholder="Karnataka"
													variant="outlined"
													name="state"
													inputProps={{ maxLength: 256 }}
													onChange={handleInputfieldChange}
													className={classes.disabledtext}
													value={fields.state}
													disabled
												/>
											</Grid>
										</Grid>
										<Grid container>
											<Grid item className="ml-auto">
												<CustomButton
													variant="outlined"
													color="primary"
													className="mr-4"
													onClick={handleCancel}
												>
													Cancel
											</CustomButton>
												<CustomButton variant="contained" color="primary" onClick={handleSave} disabled={!fields.receiverName || !fields.receiverMobileNumber || !fields.line1 || !fields.pincode || fields.pincode?.length < 6 } >
													Save
											</CustomButton>
											</Grid>
										</Grid>
									</div>
								)}
						</AccordionDetails>
					</Accordion>
				</div>

				{/* PAYMENT OPTION SECTION */}
				<div className={classes.AccordionContainer}>
					<Accordion disabled={isCardDeliveryEditable || isAmountToBePaid} className={classes.paymentAccordion}>
						<AccordionSummary className={classes.paymentAccordionSummary}>
							<PaymentOutlinedIcon className={isCardDeliveryEditable ? classes.accordionIconDisabled : classes.accordionIcon} />
							<Typography className={isCardDeliveryEditable ? classes.accordionTitleDisabled : classes.accordionTitle}>Payment Option</Typography>
							{!isCardDeliveryEditable && <span className="ml-auto">
								<Typography className={classes.lock}>
									<LockIcon className={classes.lockIcon} /> All transactions are secured and encrypted
								</Typography>
							</span>}
						</AccordionSummary>

						{isPaymentOption ? (
							<AccordionDetails className={classes.accordionDetails}>
								<Grid container spacing={0}>
									<Grid item xs={12} sm={12}>
										<RadioGroup
											aria-label="payment"
											name="payment"
											value={paymentOptionValue}
											onChange={handleRadioChange}
											className={classes.radiobtnGroup}
										>
											<FormControlLabel
												value={paymentOptions.PAY_BY_CMS_WALLET}
												control={<BlueRadio />}
												onClick={(event) => event.preventDefault()}
												className={paymentOptionValue === paymentOptions.PAY_BY_CMS_WALLET ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel} pb-0 mb-0`}
												label={getRadioLabel(paymentOptions.PAY_BY_CMS_WALLET)}
											/>
											<Typography className={classes.availableBal}>
												Available Balance ₹  {getFormattedNumber(applicationSummary.cmsWalletBalance ? applicationSummary.cmsWalletBalance : 0,2)}
											</Typography>
											{paymentOptionValue === paymentOptions.PAY_BY_CMS_WALLET && (
												<Grid container className={classes.payNowContainer}>
													<Grid item xs={12}>
														<CustomButton
															variant="contained"
															color="primary"
															onClick={() => handlePayNow(paymentOptionValue)}
															disabled={Number(applicationSummary.cmsWalletBalance) < Number(applicationSummary.amountToBePaid)}
															className={classes.btnSubmit}
														>
															PAY NOW
													</CustomButton>
														{Number(applicationSummary.cmsWalletBalance) < Number(applicationSummary.amountToBePaid) && <div className={classes.cmsWalletError}><p>{`Insufficient balance. Add ₹ ${getFormattedNumber(Number(applicationSummary.amountToBePaid) - Number(applicationSummary.cmsWalletBalance),2)} to your CMS wallet or select a different payment option.`}</p><a href="#" >Recharge Wallet</a></div>}
													</Grid>
												</Grid>
											)}
											<FormControlLabel
												className={paymentOptionValue === paymentOptions.PAY_BY_PETROMILES ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel} pb-0 mb-0`}
												value={paymentOptions.PAY_BY_PETROMILES}
												control={<BlueRadio />}
												onClick={(event) => event.preventDefault()}
												label={getRadioLabel(paymentOptions.PAY_BY_PETROMILES)}
											
											/>
											<Typography className={classes.availableBal}>
												<b>Available Points</b> {numberWithCommas(applicationSummary.petromilesPoints ? applicationSummary.petromilesPoints : 0)}
											</Typography>
											
											
											{paymentOptionValue === paymentOptions.PAY_BY_PETROMILES && (
												<div>
												<Typography className={classes.availableBal}>
												<b>Required Points</b> <br/> {numberWithCommas(applicationSummary.requiredPetroMilesPoints ? applicationSummary.requiredPetroMilesPoints : 0)}
											</Typography>
												<Grid container className={classes.payNowContainer}>
													<Grid item xs={12}>
														<CustomButton variant="contained" disabled={Number(applicationSummary.petromilesPoints) < Number(applicationSummary.requiredPetroMilesPoints)} color="primary" onClick={() => handlePayNow(paymentOptionValue)} className={classes.btnSubmit} >
														
															PAY NOW
													</CustomButton>
													</Grid>
												</Grid>
												</div>
											)}
											{paymentOptionValue === paymentOptions.PAY_BY_PETROMILES && (Number(applicationSummary.petromilesPoints) < Number(applicationSummary.requiredPetroMilesPoints)) ? (
											<div className={classes.petromilesError}
											>
												<Typography variant="body1" color="error">Insufficient points. Please select a different payment option.</Typography>
											</div>
											 ) : ""} 
											<FormControlLabel value={paymentOptions.UPI} onClick={(event) => event.preventDefault()}  control={<BlueRadio />} label={getRadioLabel(paymentOptions.UPI)} className={paymentOptionValue === paymentOptions.UPI ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel}`} />
											<FormControlLabel value={paymentOptions.WALLETS} onClick={(event) => event.preventDefault()} control={<BlueRadio />} label={getRadioLabel(paymentOptions.WALLETS)} className={paymentOptionValue === paymentOptions.WALLETS ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel}`} />
											<FormControlLabel
												value={paymentOptions.DEBIT}
												control={<BlueRadio />}
												onClick={(event) => event.preventDefault()}
												label={getRadioLabel(paymentOptions.DEBIT)}
												className={paymentOptionValue === paymentOptions.DEBIT ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel}`}
											/>
											<FormControlLabel
												value={paymentOptions.FEES_PAID}
												control={<BlueRadio />}
												onClick={(event) => event.preventDefault()}
												className={paymentOptionValue === paymentOptions.FEES_PAID ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel}`}
												label={getRadioLabel(paymentOptions.FEES_PAID)}
											/>
											{paymentOptionValue === paymentOptions.FEES_PAID && (
												<Grid container className={classes.inputContainer}>
													<Grid item>
														<CustomLabel htmlFor="receiverName" className={classes.transationRefrenTitle}>
															Transaction Reference No.
														<CustomTooltip
																enterTouchDelay={0}
																disableFocusListener
																title="The transaction reference number received for making the payment at the fuel station."
																placement="bottom-start"
															>
																<img
																	src={InfoIcon}
																	alt="Info for custom card name"
																	className={classes.infoRight}
																></img>
															</CustomTooltip>
														</CustomLabel>


														<CustomTextField
															id="cashTransRefno"
															placeholder=""
															variant="outlined"
															name="cashTransRefno"
															inputProps={{ maxLength: 256 }}
															onChange={handlePaymentOptionFieldChange}
															value={cashTransRefno}
															className={`${classes.transationRefrenceNo}`}
														/>
													</Grid>
													<Typography variant="caption" display="block" className={classes.paidFuelStationCaption} gutterBottom>
														The transaction reference number shall be subject to verification.
      											</Typography>
													<CustomButton
														variant="contained"
														color="primary"
														disabled={!cashTransRefno}
														onClick={() => handleSubmit("cashTransRefno")}
														className={classes.btnSubmit}
													>

														SUBMIT

													</CustomButton>
												</Grid>
											)}
											<FormControlLabel
												value={paymentOptions.FEE_WAIVER}
												control={<BlueRadio />}
												onClick={(event) => event.preventDefault()}
												className={paymentOptionValue === paymentOptions.FEE_WAIVER ? classes.paymentOptionLabel1 : `${classes.paymentOptionLabel}`}
												label={getRadioLabel(paymentOptions.FEE_WAIVER)}
											/>
											{paymentOptionValue === paymentOptions.FEE_WAIVER && (
												<Grid container className={classes.inputContainer}>
													<Grid item>
														<Typography variant="caption" display="block" className={`${classes.paidFuelStationCaption} mt-0`} gutterBottom>
															Your request would be subject to Bharat Petroleum’s approval
													</Typography>
														<CustomLabel htmlFor="receiverName">Reason for Fee Waiver</CustomLabel>

														<Grid item className={classes.resonReject}>
															<CustomTextField
																id="waiverReasonFee"
																placeholder="Type your reason for rejection"
																variant="outlined"
																name="waiverReasonFee"
																onChange={handlePaymentOptionFieldChange}
																multiline
																// inputProps={{
																// 	maxlength: CHARACTER_LIMIT
																// }}
																helperText={`${helperTextChange()} word remaining`}
																rowsMax={4}
																className={classes.resoneForFreeTextarea}
																value={waiverReasonFee}
															/>
															{/* <span>20 words remaining</span> */}
														</Grid>

														<CustomButton
															variant="contained"
															color="primary"
															disabled={!waiverReasonFee}
															onClick={() => handleSubmit("waiverReasonFee")}
															className={classes.btnSubmit}>
															SUBMIT
													</CustomButton>
													</Grid>
												</Grid>
											)}
										</RadioGroup>
									</Grid>
								</Grid>
							</AccordionDetails>
						) : (
								<> </>
							)}
					</Accordion>

				</div>
			</form>
			<OtpMobile
				open={openOtpModal}
				handleOtpClose={handleOtpClose}
				customerMobile={getMaskedMobileNumber(response?.data?.receiverMobileNumber)}
				handleOtpVerify={handleOtpVerify}
				handlePayNow={handlePayNow}
			/>
			<PaymentSuccess
				open={openPaymentSuccessfull}
				handlePaymentSuccessClose={handlePaymentSuccessClose}
				selectedPaymentType={paymentOptionValue}
				successResponse={paymentSuccessResponse} 
				/>
			<CustomSnackbar
				open={showSnackbar}
				close={setShowSnackbar}
				type={alertType}
				message={snackbarMessage}
			></CustomSnackbar>
		</React.Fragment>
	);
};

export default Payment;
