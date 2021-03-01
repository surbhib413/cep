import React from "react";
import { makeStyles } from "@material-ui/core/styles";
const UploadIconImg = "/W_Icon_Upload.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: "6px",
  },
}));

const UploadIcon = () => {
  const classes = useStyles();
  return (
    <div>
      <img className={classes.root} src={UploadIconImg} alt="upload" />
    </div>
  );
};

export default UploadIcon;
