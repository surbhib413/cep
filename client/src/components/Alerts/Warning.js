import Alert from "@material-ui/lab/Alert";
import React from "react";

function Warning({ children,open, ...props }) {
  return (
    open?<Alert
      style={{
        color: "#e21e1e",

        backgroundColor: "#ffd1d1",
        fontSize: "14px",
      }}
      severity="error"
      {...props}
    >
      {children} 
    </Alert>:null
  );
}

export default Warning;
