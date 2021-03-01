import React from "react";

import { Button, withStyles, ButtonProps } from "@material-ui/core";

export const CustomButton = withStyles({
  root: {
    minHeight: "40px",
    minWidth: "140px",
    "@media (max-width:576px)": {
      minWidth: "96px",
    },
    fontSize: 12,
    letterSpacing: 1.6,
    borderWidth: 1.5,
    fontWeight: "bold",
    boxShadow: "none",
    "&:focus": {
      outline: "none",
    },
    "&.MuiButton-containedSizeLarge": {
      height: "44px",
    },
    "&.MuiButton-outlinedPrimary": {
      border: "1.5px solid #0369dd"
    }
  },
})((props: ButtonProps) => <Button component="span" {...props} />);
