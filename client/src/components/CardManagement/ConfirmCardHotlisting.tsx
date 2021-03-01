import { 
    Dialog, 
    DialogContent, 
    Typography, 
    TableContainer, 
    TableRow, 
    TableCell, 
    TableHead, 
    Table,
    TableBody } from "@material-ui/core";
import React from "react";
import styles from "./BulkActionPopup.module.scss";
import { CustomButton } from "../CustomButton/CustomButton";
import { makeStyles } from "@material-ui/core/styles"
import { useDispatch, useSelector } from "react-redux"
import ConfirmCardActionTableRow from "./ConfirmCardActionTableRow"

// import { useSelector } from "react-redux";

const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";
const sortIconAsc = "/W_Icon_Order.svg";
const sortIconDesc = "/W_Icon_Order_Desc.svg"

const useStyles = makeStyles({
    notes: {
        backgroundColor: "#fff9e6",
        fontFamily: "Open Sans",
        fontSize: "14px",
        paddingRight: "1rem"
    },
    container: {
        maxHeight: "35vh",
        overflowY: "auto",
        "& .MuiTableCell-stickyHeader": {
            padding: "0.2rem",
            fontWeight: "600",
            color: "#354463",
        },
        "& .MuiTableCell-root": {
            fontSize: "14px"
        },
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
        }
    },
    description:{
        fontSize: "14px"
    }
}) 

export const ConfirmCardHotlisting = (props: any) => {
    const { open, close, closeAndSubmit, title, description, selectedRowData } = props;
    const [orderBy, setOrderBy] = React.useState('asc');
    // const store: any = useSelector((state) => state);

    const closeAndSubmitHandler = () => {
        closeAndSubmit();
    };
    const classes = useStyles();
    const dispatch = useDispatch();
    const store = useSelector(state => state);

    const getCardList = () => {
        console.log('selectedRowData',selectedRowData);
        const rowData = selectedRowData.map((row: any, index: number) => {
            return (
                <ConfirmCardActionTableRow key={row.fleetCardId} row={row}/>
            );
        });
        return rowData;
    };

    return (
        <Dialog open={open} onClose={close} maxWidth="md">
            <DialogContent
                className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
            >
                <div className="w-100 d-flex bd-highlight align-items-center justify-content-center p-2 p-sm-0">
                    <Typography
                        className={`px-2 text-center ${styles.popStyles} ${styles.dialogTitle}`}
                        variant="h5"
                        color="primary"
                    >
                        {title}
                    </Typography>
                </div>
                <div className={`${classes.notes} w-100 mt-4 d-flex justify-content-center align-items-center`}>
                    <div>
                        <img className="p-3 p-sm-4" src={WIconWarning} alt="requestSentImg" />
                    </div>
                    <div className="flex-grow-1">
                        <Typography className={`mx-2 ${classes.description}`} variant="h6">
                            {/* You can only activate cards if you have received physical cards. */}
                            {description &&
                                description.split("\n").map((item: any, key: any) => {
                                    return (
                                        <React.Fragment key={key}>
                                            {item}
                                            <br />
                                        </React.Fragment>
                                    );
                                })}
                        </Typography>
                    </div>
                </div>   
                <div className="w-100 pt-4 d-flex justify-content-center align-items-center">
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        <div className={"d-flex py-1 justify-content-center flex-fill"}>
                                            <div style={{ alignSelf: "center", paddingRight: "10px" }}>
                                                #
                                            </div>
                                            <div
                                                className={"d-flex flex-column justify-content-center"}
                                            >
                                                {orderBy === "asc" ? (
                                                    <img
                                                        src={sortIconAsc}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(event) => setOrderBy("desc")}
                                                    />
                                                ) : (
                                                        <img
                                                            src={sortIconDesc}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(event) => setOrderBy("asc")}
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="left">
                                        Name on Card
                                    </TableCell>
                                    <TableCell align="left">
                                        Card No.
                                    </TableCell>
                                    <TableCell align="left">
                                        Mobile No.
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    getCardList()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>        
                </div>         
                <div className="w-100 pt-4 d-flex justify-content-center align-items-center">
                    <CustomButton
                        onClick={close}
                        variant="outlined"
                        color="primary"
                        className={`${styles.backToEnrolmentBtn} mr-2 mx-sm-4`}
                    >
                        NO
                    </CustomButton>
                    <CustomButton
                        onClick={closeAndSubmitHandler}
                        variant="contained"
                        color="primary"
                    // className="mr-4"
                    >
                        YES
                    </CustomButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};
