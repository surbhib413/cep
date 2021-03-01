import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";

export const CustomAccordion = withStyles({
  root: {
    marginBottom: 8,
    "@media (max-width:600px)": {
      marginBottom: 4,
    },
    position: "inherit",
    //
    // border: '1px solid rgba(0, 0, 0, .125)',
    // boxShadow: 'none',
    // '&:not(:last-child)': {
    //   borderBottom: 0,
    // },
    // '&:before': {
    //   display: 'none',
    // },
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordion);

export const CustomAccordionSummary = withStyles({
  root: {
    backgroundColor: "#eff3fa",
    minHeight: 40,
    position: "sticky",
    zIndex: 20,
    top: 56,
    "@media (min-width:600px)": {
      borderRadius: 4,
      // top: 295,
    },
    "&$expanded": {
      minHeight: 50,
    },
  },
  content: {
    margin: 0,
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordionSummary);

export const CustomAccordionDetails = withStyles((theme) => ({
  root: {
    padding: "16px 0px",
  },
}))(MuiAccordionDetails);
