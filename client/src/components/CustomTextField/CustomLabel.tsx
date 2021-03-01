import { InputLabel, withStyles } from "@material-ui/core";

export const CustomLabel = withStyles({
  root: {
    fontWeight: 600,
    fontSize: "0.875rem",
    lineHeight: 1.5,
    "@media (max-width:600px)": {
      fontSize: "0.75rem",
    },
    color: "#354463",
    // width: "100%",
    // marginBottom: "20px",
    // "& label.Mui-focused": {
    //   color: "green",
    // },
    // "& .MuiInput-underline:after": {
    //   borderBottomColor: "green",
    // },

    //   "& fieldset": {
    //     borderColor: "red",
    //   },
    //   "&:hover fieldset": {
    //     borderColor: "yellow",
    //   },
    //   "&.Mui-focused fieldset": {
    //     borderColor: "green",
    //   },
    // },
  },
})(InputLabel);
