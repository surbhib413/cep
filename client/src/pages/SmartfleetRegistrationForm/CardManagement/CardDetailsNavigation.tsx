import React, { useState, useEffect, useContext } from "react";
import {
  createStyles,
  Grid,
  Hidden,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { CardsContext } from "./CardManagement";
import CustomCard from "../../../components/CustomCard/CustomCard";
import styles from "./CardManagement.module.scss";

import CardDetailsFields from "./CardDetailsFields";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
import CardDetails from "./CardDetails";

const CreditCardIcon = "/credit-card.svg";
const CreditCardIconError = "/credit-card-error.svg";
const CreditCardIconSelected = "/credit-card-selected.svg";
const cardTrashIcon = "/card_trash_Img.svg";
const Plus = "/plus.svg";

const BlackColorTypography = withStyles({
  root: {
    color: "#354463F",
  },
})(Typography);

const Accordion = withStyles({
  root: {
    //border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: "none",
    // '&:not(:last-child)': {
    //   borderBottom: 0,
    // },
    // '&:before': {
    //   display: 'none',
    // },
    // '&$expanded': {
    //   margin: 'auto',
    // },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    padding: "0px",
    // backgroundColor: 'rgba(0, 0, 0, .03)',
    // borderBottom: '1px solid rgba(0, 0, 0, .125)',
    // marginBottom: -1,
    // minHeight: 56,
    // '&$expanded': {
    //   minHeight: 56,
    // },
    "& .MuiAccordionSummary-content": {
      margin: "0px",
    },
  },
  // content: {
  //   "& .MuiAccordionSummary-content": {
  //     margin: "0px"
  //   }
  // },
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: "8px 0px",
  },
}))(MuiAccordionDetails);

// const CustomAccordion = withStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       "& .MuiAccordion-root": {
//         boxShadow: "none",
//       },
//     },
//   })
// )(Accordion);

const CardDetailsNavigation = (props: any): JSX.Element => {
  const CARDS_CONTEXT = useContext(CardsContext);




  /* ------------STATE OBJECTS OF COMPONENT-------------- */
  const [selectedCardNumber, setSelectedCardNumber] = useState<number>(0);
  const [cardNumber, setCardNumber] = useState([]);

  const [flag, setFlag] = useState(false);
  /* ---------------------------------------------------- */

  const [expanded, setExpanded] = React.useState<string | false>("0");

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    // console.log("checking panel value", panel);
    setExpanded(newExpanded ? panel : false);
  };

  //handles active-inactive color styling
  const renderActiveInactiveStyle = (cardIndex: number, flag?: string) => {
    let style =
      cardIndex === selectedCardNumber
        ? styles.cardDetailsNavCardsActive
        : styles.cardDetailsNavCards;
    return style;
  };

  // gets id of clicked /selected card
  const passSelectedCardId = (selectedCardId: number) => {
    CARDS_CONTEXT.getSelectedCardId(selectedCardId);
    setSelectedCardNumber(selectedCardId);
  };

  //checks for cards errorStatus
  const checkCardState = (
    e: React.MouseEvent<HTMLImageElement>,
    cardId: number
  ) => {
    const card = props.cardFields.cards[cardId - 1];
    // console.log("checkCardState ", !card, card);
    let isCardEmpty = true;
    for (let key in card) {
      if (
        key !== "errorStatus" &&
        key !== "fuelType" &&
        key !== "selectedNameOfCard"
      ) {
        isCardEmpty = false;
      }
    }
    if (isCardEmpty) {
      CARDS_CONTEXT.deleteCard(cardId);
    } else {
      CARDS_CONTEXT.openConfirmationBox(cardId);
    }
  };

  useEffect(() => {
    // console.log("This is the card Number........", cardNumber);
    setSelectedCardNumber(CARDS_CONTEXT.cardObj.selectedCardId);
  }, [CARDS_CONTEXT.cardObj.selectedCardId]);

  useEffect(() => {}, [props.cardFields.cards.length]);


  useEffect(() => {
    setCardNumber(CARDS_CONTEXT.cardCounter.val);
    
    setFlag(false);
  }, [CARDS_CONTEXT.cardCounter.val, props.cardFields.cards]);

  //primary function to render cards in navigation strip
  const renderCards = () => {
    // console.log("cardNumber---->", props.cardFields.cards);
    // console.log(CARDS_CONTEXT.cardCounter.val);
    // console.log(cardNumber);
    return cardNumber.map((item: number, index: number) => {
      return (
        <div key={item} data-id={index + 1}>
          {/* {console.log('Key Name', index)} */}
          <Hidden xsDown>
            <CustomCard className={`${renderActiveInactiveStyle(index + 1)}`}>
              <Grid container className={styles.cardDetailsNavCardRow}>
                <Grid item xs={2} sm={2} className={styles.cardDetailsNavIcon}>
                  <img
                    src={
                      props.cardFields.cards[index]?.errorStatus ||
                      props.cardFields.cards[index]?.errorStatus === null
                        ? CreditCardIconError
                        : index + 1 === selectedCardNumber
                        ? CreditCardIconSelected
                        : CreditCardIcon
                    }
                    alt="icon"
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  onClick={(e) => passSelectedCardId(index + 1)}
                  className={styles.cursorPointer}
                >
                  <BlackColorTypography
                    variant="h6"
                    className={`${styles.cardDetailsNavCardsNumber}  ${
                      props.cardFields.cards[index]?.errorStatus ||
                      props.cardFields.cards[index]?.errorStatus === null
                        ? styles.redText
                        : ""
                    }`}
                    data-id={index}
                  >
                    {`Card #${index + 1} `}
                    {/* {props.cardFields.cards[index]?.errorStatus ? "Error" : ""} */}
                  </BlackColorTypography>
                </Grid>
                <Grid item xs={2} sm={2}>
                  {item !== 1  ? (
                    <img
                      src={cardTrashIcon}
                      alt="delete-icon"
                      className={`ml-4 ${styles.cursorPointer}`}
                      onClick={(e) => {
                        checkCardState(e, index + 1);
                        //  CARDS_CONTEXT.openConfirmationBox(e, index + 1);
                        // passSelectedCardId(index);
                      }}
                    ></img>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </CustomCard>
          </Hidden>

          <Hidden smUp>
            {/* <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header"> */}
            <Accordion
              square
              expanded={expanded === index.toString()}
              onChange={handleChange(index.toString())}
            >
              <AccordionSummary
                aria-controls={index.toString()}
                id={index.toString()}
              >
                {/* <CustomCard className={`${renderActiveInactiveStyle(index + 1)}`}> */}
                <div className={`${renderActiveInactiveStyle(index + 1)}`}>
                  <Grid container className={styles.cardDetailsNavCardRow}>
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      className={styles.cardDetailsNavIcon}
                    >
                      <img
                        src={
                          props.cardFields.cards[index]?.errorStatus ||
                          props.cardFields.cards[index]?.errorStatus === null
                            ? CreditCardIconError
                            : index + 1 === selectedCardNumber
                            ? CreditCardIconSelected
                            : CreditCardIcon
                        }
                        alt="icon"
                      />
                    </Grid>

                    <Grid
                      item
                      xs={7}
                      sm={7}
                      onClick={(e) => passSelectedCardId(index + 1)}
                      className={styles.cursorPointer}
                    >
                      <BlackColorTypography
                        variant="h6"
                        className={`${styles.cardDetailsNavCardsNumber}  ${
                          props.cardFields.cards[index]?.errorStatus ||
                          props.cardFields.cards[index]?.errorStatus === null
                            ? styles.redText
                            : ""
                        }`}
                        data-id={index}
                      >
                        {`Card #${index + 1} `}
                        {/* {props.cardFields.cards[index]?.errorStatus ? "Error" : ""} */}
                      </BlackColorTypography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      {item !== 1 ? (
                        <img
                          src={cardTrashIcon}
                          alt="delete-icon"
                          className={`ml-4 ${styles.cursorPointer}`}
                          onClick={(e) => {
                            checkCardState(e, index + 1);
                            //  CARDS_CONTEXT.openConfirmationBox(e, index + 1);
                            // passSelectedCardId(index);
                          }}
                        ></img>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Grid>
                </div>
                {/* </CustomCard> */}
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  className={styles.cardDetailsFieldsArea}
                >
                  <CardDetailsFields
                    cardFields={props.cardFields}
                    updateSelectedCardDetails={props.updateSelectedCardDetails}
                    responseCardData={props.responseCardData}
                    navigationFlag = {props.navigationFlag}
                  ></CardDetailsFields>
                </Grid>
                {/* <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography> */}
              </AccordionDetails>
            </Accordion>
          </Hidden>
        </div>
      );
    });
  };

  return (
    <div className={styles.cardDetailsNavMainContainer}>
      {renderCards()}
      <div
        onClick={(event) => CARDS_CONTEXT.handler(event)}
        className={`${styles.cursorPointer} mt-2`}
      >
        <CustomCard className={styles.cardDetailsNavCards}>
          <Grid container className={styles.cardDetailsNavCardRow}>
            <Grid item xs={1} sm={1} className={styles.cardDetailsNavIcon}>
              <img
                src={Plus}
                alt="plus-icon"
                className={`${styles.cursorPointer}`}
              ></img>
            </Grid>

            <Grid item xs={5} sm={5} className="align-self-center">
              <BlackColorTypography
                variant="h6"
                className={styles.cardDetailsNavCardsNumber}
              >
                Add Card
              </BlackColorTypography>
            </Grid>
          </Grid>
        </CustomCard>
      </div>
    </div>
  );
};

export default CardDetailsNavigation;
