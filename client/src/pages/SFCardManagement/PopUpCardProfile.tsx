import {
  React,
  useState,
  useContext,
  Grid,
  Button,
  Dialog,
  makeStyles,
  createStyles,
  FormControl,
  withStyles,
  ListItemText,
  Checkbox,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogActions,
  IconButton,
  CloseIcon,
  Typography,
  cloneDeep,
  MenuItem,
  concat
} from "../../utility/general-imports";
import Theme from "@material-ui/core";
import styles from "./CardManagement.module.scss";
import { useDispatch } from "react-redux";
import { CustomLabel } from "../../components/CustomTextField/CustomLabel";
import CustomTextField from "../../components/CustomTextField/CustomTextField";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import { postPopupProfile } from "../../lib/api/SFCardManagement/sfcardmanagement";
import { setLoader } from "../../redux/actions/actions";

const StyledMenuItem = withStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  })
)(MenuItem);

const dialogBoxStyles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
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
    filledItem: {
      color: "#0369dd",
    },
  });

const useStyles = makeStyles((theme) => ({
  dialogCustomizedWidth: {
    "max-width": "60%",
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
      <Typography variant="h4" className={`pl-3 ${classes.filterTitle}`}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
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
    paddingLeft: theme.spacing(2),
    overflow: "Hidden",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface IErrorMessages {
  fleetCardId?: string;
  customCardName?: string;
  vehicleNumber?: string;
  yearOfRegistration?: string;
  vehicleMake?: string;
  vehicleType?: string;
  fuelType?: string;
  cardPersonalization?: string;
}

export const PopupCardProfile = (props: any) => {
  const {
    dropdownLists,
    cardDetails,
    openModal = false,
    setModalOpen,
    handleCardProfileClose = null,
    cardHeadersData,
    setLoadData,
    fleetCardId
  } = props;
  const [selectedCardNumber, setSelectedCardNumber] = useState<number>(1);
  const [fuelTypes, setFuelTypes] = useState(cardDetails?.allowedFuelTypes ? cardDetails.allowedFuelTypes : []);
  const [hideButton, setHideButton] = useState<boolean>(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [cardProfiles, setCardProfiles] = React.useState(cardDetails);
  const [disabled, setDisabled] = useState(true);

  const handleFuelTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    let fuelTypeArray = [];

    if(target.checked){
      if(target.name === 'All'){
        fuelTypeArray = [target.name]
      }
      else{
        fuelTypeArray = concat(fuelTypes.filter((value:any,index:number) => {
          return value != 'All'
        }),[target.name]);
      }
    }
    else{
      if(target.name !== 'All'){
        fuelTypeArray = fuelTypes.filter((value:any,index:number) => {
          return value != target.name
        })
      }
    } 
    setFuelTypes(fuelTypeArray);
    setCardProfiles((prevState:any) => ({...prevState, allowedFuelTypes: fuelTypeArray}));
  };

  const setInputValues = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCardProfiles({
      ...cardProfiles,
      [event.target.name]: event.target.value,
    });
  };

  const handleFinalSubmit = async () => {
    dispatch(setLoader(true));
    const finalData = {
      cardProfiles,
    };
    const res: any = await postPopupProfile(finalData);
    setLoadData({ [fleetCardId]: true });
    cardHeadersData();
    setModalOpen(false);
  };

  function handleGameClick() {
    setDisabled(!disabled);
    setHideButton(true);
  }

  //render function for all card fields
  const renderCardFields = () => {
    return (
      <React.Fragment>
        <div className={styles.cardDetailsFieldsSubContainer}>
          <Dialog
            fullWidth={true}
            classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
            onClose={handleCardProfileClose}
            aria-labelledby="customized-dialog-title"
            open={openModal}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={handleCardProfileClose}
            >
              Card Profile
            </DialogTitle>

            <DialogContent className={"pl-5 pr-5"}>
              <Grid
                container
                direction={"row"}
                spacing={3}
                id={`grid-${selectedCardNumber}`}
              >
                <Grid item xs={12} sm={4} id={"filledItem"}>
                  <CustomLabel
                    htmlFor="card-mgmt-name-n-card"
                    className={`d-flex justify-content-between`}
                  >
                    Custom Card Name
                  </CustomLabel>
                  <CustomTextField
                    id={`card-mgmt-name-n-card-${selectedCardNumber}`}
                    placeholder="John Doe"
                    variant="outlined"
                    size="small"
                    name="customCardName"
                    className={`m-0`}
                    type="text"
                    disabled={disabled}
                    defaultValue={cardDetails.customCardName}
                    onChange={(e: any) => setInputValues(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-name-n-card"
                    className={`d-flex justify-content-between`}
                  >
                    Vehicle Number
                  </CustomLabel>

                  <CustomTextField
                    id={`card-mgmt-vehicle-number-${selectedCardNumber}`}
                    placeholder="MH01AB1111"
                    variant="outlined"
                    size="small"
                    name="vehicleNumber"
                    className={`m-0`}
                    disabled={disabled}
                    defaultValue={cardDetails.vehicleNumber}
                    onChange={(e: any) => setInputValues(e)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomLabel htmlFor="card-mgmt-year-of-reg">
                    Year of Registration
                  </CustomLabel>
                  <CustomTextField
                    id="card-mgmt-year-of-reg"
                    placeholder="2012"
                    variant="outlined"
                    size="small"
                    className={`m-0`}
                    type="text"
                    disabled={disabled}
                    name="registrationYear"
                    defaultValue={cardDetails.registerationYear}
                    onChange={(e: any) => setInputValues(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomLabel htmlFor="card-mgmt-name-n-card">
                    Vehicle Make
                  </CustomLabel>
                  <CustomSelect
                    labelId="demo-simple-select-outlined-label"
                    id="vehicle-make"
                    variant="outlined"
                    fullWidth
                    placeholder="TATA Motors"
                    name="vehicleMake"
                    disabled={disabled}
                    defaultValue={cardDetails.vehicleMake}
                    onChange={(e: any) => setInputValues(e)}
                  >
                    <CustomMenuItem value="Select">Select</CustomMenuItem>
                    {dropdownLists.vehicleMake.map(
                      (list: any, index: number) => {
                        return (
                          <CustomMenuItem key={list.code} value={list.code}>
                            {list.displayName}
                          </CustomMenuItem>
                        );
                      }
                    )}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-vehicle-type"
                    className={`d-flex justify-content-between`}
                  >
                    Vehicle Type
                  </CustomLabel>
                  <FormControl className="w-100">
                    <CustomSelect
                      labelId="demo-simple-select-outlined-label"
                      id="vehicle-type"
                      variant="outlined"
                      fullWidth
                      disabled={disabled}
                      name="vehicleType"
                      defaultValue={cardDetails.vehicleType}
                      onChange={(e: any) => setInputValues(e)}
                    >
                      <CustomMenuItem value="Select">Select</CustomMenuItem>
                      {dropdownLists.vehicleType.map(
                        (list: any, index: number) => {
                          if (list.displayName) {
                            return (
                              <CustomMenuItem key={list.code} value={list.code}>
                                {list.displayName}
                              </CustomMenuItem>
                            );
                          } else {
                            return (
                              <CustomMenuItem key={list.code} value={list.code}>
                                {list.code}
                              </CustomMenuItem>
                            );
                          }
                        }
                      )}
                    </CustomSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-fuel-type"
                    className={`d-flex justify-content-between`}
                  >
                    Fuel Type
                  </CustomLabel>
                  <FormControl
                    className="w-100"
                    error={!!cardDetails?.allowedFuelTypes?.error}
                  >
                    <CustomSelect
                      labelId="demo-simple-select-outlined-label"
                      id="fuel-type"
                      variant="outlined"
                      fullWidth
                      disabled={disabled}
                      name="allowedFuelTypes"
                      renderValue={(selected) =>
                        (selected as string[]).join(", ")
                      }
                      //error={!!selectedCardDetails?.fuelType.error}
                      value={
                        cardProfiles?.allowedFuelTypes
                          ? cardProfiles?.allowedFuelTypes
                          : [""]
                      }
                    >
                      {dropdownLists.fuelType.map(
                        (list: any, index: number) => {
                          if (list.displayName) {
                            return (
                              <StyledMenuItem key={list.code} value={list.code}>
                                <Checkbox
                                  color="primary"
                                  checked={
                                    cardProfiles?.allowedFuelTypes && cardProfiles?.allowedFuelTypes.length > 0 ?
                                    cardProfiles?.allowedFuelTypes.indexOf(
                                      list.code
                                    ) > -1
                                    : false
                                  }
                                  onChange={handleFuelTypes}
                                  name={list.code}
                                />
                                <ListItemText primary={list.displayName} />
                              </StyledMenuItem>
                            );
                          } else {
                            return (
                              <StyledMenuItem key={list.code} value={list.code}>
                                <Checkbox
                                  color="primary"
                                  checked={
                                    cardProfiles?.allowedFuelTypes && cardProfiles?.allowedFuelTypes.length > 0 ?
                                    cardProfiles?.allowedFuelTypes.indexOf(
                                      list.code
                                    ) > -1
                                    : false
                                  }
                                  onChange={handleFuelTypes}
                                  name={list.code}
                                />
                                <ListItemText primary={list.code} />
                              </StyledMenuItem>
                            );
                          }
                        }
                      )}
                    </CustomSelect>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomLabel
                    htmlFor="card-mgmt-year-of-reg"
                    className={`d-flex justify-content-between`}
                  >
                    Card Personalization
                  </CustomLabel>
                  <CustomTextField
                    id="card-mgmt-card-personal"
                    placeholder="Mumbai Route"
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                    name="cardPersonalization"
                    className={`m-0`}
                    defaultValue={cardDetails.cardPersonalization}
                    onChange={(e: any) => setInputValues(e)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={"pr-5 pb-3"}>
              {!hideButton && (
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleGameClick}
                  color="primary"
                >
                  EDIT
                </Button>
              )}
              {hideButton && (
                <>
                  <Button
                    autoFocus
                    variant="outlined"
                    className={"mr-3"}
                    onClick={handleCardProfileClose}
                    color="primary"
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="contained"
                    data-test-id="submit-button"
                    onClick={handleFinalSubmit}
                    color="primary"
                  >
                    SAVE
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Grid container className={styles.cardDetailsMainContainer}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            &nbsp;
          </Grid>
        </Grid>
        {renderCardFields()}
      </Grid>
    </div>
  );
};
export default PopupCardProfile;
