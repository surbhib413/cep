import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { I18nProvider, LOCALES } from "../src/i18n";
import Header from "../src/components/Header/Header";
import styles from "../src/App.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { Hidden } from "@material-ui/core";
import SideNav from "../src/components/SideNav/SideNav";
import CustomLoader from "../src/components/CustomLoder/CustomLoader";
import Router from 'next/router';
import { setLoader } from "../src/redux/actions/actions";
import store from './store';

Router.events.on('routeChangeStart', () => store.dispatch(setLoader(true)));
Router.events.on('routeChangeComplete', () => store.dispatch(setLoader(false)));
Router.events.on('routeChangeError', () => store.dispatch(setLoader(false)));

export default function Main(props: any) {
  //const store: any = useSelector((state) => state);
  const store: any = useSelector((state) => state);
  const dispatch = useDispatch();

  // Router.events.on('routeChangeStart', () => dispatch(setLoader(true)));
  // Router.events.on('routeChangeComplete', () => dispatch(setLoader(false)));
  // Router.events.on('routeChangeError', () => dispatch(setLoader(false)));
  const { Component, pageProps } = props;
  const [sidenavOpen, setSidenavOpen] = useState(false);

  const toggleSidenavOpen = () => {
    console.log("sidenav toggles");
    setSidenavOpen((sidenavOpen) => !sidenavOpen);
  };

  return (
    <I18nProvider locale={store.language}>
      <CustomLoader loader={store.setLoader} />
      <div className={`${styles.App}`}>
        <Header toggleSidenavOpen={toggleSidenavOpen} />
        <div
          className={`d-flex ${store.assistedFlow ? "h-100" : styles.appContainer
            }`}
        >
          {/* <Hidden smUp>
            {store.userIsLoggedIn ? (
              <SideNav sidenavOpen={sidenavOpen}></SideNav>
            ) : (
              ""
            )}
          </Hidden>
          <Hidden xsDown>
            {store.userIsLoggedIn ? <SideNav></SideNav> : ""}
          </Hidden> */}
          <Component store={store} {...pageProps} />
        </div>
      </div>
    </I18nProvider>
  );
}
