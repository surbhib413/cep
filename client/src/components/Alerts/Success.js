import Alert from "@material-ui/lab/Alert";
import React from "react";

function Success({children,open,...props}) {
  return (
    open ? <Alert
      style={{
        color: "#008e65",
        margin: "1rem 0px",
        backgroundColor: "#a5efd9",
        fontSize: "14px",
      }}
      severity="success"
      {...props}
    >
      {children}
    </Alert> : null
  );
}

export default Success;
