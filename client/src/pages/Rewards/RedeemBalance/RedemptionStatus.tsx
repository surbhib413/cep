import React, { useEffect } from "react";
import { DialogContent, Hidden, Typography } from "@material-ui/core";
import styles from "./RedeemBalance.module.scss";
import { CustomButton } from "../../../../src/components/CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
import { useRouter } from "next/router";

const desktopIllustration = "../Petromiles_RedeemSuccess_Icon.svg";
const mobileIllustration = "../Petromiles_RedeemSuccess_Icon.svg";

export default function RedemptionStatus(props: any) {
  const {
    redemptionModal, setRedemptionModal, redemptionData
  } = props;

  const router = useRouter();
  const [fields, setFields] = React.useState();

  useEffect(() => {

    const { redemptionData } = props;
    if (redemptionData) {
      const RedemptionFields: any = {
        redemptionStatusMessage: redemptionData.data.message,
        redemptionRewardMoney: redemptionData.data.redemptionSummary.rewardsReceived,
        redepmtionMessage: redemptionData.data.redemptionSummary.rewardsMessage,
        redemptionMilesMessage: `${redemptionData.data.redemptionSummary.petromilesConverted} ${redemptionData.data.redemptionSummary.petromilesConvertedMessage}`,
      };
      setFields(RedemptionFields);
    }
  }, [redemptionData]);

  const redirectToRewards = (): void => {
    setRedemptionModal(false);
    router.push("/rewards/rewards");
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={redemptionModal}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-center">
          <Typography
            className={`px-4 px-sm-0 text-center ${styles.modalTitle}`}
            variant="h5"
          >
            {fields?.redemptionStatusMessage ? fields?.redemptionStatusMessage : "Congratulations"}
          </Typography>
        </div>

        <Typography variant="h6" color="textPrimary" className="text-center mt-3">
          {fields?.redemptionRewardMoney ? fields?.redemptionRewardMoney : "14,560"}
        </Typography>
        <p className={`mb-1 mt-3 ${styles.rewardMessage}`}> {fields?.redepmtionMessage ? fields?.redepmtionMessage : "Successfully added to your Reward balance"}</p>
        {/* TODO - Change to image/gif file/animation */}
        <Hidden xsDown>
          <img className="pt-3" src={desktopIllustration} alt="redeemSuccessImg" />
        </Hidden>
        <Hidden smUp>
          <img className="p-4" src={mobileIllustration} alt="redeemSuccessImg" />
        </Hidden>
        <p className={`mb-3 mt-3 ${styles.rewardMessage}`}>{fields?.redemptionMilesMessage ? fields?.redemptionMilesMessage : "9.20 Lac Petromiles successfully converted"}</p>
        <CustomButton
          color="primary"
          variant="contained"
          onClick={() => redirectToRewards()}
        >
          Done
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
};
