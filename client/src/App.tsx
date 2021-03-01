import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
import history from "./history/history";
import { Switch, Route, Router } from "react-router-dom";
import Header from "./components/Header/Header";
import SideNav from "./components/SideNav/SideNav";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Password from "./pages/Password/Password";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import SignUp from "./pages/SignUp/Signup";
import OtpVerfication from "./pages/OtpVerification/OtpVerification";
import SmartfleetRegistrationForm from "./pages/SmartfleetRegistrationForm/SmartfleetRegistrationForm";
import TypeOfBusiness from "./pages/SignUp/typeOfBusiness";
import SubmitApplicationFeePaid from "./pages/Application/SubmitApplicationFeePaid";
import SubmitApplicationFeeWaiver from "./pages/Application/SubmitApplicationFeeWaiver";
import SubmitApplicationPayLater from "./pages/Application/SubmitApplicationPayLater";
import ConfirmSubmit from "./pages/Application/ConfirmSubmission";
import EnrolSuccess from "./pages/Application/EnrolSuccess";
import ServiceRequestsTable from "./pages/ServiceRequestsTable/ServiceRequestsTable";
import EnrollCustomer from "./pages/EnrollCustomer/EnrollCustomer";
import RejectPopUp from "./pages/Application/RejectPopUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import ReviewApplication from "./pages/ReviewApplication/ReviewApplication";
import PetrocorporateEmployeeAccounts from "./pages/PetrocorporateEmployeeAccounts/PetrocorporateEmployeeAccounts";
// import PetrocorporateEmployeeAccountsBulkUpload from "./pages/PetrocorporateEmployeeAccounts/CreateEmployeeAccounts/CreateEmployeeAccounts";
// import PetrocorporateEmployeeAccountsIndividual from "./pages/PetrocorporateEmployeeAccounts/CreateEmployeeAccounts/Body/Individual/Individual";

import { useSelector } from "react-redux";
import { I18nProvider, LOCALES } from "./i18n";
// import translate from "./i18n/translate";
import PetrocorporateRegistrationForm from "./pages/PetrocorporateRegistrationForm/PetrocorporateRegistrationForm";
import PetrocorpEnrolSuccess from "./pages/PetrocorporateRegistrationForm/Application/PetrocorpEnrolSuccess";
import { Hidden } from "@material-ui/core";
import { Components } from "./components/Components";
import CreateEmployeeAccounts from "./pages/PetrocorporateEmployeeAccounts/CreateEmployeeAccounts/CreateEmployeeAccounts";
import PetrocorporateCardManagement from "./pages/CAMCardManagement/CAMCardManagement";
import AddCards from "./pages/CAMCardManagement/AddCards/AddCards";
import Notification from "./pages/Notification/Notification";
import NotificationAlerts from "./pages/Notification/NotificationAlerts";

const App = () => {
  const store: any = useSelector((state) => state);
  const [locale, setLocale] = useState(LOCALES.ENGLISH);

  const [sidenavOpen, setSidenavOpen] = useState(false);

  const toggleSidenavOpen = () => {
    setSidenavOpen((sidenavOpen) => !sidenavOpen);
  };

  // const handleSidenavClose = () => {
  //   setSidenavOpen(false);
  // };

  useEffect(() => {
    console.log("This is set Language", store.language);
    setLocale(store.language);
  }, [store.language]);

  return (
    <I18nProvider locale={locale}>
      <div className={`${styles.App}`}>
        <Router history={history}>
          {store.assistedFlow ? (
            ""
          ) : (
              <Header toggleSidenavOpen={toggleSidenavOpen}></Header>
            )}
          <div
            className={`d-flex ${store.assistedFlow ? "h-100" : styles.appContainer
              }`}
          >
            {/* <Hidden smUp>
              {store.userIsLoggedIn && !store.assistedFlow ? (
                <SideNav sidenavOpen={sidenavOpen}></SideNav>
              ) : (
                  ""
                )}
            </Hidden>
            <Hidden xsDown>
              {store.userIsLoggedIn && !store.assistedFlow ? (
                <SideNav></SideNav>
              ) : (
                  ""
                )}
            </Hidden> */}
            {/* <FormattedMessage id="hello"></FormattedMessage> */}
            {/* {translate("hello")}
          <p>
            {translate('edit', { path: <code>src/App.tsx</code> })}
          </p> */}
            {/* <button onClick={() => setLocale(LOCALES.ENGLISH)}>ENGLISH</button>
          <button onClick={() => setLocale(LOCALES.FRENCH)}>FRENCH</button>
          <button onClick={() => setLocale(LOCALES.GERMAN)}>GERMAN</button>
          <button onClick={() => setLocale(LOCALES.HINDI)}>HINDI</button> */}

            <Switch>
              <Route exact path="/components" component={Components}></Route>
              <Route exact path="/dashboard" component={Dashboard}></Route>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/home" component={Home}></Route>
              <Route
                exact
                path="/forgotpassword"
                component={ForgotPassword}
              ></Route>
              <Route exact path="/password" component={Password}></Route>
              <Route
                exact
                path="/resetpassword"
                component={ResetPassword}
              ></Route>
              <Route exact path="/signup" component={SignUp}></Route>
              <Route exact path="/smartfleet/signup" component={SignUp}></Route>
              <Route
                exact
                path="/petrocorporate/signup"
                component={SignUp}
              ></Route>
              <Route
                exact
                path="/signup/business"
                component={TypeOfBusiness}
              ></Route>
              <Route exact path="/otp" component={OtpVerfication}></Route>
              <Route
                exact
                path="/registration/smartfleet"
                component={SmartfleetRegistrationForm}
              ></Route>

              <Route
                exact
                path="/submit/applicationfeepaid"
                component={SubmitApplicationFeePaid}
              ></Route>
              <Route
                exact
                path="/submit/applicationfeewaiver"
                component={SubmitApplicationFeeWaiver}
              ></Route>
              <Route
                exact
                path="/submit/applicationpaylater"
                component={SubmitApplicationPayLater}
              ></Route>
              <Route
                exact
                path="/reject/application"
                component={RejectPopUp}
              ></Route>
              <Route
                exact
                path="/submit/enrolsuccess"
                component={EnrolSuccess}
              ></Route>
              <Route
                exact
                path="/petrocorp/enrolsuccess"
                component={PetrocorpEnrolSuccess}
              ></Route>
              <Route
                exact
                path="/service-requests"
                component={ServiceRequestsTable}
              ></Route>
              <Route
                exact
                path="/enroll/customer"
                component={EnrollCustomer}
              ></Route>
              <Route
                exact
                path="/submissionconfirm/paylater"
                component={ConfirmSubmit}
              ></Route>
              <Route
                exact
                path="/review-application/:appId"
                component={ReviewApplication}
              />
              <Route
                exact
                path="/registration/petrocorporate"
                component={PetrocorporateRegistrationForm}
              ></Route>
              <Route
                exact
                path="/petrocorp/employee-accounts"
                component={PetrocorporateEmployeeAccounts}
              />
              <Route
                exact
                path="/petrocorp/employee-accounts/create"
                component={CreateEmployeeAccounts}
              />
              <Route
                exact
                path="/cam/card-management"
                component={PetrocorporateCardManagement}
              />
              <Route
                exact
                path="/cam/card-management/add-card"
                component={AddCards}
              />
              <Route
                exact
                path="/notification"
                component={Notification}
              />
              <Route
                exact
                path="/notificationalerts"
                component={NotificationAlerts}
              />
            </Switch>
          </div>
        </Router>
      </div>
    </I18nProvider>
  );
};

export default App;
