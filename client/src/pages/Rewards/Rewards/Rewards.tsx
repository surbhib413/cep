import React, { useEffect, useState, useRef } from "react";
import { Container, Grid, Hidden, Typography } from "@material-ui/core";
import styles from "./Rewards.module.scss";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { useDispatch } from "react-redux";
import { setLoader } from "../../../redux/actions/actions";
import Link from 'next/link';
import RedeemBalance from "../RedeemBalance/RedeemBalance";
import RedemptionStatus from "../RedeemBalance/RedemptionStatus";
import OtpMobile from "./OtpMobile";
import HTMLReactParser from 'html-react-parser';
import { postValidateOTPRewards, postRedeemPetromiles } from "../../../lib/api/smartfleet/rewards/redeemBalance";
import { getRewardsData, getFaqs } from "../../../lib/api/smartfleet/rewards/rewards";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "../../../utility/Snackbar/SnackbarMessages";
import { string } from "yup/lib/locale";
import Cookies from "universal-cookie";

const WarningIcon = "/W_Icons_Warning.svg";
const IconCross = "/Icon_Cross_Red_Bg.svg";
const IconRedeemable = "/w-icon-redeemable-petromiles.svg";
const IconEarned = "/w-icon-petromiles-earned-wc.svg";
const IconRedeemed = "/w-icon-petromiles-redeemed.svg";
const IconEarnValue = "/w-icon-petromiles-earned-wc-2.svg";
const IconRightArrow = "/W_Icon_Right_Arrow_Grey.svg";
const IconDownArrow = "/W_Icon_Down_Arrow_Grey.svg";



// START | FUNCTION TO CONVERT A NUMBER INTO LACS AND CRORES WORDS
/**
 * Returns a number in Indian numbering system as a String
 *
 * @param {Number/String} number The integer to be converted.
 * @param {Number} decimals The number of digits needed after decimal point.
 * @return {String} Converted number as a String in Indian numbering unit.
 */

/* function changeNumberFormat(number: number, decimals?: number, recursiveCall?: any): any {
  // let number = Number(num);
  const decimalPoints = decimals || 2;
  const noOfLakhs = number / 100000;
  let displayStr;
  let isPlural;

  // Rounds off digits to decimalPoints decimal places
  function roundOf(integer: any) {
    return integer.toLocaleString(undefined, {
      minimumFractionDigits: decimalPoints,
      maximumFractionDigits: decimalPoints,
    });
  }

  if (noOfLakhs >= 1 && noOfLakhs <= 99) {
    const lakhs = roundOf(noOfLakhs);
    isPlural = lakhs > 1 && !recursiveCall;
    // displayStr = `${lakhs} Lakh${isPlural ? 's' : ''}`;
    displayStr = `${lakhs} Lac${isPlural ? '' : ''}`;
  } else if (noOfLakhs >= 100) {
    const crores = roundOf(noOfLakhs / 100);
    const crorePrefix: any = crores >= 100000 ? changeNumberFormat(crores, decimals, true) : crores;
    isPlural = crores > 1 && !recursiveCall;
    // displayStr = `${crorePrefix} Crore${isPlural ? 's' : ''}`;
    displayStr = `${crorePrefix} Cr${isPlural ? '' : ''}`;
  } else {
    displayStr = roundOf(+number);
  }

  return displayStr;
} */
// END | FUNCTION TO CONVERT A NUMBER INTO LACS AND CRORES WORDS

export const getMaskedMobileNumber = (num: number | string = 0) => {
  const num_parts = num.toString().replace(num.toString().slice(2, 6), "****")
  return num_parts;
};


interface IRewardsData {
  petromiles: {
    redeemable?: number;
    earned?: number;
    redeemed?: number;
    redeemableDisplay?: string,
    earnedDisplay?: string,
    redeemedDisplay?: string,
    petromilesExpiringIn30Days?: number;
    minimumPetromilesRequired?: number;
    minimumPetromilesRequiredMessage?: string;
    equPetromilesValue?: number;
    equRewardValue?: number;
    equPetromilesValueDisplay?: string;
    equRewardValueDisplay?: string;
    petromilesToRewardConversionRatio?: number;
    rewardToPetromilesConversionRatio?: number;
    giftVoucherMediaUrl?: string;
    giftVoucherRedirectUrl?: string;
  };
  isKycComplete?: boolean;
  kycStatus?: string;
  kycStatusMessage?: string;
}

interface IFaq {
  question?: string; answer?: string;
}
interface IFaqs extends Array<IFaq> { }

interface ApiResponse {
  status?: any
  data?: any,
  message?: string,
  errors?: any,
  otpAuthToken?: any
}

const Rewards = (props: any): JSX.Element => {
  const dispatch = useDispatch();

  const initialRewardsData = {
    petromiles: {
      redeemable: 0,
      earned: 0,
      redeemed: 0,
      petromilesExpiringIn30Days: 0,
      minimumPetromilesRequired: 0,
      minimumPetromilesRequiredMessage: '',
      equPetromilesValue: 0,
      equRewardValue: 0,
      petromilesToRewardConversionRatio: 0,
      rewardToPetromilesConversionRatio: 0,
      giftVoucherMediaUrl: '',
      giftVoucherRedirectUrl: ''
    },
    isKycComplete: false,
    kycStatus: '',
    kycStatusMessage: ''
  }

  const [rewardsData, setRewardsData] = useState<IRewardsData | any>(initialRewardsData);
  const [faqs, setFaqs] = useState<IFaqs>();
  const [open, setOpen] = useState(false);
  const rewardsOverview = useRef<any>(null);
  const rewardsBalance = useRef<any>(null);

  const [openOtpModal, setOpenOtpModal] = React.useState(false);
  const [petromilesToRedeem, setPetromilesToRedeem] = React.useState(String);

  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  useEffect(() => {
    const { initialRewardsData } = props.response;
    const { initialFaqs } = props.response;
    setupData(initialRewardsData, initialFaqs);
  }, []);

  const setupData = (initialRewardsData: any, initialFaqs: any) => {

    if (initialRewardsData) {
      let redeemableDisplay = initialRewardsData?.petromiles?.redeemable;
      let earnedDisplay = initialRewardsData?.petromiles?.earned;
      let redeemedDisplay = initialRewardsData?.petromiles?.redeemed;
      let equPetromilesValueDisplay = initialRewardsData?.petromiles?.equPetromilesValue;
      let equRewardValueDisplay = initialRewardsData?.petromiles?.equRewardValue;
      const initialRewards = {
        petromiles: {
          redeemable: initialRewardsData?.petromiles?.redeemable,
          earned: initialRewardsData?.petromiles?.earned,
          redeemed: initialRewardsData?.petromiles?.redeemed,
          redeemableDisplay: redeemableDisplay,
          earnedDisplay: earnedDisplay,
          redeemedDisplay: redeemedDisplay,
          petromilesExpiringIn30Days: initialRewardsData?.petromiles?.petromilesExpiringIn30Days,
          minimumPetromilesRequired: initialRewardsData?.petromiles?.minimumPetromilesRequired,
          minimumPetromilesRequiredMessage: initialRewardsData?.petromiles?.minimumPetromilesRequiredMessage,
          equPetromilesValue: initialRewardsData?.petromiles?.equPetromilesValue,
          equRewardValue: initialRewardsData?.petromiles?.equRewardValue,
          equPetromilesValueDisplay: equPetromilesValueDisplay,
          equRewardValueDisplay: equRewardValueDisplay,
          petromilesToRewardConversionRatio: initialRewardsData?.petromiles?.petromilesToRewardConversionRatio,
          rewardToPetromilesConversionRatio: initialRewardsData?.petromiles?.rewardToPetromilesConversionRatio,
          giftVoucherMediaUrl: initialRewardsData?.petromiles?.giftVoucherMediaUrl,
          giftVoucherRedirectUrl: initialRewardsData?.petromiles?.giftVoucherRedirectUrl
        },
        isKycComplete: initialRewardsData?.isKycComplete,
        kycStatus: initialRewardsData?.kycStatus,
        kycStatusMessage: initialRewardsData?.kycStatusMessage,
      }
      setRewardsData(initialRewards);
    }

    if (initialFaqs) {
      initialFaqs.sort((a: any, b: any) => (Number(a.faqId) - Number(b.faqId)))
      setFaqs(initialFaqs);
    }

  }

  const scrollToView = (section: any) => {
    if (section === 'top-most') {
      rewardsOverview.current.scrollIntoView()
    } else if (section === 'balance') {
      rewardsBalance.current.scrollIntoView()
    }
  }

  const [otpData, setOtpData] = React.useState();
  const [redemptionModal, setRedemptionModal] = React.useState(false);
  const [redemptionData, setRedemptionData] = React.useState();

  useEffect(() => {
    async function fetchData() {
      const cookies = new Cookies();
      const queryData = {
        cookieData: {
          mark_one: cookies.get("mark_one"),
          mark_two: cookies.get("mark_two"),
          mark_three: cookies.get("mark_three"),
        },
      };

      const rewardsData = await getRewardsData(queryData);
      const faqs = await getFaqs(queryData);
      setupData(rewardsData?.data, faqs?.data);
    }
    fetchData();
  }, [redemptionModal]);


  const handleRedeemAsRewardBtn = () => {
    setOpen(true);
  }

  const handleRedeemAsVoucherBtn = () => {
    const url = rewardsData?.petromiles?.giftVoucherRedirectUrl ? rewardsData?.petromiles?.giftVoucherRedirectUrl : "https://www.gyftr.com/";
    //need fully qualified url from BE. Ex : https://www.google.com
    window.open(url);
  }

  /* const handleFAQs = () => {
    //placeholder for now
  } */

  const handleClose = () => {
    setOpen(false);
  };

  const handleOtpClose = () => {
    setOpenOtpModal(false);
  };

  const redirectToRedemptionStatus = () => {
    setRedemptionModal(true);
  }

  const handleOtpVerify = async (otp: String) => {
    dispatch(setLoader(true));
    let response: ApiResponse = await postValidateOTPRewards({
      channel: "WEB",
      isNotificationEnabled: true ? true : false,
      otpChannel: "MOBILE",
      otpType: "REDEEM_PETROMILES",
      otp: otp,
    });

    if (response?.status === "success") {
      dispatch(setLoader(false));
      console.log("OTP Verify Response ", response)
      setOpenOtpModal(false);
      dispatch(setLoader(true));
      let validateResponse: any = await postRedeemPetromiles({
        channel: "WEB",
        otpAuthToken: response?.data?.otpAuthToken,
        otpChannel: "MOBILE",
        otpType: "REDEEM_PETROMILES",
        petromilesPoints: petromilesToRedeem
      });
      if (validateResponse?.status === "success" || validateResponse?.status === 200) {
        dispatch(setLoader(true));
        redirectToRedemptionStatus();
        setOpenOtpModal(false);
        setRedemptionData(validateResponse);
      } else if (validateResponse?.errors) {
        dispatch(setLoader(false));
        setShowSnackbar(true);
        setSnackbarMessage(validateResponse?.errors[0]?.message);
        setAlertType("error");
      } else {
        dispatch(setLoader(false));
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    } else if (response?.errors) {
      dispatch(setLoader(false));
      setShowSnackbar(true);
      setSnackbarMessage(response?.errors[0]?.message);
      setAlertType("error");
    } else {
      dispatch(setLoader(false));
      setShowSnackbar(true);
      setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
      setAlertType("error");
    }
  }


  return (
    <Container maxWidth="xl" className={styles.root}>

      <Grid container>

        <Hidden smDown>
          <Grid item xs={12} sm={2}>sidebar</Grid>
        </Hidden>
        <Grid item xs={12} sm={10} className={styles.mainGridContainer}>
          <div className={styles.headingContainer} ref={rewardsOverview}><Typography className={styles.heading} color="primary">Rewards</Typography></div>

          {
            !rewardsData?.isKycComplete
              ?
              <div className={styles.kycInfoContainer}>
                <div className={styles.kycDetails}>
                  <img src={IconCross} alt="" />
                  <Typography>{rewardsData?.kycStatusMessage}</Typography>
                </div>
                <Link href="/registration/smartfleet">
                  <Typography className={styles.kycLink}>
                    {rewardsData?.kycStatus === 'SUBMISSION_PENDING' && 'Complete KYC'}
                    {rewardsData?.kycStatus === 'APPROVAL_PENDING' && null}
                    {rewardsData?.kycStatus === 'FSO_REJECTED' && 'Resubmit KYC'}
                  </Typography>
                </Link>
              </div>
              : null
          }


          <Grid container>
            <Grid item xs={12} sm={4}>
              <div className={`${styles.card} ${styles.firstCard}`}>
                <div className={styles.iconContainer}>
                  <img src={IconRedeemable} alt="" />
                </div>
                <div>
                  <Typography className={styles.pmCount}>{rewardsData?.petromiles?.redeemableDisplay}</Typography>
                  <Typography className={styles.textBlackish}>Redeemable Petromiles</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className={`${styles.card} ${styles.middleCard}`}>
                <div className={styles.iconContainer}>
                  <img src={IconEarned} alt="" />
                </div>
                <div>
                  <Typography className={styles.pmCount}>{rewardsData?.petromiles?.earnedDisplay}</Typography>
                  <Typography className={styles.textBlackish}>Petromiles Earned</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className={`${styles.card} ${styles.lastCard}`}>
                <div className={styles.iconContainer}>
                  <img src={IconRedeemed} alt="" />
                </div>
                <div ref={rewardsBalance}>
                  <Typography className={styles.pmCount}>{rewardsData?.petromiles?.redeemedDisplay}</Typography>
                  <Typography className={styles.textBlackish}>Petromiles Redeemed</Typography>
                </div>
              </div>
            </Grid>
          </Grid>

          <div className={styles.expiryContainer}>
            <Typography><img src={WarningIcon} alt="" className={styles.warningIcon} /> &nbsp; {rewardsData?.petromiles?.petromilesExpiringIn30Days}</Typography>
            <Link href="/rewards/redemptionhistory"><Typography color="primary" className={styles.redemptionLink}>Redemption History</Typography></Link>
          </div>

          <div className={styles.titleRow} >
            <Typography className={styles.sectionTitle}>Redeem as Reward Balance - Fuel Redemption</Typography>
            <Hidden xsDown>
              <div className={styles.hrLine}></div>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={() => handleRedeemAsRewardBtn()}
                disabled={(!rewardsData?.isKycComplete) || (rewardsData?.petromiles?.redeemable < rewardsData?.petromiles?.minimumPetromilesRequired)}
              >
                Redeem
              </CustomButton>
            </Hidden>
          </div>

          <Grid container>
            <Grid item xs={12} sm={12}>
              <div className={`${styles.card} ${styles.redeemAsCard}`}>
                <div className={styles.conversionRow}>
                  <div className={styles.rewardBlock}>
                    <div className={styles.iconContainer}>
                      <img src={IconRedeemable} alt="" />
                    </div>
                    <div>
                      <Typography className={styles.pmCount}>{rewardsData?.petromiles?.redeemableDisplay}</Typography>
                      <Typography className={styles.textBlackish}>Petromiles</Typography>
                    </div>
                  </div>
                  <Hidden xsDown><img src={IconRightArrow} alt="" className={styles.arrowImg} /></Hidden>
                  <Hidden smUp><img src={IconDownArrow} alt="" className={styles.arrowImg} /></Hidden>
                  <div className={styles.rewardBlock}>
                    <div className={styles.iconContainer}>
                      <img src={IconEarnValue} alt="" />
                    </div>
                    <div>
                      <Typography className={styles.pmCount}>&#8377; {rewardsData?.petromiles?.equRewardValueDisplay}</Typography>
                      <Typography className={styles.textBlackish}>Value</Typography>
                    </div>
                  </div>
                </div>
                {
                  rewardsData?.petromiles?.redeemable < rewardsData?.petromiles?.minimumPetromilesRequired
                    ?
                    <div className={styles.minPetromilesError}>
                      <img src={WarningIcon} alt="" className={styles.warningIcon} />
                      <Typography>*{rewardsData?.petromiles?.minimumPetromilesRequiredMessage}</Typography>
                    </div>
                    : null
                }
              </div>
            </Grid>
          </Grid>

          <Hidden smUp>
            <CustomButton
              variant="contained"
              color="primary"
              className={styles.redeemAsRewardBtn}
              onClick={() => handleRedeemAsRewardBtn()}
              disabled={(!rewardsData?.isKycComplete) || (rewardsData?.petromiles?.redeemable < rewardsData?.petromiles?.minimumPetromilesRequired)}
            >
              Redeem
            </CustomButton>
          </Hidden>

          <div className={styles.titleRow}>
            <Typography className={styles.sectionTitle}>Redeem as Gift Vouchers</Typography>
            <Hidden xsDown>
              <div className={styles.hrLine}></div>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={handleRedeemAsVoucherBtn}
                disabled={(!rewardsData?.isKycComplete) || (rewardsData?.petromiles?.redeemable < rewardsData?.petromiles?.minimumPetromilesRequired)}
              >
                Redeem
              </CustomButton>
            </Hidden>
          </div>

          <div className={styles.bannerContainer}>
            <img src={`${process.env.NEXT_PUBLIC_API_URL_BE}/backoffice${rewardsData?.petromiles?.giftVoucherMediaUrl}`}
              alt="gift-voucher-banner"
              onClick={handleRedeemAsVoucherBtn} />
          </div>

          <Hidden smUp>
            <CustomButton
              variant="contained"
              color="primary"
              className={styles.redeemAsRewardBtn}
              onClick={handleRedeemAsVoucherBtn}
              disabled={(!rewardsData?.isKycComplete) || (rewardsData?.petromiles?.redeemable < rewardsData?.petromiles?.minimumPetromilesRequired)}
            >
              Redeem
            </CustomButton>
          </Hidden>

          <div className={styles.faqContainer}>
            <Typography className={styles.sectionTitle}>Frequently Asked Questions</Typography>

            <Grid container>
              <Grid item xs={12} sm={8}>
                {

                  faqs?.map((faq, index) => {

                    let formattedAns;
                    const html: any = faq.answer;
                    const replace = (domNode: any) => {
                      if (domNode.attribs && domNode.attribs.id) {
                        return (
                          <span className={styles.innerLink} onClick={() => scrollToView(domNode.attribs.id)}>
                            {domNode.children[0].data}
                          </span>
                        );
                      }
                    };
                    formattedAns = HTMLReactParser(html, { replace });

                    return (
                      <div key={`key-${index}`}>
                        <Typography className={styles.que}>{faq.question}</Typography>
                        <div className={styles.faqAns}>{formattedAns}</div>
                      </div>
                    )
                  })
                }

                <CustomButton
                  variant="outlined"
                  color="primary"
                  className={styles.allFaqsBtn}
                // onClick={handleFAQs} //This is a placeholder for now
                >
                  View all FAQ’s
                </CustomButton>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <RedeemBalance
        open={open}
        onClose={handleClose}
        RewardsData={rewardsData}
        setOpenOtpModal={setOpenOtpModal}
        setOtpData={setOtpData}
        setPetromilesToRedeem={setPetromilesToRedeem} //This is to pass to redemption status dialog
      >
      </RedeemBalance>
      <OtpMobile
        open={openOtpModal}
        handleOtpClose={handleOtpClose}
        otpData={otpData}
        handleOtpVerify={handleOtpVerify}
      />
      <RedemptionStatus
        redemptionModal={redemptionModal}
        setRedemptionModal={setRedemptionModal}
        redemptionData={redemptionData}
      >
      </RedemptionStatus>
      <CustomSnackbar
        open={showSnackbar}
        close={setShowSnackbar}
        type={alertType}
        message={snackbarMessage}
      ></CustomSnackbar>
    </Container>
  );
};

export default Rewards;