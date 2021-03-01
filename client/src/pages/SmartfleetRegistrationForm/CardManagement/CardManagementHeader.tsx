import React, { useState, useEffect } from "react";
import { Box, Hidden, Grid } from "@material-ui/core";
import styles from "./CardManagement.module.scss";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { Popup3 } from "../../../components/CustomPopups/Popup3/Popup3";
const InfoIcon = "/W_Icons_Info.svg";
import { useSelector } from "react-redux";

const CardManagementHeader = (props: any) => {
  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [showIndividual, setShowIndividual] = useState<boolean>(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [content, setContent] = useState("");
  const store: any = useSelector((state) => state);
  /* ---------------------------------------------------- */

  // handles switch confirm box logic
  const checkConfirmBox = async () => {
    setShowPopUp(true);
  };

  //handler to close confirm box
  const closePopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.cardVal > 9) {
      props.handleDecrement(event);
    }
    setShowPopUp(false);
    if (showIndividual && !showIndividual) {
    }
    setTimeout(() => {
      setShowIndividual((state) => !state);
    }, 200);
  };

  const changeSectionToIndividual = () => {
    setShowIndividual(true);
  };
  const voidFn1 = () => {
    return true;
  };


  const changeSectionToBulk = () => {
    setShowIndividual(false);
  };
  
  //handler to close confirm box
  const cancelPopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.cardVal > 9) {      
      props.deleteCard(props.cardVal);
      props.handleDecrement(event);
    }
    setShowPopUp(false);
  };

  //renders component when indiv section is selected
  useEffect(() => {
    props.showSection(showIndividual);
    setShowPopUp(false);
  }, [showIndividual]);

  //effects implemented when selected cards are more than 9
  useEffect(() => {
    if (props.cardVal > 9) {
      checkConfirmBox();
    }
  }, [props.cardVal]);

  return (
    <div>
      <Popup3
        open={showPopUp}
        // close={() => setShowPopUp(false)}
        close={cancelPopUp}
        closeAndSubmit={closePopUp}
        title={`Are you sure you want to switch to ${
          showIndividual ? "bulk upload?" : "individual accounts?"
        }`}
        // description={`${showIndividual
        //   ? "Any details entered so far will be deleted."
        //   : " Any document uploaded will be deleted."
        //   }`}
      ></Popup3>

      <Grid container className={styles.cardManagementHeader}>
        <Hidden xsDown>
          <Grid item xs={12} sm={8} className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <img
                src={InfoIcon}
                alt="Info for Vehicle Number"
                className="pr-2"
              ></img>
              <Box color="text.primary" className={`${styles.infoIconText}`}>
                10 or more cards need to be uploaded only using bulk upload.
              </Box>
            </div>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={4} className={`${styles.gridPadding}`}>
          <CustomButton
            // onClick={!showIndividual ? checkConfirmBox : voidFn}
            onClick={changeSectionToIndividual}
            variant={showIndividual ? "contained" : "outlined"}
            color="primary"
            className={`${styles.customButton1}`}
          >
            INDIVIDUAL
          </CustomButton>
          <CustomButton
            onClick={changeSectionToBulk}
            variant={!showIndividual ? "contained" : "outlined"}
            color="primary"
            className={`${styles.customButton2}`}
          >
            BULK
          </CustomButton>
        </Grid>

        <Hidden smUp>
          <Grid item xs={1} className={`pt-2 pl-1`}>
            <img
              src={InfoIcon}
              alt="Info for Vehicle Number"
              className={`${styles.infoRight}`}
            ></img>
          </Grid>
          <Grid item xs={11} className={`pt-2 pl-1`}>
            <span className={`${styles.cardInfoStyle}`}>
              10 or more cards need to be uploaded only using excel
            </span>
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

export default CardManagementHeader;
