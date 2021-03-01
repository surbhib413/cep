import React from "react";
import { Icon, makeStyles } from "@material-ui/core";

const useIconStyles = makeStyles({
  imageIcon: {
    // height: '100%',
  },
  iconRoot: {
    display: "flex",
    textAlign: "center",
  },
});
export const CustomSvgIcon = (props: any) => {
  const { iconsource } = props;
  const classes = useIconStyles();

  return (
    <Icon classes={{ root: classes.iconRoot }} {...props}>
      <img className={classes.imageIcon} src={iconsource} alt="icon" />
    </Icon>
  );
};
