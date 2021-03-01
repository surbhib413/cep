import React from "react";
import styles from "./MobileSearchHeader.module.scss";
import { Typography, Container, InputBase } from "@material-ui/core";

const SearchIcon = "/dealer_Icon_Search.svg";
const filterIcon = "/dealer_filter_Icon.svg";

const MobileSearchHeader = (props: any) => {
  const { openFilterDialog } = props;
  const handleSearch = (event: React.FocusEvent<HTMLInputElement>): void => {
    props.parentSearchCallback(event.target.value);
  };

  const handleEmptySearch = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    //console.log("typed input", event.target.value);
    if (event.target.value.length === 0) {
      props.parentSearchCallback(event.target.value);
    }
  };

  return (
    <Container className={`p-0 align-items-center ${styles.appBarContainer}`}>
      <div className="d-flex align-items-center justify-content-between pt-2 m-1">
        <div
          className={`d-flex align-items-center mx-3 ${styles.searchContainer}`}
        >
          <img
            src={SearchIcon}
            alt="Search Icon"
            className={`${styles.cursorPointer}`}
            data-test-id="assisted-search-icon"
          ></img>
          <InputBase
            placeholder="Search by Application no./Mobile no./Email ID"
            inputProps={{ "aria-label": "search" }}
            className={styles.searchTextInput}
            onBlur={handleSearch}
            onInput={handleEmptySearch}
            data-test-id="assisted-search-txt"
          />
        </div>
        <div className={`d-flex align-items-center`}>
          <div
            className={`d-flex align-items-center mx-3 ${styles.cursorPointer}`}
            onClick={openFilterDialog}
            data-test-id="assisted-filter-div"
          >
            <img
              src={filterIcon}
              alt="Filter Icon"
              data-test-id="assisted-filter-img"
            ></img>
            <Typography
              className={`ml-2 ${styles.labelStyle}`}
              data-test-id="assisted-filter-lbl"
            >
              Filter
            </Typography>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MobileSearchHeader;
