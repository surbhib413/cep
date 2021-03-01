import React, { useState, useEffect } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from "@material-ui/core/styles";
// import theme from "../src/theme";
// import App from "../src/App";
import bootstrapStyle from "bootstrap/dist/css/bootstrap.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "../src/redux/reducers/reducer";
import Header from "./header";
import styles from "../src/App.module.scss";
import { I18nProvider, LOCALES } from "../src/i18n";
import Main from "./main";
import "../src/index.css";
import { useRouter } from "next/router";
import { setLoader } from "../src/redux/actions/actions";
import { useSelector, useDispatch } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
const theme = createMuiTheme({
  typography: {
    fontFamily: ['"Open Sans"', "Raleway"].join(","),
    fontSize: 16,
    h1: {
      fontSize: "2.75rem", //44 px
      // '@media (max-width:600px)': {
      //   fontSize: '1.5rem',
      // },
    },
    h2: {
      fontSize: "2.25rem", //36
    },
    h3: {
      fontSize: "1.75rem", //28
      fontWeight: 500,
      "@media (max-width:600px)": {
        fontSize: "1.125rem", //18
      },
    },
    h4: {
      fontSize: "1.125rem", //18
    },
    h5: {
      fontSize: "1.125rem", //18
      fontWeight: "bold",
      "@media (max-width:600px)": {
        fontSize: "0.875rem", //14
      },
    },
    h6: {
      fontSize: "1rem", //16
      fontWeight: "bold",
      "@media (max-width:600px)": {
        fontSize: "0.875rem", //14
      },
    },
    body1: {
      fontSize: "0.875rem", //14
      "@media (max-width:600px)": {
        fontSize: "0.75rem",
      },
    },
    body2: {
      fontSize: "1rem", //16
      "@media (max-width:600px)": {
        fontSize: "0.875rem",
      },
    },
    subtitle1: {
      fontSize: "1rem", //16
      fontWeight: "bold",
    },
    subtitle2: {
      fontSize: "0.875rem", //14
      fontWeight: "bold",
      "@media (max-width:600px)": {
        fontSize: "0.75rem", //12
      },
    },
    caption: {
      fontSize: "0.75rem", //12
    },
  },
  palette: {
    background: {
      default: "#eff1f6",
      // default: "#000000",
    },
    primary: {
      light: "#117af5",
      main: "#0369dd",
      dark: "#0257a3",
    },
    secondary: {
      main: "#ffdc00",
    },
    error: {
      main: "#fd3c4b",
    },
    success: {
      main: "#008e65",
    },
    warning: {
      main: "#ff8b46",
    },
    info: {
      main: "#0369dd",
    },
    text: {
      primary: "#354463",
      secondary: "#6e7a93",
      disabled: "#eff1f6",
    },
    action: {
      disabledBackground: "#eff1f6",
      disabled: "#afb8bc",
    },
  },
});

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();

  //const dispatch = useDispatch();
  // Router.events.on('routeChangeStart', () => dispatch(setLoader(true)));
  // Router.events.on('routeChangeComplete', () => dispatch(setLoader(false)));
  // Router.events.on('routeChangeError', () => dispatch(setLoader(false)));
  setLoader("false");
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  // useEffect(() => {
  //   const publicRoute = ["/signup", "/login"];
  //   let userAuthenticated = false;
  //   console.log("router.pathname", router.pathname);
  //   if (!publicRoute.includes(router.pathname) && !userAuthenticated) {
  //     window.location.pathname = "/login";
  //   }
  // }, [router.pathname]);

  return (
    <React.Fragment>
      <Head>
        <title>CEP</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <style dangerouslySetInnerHTML={{ __html: bootstrapStyle }} />
      </Head>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Main {...props} />
            </ThemeProvider>
          </StylesProvider>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
}
