import { makeStyles } from "@material-ui/core/styles";
import { StepIconProps } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useCustomStepIconStyles = makeStyles({
  root: {
    fontSize: 12,
    fontWeight: 600,
    padding: 0,
    backgroundColor: "#cfdaef",
    zIndex: 1,
    color: "#354463",
    minWidth: 25,
    height: 25,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    fontWeight: "bold",
    width: 25,
    height: 25,
    color: "#eff3fa",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "linear-gradient(57deg, rgb(0, 177, 75) 13%, rgb(0, 211, 103) 86%)",
  },
  completed: {
    color: "#eff3fa",
    backgroundImage:
      "linear-gradient(57deg, rgb(0, 177, 75) 13%, rgb(0, 211, 103) 86%)",
  },
  incomplete: {
    color: "#eff3fa",
    backgroundImage: "linear-gradient(50deg, #ffc402 17%, #ffdc00 82%)",
  },
  circle: {
    width: 37,
    height: 37,
    position: "relative",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff3fa",
  },
  activeCircle: {
    zIndex: 2,
    border: "solid 2px #22d9a4",
  },
});

export function CustomStepIconMobile(props: StepIconProps) {
  const classes = useCustomStepIconStyles();
  const { active, completed, error } = props;

  return (
    <div
      className={`${
        active && !completed && !error ? classes.activeCircle : ""
      } ${classes.circle}`}
    >
      {/* {props.icon} */}
      {/* {active ? <div className={classes.active}>{props.icon}</div> : props.icon} */}
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
          [classes.incomplete]: error,
        })}
      >
        {props.icon}
      </div>
    </div>
  );
}
