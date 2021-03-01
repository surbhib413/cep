import React from "react";
import Dialog from "@material-ui/core/Dialog";
import scssStyles from "./RedeemBalance.module.scss";
import {
  Typography,
  withStyles,
  createStyles,
  Theme,
  WithStyles,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Hidden,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CustomTextField from "../../../../src/components/CustomTextField/CustomTextField";
import { CustomButton } from "../../../../src/components/CustomButton/CustomButton";
import { useDispatch } from "react-redux";

import defaultLocale from "date-fns/locale/en-US";
import { isOnlyNumbers, isValidDecimal } from "../../../utility/validations/validations";
import { getSendOTPRewards } from "../../../lib/api/smartfleet/rewards/redeemBalance";
import { setLoader } from "../../../redux/actions/actions";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "../../../utility/Snackbar/SnackbarMessages";
import { number } from "yup/lib/locale";

const CovertIcon = "/Petromiles_Convert_Icon.svg"


const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
    },
    title: {
      fontWeight: "bold",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(5),
      top: theme.spacing(3),
      color: theme.palette.grey[500],
      "&:focus": {
        outline: "none",
      },
    },
    closeButtonMobile: {
      position: "absolute",
      right: theme.spacing(2),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
      "&:focus": {
        outline: "none",
      },
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={`px-sm-0 ${scssStyles.RedeemPetromiles}`}
        variant="h5">
        {children}
      </Typography>
      <>
        <Hidden smUp>
          <IconButton
            aria-label="close"
            className={classes.closeButtonMobile}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Hidden>
        <Hidden xsDown>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Hidden>
      </>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    //paddingLeft: theme.spacing(2),
    overflow: "Hidden"
  },
}))(MuiDialogContent);


const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);



export default function RedeemBalanceDialog(props: any) {
  const dispatch = useDispatch();
  const { open, onClose, RewardsData, setOpenOtpModal, setOtpData, setPetromilesToRedeem } = props;

  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isRedeemDisabled, setIsRedeemDisabled] = React.useState(true);

  const [petromilesValue, setPetromilesValue] = React.useState<string>("");
  const [rewardsValue, setRewardsValue] = React.useState<string>("");

  const redirectToOTPVerification = (): void => {
    setOpenOtpModal(true);
    setPetromilesValue("");
    setRewardsValue("");
  }

  const HandleRdeemRewardBalance = async () => {
    //call send otp and send this response to rewards
    const finalData = {};
    console.log("Calling otp api from redeem balance dialog............", finalData);

    dispatch(setLoader(true));
    const res: any = await getSendOTPRewards(finalData);

    console.log("Pargali : ", res);
    if (res?.status === "success" || res?.statusCode == 200 || res?.statusCode == 201) {
      dispatch(setLoader(false));
      redirectToOTPVerification();
      setOtpData(res);
      onClose();
      setPetromilesToRedeem(petromilesValue);
      setIsRedeemDisabled(true);
    } else {
      dispatch(setLoader(false));
      const response = res?.data;
      if (response) {
        console.log("ERROR RESPONSE", response.message);
        setShowSnackbar(true);
        setSnackbarMessage(response.message);
        setAlertType("error");
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  const handlePetromilesChange = (event: React.ChangeEvent<HTMLInputElement>, petromiles: any) => {
    let inputVal: number = parseInt(event.target.value);
    let minimumPetromiles = RewardsData?.petromiles?.minimumPetromilesRequired;
    setIsRedeemDisabled(!isOnlyNumbers(event.target.value));
    setPetromilesValue(event.target.value);
    if (inputVal === null || (inputVal) === 0 ||
      isNaN(inputVal) || event.target.value === "NaN" ||
      event.target.value === "") {
      setRewardsValue("");
      setIsRedeemDisabled(true);
    } else {
      if (isOnlyNumbers(event.target.value)) {
        if (inputVal > RewardsData?.petromiles?.equPetromilesValue) {
          setIsRedeemDisabled(true);
          return false;
        }
        if (inputVal < 0 || parseInt(event.target.value) < minimumPetromiles) {
          setIsRedeemDisabled(true);
          return false;
        }
        event.preventDefault;
        inputVal = inputVal * RewardsData?.petromiles?.petromilesToRewardConversionRatio;
        inputVal = (inputVal.toFixed(2));
        setRewardsValue(inputVal.toString());
        setIsRedeemDisabled(false);
      } else {
        setIsRedeemDisabled(true);
      }
    }
  }

  const handleRewardsChange = (event: React.ChangeEvent<HTMLInputElement>, rewards: any) => {
    let outputVal: any = parseInt(event.target.value);
    let rewardVal: any = parseFloat(RewardsData?.petromiles?.equRewardValue)
    let minimumPetromiles = RewardsData?.petromiles?.minimumPetromilesRequired;
    setIsRedeemDisabled(!isValidDecimal(event.target.value));
    setRewardsValue(event.target.value);
    if (outputVal === null || outputVal === 0 ||
      event.target.value === "") {
      setPetromilesValue("");
      setIsRedeemDisabled(true);
    } else {
      if (isValidDecimal(event.target.value)) {
        if (event.target.value > rewardVal) {
          setIsRedeemDisabled(true);
          return false;
        }
        if (outputVal < 0) {
          setIsRedeemDisabled(true);
          return false;
        }
        event.preventDefault;
        outputVal = event.target.value * RewardsData?.petromiles?.rewardToPetromilesConversionRatio;
        outputVal = outputVal.toFixed(0);
        if (outputVal < minimumPetromiles) {
          setIsRedeemDisabled(true);
          return false;
        } else {
          setPetromilesValue(outputVal.toString());
          setIsRedeemDisabled(false);
        }
      } else {
        setIsRedeemDisabled(true);
      }
    }
  }

  const handleClose = () => {
    onClose();
    setPetromilesValue("");
    setRewardsValue("");
    setIsRedeemDisabled(true);
  }

  return (

    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth={true}
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={handleClose}
    >
      <div className={`d-flex flex-column h-100 px-0 px-sm-3 py-sm-3 ${scssStyles.heading}`}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Hidden xsDown>
            <span>Redeem Petromiles</span>
          </Hidden>
          <Hidden smUp>
            <span className={`${scssStyles.headerMobileLabel}`}>Redeem Petromiles</span>
          </Hidden>
        </DialogTitle>

        <DialogContent
          className={`${scssStyles.dialogContent}`}
        >
          <Hidden smDown>
            <Typography variant="h6" className={`${scssStyles.label}`}>Enter Petromiles or Reward Balance to redeem</Typography>
          </Hidden>
          <Hidden smUp>
            <Typography variant="h6" className={`${scssStyles.mobileLabel} mb-3`}>Enter Petromiles or Reward Balance to redeem</Typography>
          </Hidden>
          <Hidden smDown>
            <span className={`${scssStyles.spanLabel}`}>{RewardsData?.petromiles?.minimumPetromilesRequiredMessage ? "*" + RewardsData?.petromiles?.minimumPetromilesRequiredMessage : null}</span>
          </Hidden>
          <Grid container spacing={1} className="mt-sm-3 pb-sm-4">
            <Grid item xs={12} sm={5} className="p-0 m-0">
              <CustomTextField
                className="py-0 mb-0"
                id="petromiles"
                placeholder="10"
                variant="outlined"
                name="petromiles"
                value={petromilesValue}
                onChange={(event: any, petromiles: any) => handlePetromilesChange(event, petromiles)}
                //inputProps={{ maxLength: 10 }}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={`pr-3 ${scssStyles.adorn}`}>Petromiles</span>
                    </InputAdornment>
                }}
              />
              <span className={`${scssStyles.spanLabel} pl-2`}>({RewardsData?.petromiles?.equPetromilesValue ? parseInt(RewardsData?.petromiles?.equPetromilesValue).toFixed(0) : ""} Available)</span>
            </Grid>
            <Grid item xs={12} sm={1} className="pt-0">
              <img
                src={CovertIcon}
                alt="Convert Icon"
                className="px-2 py-2"
              ></img>
            </Grid>
            <Grid item xs={12} sm={5} className="p-0 m-0">
              <CustomTextField
                className="py-0 mb-0"
                id="reward-balance"
                placeholder="10"
                variant="outlined"
                name="reward-balance"
                value={rewardsValue}
                onChange={(event: any, petromiles: any) => handleRewardsChange(event, petromiles)}
                //inputProps={{ maxLength: 10 }}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={`pr-3 w-50 ${scssStyles.adorn}`}>Reward Balance (₹)</span>
                    </InputAdornment>
                }}
              />
              <span className={`${scssStyles.spanLabel} pl-2`}>(Equivalent to ₹
              {RewardsData?.petromiles?.equRewardValue ? RewardsData?.petromiles?.equRewardValue : ""})</span>
            </Grid>
          </Grid>
        </DialogContent>
        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>
        <Hidden xsDown>
          <DialogActions>
            <CustomButton
              disabled={isRedeemDisabled}
              variant="contained"
              color="primary"
              onClick={() => HandleRdeemRewardBalance()}
            >
              Redeem as Reward Balance
            </CustomButton>
          </DialogActions>
        </Hidden>
        <Hidden smUp>
          <DialogActions className={`d-flex justify-content-center mb-1`}>
            <CustomButton
              disabled={isRedeemDisabled}
              variant="contained"
              color="primary"
              onClick={() => HandleRdeemRewardBalance()}
            >
              Redeem as Reward Balance
            </CustomButton>
          </DialogActions>
          <span className={`${scssStyles.spanMobileLabel} px-4 mb-4`}>{RewardsData?.petromiles?.minimumPetromilesRequiredMessage ? "*" + RewardsData?.petromiles?.minimumPetromilesRequiredMessage : null}</span>
        </Hidden>
      </div>
    </Dialog>
  );
}