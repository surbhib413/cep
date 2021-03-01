import React, { useState,useEffect } from 'react';
// import React, { useEffect } from 'react';
import { Container, Paper, Typography, Grid, Divider } from '@material-ui/core';
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { Popup3 } from "../../../components/CustomPopups/Popup3/Popup3";
import styles from "./ViewApplication.module.scss";
import { getAddresses,getApplicationDetails } from '../../../lib/api/cardpayment/cardpayment'
import { AmpStoriesOutlined } from '@material-ui/icons';
const applicationDetailsIcon = "/application_details_icon.svg";
const applicationDetailsuserIcon = "/application_details_user_icon.svg";
const applicationDetailstypeIcon = "/application_details_payment_icon.svg";
const applicationDetailsstatusIcon = "/application_details_status_icon.svg";
const applicationDetailserrorIcon = "/application_details_error_icon.svg";
import { getFormattedNumber } from '../Payment/Payment'; 

const ViewApplication = (props: { history: any }): JSX.Element => {
    // const initViewApplicationObj = {
    //     application_id: 'QA123456789',
    //     name: 'John Doe',
    //     payment_type: 'Paid at Fuel Station',
    //     application_type: 'Additional Card Insurance',
    //     application_summary: '2 Physical Cards',
    //     mobile_no: '9123456789',
    //     amount_paid: '₹ 100.00',
    //     card_del_address: '#64 Godown Lot, LBS Marg, Mumbai, Maharashtra, 400080',
    //     trans_red_no: 'AQWE78179170',
    //     payment_status: 'Rejected', // Payment Pending , Paid , Rejected, Approved
    //     card_insurance_status: 'DELIVERED', // NOT APPLICABLE ,APPLIED, DISPATCH, INTRANSIT, DELIVERED
    // };
    const [applicationData, setApplicationData] = useState({});
    const [addressData, setAddressData] = useState({});


    const btnBkToTrakApp = () => {
        console.log('Button Back to Trak Application')
    }

    const btnUpdate = () => {
        console.log('Button Update Payment')
    }
    const [openPopup3, setOpenPopup3] = useState(false);
    const handlePopup3Click = () => {
        setOpenPopup3(true);
    };
    const { applicationResponse, addressResponse } = props;
    
    const paymentType = (type) => {
        console.log("type",type);
        
        switch(type) {
          case 'CMS_WALLET':
            return "CMS Wallet";
          case 'PETROMILES':
            return "Petromiles";
          case 'DEBIT':
            return "Debit";
          case 'CASH':
            return "Cash";
          case 'UPI':
            return "UPI";
          case 'FEE_WAIVER':
            return "Request for fee waiver";
          case 'FEES_PAID':
            return <p>Paid at Fuel Station</p>;
            default :
            return ;
        }
      }
	useEffect(() => {
        console.log('rrr', props)
		// Get Data from API
		if (applicationResponse?.status === "success" && addressResponse?.status === "success") {
			// const { amountToBePaid, cardType, cmsWalletBalance, numberOfCards, requiredPetroMilesPoints, cardDeliveryAddress } = response;
            setApplicationData(applicationResponse.data)
            
            if(!addressResponse?.data?.addresses[0].firstName){
                addressResponse.data.addresses[0].receiverName = applicationResponse?.data.receiverName;
            }else {
                addressResponse.data.addresses[0].receiverName = addressResponse?.data?.addresses[0].firstName;
            }
            if(!addressResponse?.data?.addresses[0].phone1){
                addressResponse.data.addresses[0].receiverMobileNumber = applicationResponse?.data.receiverMobileNumber;
            }else {
                addressResponse.data.addresses[0].receiverMobileNumber = addressResponse?.data?.addresses[0].phone1;
            }
            setAddressData(addressResponse.data.addresses[0])
            console.log("reciver Name", addressResponse.data.addresses[0].receiverName);
        }else{
            
        }
    },[])
    
    return (
        <>

            <div className={`${styles.customSidebar}`}></div>
            <Container maxWidth="lg" className={`px-0 px-sm-4`}>
                <Paper className={`px-3 px-sm-5 py-2 py-sm-3 ${styles.headerPaper}`} elevation={0}>
                    <Typography className={` mt-4 pb-2 ${styles.mainCustomTitle} `} variant="h3" color="primary">View Application</Typography>
                    {applicationData.status == 'Rejected' ?
                        <Paper className={` p-4 ${styles.rejectedPaper} justify-content-center `} elevation={0}>
                            <img className={`${styles.erroricon}`} src={applicationDetailserrorIcon} alt="" />
                            <Typography className={`ml-5 mb-2`} variant="body2">Your payment verification has been rejected.</Typography>
                            <Typography className={`ml-5 mb-2`} variant="body2">Update your payment by entering the correct reference no. or use an alternate payment type.</Typography>
                        </Paper> :
                        <></>
                    }
                    <Typography className={`mt-4`} variant="h6" >Application Details</Typography>
                    <Paper className={`py-4 mt-md-4 mt-1 mb-md-5 mb-3 ${styles.backPaper}`} elevation={0} square >
                        <Grid className={`px-2 px-md-4`} container spacing={0}>
                            <Grid className={`px-md-2 pl-2 my-2 position-relative`} container item md={4} xs={7} spacing={0}>
                                <img className={`${styles.imageStyle}`} src={applicationDetailsIcon} alt="" />
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Application ID
                                    </p>
                                    <p className={`${styles.subText}`}>
                                        {applicationData.applicationNumber}
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-md-5 pl-2 my-2`} container item md={4} xs={5} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Application Type
                                    </p>
                                    <p className={`${styles.subText}`}>
                                        {applicationData.applicationType}
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-5 my-2`} container item md={4} xs={7} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Application Summary
                                    </p>
                                    <p className={`${styles.subText}`}>
                                    {applicationData.numberOfCards}    {applicationData.cardType}  
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                        <div className={`my-4 ${styles.divider}`} />
                        <Grid className={`px-2 px-md-4`} container spacing={0}>
                            <Grid className={`px-md-2 pl-2 my-2 position-relative`} container item md={4} xs={7} spacing={0}>
                                <img className={`${styles.imageStyle}`} src={applicationDetailsuserIcon} alt="" />
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Name
                                    </p>
                                    <p className={`${styles.subText}`}>  {addressData.receiverName} 
                                        {/* {`${addressData.firstName} 
                                        ${addressData.middleName} 
                                        ${addressData.lastName}`} */}
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-md-5 pl-2 my-2`} container item md={4} xs={5} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Mobile No
                                    </p>
                                    <p className={`${styles.subText}`}>
                                        {addressData.receiverMobileNumber}
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-5 my-2`} container item md={4} xs={7} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Card Delivery Address
                                    </p>
                                    <p className={`${styles.subText}`}>
                                        {addressData.formattedAddress}
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                        <div className={`my-4 ${styles.divider}`} />
                        <Grid className={`px-2 px-md-4`} container spacing={0}>
                            <Grid className={`px-md-2 pl-2 my-2 position-relative ${styles.cmsWalletBalance}`} container item md={4} xs={7} spacing={0}>
                                <img className={`${styles.imageStyle}`} src={applicationDetailstypeIcon} alt="" />
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Payment Type
                                    </p>
                                    <p className={`${styles.subText}`}>
                                        {paymentType(applicationData?.paymentDetails?.paymentType)}
                                        
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-md-5 pl-2 my-2`} container item md={4} xs={5} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Amount Paid
                                    </p>
                                    <p className={`${styles.subText}`}>
                                    ₹ {getFormattedNumber(applicationData.paymentDetails?.amountPaid,2)}
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-5 my-2`} container item md={4} xs={7} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Transaction Reference No.
                                    </p>
                                    <p className={`${styles.subText}`}>
                                        {applicationData.paymentDetails?.referenceNumber}
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                        <div className={`my-4 ${styles.divider}`} />
                        <Grid className={`px-2 px-md-4`} container spacing={0}>
                            <Grid className={`px-md-2 pl-2 my-2 position-relative`} container item md={4} xs={12} spacing={0}>
                                <img className={`${styles.imageStyle}`} src={applicationDetailsstatusIcon} alt="" />
                                <div className={`${styles.paymentPoster}`}>
                                    <p className={`${styles.sublabelText}`}>
                                        Payment Status
                                    </p>
                                    <p className={`${styles.subText} ${applicationData.paymentStatus == 'PAID' ? styles.statusBadgeGreen : applicationData.paymentStatus == 'REJECTED' ? styles.statusBadgeRed : styles.statusBadgeOrange}`}>
                                        {applicationData.paymentStatus}
                                    </p>
                                </div>
                            </Grid>
                            <Grid className={`px-md-5 pl-5 my-2`} container item md={4} xs={12} spacing={0}>
                                <div>
                                    <p className={`${styles.sublabelText}`}>
                                        Card Issuance Status
                                    </p>
                                    <p className={`${styles.subText} ${applicationData.cardIssuanceStatus == 'NOTAPPLICABLE' ? styles.cardStatusNotApplied : applicationData.cardIssuanceStatus == 'SHIPPED' ? styles.cardStatusApplied : styles.cardStatusDiffrence} text-center`}>
                                        {applicationData.cardIssuanceStatus}
                                    </p>
                                </div>
                            </Grid>
                            <Grid container item xs={4} spacing={0}></Grid>
                        </Grid>
                    </Paper>
                    <Grid container spacing={0} className={`position-relative`}>
                        <>
                            <div className={`w-100 d-none d-md-block position-absolute m-auto ${styles.line}`} />
                            {applicationData.paymentStatus == 'Rejected' ?
                                <>
                                    <div className={`row mx-0 pl-md-4 bg-white ml-auto ${styles.buttongrp}`}>
                                        <CustomButton
                                            onClick={btnBkToTrakApp}
                                            variant="outlined"
                                            color="primary"
                                            className={`${styles.backToTrakBtn} order-last order-md-first mt-2 mt-sm-2 mt-md-0`}>
                                            Back to Track Applications
                                    </CustomButton>
                                        <CustomButton
                                            onClick={handlePopup3Click}
                                            // onClick={btnUpdate}
                                            variant="contained"
                                            color="primary"
                                            className={`${styles.updateBtn} order-first order-md-last ml-md-2 `}>
                                            Update Payment
                                    </CustomButton>
                                    </div>

                                </>
                                :
                                <>
                                    <div className={`pl-md-4 bg-white ml-auto ${styles.buttongrp}`}>
                                        <CustomButton
                                            onClick={btnBkToTrakApp}
                                            variant="outlined"
                                            color="primary"
                                            className={`${styles.backToTrakBtn} ml-auto`}>
                                            Back to Track Applications
                                    </CustomButton>
                                    </div>
                                </>}
                        </>

                    </Grid>
                </Paper>
            </Container>

            <Popup3
                open={openPopup3}
                close={() => setOpenPopup3(false)}
                closeAndSubmit={() => setOpenPopup3(false)}
                title="Are you sure you want to update payment ?"
                description=""
                onClick={btnUpdate}
            ></Popup3>
        </>
    )
}

export default ViewApplication;
