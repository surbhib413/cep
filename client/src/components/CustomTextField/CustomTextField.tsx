import React from "react";
import { TextField, makeStyles } from "@material-ui/core";

// const CustomTextField = withStyles({
//   root: {
//     width: "100%",
//     marginBottom: "20px",
//     "& .MuiOutlinedInput-notchedOutline": {
//       // border: "solid 1px #cddae0",
//     },
//     "& .MuiOutlinedInput-input": {
//       padding: "11.5px 14px",
//       fontSize: "0.875rem",
//       "@media (max-width:600px)": {
//         fontSize: "0.75rem",
//       },
//     },
//     "& .MuiInputBase-root.Mui-disabled": {
//       color: "rgba(0, 0, 0, 0.6)", // (default alpha is 0.38)
//     },
//     "& .MuiFormHelperText-contained": {
//       marginLeft: "12px",
//       marginRight: "0px",
//     },
//     "& .MuiOutlinedInput-adornedEnd": {
//       paddingRight: 0,
//     },
//     "& .MuiOutlinedInput-inputAdornedStart": {
//       paddingLeft: 0,
//     },
//   },
// })(TextField);

// export default CustomTextField;

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
      // marginLeft: "12px",
      marginLeft: "0px",
      marginRight: "0px",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
    "& .MuiOutlinedInput-inputAdornedStart": {
      paddingLeft: 0,
    },
  },
});
const CustomTextField = (props: any) => {
  const classes = useIconStyles();

  return (
    <TextField
      classes={{ root: classes.root }}
      {...props}
      onKeyPress={(ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
        }
      }}
    ></TextField>
  );
};

export default CustomTextField;
