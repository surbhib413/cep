// import React from "react";
import { Tooltip, withStyles } from "@material-ui/core";

export const CustomTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: "#354463",
    //   color: 'rgba(0, 0, 0, 0.87)',
    fontsize: "0.752rem",
    "@media (max-width:600px)": {
      fontSize: 11,
    },
    width: "215px",
    textAlign: "left",
  },
}))(Tooltip);
