import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import styles from "./Card.module.scss";

const BLUEBg = "/card_backgrounds/Blue_BG_Web.png"
const GOLDBg = "/card_backgrounds/Gold_BG_Web.png"
const PLATINUMBg = "/card_backgrounds/Platinum_BG_Web.png"
const PLATINUMPLUSBg = "/card_backgrounds/Platinum_Plus_BG_Web.png"
const SIGNATUREBg = "/card_backgrounds/Signature_BG_Web.png"
const SILVERBg = "/card_backgrounds/Silver_BG_Web.png"

const cardCategories: any = {
  'BLUE': { bg: BLUEBg, stripClass: 'stripBLUE' },
  'GOLD': { bg: GOLDBg, stripClass: 'stripGOLD' },
  'PLATINUM': { bg: PLATINUMBg, stripClass: 'stripPLATINUM' },
  'PLATINUMPLUS': { bg: PLATINUMPLUSBg, stripClass: 'stripPLATINUMPLUS' },
  'SIGNATURE': { bg: SIGNATUREBg, stripClass: 'stripSIGNATURE' },
  'SILVER': { bg: SILVERBg, stripClass: 'stripSILVER' },
};

const Card = (props: any): JSX.Element => {
  const initFields = {
    cardCategory: '',
    faID: '',
    gst: '',
    cardImageUrl: '',
    companyName: '',
    creditPartner: ''
  };
  const [fields, setFields] = React.useState(initFields);
  const [cardColors, setCardColors] = React.useState<any>();
  const [showCard, setShowCard] = React.useState(false);

  useEffect(() => {
    const { initialData } = props;

    if (initialData && Object.keys(initialData).length !== 0) {
      const initialFields: any = {
        cardCategory: initialData?.cardCategory,
        faID: initialData?.faId,
        gst: initialData?.gst,
        cardImageUrl: initialData?.cardImageUrl,
        companyName: initialData?.companyName,
        creditPartner: initialData?.creditPartner
      };
      setFields(initialFields);
      setCardColors(cardCategories[initialFields.cardCategory]);
      setShowCard(true);
      localStorage.setItem("cardDetails", JSON.stringify(initialFields));
    } else {
      let initialFields: any = localStorage.getItem("cardDetails");

      if (initialFields) {
        initialFields = JSON.parse(initialFields);
        setFields(initialFields);
        setCardColors(cardCategories[initialFields.cardCategory]);
        setShowCard(true);
      } else {
        // Card Data not available in localStorage
        setShowCard(false);
      }
    }

  }, []);

  return (
    <>
      {
        showCard
          ?
          <div className={`${styles.mainCard}`}>
            <img src={cardColors?.bg} className={`${styles.cardBg}`} />
            <div className={`${styles.cardTextContainer}`}>
              <div className={`${styles.cardTypeContainer}`}>
                <Typography className={`${styles.cardType} ${styles[cardColors?.stripClass]}`}>{fields.cardCategory}</Typography>
              </div>
              <div className={`${styles.companyContainer}`}>
                <Typography className={`${styles.companyName}`}>{fields.companyName}</Typography>
                <Typography className={`${styles.cardMeta} ${styles[cardColors?.stripClass]}`}>{fields.creditPartner}</Typography>
              </div>
            </div>
            <div className={`${styles.faidContainer}`}>
              <Typography className={`${styles.faid}`}>FA ID: {fields.faID}</Typography>
              <Typography>GST: {fields.gst}</Typography>
            </div>
          </div>
          : null
      }
    </>

  );
};

export default Card;