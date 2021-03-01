import { Container, makeStyles, Typography } from "@material-ui/core";
import { Hidden } from '@material-ui/core';
import React from "react";
import CustomCard from "src/components/CustomCard/CustomCard";
import CustomDialogComponent from "src/components/Dialog/Dialog";

const useStyles = makeStyles((theme) => ({
  CustomCard: {
    textAlign: "center",
    padding: "1rem 1rem",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem 8rem"
    },
  },
  headTitle: {
    texAtlign: "center",
    fontSize: "1.3rem",
    fontWeight: 600,
  },
  closeIcon: {
    cursor: "pointer",
  },
}));

const closeIcon = "/close_Icon.svg";

function DialogWrapper({open,title,children,handleClose}:any) {
  const classes = useStyles();
  return (
    <CustomDialogComponent open={open}>
      <Container maxWidth="sm" className={`p-0 m-0`}>
        <CustomCard className={`${classes.CustomCard}`}>
          <div className="d-flex bd-highlight">
            <div
              className={`p-2 w-100 align-items-center justify-content-center bd-highlight`}
            >
              <Typography
                className={`pl-2 ${classes.headTitle}`}
                color="primary"
              >
                {title}
              </Typography>
            </div>
            <Hidden smDown>
            <div className={`p-2 justify-content-end `}>
              <img
                className={`${classes.closeIcon}`}
                src={closeIcon}
                alt="closeIcon"
                onClick={handleClose}
              />
            </div>
            </Hidden>
          </div>
          {children}
        </CustomCard>
      </Container>
    </CustomDialogComponent>
  );
}

export default DialogWrapper;
