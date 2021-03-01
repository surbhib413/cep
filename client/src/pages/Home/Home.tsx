import React from "react";
import { Container } from "@material-ui/core";
import styles from "./Home.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import Link from "next/link";

const Home = (): JSX.Element => {

  return (
    <React.Fragment>
      <Container
        maxWidth="sm"
        className={`p-0 d-flex flex-column justify-content-between ${styles.businessContainer}`}
      >
        <CustomCard
          className={`d-flex flex-column ${styles.otpCard}`}
        >
          <div className={`mt-5 d-flex flex-column `}>
            <span className={`my-3 ${styles.linkStyle}`}>
              <Link href="/login" data-test-id="home-signIn">Sign In</Link>
            </span>
            <span className={styles.linkStyle}>
              <Link href="/signup" data-test-id="home-signUp"> Sign up</Link>
            </span>
          </div>
        </CustomCard>
      </Container>
    </React.Fragment>
  );
};

export default Home;
