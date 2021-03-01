import React from "react";
import { Select, withStyles, SelectProps } from "@material-ui/core";
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';

const CustomMultiSelect = withStyles({
  root: {
    padding: "11.5px 14px",
    // border: "solid 1px #cddae0",
    "& .MuiInputBase-root": {
      width: "100%",
    },
  },
})((props: SelectProps) => (
  <Select
    IconComponent={ExpandMoreOutlinedIcon}
    MenuProps={{
      elevation: 1,
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "center",
      }
    }}
    {...props}
  />
));

export default CustomMultiSelect;
