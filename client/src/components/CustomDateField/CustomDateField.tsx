import React from "react";
import { makeStyles } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import defaultLocale from "date-fns/locale/en-US";

const useIconStyles = makeStyles({
  root: {
    width: "100%",
    marginBottom: "20px",
    "& .MuiOutlinedInput-notchedOutline": {
      // border: "solid 1px #cddae0",
    },
    "& .MuiOutlinedInput-input": {
      padding: "11.5px 14px",
      fontSize: "0.875rem",
      "@media (max-width:600px)": {
        fontSize: "0.75rem",
      },
    },
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)", // (default alpha is 0.38)
    },
    "& .MuiFormHelperText-contained": {
      marginLeft: "0px",
      marginRight: "0px",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
    "& .MuiOutlinedInput-inputAdornedStart": {
      paddingLeft: 0,
    },
    "& button:focus": {
      outline: "none",
    },
  },
});
const CustomDateField = (props: any) => {
  const classes = useIconStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        classes={{ root: classes.root }}
        {...props}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
          }
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default CustomDateField;
