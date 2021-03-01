import {
  React, 
  useEffect,
  Button,
  Typography,
  Dialog,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  concat, 
  indexOf, 
  filter, 
  toString, 
  toLower,
  createStyles, 
  makeStyles, 
  withStyles,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogActions,
  IconButton,
  CloseIcon
} from "../../utility/general-imports";
import PropTypes from "prop-types";
import FuelTypesOptions from "../../components/CardManagement/FuelTypes";

const dialogBoxStyles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(5),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    filterTitle: {
      fontFamily: "Open Sans",
      fontSize: "28px",
      fontWeight: "bold",
      fontStretch: "normal",
      fontStyle: "normal",
      lineHeight: "1.36",
      letterSpacing: "normal",
      textAlign: "left",
      color: "#0369dd",
    },
  });

const useStyles = makeStyles((theme) => ({
  dialogCustomizedWidth: {
    "max-width": "65%",
  },
}));

export interface DialogTitleProps extends WithStyles<typeof dialogBoxStyles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(dialogBoxStyles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={`pl-5 ${classes.filterTitle}`}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={`${classes.closeButton} pr-5`}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    "& .MuiButtonBase-root": {
      fontSize: "14px",
      fontWeight: "bold"
    },
    "& .MuiButtonBase-root:focus": {
      //outline: 'none'
    },
  },
}))(MuiDialogActions);

export const PopupFilter = (props: any) => {
  const {
    openModal = false,
    handleFilterClose = null,
    filterCardData,
    selectedButton = "Active",
    fuelTypeData
  } = props;
  const classes = useStyles();
  const [cardStatus, setCardStatus] = React.useState<Array<String>>([toLower(selectedButton)]);
  const [cardType, setCardType] = React.useState<Array<String>>([]);
  const [limitType, setLimitType] = React.useState<Array<String>>([]);
  const [fuelTypes, setFuelTypes] = React.useState<Array<String>>([]);
  const [cardBalance, setCardBalance] = React.useState({
    minBalance: "",
    maxBalance: "",
  });
  const regToCheckNumber = /[0-9]+/g;

  const handleCardStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    if(target.checked){
      if(target.name == toLower(selectedButton) || selectedButton == 'All'){
        setCardStatus((prevState) => concat(prevState, [target.name]))
      }
    }
    else{
      if(selectedButton == 'All'){
        setCardStatus((prevState) =>
          filter(prevState, (item) => {
            return item != target.name;
          })
        );
      }
    }
  };
  const handleCardTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    target.checked
      ? setCardType((prevState) => concat(prevState, [target.name]))
      : setCardType((prevState) =>
          filter(prevState, (item) => {
            return item != target.name;
          })
        );
  };
  const handleLimitTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    target.checked
      ? setLimitType((prevState) => concat(prevState, [target.name]))
      : setLimitType((prevState) =>
          filter(prevState, (item) => {
            return item != target.name;
          })
        );
  };
  const handleAllowedFuelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    const fuleTypesList = fuelTypeData.map((value:any,index:number) => {
      return value.code;
    })
    if(target.checked){
      if(target.name === 'All'){
        setFuelTypes(fuleTypesList);
      }
      else{
        setFuelTypes((prevState: any) =>
          concat(prevState, [target.name])
        )
      }
    }
    else{
      if(target.name === 'All'){
        setFuelTypes([]);
      }
      else{
        setFuelTypes((prevState: any) =>
          filter(prevState, (item) => {
            return item != target.name && item != 'All';
          })
        );
      }
    }    
  };
  const handleCardBalanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;

    if (
      target.value === "" ||
      regToCheckNumber.test(target.value)
    ) {
      setCardBalance({
        ...cardBalance,
        [target.name]: target.value,
      });
    } else {
      event.preventDefault();
      return;
    }
  };

  const handleFilterApply = () => {
    filterCardData({
      status: toString(cardStatus),
      cardType: toString(cardType),
      limitType: toString(limitType),
      fuelType: toString(fuelTypes),
      ...cardBalance,
    });
    handleFilterClose();
  };

  const handleResetFilter = () => {
    setCardStatus([]);
    setCardType([]);
    setLimitType([]);
    setFuelTypes([]);
    setCardBalance({ minBalance: "", maxBalance: "" });
  };

  useEffect(() => {
    setCardStatus([toLower(selectedButton)]);
  },[selectedButton])

  return (
    <Dialog
      fullWidth={true}
      classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
      onClose={handleFilterClose}
      aria-labelledby="customized-dialog-title"
      open={openModal}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleFilterClose}>
        Filter
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" className={"pl-3"}>
          Card Status
        </Typography>
        <Grid container className={"pl-3"}>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="active"
                  onChange={handleCardStatusChange}
                  checked={indexOf(cardStatus, "active") > -1}
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="blocked"
                  onChange={handleCardStatusChange}
                  checked={indexOf(cardStatus, "blocked") > -1}
                />
              }
              label="Blocked"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="hotlisted"
                  onChange={handleCardStatusChange}
                  checked={indexOf(cardStatus, "hotlisted") > -1}
                />
              }
              label="Hotlisted"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="inactive"
                  onChange={handleCardStatusChange}
                  checked={indexOf(cardStatus, "inactive") > -1}
                />
              }
              label="Inactive"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="terminated"
                  onChange={handleCardStatusChange}
                  checked={indexOf(cardStatus, "terminated") > -1}
                />
              }
              label="Terminated"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="unassigned"
                  onChange={handleCardStatusChange}
                  checked={indexOf(cardStatus, "unassigned") > -1}
                />
              }
              label="Unassigned"
            />
          </Grid>
        </Grid>
        <Typography variant="h6" className={"pl-3 pt-2"}>
          Card Type
        </Typography>
        <Grid container className={"pl-3"}>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="physical"
                  onChange={handleCardTypeChange}
                  checked={indexOf(cardType, "physical") > -1}
                />
              }
              label="Physical"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="virtual"
                  onChange={handleCardTypeChange}
                  checked={indexOf(cardType, "virtual") > -1}
                />
              }
              label="Virtual"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="instacard"
                  onChange={handleCardTypeChange}
                  checked={indexOf(cardType, "instacard") > -1}
                />
              }
              label="Instacard"
            />
          </Grid>
        </Grid>
        <Typography variant="h6" className={"pl-3 pt-2"}>
          Limit Type
        </Typography>
        <Grid container className={"pl-3"}>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="adhoc"
                  onChange={handleLimitTypeChange}
                  checked={indexOf(limitType, "adhoc") > -1}
                />
              }
              label="Adhoc"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="daily"
                  onChange={handleLimitTypeChange}
                  checked={indexOf(limitType, "daily") > -1}
                />
              }
              label="Daily Limit"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  name="monthly"
                  onChange={handleLimitTypeChange}
                  checked={indexOf(limitType, "monthly") > -1}
                />
              }
              label="Monthly Limit"
            />
          </Grid>
        </Grid>
        <Typography variant="h6" className={"pl-3 pt-2"}>
          Allowed Fuel Types
        </Typography>
        <Grid container className={"pl-3"}>
          <FuelTypesOptions
            columns={3}
            onChangeHandler={handleAllowedFuelTypeChange}
            selectedFuelTypes={fuelTypes}
            fuelTypeData={fuelTypeData}
          />
        </Grid>
        <Typography variant="h6" className={"pl-3 pt-2"}>
          Card Wallet
        </Typography>
        <Grid container className={"pl-3"}>
          <Grid item xs={3} sm={3} className={"pr-3"}>
            <Typography className={"py-2"}>Minimum</Typography>
            <TextField
              name="minBalance"
              placeholder="In Rupees"
              variant="outlined"
              size="small"
              onChange={handleCardBalanceChange}
              value={cardBalance.minBalance}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography className={"py-2"}>Maximum</Typography>
            <TextField
              name="maxBalance"
              placeholder="In Rupees"
              variant="outlined"
              size="small"
              onChange={handleCardBalanceChange}
              value={cardBalance.maxBalance}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={"pr-5"}>
        <Button
          variant="outlined"
          onClick={handleResetFilter}
          color="primary"
          className={"mr-3"}
        >
          RESET FILTER
        </Button>
        <Button
          variant="contained"
          onClick={handleFilterApply}
          color="primary"
          className={"mr-5"}
        >
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  );
};
