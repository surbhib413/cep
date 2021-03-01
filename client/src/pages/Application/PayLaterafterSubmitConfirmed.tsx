import React from "react";
import {
  Grid,
  Hidden,
  Container,
  Paper,
  Typography,
  Box,
} from "@material-ui/core";
import Header from "../../components/Header/Header";
import styles from "./Application.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useRouter } from "next/router";

const downloadIcon = "/Download_Icon.svg";
const requestSentImg = "/Request_Sent.svg";

const PayLaterApplicationsubmit = () => {
  const router = useRouter();
  const redirectToLogin = (): void => {
    // props.history.push("/login/");
    router.push("/login/");
  };

  const redirectToForm = (): void => {
    // props.history.push("/registration/smartfleet/");
    router.push("/registration/smartfleet/");
  };

  return (
    <>
      <Header></Header>
      <Container
        maxWidth="xl"
        className={`w-100 d-flex justify-content-around bd-highlight ${styles.parent}`}
      >
        <Paper className={`w-100 ${styles.headerPaper}`}>
          <CustomCard
            className={`w-100 d-flex flex-column ${styles.submitCard}`}
          >
            <div
              className={`d-flex justify-content-center align-items-center mt-4`}
            >
              <img className="p-3" src={requestSentImg} alt="requestSentImg" />
            </div>
            <div className="d-flex bd-highlight">
              <div
                className={`p-2 w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography className={`pl-2 ${styles.title}`} color="primary">
                  Application Submitted
                </Typography>
              </div>
            </div>
            <Typography className={`pt-5`}>
              <span className={`${styles.subLabel}`}>
                Application number 998766 has been submitted
              </span>
            </Typography>
            <Typography className="pt-4">
              <span className={`${styles.spanLabel}`}>
                Request to visit nearby Bharat Petroleum Fuel Station and
                complete the payment.
              </span>
              <p className={`${styles.spanLabel}`}>
                Post payment completion, Re-Login and enter the Transaction
                Reference Number
              </p>
              <p className={`${styles.spanLabel}`}>
                received at the Fuel Station to complete your enrolment.
              </p>
            </Typography>
            <Box
              className={`d-flex w-100 pt-4 mt-auto align-items-end ${styles.submitBox}`}
            >
              <Hidden smUp>
                <Grid container spacing={4} className="mb-0">
                  <Grid item xs={6} sm={4} className="py-0">
                    <CustomButton
                      color="primary"
                      variant="outlined"
                      className={`ml-4 mr-auto`}
                      onClick={() => redirectToLogin()}
                    >
                      BACK TO LOGIN
                    </CustomButton>
                  </Grid>
                  <Grid item xs={6} sm={4} className="py-0">
                    <CustomButton
                      color="primary"
                      variant="outlined"
                      className={`mr-4 ${styles.btnStyle}`}
                      onClick={() => redirectToForm()}
                    >
                      VIEW APPLICATION
                    </CustomButton>
                  </Grid>
                </Grid>
              </Hidden>

              <Hidden xsDown>
                <CustomButton
                  color="primary"
                  variant="outlined"
                  className={`ml-4 mr-auto`}
                  onClick={() => redirectToLogin()}
                >
                  BACK TO LOGIN
                </CustomButton>

                <CustomButton
                  color="primary"
                  variant="outlined"
                  className={`mr-4 ${styles.btnStyle}`}
                  onClick={() => redirectToForm()}
                >
                  VIEW APPLICATION
                </CustomButton>
                <CustomButton
                  color="primary"
                  variant="contained"
                  className={`mr-4 ${styles.btnStyle}`}
                  startIcon={<img src={downloadIcon} alt="downloadIcon" />}
                >
                  APPLICATION PDF
                </CustomButton>
              </Hidden>
            </Box>
          </CustomCard>
        </Paper>
      </Container>
    </>
  );
};

export default PayLaterApplicationsubmit;
