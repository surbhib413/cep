import React, { useState } from "react";
import { Grid, Typography, Hidden, Container, Paper } from "@material-ui/core";
import styles from "./PetrocorporateEmployeeAccounts.module.scss";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const PetrocorporateEmployeeAccounts = (props: any): JSX.Element => {
  const router = useRouter();
  const store: any = useSelector((state) => state);
  // console.log(store);

  const handleRedirectToCreateEmployeeAccounts = () => {
    router.push("/petrocorp/employee-accounts/create");
  };

  return (
    <>
      <Container maxWidth="lg" className={`px-0 px-sm-4`}>
        <Paper className={`px-3 px-sm-5 py-2 py-sm-3 ${styles.headerPaper}`}>
          <div
            className={`${styles.cursorPointer} `}
            onClick={handleRedirectToCreateEmployeeAccounts}
          >
            Create Employee Accounts
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default PetrocorporateEmployeeAccounts;
