import { Button, withStyles } from "@material-ui/core";

export const CustomUploadButton = withStyles({
  root: {
    height: "44px",
    width: "112px",
    fontSize: 12,
    fontWeight: "bold",
    boxShadow: "none",
    paddingLeft: "12px",
    "&:focus": {
      outline: "none",
    },
  },
})(Button);
