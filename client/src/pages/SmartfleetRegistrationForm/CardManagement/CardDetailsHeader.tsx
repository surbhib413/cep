import React from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import styles from "./CardManagement.module.scss";

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
    padding: "21px 0 21px 24px",
  },
})(Typography);

const CardDetailsHeader = () => {
  return (
    <div>
      <Grid
        container
        className={`${styles.basicDetailsHeader} d-flex align-items-center pl-3`}
      >
        <Grid item xs={11}>
          <Typography variant="h6">Card Details</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default CardDetailsHeader;
