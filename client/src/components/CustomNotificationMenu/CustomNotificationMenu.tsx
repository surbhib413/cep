import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Hidden } from "@material-ui/core";

export const CustomNotificationMenu = withStyles({
  paper: {
    // border: '1px solid #d3d4d5',
    // backgroundColor: 'red',
    //left: "70% !important",
    right: "3%",
    top: "13% !important",
    position: "absolute",
    width: "24rem",
    //height: "40rem",
    //overflowY: "hidden",
    "& .MuiList-padding": {
      padding: "0px"
    },
    "&:focus": {
      outline: "none",
    },
  },
  list: {
    "&:focus": {
      outline: "none",
    },
  }
})((props: MenuProps) => (
  <Menu
    MenuListProps={{
      style: {
        // width: 360,
        maxHeight: 500,
        flexDirection: "column",
        display: "flex",
        alignItems: "left",
      },
    }}
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

export const CustomNotificationMenuItem = withStyles((theme) => ({
  // root: {
  //   "&:hover": {
  //     fontWeight: "600",
  //     color: "#0369dd",
  //     backgroundColor: "rgba(3, 105, 221, 0.1)",
  //   },
  // },
}))(MenuItem);
