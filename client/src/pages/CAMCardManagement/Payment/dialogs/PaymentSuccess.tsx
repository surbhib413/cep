import React from "react";
import { Button, Grid, makeStyles, Switch, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
const requestSentImg = "/payments/payment_successful.svg";
const applicationSubmitImg = "/payments/application_submitted.svg";
import { paymentOptions } from '../Payment';
import DialogWrapper from "./DialogWrapper";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { getFormattedNumber } from '../Payment'; 

const useStyles = makeStyles((theme) => ({
  subLabel: {
    fontSize: "1rem",
    color: "#354463",
    lineHeight: "1.5",
    width:'480px',
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.8125rem",
      width:'100%',
    },
  },
  btnDialog: {
    height: "40px",
    width: "100%",
    fontSize: "12px", // !important
    fontWeight: "bold", // !important
    letterSpacing: "0.6px",
  },
  btnDialogContainer: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
  applicationDetails: {
    backgroundColor: "#e6f1fe",
    margin: "1.5rem 0px",
    padding: "1rem",
    borderRadius: "4px"
  },
  tableHead: {
    fontWeight: 600,
    whiteSpace: "nowrap",
    textAlign: "initial",
    padding: "6px 0px",
    color: "#354463",
    [theme.breakpoints.down("xs")]: {
     fontSize: '13px',
    },
  },
  tableBody: {
    textAlign: "initial",
    paddingLeft: "1rem",
    color: "#354463",
    [theme.breakpoints.down("xs")]: {
      fontSize: '13px',
     },
  },
  popupDetails:{
    width:'480px',
    padding: '8px 0',
    margin: 'auto',
    [theme.breakpoints.down("xs")]: {
      width:'100%',
    },
  },
  tablePopup:{
    width: '100%',
    wordBreak: 'break-all',
  }
}));

function PaymentSuccess({successResponse, open = false, data = successResponse, handlePaymentSuccessClose = () => { }, selectedPaymentType }: any) {
  console.log("SUCESSSSSSSS",data)
  const classes = useStyles();
  const router = useRouter();

  const handleClose = () => {
    router.push({ pathname: "/cam/card-management" });
    // handlePaymentSuccessClose();
  };

  const getDialogTitle = (type: paymentOptions) => {
    switch (type) {
      case paymentOptions.PAY_BY_CMS_WALLET:
      case paymentOptions.PAY_BY_PETROMILES:
        return "Payment Successful";
      case paymentOptions.FEE_WAIVER:
      case paymentOptions.FEES_PAID:
        return "Application Submitted";
      default:
        return;
    }
  }

  const paymentTypeDetails = (type: paymentOptions) => {
    switch (type) {
      case paymentOptions.PAY_BY_CMS_WALLET:
        return "CMS BALANCE";
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

  const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // return JSX
  const getHeaderImage = (paymentType: paymentOptions) => {
    const HeaderImage = (props: any) => <img className={`p-3`} src={props.src} alt="requestSentImg" />;

    switch (paymentType) {
      case paymentOptions.PAY_BY_CMS_WALLET:
        return <HeaderImage src={requestSentImg} />
      case paymentOptions.PAY_BY_PETROMILES:
        return <HeaderImage src={applicationSubmitImg} />
      case paymentOptions.FEE_WAIVER:
      case paymentOptions.FEES_PAID:
        return <HeaderImage src={applicationSubmitImg} />
      default:
        return;
    }
  }

  // return JSX
  const getBodyTitle = (paymentType: paymentOptions) => {
    //style={{ textAlign: "-webkit-center" }}
    const TitlePayment = () => <>
      <Grid item sm={12} justify="center">
        <span className={`${classes.subLabel}`}>
          Your payment was successful.
                      </span>
                      
      </Grid>
      <Grid item sm={12} xs={12} justify="center">
        <span className={`${classes.subLabel}`}>
          An invoice copy has been sent to <b>{data.customerEmail}</b>
        </span>
      </Grid>
    </>;

    const TitleApplication = (props: any) => <>
        <span className={`${classes.subLabel}`}>
          {props.text}
        </span>
    </>;

    switch (paymentType) {
      case paymentOptions.PAY_BY_CMS_WALLET:
      case paymentOptions.PAY_BY_PETROMILES:
        return <TitlePayment />
      case paymentOptions.FEE_WAIVER:
        return <TitleApplication text="Your request for Fee Waiver has been initiated. The request would be subject to Bharat Petroleum’s approval" />
      case paymentOptions.FEES_PAID:
        return <TitleApplication text="The application would be subject to Bharat Petroleum’s approval" />
      default:
        return;
    }

  }
  
  const handleCTA = (paymentType : paymentOptions) => {
    if(paymentType == paymentOptions.PAY_BY_CMS_WALLET || paymentType == paymentOptions.PAY_BY_PETROMILES){
      window.open(data.invoice_link, "_blank");
    }
    else if (paymentType == paymentOptions.FEES_PAID || paymentType == paymentOptions.FEE_WAIVER)
    router.push(`/cam/card-management/viewapplication/${data.applicationNumber}`);
  }

  // return JSX
  const getBodyContent = (paymentType: paymentOptions) => {
    const Content = (props: any) => <span className={`${classes.subLabel}`}>{props.text}</span>

    switch (paymentType) {
      case paymentOptions.PAY_BY_CMS_WALLET :
      case paymentOptions.PAY_BY_PETROMILES :
        return <Content text={`Your cards will be dispatched in 15-20 working days`} />
      case paymentOptions.FEES_PAID:
        return <Content text=" Your cards will be dispatched in 15-20 working days post payment verification" />
      case paymentOptions.FEE_WAIVER:
        return <Content text="Your cards will be dispatched in 15-20 working days post approval" />
    }
  }

  // return JSX
  const getTableContent = (paymentType: paymentOptions, props: any) => {
    console.log("wgedfvg",successResponse, data)
    console.log("PAyment Type", paymentType)
    let dataArr:any = []
    switch (paymentType) {
      case paymentOptions.PAY_BY_CMS_WALLET:
        dataArr.push({key : 'Application Summary',value:`${data.numberOfCards} ${data.cardType} Cards`})
        dataArr.push({key : 'Application ID',value:data.applicationNumber})
        dataArr.push({key : 'Payment Type',value:`${paymentTypeDetails(data?.paymentDetails?.paymentType)}`})
        // dataArr.push({key : 'Payment Type',value:data.paymentDetails && data.paymentDetails.paymentType})
        dataArr.push({key : 'CMS Wallet Balance',value:`₹ ${getFormattedNumber(data.cmsWalletBalance,2)}`})
        dataArr.push({key : 'Amount paid',value:`₹ ${data.paymentDetails && getFormattedNumber(data.paymentDetails.amountPaid,2)}`})
        break; 
        case paymentOptions.PAY_BY_PETROMILES:
          dataArr.push({key : 'Application Summary',value:`${data.numberOfCards} ${data.cardType} Cards`})
          dataArr.push({key : 'Application ID',value:data.applicationNumber})
          dataArr.push({key : 'Payment Type',value:`${paymentTypeDetails(data?.paymentDetails?.paymentType)}`})
          // dataArr.push({key : 'Payment Type',value:data.paymentDetails && data.paymentDetails.paymentType})
          dataArr.push({key : 'Petromiles Balance',value:data.petromilesPoints})
          dataArr.push({key : 'Points Redeemed', value :data.paymentDetails && data.paymentDetails.amountPaid})
          break; 
      case paymentOptions.FEES_PAID:
        dataArr.push({key : 'Application Summary',value:`${data.numberOfCards} ${data.cardType} Cards`})
        dataArr.push({key : 'Application ID',value:data.applicationNumber})
        dataArr.push({key : 'Payment Type',value:`${paymentTypeDetails(data?.paymentDetails?.paymentType)}`})
        // dataArr.push({key : 'Payment Type',value:data.paymentDetails && data.paymentDetails.paymentType})
        dataArr.push({key : 'Transaction Reference No.',value:data.paymentDetails && data.paymentDetails.referenceNumber})
        dataArr.push({key : 'Amount paid',value:`₹ ${data.paymentDetails && getFormattedNumber(data.paymentDetails.amountPaid,2)}`})
        break;
      case paymentOptions.FEE_WAIVER:
        dataArr.push({key : 'Application Summary',value:`${data.numberOfCards} ${data.cardType} Cards`})
        dataArr.push({key : 'Application ID',value:data.applicationNumber})
        dataArr.push({key : 'Payment Type',value:`${paymentTypeDetails(data?.paymentDetails?.paymentType)}`})
        // dataArr.push({key : 'Payment Type',value:data.paymentDetails && data.paymentDetails.paymentType})
        dataArr.push({key : 'Amount paid',value:`₹ ${data.paymentDetails && getFormattedNumber(data.paymentDetails.amountPaid,2)}`})
        break;
    }

    return dataArr.map((item:any) => {
      return (
        <tr>
          <td className={classes.tableHead}>{item.key}</td>
          <td className={classes.tableBody}>{item.value}</td>
        </tr>
      )
    })
  }

  const getButtonText = (paymentType: paymentOptions) => {
    
    if(paymentType == paymentOptions.PAY_BY_CMS_WALLET || paymentType == paymentOptions.PAY_BY_PETROMILES){
      return 'Download Invoice'
    }else if(paymentType == paymentOptions.FEES_PAID || paymentType == paymentOptions.FEE_WAIVER){
      return 'View Application'
    }
  }
 

  return (
    
    <DialogWrapper disableBackdropClick disableEscapeKeyDown fullScreen={fullScreen} open={open} title={getDialogTitle(selectedPaymentType)} handleClose={handleClose}>
      {getHeaderImage(selectedPaymentType)}
      <Grid container spacing={2} justify="center">
      <Grid item sm={10} xs={8} md={12}>
        <Typography className={classes.popupDetails}>
          {getBodyTitle(selectedPaymentType)}
          {console.log("ppppp",paymentOptions)}
        </Typography>
      </Grid>
        <br />
        <Grid item sm={10} xs={8} md={12}>
          <Typography>
            {getBodyContent(selectedPaymentType)}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={11} sm={9}>
          <div className={classes.applicationDetails}>
            <table className={classes.tablePopup}>
              {getTableContent(selectedPaymentType)}
            </table>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="center" className={classes.btnDialogContainer}>
        <Grid
          item
          xs={11}
          sm={6}
        >
          <Button
            className={` ${classes.btnDialog}`}
            variant="outlined"
            color="primary"
            onClick={() => handleCTA(selectedPaymentType)}
            // onClick={() => window.open(data.invoice_link, "_blank")}
            disableElevation
          >
            {getButtonText(selectedPaymentType)}
          </Button>
        </Grid>
        <Grid item xs={11} sm={6}>
          <Button
            className={`${classes.btnDialog}`}
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleClose}
          >
            Back to Card Management
          </Button>
        </Grid>
      </Grid>
    </DialogWrapper>
  );
}

export default PaymentSuccess;
