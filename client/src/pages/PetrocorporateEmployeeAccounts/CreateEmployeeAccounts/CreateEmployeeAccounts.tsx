import React, { useState } from "react";
import { Container, Paper } from "@material-ui/core";
import styles from "./CreateEmployeeAccounts.module.scss";
// import { useSelector } from "react-redux";
import Header from "./Header/Header";
import BulkUploadBody from "./Body/BulkUpload/BulkUpload";
import Individual from "./Body/Individual/Individual";

const CreateEmployeeAccounts = (props: any): JSX.Element => {
  // const store: any = useSelector((state) => state);
  // console.log(store);
  const [createMode, setCreateMode] = useState("individual");

  const toggleCreateMode = () => {
    if (createMode === "bulk") {
      setCreateMode("individual");
    } else {
      setCreateMode("bulk");
    }
  };

  return (
    <Container maxWidth="lg" className={`px-0 px-sm-4`}>
      <Paper className={`px-3 px-sm-5 py-2 py-sm-3 ${styles.headerPaper}`}>
        <Header
          toggleCreateMode={toggleCreateMode}
          createMode={createMode}
        ></Header>
        {createMode === "bulk" ? (
          <BulkUploadBody></BulkUploadBody>
        ) : (
          <Individual></Individual>
        )}
      </Paper>
    </Container>
  );
};

export default CreateEmployeeAccounts;
