import { Dialog, withStyles } from "@material-ui/core";

const CustomDialogComponent = withStyles({
    root: {
        // width: "100%",
        // minHeight: '600px',
        // marginBottom: "20px",
        // "& label.Mui-focused": {
        //   color: "green",
        // },
        // "& .MuiInput-underline:after": {
        //   borderBottomColor: "green",
        // },
        "& .MuiDialog-paperWidthSm": {
            minWidth: "600px",
            maxHeight:"100%"

            //   "& fieldset": {
            //     borderColor: "red",
            //   },
            //   "&:hover fieldset": {
            //     borderColor: "yellow",
            //   },
            //   "&.Mui-focused fieldset": {
            //     borderColor: "green",
            //   },
        },
        "&.MuiDialog-paperWidthXs": {
            minHeight: '100%',
        },
        "& .MuiDialogActions-root": {
            justifyContent: "center",
            // minHeight: '600px',
        },
    },
})(Dialog);

export default CustomDialogComponent;
