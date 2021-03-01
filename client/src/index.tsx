import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./redux/reducers/reducer";
import combinedReducers from "./redux"

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// import 'bootstrap-daterangepicker/daterangepicker.css';

const store = createStore(combinedReducers);

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
        fontSize: "0.75rem",  // 12
      },
    },
    body2: {
      fontSize: "1rem", //16
      "@media (max-width:600px)": {
        fontSize: "0.875rem", //14
      },
    },
    subtitle1: {
      fontSize: "1rem", //16
      fontWeight: "bold",
      "@media (max-width:600px)": {
        fontSize: "0.75rem", //12
      },
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
      // primary: "#354463",
      primary: "#0257a3",
      secondary: "#6e7a93",
      disabled: "#eff1f6",
    },
    action: {
      disabledBackground: "#eff1f6",
      disabled: "#afb8bc",
    },
  },
});

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StylesProvider injectFirst>
        <App />
      </StylesProvider>
    </ThemeProvider>
  </Provider>,
  // </React.StrictMode>
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
