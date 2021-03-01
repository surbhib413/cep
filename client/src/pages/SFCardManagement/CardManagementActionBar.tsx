import {
    React,
    useEffect,
    useState,
    useDispatch,
    useRouter,
    makeStyles,
    Paper,
    Button,
    Tooltip,
    Grow,
    Popper,
    MenuItem,
    MenuList,
    ClickAwayListener
} from "../../utility/general-imports";
import PropTypes from "prop-types";
import styles from "../SFCardManagement/CardManagement.module.scss";
import {
        setPopupTitleForBulkAction, 
        setPopupDescriptionForBulkAction,
        setPopupActionTypeForBulkAction,
        setCardsForBulkAction
} from "../../redux/SmartFleet/SFCardManagement/CardManagementAction"
import {
    CONFIRM_CARD_BLOCK_TITLE,
    CONFIRM_CARD_BLOCK_DESCRIPTION,
    CONFIRM_CARD_UNBLOCK_TITLE,
    CONFIRM_CARD_UNBLOCK_DESCRIPTION,
    CONFIRM_CARD_HOTLISTING_TITLE,
    CONFIRM_CARD_HOTLISTING_DESCRIPTION,
} from "./constants";


import { PopupFilter } from "./PopupFilter";
import {
    ICON_ACTIVATE,
    ICON_BLOCK,
    ICON_UNBLOCK,
    ICON_DOWNLOAD,
    ICON_RESETPIN,
    ICON_HOTLIST,
    ICON_EXCELREPORT,
    ICON_FILTER,
    TOOL_TIP_TEXT,
} from "./constants";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        width: "100%",
        background: "#ffffff",
        flexDirection: "column",
        alignItems: "center",
        // paddingTop: "15px",
        // paddingRight: "5px",
        // paddingLeft: "10px",
        padding:"0.6rem 10px" ,
        textTransform: "none",
        "& > *": {
            margin: "auto",
            width: "100%",
            height: "30px",
        },
        "& .MuiButton-root": {
            minWidth: "100px",
        },
        "& .MuiListItem-button:hover": {
            color: "#0369dd",
        },
    },
    largeButton: {
        minWidth: "130px !important",
        [theme.breakpoints.down("md")]: {
            minWidth: "100px",
        },
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    box: {
        "& > *": {
            zIndex: 5,
        },
    },
    dialogCustomizedWidth: {
        "max-width": "60%",
    },
}));

export default function CardManagementActionBar(props: any) {
    const classes = useStyles();
    const visibleButtonListInit = {
        resetPINButton: true,
        activateButton: true,
        blockButton: true,
        unBlockButton: true,
        hotListButton: true,
        bulkLimitButton: true,
    };
    const [visibleButtonList, setButtonsVisible] = useState(
        visibleButtonListInit
    );
    const { 
        selectedButton, 
        filterCardData, 
        fuelTypeData, 
        setOpenConfirmModal, 
        selectedRow, 
        setShowSnackbar, 
        setSnackbarMessage,
        setOpenHotelistConfirmModal,
        setOpenBlockConfirmModal 
    } = props;
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [openModal, setModalOpen] = React.useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        resetButtonsVisibility();
        switch (selectedButton) {
            case "Active":
                setButtonsVisible((prevState) => ({
                    ...prevState,
                    unBlockButton: false,
                    activateButton: false,
                }));
                break;
            case "Unassigned":
                setButtonsVisible((prevState) => ({
                    ...prevState,
                    resetPINButton: false,
                    activateButton: false,
                    unBlockButton: false,
                }));
                break;
            case "Inactive":
                setButtonsVisible((prevState) => ({
                    ...prevState,
                    resetPINButton: false,
                    blockButton: false,
                    unBlockButton: false,
                    bulkLimitButton: false,
                    hotListButton: false,
                }));
                break;
            case "Blocked":
                setButtonsVisible((prevState) => ({
                    ...prevState,
                    resetPINButton: false,
                    activateButton: false,
                    blockButton: false,
                    bulkLimitButton: false,
                }));
                break;
            case "Hotlisted":
            case "Terminated":
                setButtonsVisible((prevState) => ({
                    ...prevState,
                    resetPINButton: false,
                    activateButton: false,
                    blockButton: false,
                    unBlockButton: false,
                    bulkLimitButton: false,
                    hotListButton: false,
                }));
                break;
            case "All":
                setButtonsVisible((prevState) => ({
                    ...prevState,
                    unBlockButton: false,
                }));
                break;
        }
    }, [selectedButton]);

    const handleFilterClick = () => {
        setModalOpen(true);
    };

    const resetButtonsVisibility = () => {
        setButtonsVisible((prevState) => ({
            ...prevState,
            ...visibleButtonListInit,
        }));
    };

    const handleFilterClose = () => {
        setModalOpen(false);
    };

    const handleBulkAction = (actionType: string): any => {
        console.log(actionType);
        if (actionType === 'activate') {
            if(selectedRow.length){
                console.log("activate");
                dispatch(setPopupActionTypeForBulkAction("activate"));
                setOpenConfirmModal(true);
            }
            else{
                setSnackbarMessage('Please select a card to proceed');
                setShowSnackbar(true);
            }
        }
        if (actionType === 'reset') {
            if(selectedRow.length){
                dispatch(setPopupActionTypeForBulkAction("reset"));
                dispatch(setCardsForBulkAction(selectedRow));
                router.push('/sfcardmanagement/BulkActions');
            }
            else{
                setSnackbarMessage('Please select a card to proceed');
                setShowSnackbar(true);
            }
        }
        if (actionType === 'hotlist'){
            if(selectedRow.length){
                console.log('hotlist action');
                setOpenHotelistConfirmModal(true);
                dispatch(setPopupTitleForBulkAction(CONFIRM_CARD_HOTLISTING_TITLE));
                dispatch(setPopupDescriptionForBulkAction(CONFIRM_CARD_HOTLISTING_DESCRIPTION));
                dispatch(setPopupActionTypeForBulkAction("hotlist"));
            }
            else{
                setSnackbarMessage('Please select a card to proceed');
                setShowSnackbar(true);
            }
        }       
        if (actionType === 'block') {
            if(selectedRow.length){
                console.log("blocking");
                setOpenBlockConfirmModal(true);
                dispatch(setPopupTitleForBulkAction(CONFIRM_CARD_BLOCK_TITLE));
                dispatch(setPopupDescriptionForBulkAction(CONFIRM_CARD_BLOCK_DESCRIPTION));
                dispatch(setPopupActionTypeForBulkAction("block"));
            }
            else{
                setSnackbarMessage('Please select a card to proceed');
                setShowSnackbar(true);
            }
        }
        if (actionType === 'unblock') {
            if(selectedRow.length){
                console.log("unblocking");
                setOpenBlockConfirmModal(true);
                dispatch(setPopupTitleForBulkAction(CONFIRM_CARD_UNBLOCK_TITLE));
                dispatch(setPopupDescriptionForBulkAction(CONFIRM_CARD_UNBLOCK_DESCRIPTION));
                dispatch(setPopupActionTypeForBulkAction(actionType));
            }
            else{
                setSnackbarMessage('Please select a card to proceed');
                setShowSnackbar(true);
            }
        }
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: any) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className={classes.root}>
            <div className={"d-flex w-100"}>
                <div className={"d-flex mr-auto"}>
                    {!visibleButtonList.resetPINButton ? null : (
                        <div>
                            <Tooltip title={TOOL_TIP_TEXT}>
                                <Button onClick={() => handleBulkAction("reset")}>
                                    <img src={ICON_RESETPIN}></img>
                                    <span className={styles.actionBarFont}>Reset PIN</span>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                    {!visibleButtonList.activateButton ? null : (
                        <div>
                            <Tooltip title={TOOL_TIP_TEXT}>
                                <Button onClick={() => handleBulkAction("activate")}>
                                    <img src={ICON_ACTIVATE}></img>
                                    <span className={styles.actionBarFont}>Activate</span>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                    {!visibleButtonList.blockButton ? null : (
                        <div>
                            <Tooltip title={TOOL_TIP_TEXT}>
                                <Button onClick={() => handleBulkAction("block")}>
                                    <img src={ICON_BLOCK}></img>
                                    <span className={styles.actionBarFont}>Block</span>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                    {!visibleButtonList.unBlockButton ? null : (
                        <div>
                            <Tooltip title={TOOL_TIP_TEXT}>
                                <Button onClick={() => handleBulkAction("unblock")}>
                                    <img src={ICON_UNBLOCK}></img>
                                    <span className={styles.actionBarFont}>Unblock</span>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                    {!visibleButtonList.hotListButton ? null : (
                        <div>
                            <Button onClick={() => handleBulkAction("hotlist")}>
                                <img src={ICON_HOTLIST}></img>
                                <span className={styles.actionBarFont}>Hotlist</span>
                            </Button>
                        </div>
                    )}
                </div>
                <div className={"d-flex ml-auto"}>
                    {!visibleButtonList.bulkLimitButton ? null : (
                        <div>
                            <Button
                                onClick={() => handleBulkAction("setLimit")}
                                className={classes.largeButton}
                            >
                                <img src={ICON_EXCELREPORT}></img>
                                <span className={styles.actionBarFontRight}>
                                    Set Bulk Limit
                </span>
                            </Button>
                        </div>
                    )}
                    <div>
                        <Button onClick={() => handleFilterClick()}>
                            <img src={ICON_FILTER}></img>
                            <span className={styles.actionBarFontRight}>Filter</span>
                        </Button>
                        <PopupFilter
                            openModal={openModal}
                            handleFilterClose={handleFilterClose}
                            filterCardData={filterCardData}
                            selectedButton={selectedButton}
                            fuelTypeData={fuelTypeData}
                        ></PopupFilter>
                    </div>
                    <div>
                        <Button
                            ref={anchorRef}
                            aria-controls={open ? "menu-list-grow" : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        >
                            <img src={ICON_DOWNLOAD}></img>
                            <span className={styles.actionBarFontRight}>Download</span>
                        </Button>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                            className={styles.zIndex}
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === "bottom" ? "center top" : "center bottom",
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList
                                                autoFocusItem={open}
                                                id="menu-list-grow"
                                                onKeyDown={handleListKeyDown}
                                            >
                                                <MenuItem onClick={handleClose}>
                                                    Excel Format (.xlsx)
                        </MenuItem>
                                                <MenuItem onClick={handleClose}>
                                                    PDF Format (.pdf)
                        </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </div>
            </div>
        </div>
    );
}

