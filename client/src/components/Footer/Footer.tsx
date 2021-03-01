import React from "react";
import { Container, Typography, Link } from "@material-ui/core";
import styles from "./Footer.module.scss";
const FacebookLogo = "/facebook.svg";
const GoogleLogo = "/google.svg";
const TwitterLogo = "/twitter.svg";
const Footer = () => {
  return (
    <footer className={`py-3 ${styles.footer}`}>
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <div className={`${styles.footerLeft}`}>
            <div className={`d-flex`}>
              <Typography variant="subtitle2" className={`mr-5`}>
                <Link color="textSecondary" href="#">
                  About
                </Link>
              </Typography>
              <Typography variant="subtitle2" className={`mr-5`}>
                <Link color="textSecondary" href="#">
                  Contact
                </Link>
              </Typography>
              <Typography variant="subtitle2" className={`mr-5`}>
                <Link color="textSecondary" href="#">
                  Legal
                </Link>
              </Typography>
              <Typography variant="subtitle2" className={`mr-5`}>
                <Link color="textSecondary" href="#">
                  Terms
                </Link>
              </Typography>
            </div>
            <Typography variant="caption">
              Copyright © 2020 Bharat Petroleum. All rights reserved.
            </Typography>
          </div>

          <div>
            <img src={FacebookLogo} alt="Facebook" className={`ml-5`}></img>
            <img src={GoogleLogo} alt="Google" className={`ml-5`}></img>
            <img src={TwitterLogo} alt="Twitter" className={`ml-5`}></img>
          </div>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
