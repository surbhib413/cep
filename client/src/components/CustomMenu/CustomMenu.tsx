import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export const CustomMenu = withStyles({
  // root: {
  //   "&:hover": {
  //     fontWeight: "600",
  //     color: "#0369dd",
  //     backgroundColor: "rgba(3, 105, 221, 0.1)",
  //   },
  // },
})((props: MenuProps) => (
  <Menu
    MenuListProps={{
      style: {
        minWidth: 100,
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
      },
    }}
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export const CustomMenuItem = withStyles((theme) => ({
  root: {
    "&:hover": {
      fontWeight: "600",
      color: "#0369dd",
      backgroundColor: "rgba(3, 105, 221, 0.1)",
    },
  },
}))(MenuItem);
