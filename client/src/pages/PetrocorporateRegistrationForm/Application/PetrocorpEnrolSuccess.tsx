import React, { useState, useEffect } from "react";
import { Grid, Hidden, Container, Typography, Box } from "@material-ui/core";
import styles from "../../Application/Application.module.scss";
import CustomCard from "../../../components/CustomCard/CustomCard";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { unsetAssistedFlow } from "../../../redux/actions/actions";
import { useRouter } from "next/router";

const faIdIcon = "/Fa_Id.svg";
const passwordIcon = "/password.svg";
const phoneCallIcon = "/phone_call.svg";
const userIdIcon = "/user_Id.svg";
const applicationDescIcon = "/Application_Desc_Icon.svg";
const mobileIcon = "/mobile_Congratulations_Img.svg";
const doneKycIcon = "/done_kyc.svg";
const notUploadedKycIcon = "/not_uploaded.svg";
const pendingKycIcon = "/pending_kyc.svg";
const downloadIcon = "/Download_Icon.svg";
const b2bIllustration = "/WM_Illus-B2B_PC-Registration-Success.svg";
const b2bMobileIllustration = "/M_Illus-B2B_PetroCorp-Registration-Successful.svg";

const PetrocorpEnrolSuccess = (props: { history: any }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);
  const [kycStatus, setKycStatus] = useState<string>("");

  useEffect(() => {
    setKycStatus("done");
  }, []);

  const redirectToResetPassword = (): void => {
    // props.history.push({
    //   pathname: "/resetpassword/",
    //   state: { setPassword: true },
    // });
    router.push({
      pathname: "/resetpassword/",
      query: { setPassword: true },
    });
  };

  const redirectToLogin = (): void => {
    // props.history.push("/login/");
    router.push("/login/");
  };

  const redirectToForm = (): void => {
    // props.history.push("/registration/petrocorporate/");
    router.push("/registration/petrocorporate/");
  };

  const redirectToServiceRequests = () => {
    dispatch(unsetAssistedFlow());
    // props.history.push("/service-requests");
    router.push("/ervice-requests/");
  };

  return (
    <Container
      maxWidth="xl"
      className={`w-100 d-flex flex-column justify-content-around bd-highlight ${styles.parent}`}
    >
      <CustomCard className={`w-100 d-flex flex-column ${styles.submitCard}`}>
        <Hidden smUp>
          <div className="d-flex bd-highlight">
            <div className={`w-100 bd-highlight`}>
              {store.assistedFlow ? (
                ""
              ) : (
                  <Typography color="primary" className={styles.mobileTitle}>
                    Congratulations on getting enrolled
                    <p>in PetroCorporate Loyalty Program</p>
                  </Typography>
                )}
            </div>
          </div>
          <img className="" src={b2bMobileIllustration} alt="" />
        </Hidden>

        <Hidden xsDown>
          <img className="" src={b2bIllustration} alt="" />
          <div className="d-flex bd-highlight mt-3 ">
            <div className={`w-100 bd-highlight`}>
              {store.assistedFlow ? (
                ""
              ) : (
                  <Typography color="primary" className={styles.title}>
                    Congratulations on getting enrolled
                    <p>in PetroCorporate Loyalty Program</p>
                  </Typography>
                )}
            </div>
          </div>
        </Hidden>

        <Hidden xsDown>
          <div className={`d-flex m-3 mt-5 justify-content-around`}>
            <div className={``}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <div className={`d-flex justify-content-center`}>
                    <div className={`align-top pr-2`}>
                      <img
                        src={userIdIcon}
                        alt="userIdIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <Typography className={styles.labelStyle}>
                      <span className={`${styles.subTitle}`}>User ID </span>
                      <p className={`pt-2 ${styles.subLabel}`}>9820098200</p>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className={`d-flex justify-content-center`}>
                    <div className={`align-top pr-2`}>
                      <img
                        src={faIdIcon}
                        alt="FaIdIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <Typography className={styles.labelStyle}>
                      <span className={`${styles.subTitle}`}>CC ID</span>
                      <p className={`pt-2 ${styles.subLabel}`}>CC9722334412</p>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className={`d-flex justify-content-center`}>
                    <div className={`align-top pr-2`}>
                      <img
                        src={passwordIcon}
                        alt="passwordIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <Typography className={styles.labelStyle}>
                      <span className={`${styles.subTitle}`}>Password</span>
                      <p
                        className={`pt-2 ${styles.passwordLabel}`}
                        onClick={() => redirectToResetPassword()}
                      >
                        Set a password
                      </p>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className={`d-flex justify-content-center`}>
                    <div className={`align-top pr-2`}>
                      {kycStatus === "done" ? (
                        <img
                          src={doneKycIcon}
                          alt="doneKycIcon"
                          className={`${styles.imageStyle}`}
                        />
                      ) : (
                          ""
                        )}
                      {kycStatus === "pending" ? (
                        <img
                          src={pendingKycIcon}
                          alt="pendingKycIcon"
                          className={`${styles.imageStyle}`}
                        />
                      ) : (
                          ""
                        )}
                      {kycStatus === "notUploaded" ? (
                        <img
                          src={notUploadedKycIcon}
                          alt="notUploadedKycIcon"
                          className={`${styles.imageStyle}`}
                        />
                      ) : (
                          ""
                        )}
                    </div>
                    <Typography className={styles.labelStyle}>
                      <span className={`${styles.subTitle}`}>KYC Status</span>
                      {kycStatus === "done" ? (
                        <p className={`pb-1 m-0 pt-2 ${styles.kycDone}`}>
                          Done
                        </p>
                      ) : (
                          ""
                        )}
                      {kycStatus === "pending" ? (
                        <>
                          <p className={`pb-1 m-0 pt-2 ${styles.kycPending}`}>
                            Pending
                          </p>
                          <span className={`${styles.contactLabel}`}>
                            You may continue to do transactions
                          </span>
                          <p className={`p-0 m-0 ${styles.contactLabel}`}>
                            up to 45 days, but would not be able to
                          </p>
                          <p className={`p-0 m-0 ${styles.contactLabel}`}>
                            redeem reward points or use cashback
                          </p>
                        </>
                      ) : (
                          ""
                        )}
                      {kycStatus === "notUploaded" ? (
                        <>
                          <p
                            className={`pb-1 m-0 pt-2 ${styles.kycNotUploaded}`}
                          >
                            Not Uploaded
                          </p>
                          <span className={`${styles.contactLabel}`}>
                            Please upload KYC documents within 15
                          </span>
                          <p className={`p-0 m-0 ${styles.contactLabel}`}>
                            days to continue transacting with Bharat PetroleumL
                          </p>
                        </>
                      ) : (
                          ""
                        )}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className={`d-flex justify-content-center`}>
                    <div className={`align-top pr-2`}>
                      <img
                        src={phoneCallIcon}
                        alt="phoneCallIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <Typography className={styles.labelStyle}>
                      {store.assistedFlow ? (
                        <span className={`${styles.subTitle}`}>
                          Details of your BPCL relationship officer
                        </span>
                      ) : (
                          <span className={`${styles.subTitle}`}>
                            Bharat Petroleum Relationship Officer
                          </span>
                        )}

                      <p className={`pt-2 pb-1 m-0 ${styles.subLabel}`}>
                        Mr. K Sinha
                      </p>
                      <span className={`${styles.contactLabel}`}>
                        Mobile: 9820098200
                      </span>
                      <p className={`${styles.contactLabel}`}>
                        E-mail: ksinha@gmail.com
                      </p>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Hidden>
        <Hidden smUp>
          <div className={`d-flex m-3 mt-4 justify-content-around`}>
            <div className={`ml-2`}>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <div className={`d-flex`}>
                    <div className={`d-flex align-top pr-2`}>
                      <img
                        src={userIdIcon}
                        alt="userIdIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <span className={`${styles.mobileSubTitle}`}>User ID </span>
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <span className={`d-flex align-top ${styles.mobileSubLabel}`}>
                    9820098200
                  </span>
                </Grid>

                <Grid item xs={5}>
                  <div className={`d-flex`}>
                    <div className={`d-flex align-top pr-2`}>
                      <img
                        src={faIdIcon}
                        alt="FaIdIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <span className={`${styles.mobileSubTitle}`}>CC ID </span>
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <span className={`d-flex align-top ${styles.mobileSubLabel}`}>
                    CC9820098200
                  </span>
                </Grid>

                <Grid item xs={5}>
                  <div className={`d-flex`}>
                    <div className={`d-flex align-top pr-2`}>
                      {kycStatus === "done" ? (
                        <img
                          src={doneKycIcon}
                          alt="doneKycIcon"
                          className={`${styles.imageStyle}`}
                        />
                      ) : (
                          ""
                        )}
                      {kycStatus === "pending" ? (
                        <img
                          src={pendingKycIcon}
                          alt="pendingKycIcon"
                          className={`${styles.imageStyle}`}
                        />
                      ) : (
                          ""
                        )}
                      {kycStatus === "notUploaded" ? (
                        <img
                          src={notUploadedKycIcon}
                          alt="notUploadedKycIcon"
                          className={`${styles.imageStyle}`}
                        />
                      ) : (
                          ""
                        )}
                    </div>
                    <span className={`${styles.mobileSubTitle}`}>
                      KYC Status
                    </span>
                  </div>
                </Grid>
                <Grid item xs={7}>
                  {kycStatus === "done" ? (
                    <span
                      className={`d-flex align-top ${styles.mobileKycDone}`}
                    >
                      Done
                    </span>
                  ) : (
                      ""
                    )}
                  {kycStatus === "pending" ? (
                    <>
                      <span
                        className={`d-flex align-top ${styles.mobileKycPending}`}
                      >
                        Pending
                      </span>
                      <p
                        className={`p-0 m-0 text-align-left ${styles.contactLabel}`}
                      >
                        You may continue to do
                      </p>
                      <p className={`p-0 m-0 ${styles.contactLabel}`}>
                        transactions up to 45 days, but would not be able to
                      </p>
                      <p className={`p-0 m-0 ${styles.contactLabel}`}>
                        redeem reward points or use cashback
                      </p>
                    </>
                  ) : (
                      ""
                    )}
                  {kycStatus === "notUploaded" ? (
                    <>
                      <span
                        className={`d-flex align-top ${styles.mobileKycNotUploaded}`}
                      >
                        Not Uploaded
                      </span>
                      <p className={`p-0 m-0 ${styles.contactLabel}`}>
                        Please upload KYC documents within 15
                      </p>
                      <p className={`p-0 m-0 ${styles.contactLabel}`}>
                        days to continue transacting with Bharat Petroleum
                      </p>
                    </>
                  ) : (
                      ""
                    )}
                </Grid>

                <Grid item xs={5}>
                  <div className={`d-flex`}>
                    <div className={`d-flex align-top pr-2`}>
                      <img
                        src={passwordIcon}
                        alt="passwordIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <span className={`${styles.mobileSubTitle}`}>
                      Password{" "}
                    </span>
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <span
                    className={`d-flex align-top ${styles.passwordLabel}`}
                    onClick={() => redirectToResetPassword()}
                  >
                    {" "}
                    Set a password
                  </span>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <div className={`d-flex`}>
                    <div className={`align-top pr-2`}>
                      <img
                        src={phoneCallIcon}
                        alt="phoneCallIcon"
                        className={`${styles.imageStyle}`}
                      />
                    </div>
                    <Typography className={styles.labelStyle}>
                      {store.assistedFlow ? (
                        <span className={`${styles.mobileSubTitle}`}>
                          Details of your BPCL relationship officer
                        </span>
                      ) : (
                          <span className={`${styles.mobileSubTitle}`}>
                            Bharat Petroleum Relationship Officer
                          </span>
                        )}

                      <p className={`pt-1 m-0 ${styles.contactLabel}`}>
                        Mr. K Sinha
                        <span className={`${styles.contactSubLabel}`}>
                          , 9820098200, ksinha@gmail.com
                        </span>
                      </p>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Hidden>
        {/* </div> */}

        <Hidden smUp>
          <Box
            className={`d-flex flex-column pt-4 mt-auto align-items-center justify-content-center`}
          >
            <CustomButton
              color="primary"
              id="submitsuccess-applicationpdf"
              variant="contained"
              className={`w-100`}
              startIcon={<img src={downloadIcon} alt="downloadIcon" />}
            >
              APPLICATION PDF
            </CustomButton>

            <CustomButton
              color="primary"
              id="submitsuccess-viewapplication"
              variant="outlined"
              className={`w-100 mt-3`}
              onClick={() => redirectToForm()}
            >
              VIEW APPLICATION
            </CustomButton>
            <div
              className={`d-flex align-items-start justify-content-start pt-0`}
            >
              {store.assistedFlow ? (
                <span
                  className={`mt-3 ${styles.mobileBackToLoginLabel}`}
                  onClick={() => redirectToServiceRequests()}
                  id="submitsuccess-servicerequest"
                >
                  Back to service requests
                </span>
              ) : (
                  <span
                    className={`mt-3 ${styles.mobileBackToLoginLabel}`}
                    onClick={() => redirectToLogin()}
                    id="submitsuccess-signin"
                  >
                    BACK TO SIGN IN
                  </span>
                )}
            </div>
          </Box>
        </Hidden>
        <Hidden xsDown>
          <Box
            className={`d-flex w-100 pt-4 mt-auto align-items-end ${styles.submitBox}`}
          >
            {store.assistedFlow ? (
              <CustomButton
                color="primary"
                id="submitsuccess-servicerequest"
                variant="outlined"
                className={`ml-4 mr-auto`}
                onClick={() => redirectToServiceRequests()}
              >
                BACK TO SERVICE REQUESTS
              </CustomButton>
            ) : (
                <CustomButton
                  color="primary"
                  id="submitsuccess-signin"
                  variant="outlined"
                  className={`ml-4 mr-auto`}
                  onClick={() => redirectToLogin()}
                >
                  BACK TO SIGN IN
                </CustomButton>
              )}
            {store.assistedFlow ? (
              <CustomButton
                color="primary"
                id="submitsuccess-reviewapplication"
                variant="outlined"
                className={`mr-4 ${styles.btnStyle}`}
                onClick={() => redirectToForm()}
              >
                REVIEW APPLICATION
              </CustomButton>
            ) : (
                <CustomButton
                  color="primary"
                  id="submitsuccess-viewapplication"
                  variant="outlined"
                  className={`mr-4 ${styles.btnStyle}`}
                  onClick={() => redirectToForm()}
                >
                  VIEW APPLICATION
                </CustomButton>
              )}
            <CustomButton
              color="primary"
              id="submitsuccess-downloadpdf"
              variant="contained"
              className={`mr-4 ${styles.btnStyle}`}
              startIcon={<img src={downloadIcon} alt="downloadIcon" />}
            >
              DOWNLOAD PDF
            </CustomButton>
          </Box>
        </Hidden>
      </CustomCard>
    </Container>
  );
};

export default PetrocorpEnrolSuccess;
