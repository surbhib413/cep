import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import {
  Typography,
  withStyles,
  createStyles,
  Theme,
  WithStyles,
  Grid,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import scssStyles from "./MobileViewDetails.module.scss";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const rectangleTop = "/rectangle_top.svg";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      // padding: theme.spacing(5),
    },
    title: {
      fontWeight: "bold",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(5),
      top: theme.spacing(3),
      color: theme.palette.grey[500],
      "&:focus": {
        outline: "none",
      },
    },
  });

const CustomFilter = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiDialogContent-root": {
        overflowY: "unset",
        padding: "8px 16px",
        //height: showCalendar ? "505px" : "max-content"
      },
      "& .MuiDialog-scrollPaper": {
        alignItems: "flex-end"
      },
      "& .MuiDialog-paper": {
        margin: "0px"
      },
      "& .MuiDialog-paperFullWidth": {
        width: "100%"
      },
      "& .MuiDialog-paperScrollPaper": {
        maxHeight: "48%",
        height: "48%",
        marginTop: "8%"
      },
      "& .MuiDialogTitle-root": {
        padding: "0px 0px 0px 15px"
      },
      "& .MuiIconButton-root": {
        right: "10px !important",
        paddingBottom: "0px !important"
      },
      "& .MuiDialogActions-root": {
        padding: "16px",
      },
      "& .MuiButton-root": {
        width: "100%"
      }

    },
  })
)(Dialog);

const CustomGrid = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > .MuiGrid-item": {
        padding: "10.5px !important",
      }
    },
  })
)(Grid);

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h3" color="primary" className={classes.title}>
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

export default function SoMobileViewDetails(props: any) {
  const { soViewDetailsDialogOpen, closeSOViewDetailsDialog } = props;
  return (
    <CustomFilter
      open={soViewDetailsDialogOpen}
      onClose={closeSOViewDetailsDialog}
      aria-labelledby="filter-table-dialog"
      fullWidth={true}
      maxWidth="md"
    >
      <img src={rectangleTop} alt="icon" className={`pt-3 ${scssStyles.imageStyle}`} />
      <div className="pt-4">
        <DialogTitle id="filter-table-dialog" onClose={closeSOViewDetailsDialog}>
          Details
        </DialogTitle>
        <DialogContent>
          <div className={`d-flex mt-2 justify-content-around`}>
            <CustomGrid container spacing={2} >
              <CustomGrid item xs={5}>
                <span className={`${scssStyles.colLabels}`}>Application ID </span>
              </CustomGrid>
              <CustomGrid item xs={7}>
                <span className={`${scssStyles.colValues} ${scssStyles.blueText}`}>AEQI1568</span>
              </CustomGrid>
              <CustomGrid item xs={5}>
                <span className={`${scssStyles.colLabels}`}>Application Date </span>
              </CustomGrid>
              <CustomGrid item xs={7}>
                <span className={`${scssStyles.colValues}`}>31/07/2020</span>
              </CustomGrid>
              <CustomGrid item xs={5}>
                <span className={`${scssStyles.colLabels}`}>Organization Name </span>
              </CustomGrid>
              <CustomGrid item xs={7}>
                <span className={`${scssStyles.colValues}`}>ABC Corporation</span>
              </CustomGrid>
              <CustomGrid item xs={5}>
                <span className={`${scssStyles.colLabels}`}>Customer Name</span>
              </CustomGrid>
              <CustomGrid item xs={7}>
                <span className={`${scssStyles.colValues}`}>John Doe</span>
              </CustomGrid>
              <CustomGrid item xs={5}>
                <span className={`${scssStyles.colLabels}`}>KYC Status</span>
              </CustomGrid>
              <CustomGrid item xs={7}>
                {props.tabValue === 0 ?
                  <div className={`d-flex align-items-center justify-content-center ${scssStyles.pendingRectangle}`}>
                    <span className={`${scssStyles.colValues}`}>PENDING APPROVAL</span>
                  </div>
                  :
                  <div className={`d-flex align-items-center justify-content-center ${scssStyles.approvedRectangle}`}>
                    <span className={`${scssStyles.colValues}`}>APPROVED</span>
                  </div>
                }
              </CustomGrid>
            </CustomGrid>
          </div>
        </DialogContent>
      </div>
    </CustomFilter>
  );
}
