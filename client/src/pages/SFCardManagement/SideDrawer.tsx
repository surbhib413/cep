import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";


function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  verticalTabs: {
    width: "100%",
  },
}));

export default function SideDrawer({ children }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="standard"
        value={value}
        onChange={handleChange}
        aria-label="Side Navigation"
        className={classes.tabs}
      >
        <Tab label="Home" {...a11yProps(0)} />
        <Tab label="Recharge" {...a11yProps(1)} />
        <Tab label="Card Management" {...a11yProps(2)} />
        <Tab label="Vouchers" {...a11yProps(3)} />
        <Tab label="Rewards" {...a11yProps(4)} />
        <Tab label="Credit Management" {...a11yProps(5)} />
        <Tab label="Transaction History" {...a11yProps(6)} />
        <Tab label="Reports" {...a11yProps(7)} />
        <Tab label="Support" {...a11yProps(8)} />
        <Tab label="Logout" {...a11yProps(9)} />
      </Tabs>
      <TabPanel value={value} index={0} className={classes.verticalTabs}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Recharge
      </TabPanel>
      <TabPanel value={value} index={2}>
        Card Management
      </TabPanel>
      <TabPanel value={value} index={3}>
        Vouchers
      </TabPanel>
      <TabPanel value={value} index={4}>
        Rewards
      </TabPanel>
      <TabPanel value={value} index={5}>
        Credit Management
      </TabPanel>
      <TabPanel value={value} index={6}>
        Transaction History
      </TabPanel>
      <TabPanel value={value} index={7}>
        Reports
      </TabPanel>
      <TabPanel value={value} index={8}>
        Support
      </TabPanel>
      <TabPanel value={value} index={9}>
        Logout
      </TabPanel>
    </div>
  );
}
