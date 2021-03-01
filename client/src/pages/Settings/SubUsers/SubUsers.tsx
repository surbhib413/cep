import React, { useEffect, useState, createContext, useContext } from "react";
import { Container, Grid, Hidden, Typography, InputAdornment, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import Divider from '@material-ui/core/Divider';
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";

import { setLoader } from "../../../redux/actions/actions";
import CustomSnackbar from "../../../components/CustomSnackbar/CustomSnackbar";
import { SnackbarMessage } from "../../../utility/Snackbar/SnackbarMessages";
import { getSubUserById, disableSubUser, enableSubUser, deleteSubUser } from "../../../lib/api/smartfleet/settings/subusers";
// import styles from "../Settings.module.scss";
import styles2 from "./SubUsers.module.scss";
import { CustomMenu, CustomMenuItem } from "../../../components/CustomMenu/CustomMenu";
import Card from '../Card'
import Navigation from '../Navigation'
import UserProfileComponent from '../UserProfileComponent/UserProfileComponent'

const IconSearch = "/search.svg"
const IconMore = "/W_Icon_More.svg"
const IconDisable = "/disable_icon.svg"
const IconDelete3 = "/W_Icons_Delete_3.svg"
const IconView = "/reports_view_grey.svg"
const IconEditGrey = "/edit_grey.svg"
const IconEditBlue = "/W_Icon_Edit_Blue.svg"
const IconDisableGrey = "/disable_grey.svg"
const IconDeleteGrey = "/delete_grey.svg"
const IconEdit = "/Edit_Icon.svg"
const IconBack = "/Back_Icon.svg"

export const SubUsersContext = createContext<any>(0);

const stylesDialog = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      paddingBottom: 0,
      color: '#0257a3'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof stylesDialog> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitleCustom = withStyles(stylesDialog)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={styles2.dialogHeadingSubuser}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={`${classes.closeButton} ${styles2.closeButton}`} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});


const useStyles = makeStyles({
  table: {
    backgroundColor: 'transparent',
    borderSpacing: '0 10px !important',
    borderCollapse: 'separate !important'
  },

  dialog: {

    height: 600,
    width: 335

  },
  backdrop: {
    // backgroundColor: '#7e90a77a'
  }
});


// START | SUB USERS TABLE
const SubUsersTable = (props: any): JSX.Element => {
  const [tableData, setTableData, setShowSubUsersTable, subUserProfileDetails, setSubUserProfileDetails, setShowSnackbar,
    setSnackbarMessage, setAlertType] = useContext(SubUsersContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const classes = useStyles();
  const [isSectionEditable, setIsSectionEditable] = React.useState(true)
  // const [isInputEdited, setIsInputEdited] = useState(false)
  const initFields = {
    searchField: ''
  };
  const [fields, setFields] = React.useState(initFields);
  //const [tableData, setTableData] = React.useState([]);
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState([]);
  const [originalState, setOriginalState] = React.useState();

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openedPopoverId, setOpenedPopoverId] = React.useState<null | number>();
  const [errorMessage, setErrorMessage] = React.useState({});
  const [apiOtherErrorMessage, setApiOtherErrorMessage] = React.useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width:600px)');


  const handleClickOpen = () => {
    if (tableData.length >= 50) {
      setShowSnackbar(true);
      setSnackbarMessage(SnackbarMessage.SUBUSERS_MAX_LIMIT);
      setAlertType("error");
    } else {
      setOpen(true);
      setIsSectionEditable(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMoreBtnClose = () => {
    setAnchorEl(null);
    setOpenedPopoverId(null);
  };
  const handleMoreBtnClick = (event: React.MouseEvent<HTMLButtonElement>, popoverId: number) => {
    setAnchorEl(event.currentTarget);
    setOpenedPopoverId(popoverId);
  };

  const searchTableData = (searchTerm: any) => {
    if (searchTerm.length > 0) {
      // console.log("data to be searched from", tableData);
      // console.log("data to be searched", searchTerm);
      const serachedresult = tableData.filter((item: any) => item.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
        ||
        item.designation.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
        ||
        item.emailId.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
        ||
        item.mobileNumber.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
      );
      // console.log("searched data", serachedresult);
      setSearchedData(serachedresult);
      setIsFiltered(true);

    }
    else {
      setSearchedData(tableData);
      setIsFiltered(false);
    }

  }

  const handleTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // console.log("initial search", event.target.value);
    const search = [event.target.value];

    // console.log("value to be searched", search);
    searchTableData(search);
    setFields({
      ...fields,
      [event.target.name]: event.target.value
    });
  }

  const handleDisable = async (event: React.MouseEvent<HTMLElement>, userId: any) => {
    // console.log(userId);
    event.preventDefault();
    dispatch(setLoader(true));
    const res: any = await disableSubUser(userId);
    dispatch(setLoader(false));
    // console.log(res);

    if (res?.status === "success" || res?.status === "updated") {
      if (isFiltered) {
        let index = searchedData.findIndex((obj: any) => obj.userId === userId);
        let newArr: any = [...searchedData];
        newArr[index] = { ...newArr[index], active: false };
        setSearchedData(newArr);
      }
      let index = tableData.findIndex((obj: any) => obj.userId === userId);
      let newArr = [...tableData];
      newArr[index] = { ...newArr[index], active: false };
      setTableData(newArr);

      handleMoreBtnClose();
      setShowSnackbar(true);
      setSnackbarMessage(res.data.message);
      setAlertType("success");

    } else {
      setShowSnackbar(true);
      setSnackbarMessage(res.data.message);
      setAlertType("error");
    }

  };


  const handleEnable = async (event: React.MouseEvent<HTMLElement>, userId: any) => {
    // console.log(userId);
    event.preventDefault();
    dispatch(setLoader(true));
    const res: any = await enableSubUser(userId);
    dispatch(setLoader(false));
    // console.log(res);

    if (res?.status === "success" || res?.status === "updated") {
      if (isFiltered) {
        let index = searchedData.findIndex((obj: any) => obj.userId === userId);
        let newArr: any = [...searchedData];
        newArr[index] = { ...newArr[index], active: true };
        setSearchedData(newArr);
      }
      let index = tableData.findIndex((obj: any) => obj.userId === userId);
      let newArr = [...tableData];
      newArr[index] = { ...newArr[index], active: true };
      setTableData(newArr);

      handleMoreBtnClose();
      setShowSnackbar(true);
      setSnackbarMessage(res.message);
      setAlertType("success");

    } else {
      setShowSnackbar(true);
      setSnackbarMessage(res.data.message);
      setAlertType("error");
    }

  };


  const handleDelete = async (event: React.MouseEvent<HTMLElement>, userId: any) => {
    // console.log(userId);
    event.preventDefault();
    alert('Delete functionality not available');

    /*
    dispatch(setLoader(true));
    const res: any = await deleteSubUser(userId);
    dispatch(setLoader(false));
    // const res: any = await disableSubUser(userId);
    // console.log(res);

    if (res?.status === "success" || res?.status === "updated") {
      // update the tableData for disable/enable/delete
      // let arr: any = tableData.filter((obj: any) => obj.userId !== userId);
      // setTableData(arr);
      // let index = tableData.findIndex((obj: any) => obj.userId === userId);
      // let newArr = [...tableData];
      // newArr[index] = { ...newArr[index], active: false };
      // setTableData(newArr);

      handleMoreBtnClose();
      setShowSnackbar(true);
      setSnackbarMessage(res.message);
      setAlertType("success");

    } else {
      setShowSnackbar(true);
      setSnackbarMessage(res.data.message);
      setAlertType("error");
    }
    */

  };



  return (
    <div className={``}>
      <div className={`d-flex align-items-baseline justify-content-between mb-2`}>
        <Typography className={`${styles2.sectionHeading}`}>
          <Hidden smUp>
            <img
              className={`mr-3 ${styles2.backToMyProfile}`}
              src={IconBack}
              alt=""
              onClick={() => router.back()}
            />
          </Hidden>
          Sub Users
        </Typography>
        <Hidden smUp>
          <Typography color="primary" className={`${styles2.changePassLink}`} onClick={handleClickOpen}>
            Add Sub User
          </Typography>
        </Hidden>
      </div>

      <Divider className={`${styles2.secDivider}`} />

      <Grid container>
        <Grid item xs={12} sm={12} className={styles2.searchRow}>
          <Hidden smDown>
            <CustomButton
              variant="outlined"
              color="primary"
              className={styles2.addSubUserBtn}
              onClick={handleClickOpen}
            >
              Add Sub User
          </CustomButton>
          </Hidden>

          <div className={styles2.searchContainer}>
            <CustomTextField
              id="searchField"
              type="text"
              variant="outlined"
              placeholder="Search by Name, Mobile No, Email ID"
              // error={!!errorMessage.searchField}
              name="searchField"
              value={fields.searchField}
              onChange={handleTextfieldChange}
              className={styles2.searchInput}
              // helperText={errorMessage.searchField && errorMessage.searchField}
              // inputProps={{ maxLength: 20 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" className="mr-0">
                    <IconButton
                      aria-label="search icon"
                      className={styles2.searchIcon}
                    >
                      <img src={IconSearch} alt="SearchIcon" data-test-id="search" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          {
            typeof tableData === 'undefined' || tableData.length === 0
              ? <Typography className={styles2.noSubuser}>You haven't added any subuser yet.</Typography>
              : null
          }
          {
            isFiltered === true
              ?
              (<TableContainer>
                <Table className={`${classes.table} ${styles2.usersTable}`} aria-label="simple table">
                  <TableBody>
                    {searchedData.map((row: any, index) => (
                      <TableRow key={`${row.name}-${index}`} className={`${styles2.tableRow} ${row.active ? null : styles2.disabledSubUser}`}>
                        <TableCell component="th" scope="row" className={styles2.subuserName}>
                          {row.name}
                        </TableCell>
                        <TableCell align="left">{row.designation}</TableCell>
                        <Hidden smDown>
                          <TableCell align="left">{row.mobileNumber}</TableCell>
                          <TableCell align="left">{row.emailId}</TableCell>
                        </Hidden>
                        <TableCell align="left" className={styles2.userMoreCell}>
                          <CustomButton
                            className={styles2.userMore}
                            aria-controls={`subuser-more-${index}`}
                            aria-haspopup="true"
                            onClick={(e) => handleMoreBtnClick(e, index)}
                          >
                            <img
                              className={``}
                              src={IconMore}
                              alt=""
                            />
                          </CustomButton>
                          <CustomMenu
                            id={`subuser-more-${index}`}
                            anchorEl={anchorEl}
                            keepMounted
                            open={openedPopoverId === index}
                            onClose={() => handleMoreBtnClose()}
                            className={styles2.moreDropdown}
                          >
                            {
                              row.active
                                ?
                                <div>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={() => {
                                    setSubUserProfileDetails(row);
                                    setShowSubUsersTable(false);
                                  }}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconView} alt="" /></div>
                                    <div>View</div>
                                  </CustomMenuItem>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleDisable(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconDisableGrey} alt="" /></div>
                                    <div>Disable</div>
                                  </CustomMenuItem>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleDelete(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconDeleteGrey} alt="" /></div>
                                    <div>Delete</div>
                                  </CustomMenuItem>
                                </div>
                                :
                                <div>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleEnable(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconView} alt="" /></div>
                                    <div>Enable</div>
                                  </CustomMenuItem>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleDelete(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconDeleteGrey} alt="" /></div>
                                    <div>Delete</div>
                                  </CustomMenuItem>
                                </div>
                            }
                          </CustomMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>)

              :

              (<TableContainer>
                <Table className={`${classes.table} ${styles2.usersTable}`} aria-label="simple table">
                  <TableBody>
                    {tableData.map((row: any, index: any) => (
                      <TableRow key={`${row.name}-${index}`} className={`${styles2.tableRow} ${row.active ? null : styles2.disabledSubUser}`}>
                        <TableCell component="th" scope="row" className={styles2.subuserName}>
                          {row.name}
                        </TableCell>
                        <TableCell align="left">{row.designation}</TableCell>
                        <Hidden smDown>
                          <TableCell align="left">{row.mobileNumber}</TableCell>
                          <TableCell align="left">{row.emailId}</TableCell>
                        </Hidden>
                        <TableCell align="left" className={styles2.userMoreCell}>
                          <CustomButton
                            className={styles2.userMore}
                            aria-controls={`subuser-more-${index}`}
                            aria-haspopup="true"
                            onClick={(e) => handleMoreBtnClick(e, index)}
                          >
                            <img
                              className={``}
                              src={IconMore}
                              alt=""
                            />
                          </CustomButton>
                          <CustomMenu
                            id={`subuser-more-${index}`}
                            anchorEl={anchorEl}
                            keepMounted
                            open={openedPopoverId === index}
                            onClose={() => handleMoreBtnClose()}
                            className={styles2.moreDropdown}
                          >
                            {
                              row.active
                                ?
                                <div>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={() => {
                                    setSubUserProfileDetails(row);
                                    setShowSubUsersTable(false);
                                  }}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconView} alt="" /></div>
                                    <div>View</div>
                                  </CustomMenuItem>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleDisable(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconDisableGrey} alt="" /></div>
                                    <div>Disable</div>
                                  </CustomMenuItem>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleDelete(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconDeleteGrey} alt="" /></div>
                                    <div>Delete</div>
                                  </CustomMenuItem>
                                </div>
                                :
                                <div>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleEnable(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconView} alt="" /></div>
                                    <div>Enable</div>
                                  </CustomMenuItem>
                                  <CustomMenuItem className={styles2.subMenuItem} onClick={(e) => handleDelete(e, row.userId)}>
                                    <div className={styles2.subMenuIconContainer}><img className={``} src={IconDeleteGrey} alt="" /></div>
                                    <div>Delete</div>
                                  </CustomMenuItem>
                                </div>
                            }

                          </CustomMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>)
          }
        </Grid>

      </Grid>

      {/* START | ADD SUB USER MODAL */}
      <Dialog fullScreen={fullScreen}
        open={open} onClose={handleClose}
        classes={{
          paper: `${isMobile ? classes.dialog : null}`,
        }}
        aria-labelledby="form-dialog-title">
        <DialogTitleCustom id="customized-dialog-title" onClose={handleClose}>
          Add Sub User
        </DialogTitleCustom>
        <DialogContent>
          <UserProfileComponent
            componentType={'createSubUser'}
            isSectionEditable={isSectionEditable}
            setIsSectionEditable={(val: boolean) => setIsSectionEditable(val)}
            // setIsInputEdited={(val: boolean) => setIsInputEdited(val)}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>
      {/* END | ADD SUB USER MODAL */}

    </div>
  )
}
// END | SUB USERS TABLE



// START | VIEW SUB USER PROFILE
const SubUserProfile = (props: any): JSX.Element => {
  const [tableData, setTableData, setShowSubUsersTable, subUserProfileDetails, setSubUserProfileDetails, setShowSnackbar,
    setSnackbarMessage, setAlertType, setIsInputEdited] = useContext(SubUsersContext);
  const router = useRouter();
  const [isSectionEditable, setIsSectionEditable] = React.useState(false)
  // const [isInputEdited, setIsInputEdited] = useState(false)

  // useEffect(() => {

  // }, []);

  // const handleDisable = async (event: React.MouseEvent<HTMLElement>, userId: any) => {
  //   // console.log(userId);
  //   event.preventDefault();
  //   const res: any = await disableSubUser(userId);
  //   // console.log(res);

  //   if (res?.status === "success" || res?.status === "updated") {
  //     // setErrorMessage({});
  //     // setIsSectionEditable(false);
  //     // show success snackbar
  //     // alert(res?.message);
  //     setShowSubUsersTable(true);
  //     // router.reload();
  //   } else {
  //     // handle errors
  //   }

  // };

  return (
    <div className={``}>
      <div className={`d-flex align-items-baseline justify-content-between mb-2`}>
        <div className={`${styles2.sectionHeading} ${styles2.sectionHeading}`}>
          <div>
            <img
              className={`mr-3 ${styles2.backToMyProfile}`}
              src={IconBack}
              alt=""
              onClick={() => {
                setIsInputEdited(false);
                setShowSubUsersTable(true);
              }}
            />
          Sub User Profile
          </div>
          {
            isSectionEditable
              ?
              null
              // <Hidden smUp>
              //   <div className={styles2.mobSubUserDiscardBtns}>
              //     <img
              //       className={styles2.disableIcon}
              //       src={IconDelete3}
              //       alt=""
              //       onClick={(e) => handleDisable(e, props.subUserProfileDetails.userId)}
              //     />
              //     <img
              //       className={styles2.disableIcon}
              //       src={IconDisable}
              //       alt=""
              //       onClick={(e) => handleDisable(e, props.subUserProfileDetails.userId)}
              //     />
              //   </div>
              // </Hidden>
              :
              <div className={styles2.mobSubUserDiscardBtns}>
                <Hidden smDown>
                  <img
                    className={`ml-3 mr-3 ${styles2.backToMyProfile}`}
                    src={IconEdit}
                    alt=""
                    onClick={() => setIsSectionEditable(true)}
                  />
                </Hidden>
                <Hidden smUp>
                  <img
                    className={`ml-3 ${styles2.backToMyProfile}`}
                    src={IconEditBlue}
                    alt=""
                    onClick={() => setIsSectionEditable(true)}
                  />
                </Hidden>

              </div>
          }
        </div>
        {/* <Hidden smDown>
          <div className={styles2.disableUserBtns}>
            <Typography color="primary" className={`${styles2.changePassLink}`} onClick={(e) => handleDisable(e, props.subUserProfileDetails.userId)}>
              Disable User
              <img
                className={styles2.disableIcon}
                src={IconDisable}
                alt=""
              />
            </Typography>
            <Typography color="primary" className={`${styles2.changePassLink}`} onClick={(e) => handleDisable(e, props.subUserProfileDetails.userId)}>
              Delete User
              <img
                className={styles2.disableIcon}
                src={IconDelete3}
                alt=""
              />
            </Typography>
          </div>
        </Hidden> */}
      </div>

      <Divider className={`${styles2.secDivider}`} />

      <UserProfileComponent
        componentType={'viewSubUser'}
        isSectionEditable={isSectionEditable}
        setIsSectionEditable={(val: boolean) => setIsSectionEditable(val)}
        // setIsInputEdited={(val: boolean) => setIsInputEdited(val)}
        initialData={subUserProfileDetails}
      />
    </div>
  )
}
// END | VIEW SUB USER PROFILE










// START | SUB USERS
const SubUsers = (props: any): JSX.Element => {
  const { Provider } = SubUsersContext;

  const [showSubUsersTable, setShowSubUsersTable] = useState(true)
  const [subUserProfileDetails, setSubUserProfileDetails] = useState(null);
  const [tableData, setTableData] = React.useState([]);
  const [isInputEdited, setIsInputEdited] = useState(false);
  //Show snackbar for API response
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");


  useEffect(() => {
    // const initialData = props.response.data;
    const initialData = props.response.data.bpclSubUserList;
    if (initialData) {
      const initialFields = initialData;
      // setOriginalState(initialFields);
      setTableData(initialFields);
    }
  }, []);

  return (
    <Container>
      <Provider value={[tableData, setTableData, setShowSubUsersTable, subUserProfileDetails, setSubUserProfileDetails, setShowSnackbar,
        setSnackbarMessage, setAlertType, setIsInputEdited]}>

        <Grid container spacing={10} className={styles2.padTop}>

          <Hidden smDown>
            <Grid item xs={12} sm={2} className="py-0">sidebar</Grid>
          </Hidden>
          <Grid item xs={12} sm={10} className={`${styles2.mainGridContainer}`}>

            <Hidden smDown>
              <Grid item xs={12} sm={4}>
                <Card />
                <Navigation
                  isInputEdited={isInputEdited}
                  setShowSnackbar={setShowSnackbar}
                  setSnackbarMessage={setSnackbarMessage}
                  setAlertType={setAlertType}
                />
              </Grid>
            </Hidden>

            <Grid item xs={12} sm={8} className={`${styles2.contentContainer}`}>
              {
                showSubUsersTable
                  ?
                  <SubUsersTable />
                  :
                  <SubUserProfile />
              }
            </Grid>

          </Grid>
        </Grid>
        <CustomSnackbar
          open={showSnackbar}
          close={setShowSnackbar}
          type={alertType}
          message={snackbarMessage}
        ></CustomSnackbar>

      </Provider>
    </Container>
  );
};
// END | SUB USERS

export default SubUsers;