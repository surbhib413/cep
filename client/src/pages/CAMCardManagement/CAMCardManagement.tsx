import React, { useState } from "react";
import {
  Grid,
  Typography,
  Hidden,
  Container,
  Paper,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import styles from "./CAMCardManagement.module.scss";
import { useSelector } from "react-redux";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import SampleCardModal from "../SmartfleetRegistrationForm/CardManagement/SampleCardModal";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useRouter } from "next/router";
const bulkIcon = "/WM_Illus-B2B_bulk-upload.svg";
const indIcon = "/WM_Illus-B2B_Individual-card.svg";

const PetrocorporateCardManagement = (props: any): JSX.Element => {
  const router = useRouter();
  const [selectedCardType, setSelectedCardType] = useState<string>("virtual");
  const [showSampleCard, setShowSampleCard] = useState(false);

  //virtual/physical option handler
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedCardType(event.target.value);
  };

  const closeSampleCardPopUp = () => {
    setShowSampleCard(false);
  };

  const handleToggleCreteMode = () => {
    // console.log("newMode", selectedCardType);
    router.push({
      pathname: "/cam/card-management/add-card",
      //query: { createMode: newMode, cardType: selectedCardType },
    });
    // if (newMode !== createMode) {
    //   setOpenConfirmModal(true);
    // }
  };

  return (
    <>
      <Container maxWidth="lg" className={`px-0 px-sm-4`}>
        <Paper
          className={`px-3 px-sm-5 py-3 py-sm-5 h-100 ${styles.headerPaper}`}
        >
          <div
            className={`${styles.cursorPointer} `}
            onClick={handleToggleCreteMode}
          >
            Add Cards
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default PetrocorporateCardManagement;
