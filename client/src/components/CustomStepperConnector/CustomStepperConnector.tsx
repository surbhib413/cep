import { withStyles, makeStyles } from "@material-ui/core/styles";
import StepConnector from "@material-ui/core/StepConnector";
import { StepIconProps } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

export const CustomStepperConnector = withStyles({
  alternativeLabel: {
    top: 14,
    fontWeight: 600,
    color: "#354463",
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
    zIndex: 1,
  },
  active: {
    fontWeight: 600,
    "& $line": {
      borderColor: "#eff3fa",
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#eff3fa",
    },
  },
  line: {
    borderColor: "#eff3fa",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useCustomStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#eff3fa",
    fontWeight: 600,
    zIndex: 1,
    color: "#354463",
    minWidth: 32,
    height: 32,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    width: 32,
    height: 32,
    color: "#ffffff",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "linear-gradient(57deg, rgb(0, 177, 75) 13%, rgb(0, 211, 103) 86%)",
  },
  completed: {
    color: "#ffffff",
    backgroundImage:
      "linear-gradient(57deg, rgb(0, 177, 75) 13%, rgb(0, 211, 103) 86%)",
  },
  incomplete: {
    color: "#ffffff",
    backgroundImage: "linear-gradient(50deg, #ffc402 17%, #ffdc00 82%)",
  },
  circle: {
    width: 48,
    height: 48,
    bottom: 8,
    position: "relative",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  activeCircle: {
    zIndex: 2,
    border: "solid 2px #22d9a4",
  },
});

export function CustomStepIcon(props: StepIconProps) {
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
