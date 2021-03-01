import React, { useEffect, createRef } from "react";
import {
  Box,
  Container,
  Hidden,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import styles from "./ServiceRequestsTable.module.scss";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import TableHeader from "./TableHeader";
import MobileSearchHeader from "./MobileSearchHeader";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { ExpandMore } from "@material-ui/icons";
import {
  CustomMenu,
  CustomMenuItem,
} from "../../components/CustomMenu/CustomMenu";
import FilterDialog from "./FilterDialog";
import CustomiseTable from "./CustomiseTablePopup";
import { useDispatch, useSelector } from "react-redux";
import { setAssistedFlow } from "../../redux/actions/actions";
import MobileViewDetails from "./MobileViewDetails";
import PendingEnrolDetailsMobile from "./PendingEnrolDetailsMobile";
import SoMobileViewDetails from "./SoMobileViewDetails";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useRouter } from "next/router";

const smartFleetWebIcon = "/smartFleet_Web.svg";
const smartFleetMobileIcon = "/smartFleet_Mobile_Web.svg";
const noRecordsImg = "/noRecords_Img.svg";
const noPendingApprovals = "/noPendingApprovals.svg";
const noPendingEnrol = "/noPendingEnrol.svg";
const overFlowIcon = "/OverFlow_Icon.svg";
const upIcon = "/upIcon.svg";
const downIcon = "/downIcon.svg";

interface Props {
  history: any;
}

interface Column {
  //id: 'id' | 'Application_Date' | 'Customer_Name' | 'Mobile_No' | 'Payment_Status' | 'Payment_Amount' | 'Customer_ID' | 'Customer_Email_ID' | 'Type_Of_Customer' | 'Card_Type' | 'No_Of_Cards' | 'KYC_Status';
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  name: string;
}

interface Data {
  id: string;
  name: string;
  username: string;
  title: string;
  completed: boolean;
  Payment_Amount: string;
  Customer_ID: string;
  email: string;
  Type_Of_Customer: string;
  Card_Type: string;
  No_Of_Cards: string;
  KYC_Status: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const drawerWidth = 250;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    tableRow: {
      backgroundColor: "white",
      "&$selected, &$selected:hover": {
        backgroundColor: "none",
      },
    },
    tableCell: {
      backgroundColor: "white",
      "$selected &": {
        color: "#0369dd",
      },
    },
    hover: {
      fontFamily: "Open Sans",
    },
    selected: {},
    container: {
      boxShadow: "0.5px 3px 10px 0 rgba(119, 119, 119, 0.1)",
      backgroundColor: "#eff1f6",
      fontFamily: "Open Sans",
    },
    paginator: {
      outline: "none",
      "&:focus": {
        outline: "none",
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
      position: "fixed",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: "#eff3fa",
      fontWeight: 600,
      fontSize: "14px",
      borderRight: "2px solid grey",
      textAlign: "center",
      alignItems: "center",
      padding: "10px",
      height: "50px",
      "&:first-of-type": {
        position: "sticky !important",
        left: "0 !important",
        width: "250px !important",
        backgroundColor: "#eff3fa",
      },
      "&:last-of-type": {
        borderRight: "none",
      },
    },
    body: {
      fontSize: 14,
      color: "#354463",
      "&:first-of-type": {
        position: "sticky !important",
        left: "0 !important",
        width: "250px !important",
        backgroundColor: "#eff3fa",
      },
    },
  })
)((props: any) => <TableCell {...props}></TableCell>);

const StyledTableRowCell = withStyles((theme: Theme) =>
  createStyles({
    body: {
      fontSize: 14,
      "&:first-of-type": {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        position: "sticky !important",
        left: "0 !important",
        width: "250px !important",
        backgroundColor: "white",
      },
      "&:last-of-type": {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      },
      "$selected &": {
        color: "yellow",
      },
    },
  })
)((props: any) => <TableCell {...props}></TableCell>);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    hover: {
      fontFamily: "Open Sans",
    },
    selected: {},
    root: {
      backgroundColor: "white",
      borderBottom: "6px solid #eff1f6",
      boxShadow: "0.5px 3px 10px 0 rgba(119, 119, 119, 0.1)",
      "& .MuiTableCell-root": {
        padding: "10px",
        height: "60px",
      },
    },
  })
)((props: any) => <TableRow {...props}></TableRow>);

const CustomPagination = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiPaginationItem-root": {
        outline: "none !important",
      },
    },
  })
)((props: any) => <Pagination {...props}></Pagination>);

const CustomTabs = withStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        "& .MuiTab-root": {
          textTransform: "none",
          padding: "15px 30px",
        },
        "& .MuiAppBar-root": {
          width: "max-content",
        },
        "& .MuiTabs-flexContainer": {
          background: "#dff0fd",
          color: "black",
          outline: "none",
        },
        "& .MuiTab-textColorInherit.Mui-selected": {
          opacity: 1,
          color: "white",
          background: "#0369dd",
          borderTopRightRadius: "5px",
          borderTopLeftRadius: "5px",
        },
        "& .MuiButtonBase-root": {
          outline: "none !important",
        },
        "& .MuiTabs-fixed": {
          maxWidth: "max-content",
        },
        "& .MuiTab-wrapper": {
          fontWeight: 600,
          fontSize: "14px",
        },
      },
    })
  // )((props: any) => <Tabs {...props}></Tabs>);
)(Tabs);

const CustomMobileTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTab-root": {
        textTransform: "none",
        padding: "5px 0px",
      },
      "& .MuiAppBar-root": {
        width: "max-content",
      },
      "& .MuiTabs-flexContainer": {
        background: "#dff0fd",
        color: "black",
        outline: "none",
      },
      "& .MuiTab-textColorInherit.Mui-selected": {
        opacity: 1,
        color: "white",
        background: "#0369dd",
        borderTopRightRadius: "5px",
        borderTopLeftRadius: "5px",
      },
      "& .MuiButtonBase-root": {
        outline: "none !important",
        padding: "0px 10px",
      },
      "& .MuiTab-wrapper": {
        fontWeight: 600,
        fontSize: "12px",
      },
    },
  })
)((props: any) => <Tabs {...props}></Tabs>);

const ServiceRequestsTable = React.memo(
  (props: any): JSX.Element => {
    const data = props.data;
    const router = useRouter();

    const pageValue: React.RefObject<HTMLInputElement> = createRef();
    const classes = useStyles();
    const [selectedID, setSelectedID] = React.useState("");
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(props.page);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [tableData, setTableData] = React.useState<Array<any>>(data);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [
      expandAnchorEl,
      setExpandAnchorEl,
    ] = React.useState<null | HTMLElement>(null);
    const [
      pendingEnrolAnchorEl,
      setPendingEnrolAnchorEl,
    ] = React.useState<null | HTMLElement>(null);
    const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
    const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = React.useState(
      false
    );
    const [
      soViewDetailsDialogOpen,
      setSOViewDetailsDialogOpen,
    ] = React.useState(false);
    const [pendingEnrolDialogOpen, setPendingEnrolDialogOpen] = React.useState(
      false
    );
    const [isSearching, setIsSearching] = React.useState(false);
    const store: any = useSelector((state) => state);

    const [
      customiseTableDialogOpen,
      setCustomiseTableDialogOpen,
    ] = React.useState(false);
    const [value, setValue] = React.useState(0);

    let columnsTab: Column[] = [
      {
        id: "id",
        label: "Application ID",
        minWidth: 200,
        name: "applicationId",
      },
      {
        id: "title",
        label: "Application Date",
        minWidth: 250,
        name: "applicationDate",
      },
      {
        id: "title",
        label: "Organization Name",
        minWidth: 250,
        name: "organizationName",
      },
      {
        id: "completed",
        label: "KYC Status",
        minWidth: 200,
        name: "kycStatus",
      },
      {
        id: "completed",
        label: "Payment Status",
        minWidth: 250,
        name: "paymentStatus",
      },
    ];

    let columnsSOTab: Column[] = [
      {
        id: "id",
        label: "Application ID",
        minWidth: 200,
        name: "applicationId",
      },
      {
        id: "title",
        label: "Application Date",
        minWidth: 250,
        name: "applicationDate",
      },
      {
        id: "title",
        label: "Organization Name",
        minWidth: 250,
        name: "organizationName",
      },
      {
        id: "title",
        label: "Customer Name",
        minWidth: 250,
        name: "customerName",
      },
      {
        id: "completed",
        label: "KYC Status",
        minWidth: 200,
        name: "kycStatus",
      },
    ];

    let pendingEnrolColumnsTab: Column[] = [
      { id: "id", label: "User ID", minWidth: 200, name: "userId" },
      {
        id: "title",
        label: "Application Date",
        minWidth: 250,
        name: "applicationDate",
      },
      {
        id: "title",
        label: "Customer Name",
        minWidth: 250,
        name: "customerName",
      },
      {
        id: "title",
        label: "Organization Name",
        minWidth: 250,
        name: "organizationName",
      },
      {
        id: "completed",
        label: "Completion Status",
        minWidth: 250,
        name: "completionStatus",
      },
    ];

    let columnsTabMobile: Column[] = [
      {
        id: "id",
        label: "Application ID",
        minWidth: 120,
        name: "applicationId",
      },
      {
        id: "title",
        label: "Organization Name",
        minWidth: 180,
        name: "organizationName",
      },
    ];

    let columnsS0TabMobile: Column[] = [
      {
        id: "id",
        label: "Application ID",
        minWidth: 120,
        name: "applicationId",
      },
      {
        id: "title",
        label: "Customer Name",
        minWidth: 180,
        name: "customerName",
      },
    ];

    let pendingEnrolColumnsTabMobile: Column[] = [
      { id: "id", label: "User ID", minWidth: 100, name: "userId" },
      {
        id: "title",
        label: "Organization Name",
        minWidth: 180,
        name: "organizationName",
      },
    ];

    const [columns, setTableColumns] = React.useState<Column[]>(() => {
      return store.role === "SO" ? columnsSOTab : columnsTab;
    });

    const [mobileColumns, setMobileTableColumns] = React.useState<Column[]>(
      () => {
        return store.role === "SO" ? columnsS0TabMobile : columnsTabMobile;
      }
    );

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      // console.log('this is modal test', event.currentTarget);
      setAnchorEl(event.currentTarget);
    };

    const handleExpandClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      // console.log('Open expand modal', event.currentTarget);
      setExpandAnchorEl(event.currentTarget);
    };

    const handlePendingEnrolClick = (
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      event.preventDefault();
      // console.log('handlePendingEnrolClick', event.currentTarget);
      setPendingEnrolAnchorEl(event.currentTarget);
    };

    const handleClose = (event: unknown, property: string): void => {
      setRowsPerPage(parseInt(property));
      setAnchorEl(null);
      setExpandAnchorEl(null);
    };

    const sortTable = (event: unknown, property: string, dir: string): void => {
      let direction: number;
      if (dir === "asc") {
        direction = 1;
      } else {
        direction = -1;
      }

      setTableData(
        [...tableData].sort(function (a, b) {
          if (a[property] < b[property]) {
            return -1 * direction;
          } else if (a[property] > b[property]) {
            return 1 * direction;
          } else {
            return 0;
          }
        })
      );
    };

    const handleChangePage = (event: unknown, newPage: number): void => {
      setPage(newPage);
    };

    const handleChangeTab = (
      event: React.ChangeEvent<{}>,
      newValue: number
    ) => {
      //console.log("new Tab", newValue)
      setValue(newValue);
    };

    const goToPage = (): void => {
      // console.log('go to page value......', pageValue.current?.value);
      const value: number = pageValue.current
        ? parseInt(pageValue.current.value)
        : 1;
      setPage(value);
    };

    const enrollCustomer = (): void => {
      dispatch(setAssistedFlow());
      router.push("/enroll/customer");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.target.value = Math.abs(parseInt(e.target.value)).toString();
    };

    const openFilterDialog = () => {
      // console.log("filterDialogOpen --- ", filterDialogOpen);
      setFilterDialogOpen(true);
    };

    const openViewDetailsDialog = () => {
      // console.log("openViewDetailsDialog");
      setExpandAnchorEl(null);
      setViewDetailsDialogOpen(true);
    };

    const openSOViewDetailsDialog = () => {
      // console.log("openSOViewDetailsDialog");
      setExpandAnchorEl(null);
      setSOViewDetailsDialogOpen(true);
    };

    const openPendingEnrolDialog = () => {
      // console.log("openPendingEnrolDialog");
      setPendingEnrolAnchorEl(null);
      setPendingEnrolDialogOpen(true);
    };

    const closeFilterDialog = () => {
      setFilterDialogOpen(false);
    };

    const closeViewDetailsDialog = () => {
      setViewDetailsDialogOpen(false);
    };

    const closeSOViewDetailsDialog = () => {
      setSOViewDetailsDialogOpen(false);
    };

    const closePendingEnrolDialog = () => {
      setPendingEnrolDialogOpen(false);
    };

    const openCustomiseTableDialog = () => {
      //console.log("filterDialogOpen --- ", customiseTableDialogOpen);
      setCustomiseTableDialogOpen(true);
    };
    const closeCustomiseTableDialog = () => {
      setCustomiseTableDialogOpen(false);
    };

    const customiseTableColumn = (value: Array<any>) => {
      console.log("customised Columns are.........", value);
      setTableColumns(value);
    };

    const reviewApplication = (applicationId: string) => {
      router.push(`/review-application/${applicationId}`);
    };

    const getData = async () => {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("Access-Control-Allow-Origin", "*");
      headers.append(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

      await axios
        .get(
          `https://jsonplaceholder.typicode.com/todos?_limit=${rowsPerPage}&_page=${page}`,
          { headers }
        )
        .then((response) => {
          console.log("response data is .........", response.data);
          setTableData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const searchCallback = async (dataFromChild: string) => {
      //console.log("This is search data from child..........", dataFromChild.length);
      if (dataFromChild.length > 0) {
        setIsSearching(true);
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Access-Control-Allow-Origin", "*");
        headers.append(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        await axios
          .get(`https://jsonplaceholder.typicode.com/todos/${dataFromChild}`, {
            headers,
          })
          .then((response) => {
            //console.log('This is search response data .........', response.data);
            const res = [response.data];
            //console.log("Filtered response.........", res);
            setTableData(res);
          })
          .catch((error) => {
            console.log(error);
            setTableData([]);
          });
      } else {
        getData();
        setIsSearching(false);
      }
      dataFromChild = "";
    };

    // useEffect(() => {
    //   // console.log("Store Role......................", store.role)
    //   getData();
    // }, [rowsPerPage, page]);

    function TabPanel(props: TabPanelProps) {
      const { children, value, index, ...other } = props;

      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box>
              <div>{children}</div>
            </Box>
          )}
        </div>
      );
    }

    function a11yProps(index: any) {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    }
    return (
      <React.Fragment>
        <Hidden xsDown>
          {/* <div className={`d-flex`}> */}
          {/*  <SideNav></SideNav> */}
          <Container maxWidth="xl" className={`${styles.containerWidth}`}>
            <Paper
              className={`pt-3 pb-5 ${tableData && tableData.length > 0
                  ? ""
                  : styles.headerPaperHeight
                } ${styles.headerPaper}`}
            >
              <Container maxWidth="lg">
                <div
                  className={`d-flex align-items-center justify-content-between ${styles.formTitle}`}
                >
                  <div className="d-flex align-items-center">
                    <Typography
                      color="primary"
                      className={`${styles.header1}`}
                      data-test-id="assisted-smartfleet-lbl"
                    >
                      {store.role === "SO" ? (
                        "KYC Approval Requests"
                      ) : (
                          <>
                            <img
                              src={smartFleetWebIcon}
                              alt="smartFleetWebIcon"
                            />
                            <span> Enrolment Requests</span>
                          </>
                        )}
                    </Typography>
                  </div>
                  {store.role !== "SO" && (
                    <div className={`d-flex`}>
                      <CustomButton
                        color="primary"
                        variant="outlined"
                        className={`${styles.enrolBtn}`}
                        onClick={() => enrollCustomer()}
                        data-test-id="serviceReq-newEnrolment-btn"
                      >
                        NEW ENROLMENT
                      </CustomButton>
                    </div>
                  )}
                </div>

                <div className={styles.stickyTab}>
                  <p
                    className={`d-flex p-0 justify-content-end ${styles.bottomLabel1} ${styles.overlayTab}`}
                    data-test-id="serviceReq-rowsPerPage-lbl"
                  >
                    Showing {page * rowsPerPage - (rowsPerPage - 1)} to{" "}
                    {page * rowsPerPage} of 200 Entries
                  </p>

                  <CustomTabs
                    value={value}
                    onChange={handleChangeTab}
                    aria-label="simple tabs example"
                    data-test-id="serviceReq-customTabs"
                  >
                    <Tab
                      label="Pending Approvals"
                      value={0}
                      {...a11yProps(0)}
                      data-test-id="serviceReq-pendingApproval-tab"
                    />
                    {store.role !== "SO" && (
                      <Tab
                        label="Pending Enrolment"
                        value={1}
                        {...a11yProps(1)}
                        data-test-id="serviceReq-pendingEnrol-tab"
                      />
                    )}
                    {store.role !== "SO" && (
                      <Tab
                        label="Enrolled Customers"
                        value={2}
                        {...a11yProps(2)}
                        data-test-id="serviceReq-enrolCustomer-tab"
                      />
                    )}
                    {store.role === "SO" && (
                      <Tab
                        label="Approved Applications"
                        value={2}
                        {...a11yProps(3)}
                        data-test-id="serviceReq-approvedApplications-tab"
                      />
                    )}
                  </CustomTabs>

                  <div
                    className={`d-flex align-items-center justify-content-center`}
                  >
                    <TableHeader
                      parentSearchCallback={searchCallback}
                      openFilterDialog={openFilterDialog}
                      openCustomiseTableDialog={openCustomiseTableDialog}
                      tabValue={value}
                      data-test-id="serviceReq-search-header"
                    ></TableHeader>
                  </div>
                </div>

                <div className={`d-flex flex-column`}>
                  <TabPanel value={value} index={0}>
                    <TableContainer
                      className={
                        tableData && tableData.length > 0
                          ? classes.container
                          : styles.noScroll
                      }
                    >
                      <Table aria-label="sticky table">
                        <TableHead className={`${styles.tableHead}`}>
                          {tableData && tableData.length > 0 ? (
                            <TableRow>
                              {columns.map((column, i) => {
                                return (
                                  <StyledTableCell
                                    key={column.id + i}
                                    align={"center"}
                                    style={{ minWidth: column.minWidth }}
                                    data-test-id={column.id + i}
                                  >
                                    <div className={`d-flex pl-3`}>
                                      <div className={`d-flex`}>
                                        {column.label}
                                      </div>
                                      {column.label === "Application Date" ||
                                        column.label === "No of Cards" ? (
                                          <div
                                            className={`d-flex flex-column pl-3`}
                                          >
                                            <img
                                              className={styles.cursorPointer}
                                              src={upIcon}
                                              alt="up Icon"
                                              data-test-id={
                                                column.id + i + "-asc"
                                              }
                                              onClick={(e) => {
                                                sortTable(e, column.id, "asc");
                                              }}
                                            />
                                            <img
                                              className={styles.cursorPointer}
                                              src={downIcon}
                                              alt="down Icon"
                                              data-test-id={
                                                column.id + i + "-des"
                                              }
                                              onClick={(e) => {
                                                sortTable(e, column.id, "des");
                                              }}
                                            />
                                          </div>
                                        ) : null}
                                    </div>
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          ) : null}
                        </TableHead>
                        <TableBody>
                          {tableData && tableData.length > 0 ? (
                            tableData.map((row, index) => {
                              return (
                                <StyledTableRow
                                  key={row.id + index}
                                  data-test-id={index}
                                >
                                  {columns.map((column, i) => {
                                    const value = row[column.id];
                                    return (
                                      <StyledTableRowCell
                                        key={column.id + i}
                                        data-test-id={column.id + i}
                                        align={column.align}
                                      >
                                        {column.label === "Payment Status" ? (
                                          <div className={`d-flex`}>
                                            {value.toString() === "true" ? (
                                              <>
                                                <div
                                                  className={`d-flex align-items-center`}
                                                >
                                                  <span
                                                    className={`${styles.radioStyle} ${styles.approved}`}
                                                  ></span>
                                                </div>
                                                <div
                                                  className={`pl-2 d-flex align-items-center`}
                                                >
                                                  <span>
                                                    Request for fee waiver
                                                    approved
                                                  </span>
                                                </div>
                                              </>
                                            ) : (
                                                <>
                                                  <div
                                                    className={`d-flex align-items-center`}
                                                  >
                                                    <span
                                                      className={`${styles.radioStyle} ${styles.rejected}`}
                                                    ></span>
                                                  </div>
                                                  <div
                                                    className={`pl-2 d-flex align-items-center`}
                                                  >
                                                    <span>
                                                      Request for fee waiver
                                                      rejected
                                                  </span>
                                                  </div>
                                                </>
                                              )}
                                          </div>
                                        ) : column.label === "KYC Status" ? (
                                          <div
                                            className={`d-flex align-items-center`}
                                          >
                                            {value.toString() === "true" ? (
                                              <div
                                                className={`${styles.notSubmittedRectangle} d-flex align-items-center justify-content-center`}
                                              >
                                                REJECTED
                                              </div>
                                            ) : (
                                                <div
                                                  className={`${styles.pendingRectangle} d-flex align-items-center justify-content-center`}
                                                >
                                                  PENDING APPROVAL
                                                </div>
                                              )}
                                          </div>
                                        ) : (
                                              <div
                                                className={`d-flex align-items-center`}
                                              >
                                                <span
                                                  className={
                                                    column.label ===
                                                      "Application ID"
                                                      ? `${styles.blueLabel}`
                                                      : ""
                                                  }
                                                  data-test-id={
                                                    column.id + i + "-lbl"
                                                  }
                                                >
                                                  {column.label ===
                                                    "Application ID" ? (
                                                      <span
                                                        onClick={() =>
                                                          reviewApplication(
                                                            Math.random()
                                                              .toString(36)
                                                              .substr(2, 8)
                                                              .toUpperCase()
                                                          )
                                                        }
                                                      >
                                                        {Math.random()
                                                          .toString(36)
                                                          .substr(2, 8)
                                                          .toUpperCase()}
                                                      </span>
                                                    ) : (
                                                      value.toString()
                                                    )}
                                                </span>
                                              </div>
                                            )}
                                      </StyledTableRowCell>
                                    );
                                  })}
                                </StyledTableRow>
                              );
                            })
                          ) : (
                              <tr>
                                <td colSpan={5}>
                                  {isSearching ? (
                                    <div
                                      className={`my-5 pt-5 d-flex flex-column justify-content-center`}
                                    >
                                      <img
                                        className={`d-flex justify-content-center`}
                                        src={noRecordsImg}
                                        alt="noRecordsImg"
                                      />
                                      <span
                                        className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                      >
                                        No Results Found
                                    </span>
                                      <span
                                        className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                      >
                                        {store.role === "SO"
                                          ? "Kindly try again with a different search criteria"
                                          : "Try again using more general search terms"}
                                      </span>
                                    </div>
                                  ) : (
                                      <div
                                        className={`my-5 pt-5 d-flex flex-column justify-content-center`}
                                      >
                                        <img
                                          className={`d-flex justify-content-center`}
                                          src={noPendingApprovals}
                                          alt="noPendingApprovals"
                                        />
                                        <span
                                          className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                        >
                                          No Pending Approvals
                                    </span>
                                        <span
                                          className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                        >
                                          All done here!
                                    </span>
                                      </div>
                                    )}
                                </td>
                              </tr>
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    {/* Item Two {value} */}
                    <TableContainer
                      className={
                        tableData && tableData.length > 0
                          ? classes.container
                          : styles.noScroll
                      }
                    >
                      <Table aria-label="sticky table">
                        <TableHead>
                          {tableData && tableData.length > 0 ? (
                            <TableRow>
                              {pendingEnrolColumnsTab.map((column, i) => {
                                return (
                                  <StyledTableCell
                                    key={column.id + i}
                                    data-test-id={column.id + i}
                                    align={"center"}
                                    style={{ minWidth: column.minWidth }}
                                  >
                                    <div className={`d-flex pl-3`}>
                                      <div className={`d-flex`}>
                                        {column.label}
                                      </div>
                                      {column.label === "Application Date" ? (
                                        <div
                                          className={`d-flex flex-column pl-3`}
                                        >
                                          <img
                                            className={styles.cursorPointer}
                                            src={upIcon}
                                            alt="up Icon"
                                            data-test-id={
                                              column.id + i + "-asc"
                                            }
                                            onClick={(e) => {
                                              sortTable(e, column.id, "asc");
                                            }}
                                          />
                                          <img
                                            className={styles.cursorPointer}
                                            src={downIcon}
                                            alt="down Icon"
                                            data-test-id={
                                              column.id + i + "-des"
                                            }
                                            onClick={(e) => {
                                              sortTable(e, column.id, "des");
                                            }}
                                          />
                                        </div>
                                      ) : null}
                                    </div>
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          ) : null}
                        </TableHead>
                        <TableBody>
                          {tableData && tableData.length > 0 ? (
                            tableData.map((row, index) => {
                              return (
                                <StyledTableRow key={row.id + index}>
                                  {pendingEnrolColumnsTab.map((column, i) => {
                                    const value = row[column.id];
                                    return (
                                      <StyledTableRowCell
                                        key={column.id + i}
                                        data-test-id={column.id + i}
                                        align={column.align}
                                      >
                                        {column.label ===
                                          "Completion Status" ? (
                                            <div className={`d-flex`}>
                                              {value.toString() === "true" ? (
                                                <span>Step 3 of 7</span>
                                              ) : (
                                                  <span>Step 5 of 7</span>
                                                )}
                                            </div>
                                          ) : (
                                            <div
                                              className={`d-flex align-items-center`}
                                            >
                                              <span
                                                className={
                                                  column.label === "User ID"
                                                    ? `${styles.blueLabel}`
                                                    : ""
                                                }
                                                data-test-id={
                                                  column.id + i + "-lbl"
                                                }
                                              >
                                                {column.label === "User ID"
                                                  ? Math.random()
                                                    .toString(36)
                                                    .replace(/[^a-z]+/g, "")
                                                    .substr(2, 8) +
                                                  "@example.com"
                                                  : value.toString()}
                                              </span>
                                            </div>
                                          )}
                                      </StyledTableRowCell>
                                    );
                                  })}
                                </StyledTableRow>
                              );
                            })
                          ) : (
                              <tr>
                                <td colSpan={5}>
                                  {isSearching ? (
                                    <div
                                      className={`my-5 pt-5 d-flex flex-column justify-content-center`}
                                    >
                                      <img
                                        className={`d-flex justify-content-center`}
                                        src={noRecordsImg}
                                        alt="noRecordsImg"
                                      />
                                      <span
                                        className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                      >
                                        No Results Found
                                    </span>
                                      <span
                                        className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                      >
                                        {store.role === "SO"
                                          ? "Kindly try again with a different search criteria"
                                          : "Try again using more general search terms"}
                                      </span>
                                    </div>
                                  ) : (
                                      <div
                                        className={`my-5 pt-5 d-flex flex-column justify-content-center`}
                                      >
                                        <img
                                          className={`d-flex justify-content-center`}
                                          src={noPendingEnrol}
                                          alt="noPendingEnrol"
                                        />
                                        <span
                                          className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                        >
                                          No Pending Enrolments
                                    </span>
                                        <span
                                          className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                        >
                                          To enrol a new customer kindly click on
                                    </span>
                                        <div
                                          className={`d-flex mt-3 justify-content-center`}
                                        >
                                          <CustomButton
                                            className={`d-flex justify-content-center ${styles.buttonStyle}`}
                                            variant="contained"
                                            color="primary"
                                            disableElevation
                                            onClick={() => enrollCustomer()}
                                          >
                                            New Enrolment
                                      </CustomButton>
                                        </div>
                                      </div>
                                    )}
                                </td>
                              </tr>
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>

                  <TabPanel value={value} index={2}>
                    {/* Item Three {value} */}
                    <TableContainer
                      className={
                        tableData && tableData.length > 0
                          ? classes.container
                          : styles.noScroll
                      }
                    >
                      <Table aria-label="sticky table">
                        <TableHead>
                          {tableData && tableData.length > 0 ? (
                            <TableRow>
                              {columns.map((column, i) => {
                                return (
                                  <StyledTableCell
                                    key={column.id + i}
                                    data-test-id={column.id + i}
                                    align={"center"}
                                    style={{ minWidth: column.minWidth }}
                                  >
                                    <div className={`d-flex pl-3`}>
                                      <div className={`d-flex`}>
                                        {column.label}
                                      </div>
                                      {column.label === "Application Date" ||
                                        column.label === "No of Cards" ? (
                                          <div
                                            className={`d-flex flex-column pl-3`}
                                          >
                                            <img
                                              className={styles.cursorPointer}
                                              src={upIcon}
                                              alt="up Icon"
                                              data-test-id={
                                                column.id + i + "-asc"
                                              }
                                              onClick={(e) => {
                                                sortTable(e, column.id, "asc");
                                              }}
                                            />
                                            <img
                                              className={styles.cursorPointer}
                                              src={downIcon}
                                              alt="down Icon"
                                              data-test-id={
                                                column.id + i + "-des"
                                              }
                                              onClick={(e) => {
                                                sortTable(e, column.id, "des");
                                              }}
                                            />
                                          </div>
                                        ) : null}
                                    </div>
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          ) : null}
                        </TableHead>
                        <TableBody>
                          {tableData && tableData.length > 0 ? (
                            tableData.map((row, index) => {
                              return (
                                <StyledTableRow key={row.id + index}>
                                  {columns.map((column, i) => {
                                    const value = row[column.id];
                                    return (
                                      <StyledTableRowCell
                                        key={column.id + i}
                                        align={column.align}
                                        data-test-id={column.id + i}
                                      >
                                        {column.label === "Payment Status" ? (
                                          <div className={`d-flex`}>
                                            {value.toString() === "true" ? (
                                              <>
                                                <div
                                                  className={`d-flex align-items-center`}
                                                >
                                                  <span
                                                    className={`${styles.radioStyle} ${styles.approved}`}
                                                  ></span>
                                                </div>
                                                <div
                                                  className={`pl-2 d-flex align-items-center`}
                                                >
                                                  <span>
                                                    Request for fee waiver
                                                    approved
                                                  </span>
                                                </div>
                                              </>
                                            ) : (
                                                <>
                                                  <div
                                                    className={`d-flex align-items-center`}
                                                  >
                                                    <span
                                                      className={`${styles.radioStyle} ${styles.paid}`}
                                                    ></span>
                                                  </div>
                                                  <div
                                                    className={`pl-2 d-flex align-items-center`}
                                                  >
                                                    <span>Paid at Fuel Station</span>
                                                  </div>
                                                </>
                                              )}
                                          </div>
                                        ) : column.label === "KYC Status" ? (
                                          <div
                                            className={`d-flex align-items-center`}
                                          >
                                            <div
                                              className={`${styles.approvedRectangle} d-flex align-items-center justify-content-center`}
                                            >
                                              APPROVED
                                            </div>
                                          </div>
                                        ) : (
                                              <div
                                                className={`d-flex align-items-center`}
                                              >
                                                <span
                                                  className={
                                                    column.label ===
                                                      "Application ID"
                                                      ? `${styles.blueLabel}`
                                                      : ""
                                                  }
                                                  data-test-id={
                                                    column.id + i + "-lbl"
                                                  }
                                                >
                                                  {column.label ===
                                                    "Application ID" ? (
                                                      <span
                                                        onClick={() =>
                                                          reviewApplication(
                                                            Math.random()
                                                              .toString(36)
                                                              .substr(2, 8)
                                                              .toUpperCase()
                                                          )
                                                        }
                                                      >
                                                        {Math.random()
                                                          .toString(36)
                                                          .substr(2, 8)
                                                          .toUpperCase()}
                                                      </span>
                                                    ) : (
                                                      value.toString()
                                                    )}
                                                </span>
                                              </div>
                                            )}
                                      </StyledTableRowCell>
                                    );
                                  })}
                                </StyledTableRow>
                              );
                            })
                          ) : (
                              <tr>
                                <td colSpan={5}>
                                  <div
                                    className={`my-5 pt-5 d-flex flex-column justify-content-center`}
                                  >
                                    <img
                                      className={`d-flex justify-content-center`}
                                      src={noRecordsImg}
                                      alt="noRecordsImg"
                                    />
                                    <span
                                      className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                    >
                                      No Results Found
                                  </span>
                                    <span
                                      className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                    >
                                      {store.role === "SO"
                                        ? "Kindly try again with a different search criteria"
                                        : "Try again using more general search terms"}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  {/* <TabPanel value={value} index={3}>
                  Item Three {value}
                </TabPanel> */}
                  {tableData && tableData.length > 0 ? (
                    <div
                      className={`d-flex pt-3 align-items-center justify-content-between`}
                    >
                      <div
                        aria-controls="rowsPerPage-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        data-test-id="serviceReq-pagination-div"
                        className={`d-flex align-items-center mx-3 ${styles.FuelServicesMenuContainer}`}
                      >
                        <span
                          className={`mx-2 ${styles.cursorPointer} ${styles.expandLabel}`}
                          data-test-id="serviceReq-view-lbl"
                        >
                          {`View ${rowsPerPage}`}
                        </span>
                        <ExpandMore />
                      </div>
                      <CustomMenu
                        id="rowsPerPage-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        data-test-id="serviceReq-customMenu"
                        onClose={(e) => {
                          setAnchorEl(null);
                        }}
                      >
                        <CustomMenuItem
                          value="10"
                          onClick={(e) => {
                            handleClose(e, "10");
                          }}
                          data-test-id="serviceReq-menuItem-view-10"
                        >
                          View 10
                        </CustomMenuItem>
                        <CustomMenuItem
                          value="20"
                          onClick={(e) => {
                            handleClose(e, "20");
                          }}
                          data-test-id="serviceReq-menuItem-view-20"
                        >
                          View 20
                        </CustomMenuItem>
                      </CustomMenu>
                      <div
                        className={`d-flex align-items-center justify-content-between`}
                      >
                        <CustomPagination
                          count={Math.ceil(200 / rowsPerPage)}
                          page={page}
                          color="primary"
                          boundaryCount={2}
                          onChange={handleChangePage}
                          data-test-id="serviceReq-pagination"
                        />
                        <div className={`d-flex`}>
                          <Typography
                            className={`pr-2 pt-1 ${styles.bottomLabel2}`}
                            data-test-id="serviceReq-goTo-lbl"
                          >
                            Go to page
                          </Typography>
                          <input
                            className={`${styles.inputStyle}`}
                            type="number"
                            placeholder=""
                            ref={pageValue}
                            min="1"
                            onChange={handleChange}
                            data-test-id="serviceReq-goTo-input"
                          />
                          <span
                            className={`pl-2 pt-1 ${styles.bottomLabel3} ${styles.cursorPointer}`}
                            onClick={goToPage}
                            data-test-id="serviceReq-goTo-btn"
                          >
                            Go
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Container>
            </Paper>
          </Container>
          <FilterDialog
            filterDialogOpen={filterDialogOpen}
            closeFilterDialog={closeFilterDialog}
            tabValue={value}
          ></FilterDialog>
          <CustomiseTable
            customiseTableDialogOpen={customiseTableDialogOpen}
            closeCustomiseTableDialog={closeCustomiseTableDialog}
            customiseTableColumn={customiseTableColumn}
            columns={columns}
          ></CustomiseTable>
          {/* </div> */}
        </Hidden>
        <Hidden smUp>
          <Container className={`p-0 ${styles.containerStyle}`} maxWidth="xl">
            <Paper
              className={`py-4 px-4 ${tableData && tableData.length > 0
                  ? ""
                  : styles.headerPaperHeight
                } ${styles.headerPaper}  `}
            >
              <div
                className={`d-flex flex-column justify-content-between ${styles.formTitle}`}
              >
                <Typography
                  color="primary"
                  className={`${styles.mobileHeader1}`}
                  data-test-id="assisted-smartfleet-lbl-mbl"
                >
                  {store.role === "SO" ? (
                    "KYC Approval Requests"
                  ) : (
                      <>
                        <img
                          src={smartFleetMobileIcon}
                          alt="smartFleetMobileIcon"
                        />
                        <span> Enrolments</span>
                      </>
                    )}
                </Typography>

                {store.role === "SO" ? null : (
                  <CustomButton
                    color="primary"
                    variant="outlined"
                    className={`my-2`}
                    onClick={() => enrollCustomer()}
                    data-test-id="serviceReq-newEnrolment-btn-mbl"
                  >
                    NEW ENROLMENT
                  </CustomButton>
                )}
              </div>

              <div className={styles.mobileStickyTab}>
                <CustomMobileTabs
                  value={value}
                  onChange={handleChangeTab}
                  aria-label="full width tabs example"
                  data-test-id="serviceReq-customTabs-mbl"
                  variant="fullWidth"
                  className={`pt-3`}
                >
                  <Tab
                    label="Pending Approvals"
                    value={0}
                    {...a11yProps(0)}
                    data-test-id="serviceReq-pendingApproval-tab-mbl"
                  />
                  {store.role !== "SO" && (
                    <Tab
                      label="Pending Enrolment"
                      value={1}
                      {...a11yProps(1)}
                      data-test-id="serviceReq-pendingEnrol-tab-mbl"
                    />
                  )}
                  {store.role !== "SO" && (
                    <Tab
                      label="Enrolled Customers"
                      value={2}
                      {...a11yProps(2)}
                      data-test-id="serviceReq-enrolCustomer-tab-mbl"
                    />
                  )}
                  {store.role === "SO" && (
                    <Tab
                      label="Approved Applications"
                      value={2}
                      {...a11yProps(3)}
                      data-test-id="serviceReq-approvedApplications-tab-mbl"
                    />
                  )}
                </CustomMobileTabs>
                <div
                  className={`d-flex align-items-center justify-content-center`}
                >
                  <MobileSearchHeader
                    parentSearchCallback={searchCallback}
                    openFilterDialog={openFilterDialog}
                    openCustomiseTableDialog={openCustomiseTableDialog}
                    tabValue={value}
                    data-test-id="serviceReq-search-header-mbl"
                  ></MobileSearchHeader>
                </div>
              </div>
              <TabPanel value={value} index={0}>
                <TableContainer
                  className={
                    tableData && tableData.length > 0 ? classes.container : ""
                  }
                >
                  <Table aria-label="sticky table">
                    <TableHead>
                      {tableData && tableData.length > 0 ? (
                        <TableRow>
                          {mobileColumns.map((column, i) => {
                            return (
                              <StyledTableCell
                                key={column.id + i + "-pendingApproval-mbl"}
                                data-test-id={column.id + i + "-mbl"}
                                align={"center"}
                                style={{ minWidth: column.minWidth }}
                              >
                                <div className={`d-flex`}>
                                  <div className={`d-flex`}>{column.label}</div>
                                  {column.label === "Application Date" ||
                                    column.label === "No of Cards" ? (
                                      <div className={`d-flex flex-column pl-3`}>
                                        <img
                                          className={styles.cursorPointer}
                                          src={upIcon}
                                          alt="up Icon"
                                          data-test-id={
                                            column.id + i + "-asc-mbl"
                                          }
                                          onClick={(e) => {
                                            sortTable(e, column.id, "asc");
                                          }}
                                        />
                                        <img
                                          className={styles.cursorPointer}
                                          src={downIcon}
                                          alt="down Icon"
                                          data-test-id={
                                            column.id + i + "-des-mbl"
                                          }
                                          onClick={(e) => {
                                            sortTable(e, column.id, "des");
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                </div>
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      ) : null}
                    </TableHead>
                    <TableBody>
                      {tableData && tableData.length > 0 ? (
                        tableData.map((row, index) => {
                          return (
                            <StyledTableRow
                              key={row.id + index + "-pendingApproval-mbl"}
                              hover
                              onClick={() => {
                                setSelectedID(
                                  row.id + index + "-pendingApproval-mbl"
                                );
                              }}
                              selected={
                                selectedID ===
                                row.id + index + "-pendingApproval-mbl"
                              }
                              classes={{
                                hover: classes.hover,
                                selected: classes.selected,
                              }}
                              className={classes.tableRow}
                            >
                              {mobileColumns.map((column, i) => {
                                const value = row[column.id];
                                return (
                                  <StyledTableRowCell
                                    key={column.id + i + "-pendingApproval-mbl"}
                                    align={column.align}
                                    data-test-id={column.id + i + "-mbl"}
                                    className={classes.tableCell}
                                    aria-controls={`pendingApproval`}
                                    aria-haspopup="true"
                                    onClick={handleExpandClick}
                                  >
                                    <div
                                      className={`d-flex align-items-center`}
                                    >
                                      <span
                                        className={
                                          column.label === "Application ID"
                                            ? `${styles.blueLabelMobile}`
                                            : `${styles.spanWidth}`
                                        }
                                        data-test-id={
                                          column.id + i + "-lbl-mbl"
                                        }
                                      >
                                        {column.label === "Application ID"
                                          ? Math.random()
                                            .toString(36)
                                            .substr(2, 8)
                                            .toUpperCase()
                                          : value.toString()}
                                      </span>
                                      {column.label === "Organization Name" ||
                                        column.label === "Customer Name" ? (
                                          <MoreVertIcon />
                                        ) : null}
                                    </div>
                                  </StyledTableRowCell>
                                );
                              })}
                            </StyledTableRow>
                          );
                        })
                      ) : (
                          <tr>
                            <td colSpan={2}>
                              {isSearching ? (
                                <div
                                  className={`my-5 d-flex flex-column justify-content-center`}
                                >
                                  <img
                                    className={`d-flex justify-content-center`}
                                    src={noRecordsImg}
                                    alt="noRecordsImg"
                                  />
                                  <span
                                    className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                  >
                                    No Results Found
                                </span>
                                  <span
                                    className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                  >
                                    {store.role === "SO"
                                      ? "Kindly try again with a different search criteria"
                                      : "Try again using more general search terms"}
                                  </span>
                                </div>
                              ) : (
                                  <div
                                    className={`my-5 d-flex flex-column justify-content-center`}
                                  >
                                    <img
                                      className={`d-flex justify-content-center`}
                                      src={noPendingApprovals}
                                      alt="noPendingApprovals"
                                    />
                                    <span
                                      className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                    >
                                      No Pending Approvals
                                </span>
                                    <span
                                      className={`${styles.noRecordSubLabel} pt-2 d-flex justify-content-center`}
                                    >
                                      All done here!
                                </span>
                                  </div>
                                )}
                            </td>
                          </tr>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <TableContainer
                  className={
                    tableData && tableData.length > 0 ? classes.container : ""
                  }
                >
                  <Table aria-label="sticky table">
                    <TableHead>
                      {tableData && tableData.length > 0 ? (
                        <TableRow>
                          {pendingEnrolColumnsTabMobile.map((column, i) => {
                            return (
                              <StyledTableCell
                                key={column.id + i + "-pendingEnrol-mbl"}
                                data-test-id={column.id + i + "-mbl"}
                                align={"center"}
                                style={{ minWidth: column.minWidth }}
                              >
                                <div className={`d-flex`}>
                                  <div className={`d-flex`}>{column.label}</div>
                                  {column.label === "Application Date" ||
                                    column.label === "No of Cards" ? (
                                      <div className={`d-flex flex-column pl-3`}>
                                        <img
                                          className={styles.cursorPointer}
                                          src={upIcon}
                                          alt="up Icon"
                                          data-test-id={
                                            column.id + i + "-asc-mbl"
                                          }
                                          onClick={(e) => {
                                            sortTable(e, column.id, "asc");
                                          }}
                                        />
                                        <img
                                          className={styles.cursorPointer}
                                          src={downIcon}
                                          alt="down Icon"
                                          data-test-id={
                                            column.id + i + "-des-mbl"
                                          }
                                          onClick={(e) => {
                                            sortTable(e, column.id, "des");
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                </div>
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      ) : null}
                    </TableHead>
                    <TableBody>
                      {tableData && tableData.length > 0 ? (
                        tableData.map((row, index) => {
                          return (
                            <StyledTableRow
                              key={row.id + index + "-pendingEnrol-mbl"}
                              hover
                              onClick={() => {
                                setSelectedID(
                                  row.id + index + "-pendingEnrol-mbl"
                                );
                              }}
                              selected={
                                selectedID ===
                                row.id + index + "-pendingEnrol-mbl"
                              }
                              classes={{
                                hover: classes.hover,
                                selected: classes.selected,
                              }}
                              className={classes.tableRow}
                            >
                              {pendingEnrolColumnsTabMobile.map((column, i) => {
                                const value = row[column.id];
                                return (
                                  <StyledTableRowCell
                                    key={column.id + i + "-pendingEnrol-mbl"}
                                    align={column.align}
                                    data-test-id={column.id + i + "mbl"}
                                    aria-controls={`expandPenEnrol`}
                                    aria-haspopup="true"
                                    onClick={handlePendingEnrolClick}
                                    className={classes.tableCell}
                                  >
                                    <div
                                      className={`d-flex align-items-center`}
                                    >
                                      <span
                                        className={
                                          column.label === "User ID"
                                            ? `${styles.blueLabelMobile}`
                                            : `${styles.spanWidth}`
                                        }
                                        data-test-id={
                                          column.id + i + "-lbl-mbl"
                                        }
                                      >
                                        {column.label === "User ID"
                                          ? Math.random()
                                            .toString(36)
                                            .replace(/[^a-z]+/g, "")
                                            .substr(2, 8) + "@example.com"
                                          : value.toString()}
                                      </span>
                                      {column.label === "Organization Name" ? (
                                        <MoreVertIcon />
                                      ) : null}
                                    </div>
                                  </StyledTableRowCell>
                                );
                              })}
                            </StyledTableRow>
                          );
                        })
                      ) : (
                          <tr>
                            <td colSpan={2}>
                              {isSearching ? (
                                <div
                                  className={`my-5 d-flex flex-column justify-content-center`}
                                >
                                  <img
                                    className={`d-flex justify-content-center`}
                                    src={noRecordsImg}
                                    alt="noRecordsImg"
                                  />
                                  <span
                                    className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                  >
                                    No Results Found
                                </span>
                                  <span
                                    className={`${styles.noRecordsSubLabel} d-flex justify-content-center`}
                                  >
                                    {store.role === "SO"
                                      ? "Kindly try again with a different search criteria"
                                      : "Try again using more general search terms."}
                                  </span>
                                </div>
                              ) : (
                                  <div
                                    className={`my-5 d-flex flex-column justify-content-center`}
                                  >
                                    <img
                                      className={`d-flex justify-content-center`}
                                      src={noPendingEnrol}
                                      alt="noPendingEnrolments"
                                    />
                                    <span
                                      className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                    >
                                      No Pending Enrolments
                                </span>
                                    <span
                                      className={`${styles.noRecordsSubLabel} mt-1 d-flex justify-content-center`}
                                    >
                                      To enrol a new customer kindly click on
                                </span>
                                    <div
                                      className={`d-flex mt-3 justify-content-center`}
                                    >
                                      <CustomButton
                                        className={`d-flex justify-content-center ${styles.buttonStyle}`}
                                        variant="contained"
                                        color="primary"
                                        disableElevation
                                        onClick={() => enrollCustomer()}
                                      >
                                        New Enrolment
                                  </CustomButton>
                                    </div>
                                  </div>
                                )}
                            </td>
                          </tr>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={value} index={2}>
                <TableContainer
                  className={
                    tableData && tableData.length > 0 ? classes.container : ""
                  }
                >
                  <Table aria-label="sticky table">
                    <TableHead>
                      {tableData && tableData.length > 0 ? (
                        <TableRow>
                          {mobileColumns.map((column, i) => {
                            return (
                              <StyledTableCell
                                key={column.id + i + "-enrolCust-mbl"}
                                data-test-id={column.id + i + "-mbl"}
                                align={"center"}
                                style={{ minWidth: column.minWidth }}
                              >
                                <div className={`d-flex`}>
                                  <div className={`d-flex`}>{column.label}</div>
                                  {column.label === "Application Date" ||
                                    column.label === "No of Cards" ? (
                                      <div className={`d-flex flex-column pl-3`}>
                                        <img
                                          className={styles.cursorPointer}
                                          src={upIcon}
                                          alt="up Icon"
                                          data-test-id={
                                            column.id + i + "-asc-mbl"
                                          }
                                          onClick={(e) => {
                                            sortTable(e, column.id, "asc");
                                          }}
                                        />
                                        <img
                                          className={styles.cursorPointer}
                                          src={downIcon}
                                          alt="down Icon"
                                          data-test-id={
                                            column.id + i + "-des-mbl"
                                          }
                                          onClick={(e) => {
                                            sortTable(e, column.id, "des");
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                </div>
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      ) : null}
                    </TableHead>
                    <TableBody>
                      {tableData && tableData.length > 0 ? (
                        tableData.map((row, index) => {
                          return (
                            <StyledTableRow
                              key={row.id + index + "-enrolCust-mbl"}
                              hover
                              onClick={() => {
                                setSelectedID(
                                  row.id + index + "-enrolCust-mbl"
                                );
                              }}
                              selected={
                                selectedID === row.id + index + "-enrolCust-mbl"
                              }
                              classes={{
                                hover: classes.hover,
                                selected: classes.selected,
                              }}
                              className={classes.tableRow}
                            >
                              {mobileColumns.map((column, i) => {
                                const value = row[column.id];
                                return (
                                  <StyledTableRowCell
                                    key={column.id + i + "-enrolCust-mbl"}
                                    align={column.align}
                                    data-test-id={column.id + i + "-mbl"}
                                    aria-controls={`pendingApproval`}
                                    aria-haspopup="true"
                                    onClick={handleExpandClick}
                                    className={classes.tableCell}
                                  >
                                    <div
                                      className={`d-flex align-items-center`}
                                    >
                                      <span
                                        className={
                                          column.label === "Application ID"
                                            ? `${styles.blueLabelMobile}`
                                            : `${styles.spanWidth}`
                                        }
                                        data-test-id={
                                          column.id + i + "-lbl-mbl"
                                        }
                                      >
                                        {column.label === "Application ID"
                                          ? Math.random()
                                            .toString(36)
                                            .substr(2, 8)
                                            .toUpperCase()
                                          : value.toString()}
                                      </span>
                                      {column.label === "Organization Name" ||
                                        column.label === "Customer Name" ? (
                                          <MoreVertIcon />
                                        ) : null}
                                    </div>
                                  </StyledTableRowCell>
                                );
                              })}
                            </StyledTableRow>
                          );
                        })
                      ) : (
                          <tr>
                            <td colSpan={2}>
                              <div
                                className={`my-5 d-flex flex-column justify-content-center`}
                              >
                                <img
                                  className={`d-flex justify-content-center`}
                                  src={noRecordsImg}
                                  alt="noRecordsImg"
                                />
                                <span
                                  className={`${styles.noRecordLabel} mt-3 d-flex justify-content-center`}
                                >
                                  No Results Found
                              </span>
                                <span
                                  className={`${styles.noRecordsSubLabel} d-flex justify-content-center`}
                                >
                                  {store.role === "SO"
                                    ? "Kindly try again with a different search criteria"
                                    : "Try again using more general search terms."}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
              {tableData && tableData.length > 0 ? (
                <div
                  className={`d-flex pt-3 align-items-center justify-content-between`}
                >
                  <div
                    aria-controls="rowsPerPage-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    data-test-id="serviceReq-pagination-div-mbl"
                    className={`d-flex align-items-center mx-3 ${styles.FuelServicesMenuContainer}`}
                  >
                    <span
                      className={`mx-2 ${styles.cursorPointer} ${styles.expandLabel}`}
                      data-test-id="serviceReq-view-lbl-mbl"
                    >
                      {`View ${rowsPerPage}`}
                    </span>
                    <ExpandMore />
                  </div>
                  <CustomMenu
                    id="rowsPerPage-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    data-test-id="rowsPerPage-customMenu"
                    onClose={(e) => {
                      setAnchorEl(null);
                    }}
                  >
                    <CustomMenuItem
                      value="10"
                      onClick={(e) => {
                        handleClose(e, "10");
                      }}
                      data-test-id="rowsPerPage-menuItem-view-10"
                    >
                      View 10
                    </CustomMenuItem>
                    <CustomMenuItem
                      value="20"
                      onClick={(e) => {
                        handleClose(e, "20");
                      }}
                      data-test-id="rowsPerPage-menuItem-view-20"
                    >
                      View 20
                    </CustomMenuItem>
                  </CustomMenu>
                  <div
                    className={`d-flex align-items-center justify-content-between`}
                  >
                    <CustomPagination
                      count={Math.ceil(200 / rowsPerPage)}
                      page={page}
                      color="primary"
                      boundaryCount={0}
                      onChange={handleChangePage}
                      data-test-id="serviceReq-pagination"
                    />
                  </div>
                </div>
              ) : null}
            </Paper>
          </Container>
          <CustomMenu
            id={`pendingApproval`}
            anchorEl={expandAnchorEl}
            keepMounted
            open={Boolean(expandAnchorEl)}
            data-test-id="pendingApproval-customMenu"
            onClose={(e) => {
              setExpandAnchorEl(null);
            }}
          >
            <CustomMenuItem
              value="10"
              onClick={
                store.role === "SO"
                  ? openSOViewDetailsDialog
                  : openViewDetailsDialog
              }
              data-test-id="pendingApproval-menuItem-view-details"
            >
              View Details
            </CustomMenuItem>
            <CustomMenuItem
              value="20"
              onClick={() =>
                reviewApplication(
                  Math.random().toString(36).substr(2, 8).toUpperCase()
                )
              }
              data-test-id="pendingApproval-menuItem-view-application"
            >
              Review Application
            </CustomMenuItem>
          </CustomMenu>

          <CustomMenu
            id={`expandPenEnrol`}
            anchorEl={pendingEnrolAnchorEl}
            keepMounted
            open={Boolean(pendingEnrolAnchorEl)}
            data-test-id="expandPenEnrol-customMenu-mbl"
            onClose={(e) => {
              setPendingEnrolAnchorEl(null);
            }}
          >
            <CustomMenuItem
              value="view details"
              onClick={openPendingEnrolDialog}
              data-test-id="expandPenEnrol-menuItem-view-details"
            >
              View Details
            </CustomMenuItem>
            <CustomMenuItem
              value="review-application"
              onClick={() =>
                reviewApplication(
                  Math.random().toString(36).substr(2, 8).toUpperCase()
                )
              }
              data-test-id="expandPenEnrol-menuItem-review-application"
            >
              Review Application
            </CustomMenuItem>
          </CustomMenu>
          <FilterDialog
            filterDialogOpen={filterDialogOpen}
            closeFilterDialog={closeFilterDialog}
            tabValue={value}
          ></FilterDialog>

          <MobileViewDetails
            viewDetailsDialogOpen={viewDetailsDialogOpen}
            closeViewDetailsDialog={closeViewDetailsDialog}
            tabValue={value}
          ></MobileViewDetails>

          <SoMobileViewDetails
            soViewDetailsDialogOpen={soViewDetailsDialogOpen}
            closeSOViewDetailsDialog={closeSOViewDetailsDialog}
            tabValue={value}
          ></SoMobileViewDetails>

          <PendingEnrolDetailsMobile
            viewDetailsDialogOpen={pendingEnrolDialogOpen}
            closeViewDetailsDialog={closePendingEnrolDialog}
            tabValue={value}
          ></PendingEnrolDetailsMobile>
        </Hidden>
      </React.Fragment>
    );
  }
);

export default ServiceRequestsTable;
