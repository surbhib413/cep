import { InputAdornment, withStyles } from "@material-ui/core";
export const CustomInputAdornment = withStyles({
  root: {
    marginRight: 0,
    "& .MuiTypography-body1": {
      fontSize: 16,
      fontWeight: 600,
    },
  },
})(InputAdornment);
