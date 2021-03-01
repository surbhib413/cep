import { Card, withStyles } from "@material-ui/core";

const CustomCard = withStyles({
  root: {
    boxShadow: "0 0 10px 0 rgba(224, 214, 214, 0.29)",
  },
})(Card);

export default CustomCard;
