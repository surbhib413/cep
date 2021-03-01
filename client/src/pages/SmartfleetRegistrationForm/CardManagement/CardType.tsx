import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography, FormControlLabel } from "@material-ui/core";
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CardsContext } from "./CardManagement";
import Radio from "@material-ui/core/Radio";
import styles from "./CardManagement.module.scss";
import SampleCardModal from "./SampleCardModal";

const CardType = (props: any) => {
  const CARD_CONTEXT = useContext(CardsContext);


  const {
    selectedCardCallback,
    section,
    selectedCardCallbackIndividual,
    selectedCardCallbackBulk,
    selectedCardType,
    selectedCardTypeBulk,
  } = props;
  const [cardType, setCardType] = useState<string>("virtual");
  const [showSampleCard, setShowSampleCard] = useState(false);
  const [dropdownLists, setdropdownLists] = useState(
    props.navigationFlag ? CARD_CONTEXT.dropdownLists : props.dropdownLists
  );
  useEffect(() => {
    if (section) {
      setCardType(selectedCardType);
    } else {
      setCardType(selectedCardTypeBulk);
    }
  }, [section,selectedCardType]);

  const closeSampleCardPopUp = () => {
    setShowSampleCard(false);
  };


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //this call back for smartflitregistration form component to update the payment.
    // selectedCardCallback(event.target.value);
    setCardType(event.target.value);
    if (section) {
      //this call back for cardmanagement component to update the state of cardType selected.
      selectedCardCallbackIndividual(event.target.value);
    } else {
      selectedCardCallbackBulk(event.target.value);
    }
  };

  return (
    <div>
      <Grid container className="pt-3">
        <Grid item xs={12} sm={4} className="py-0">
          <CustomLabel htmlFor="card-mgmt-num-of-cards">
            Type of Card *
          </CustomLabel>
        </Grid>
      </Grid>

      <Grid container className="pb-3">
        <Grid item xs={10} sm={6}>
          {dropdownLists?.typeOfCards && dropdownLists?.typeOfCards.map((list: any, index: number) => {
            if (index == 0) {
              return (
                <FormControlLabel
                  value="virtual"
                  name="cardType"
                  key={list.code}
                  control={
                    <Radio
                      color="primary"
                      onChange={handleChange}
                      checked={cardType === "virtual"}
                    />
                  }
                  label={
                    <span className={`${styles.radioLabel}`}> {list.code}</span>
                  }
                  className={`${styles.radioLabel}`}
                />
              );
            }
          })}

          {dropdownLists?.typeOfCards && dropdownLists?.typeOfCards.map((list: any, index: number) => {
            if (index == 0) {
              return (
                <Typography
                  variant="body2"
                  gutterBottom
                  className={`${styles.virtualRadioBtnText}`}
                  key={list.code}
                >
                  {list.displayName}
                </Typography>
              );
            }
          })}
        </Grid>

        <Grid item xs={10} sm={6}>
          {dropdownLists?.typeOfCards && dropdownLists?.typeOfCards.map((list: any, index: number) => {
            if (index == 1) {
              return (
                <FormControlLabel
                  value="physical"
                  name="cardType"
                  key={list.code}
                  control={
                    <Radio
                      color="primary"
                      onChange={handleChange}
                      checked={cardType === "physical"}
                    />
                  }
                  label={
                    <span className={`${styles.radioLabel}`}> {list.code}</span>
                  }
                  className={`${styles.radioLabel}`}
                />
              );
            }
          })}

          {dropdownLists?.typeOfCards && dropdownLists?.typeOfCards.map((list: any, index: number) => {
            if (index == 1) {
              return (
                <Typography
                  variant="body2"
                  gutterBottom
                  className={`${styles.virtualRadioBtnText}`}
                  key={list.code}
                >
                  {list.displayName}
                </Typography>
              );
            }
          })}

{cardType === "physical" ? (
                  <div
                    className={styles.linkStyle}
                    onClick={() => setShowSampleCard(true)}
                  >
                    Sample Card
                  </div>
                ) : (
                  <></>
                )}
                <>
                  {showSampleCard ? (
                    <>
                      <SampleCardModal
                        closeSampleCardPopUp={closeSampleCardPopUp}
                        navigationFlag={props.navigationFlag}
                      ></SampleCardModal>
                    </>
                  ) : (
                    <></>
                  )}
                </>


        </Grid>
      </Grid>
    </div>
  );
};

export default CardType;
