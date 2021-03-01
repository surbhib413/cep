import React from "react";
import styles from "./TableHeader.module.scss";
import { Typography, Container, InputBase } from "@material-ui/core";

const SearchIcon = "/dealer_Icon_Search.svg";
const sliderIcon = "/dealer_slider_Icon.svg";
const filterIcon = "/dealer_filter_Icon.svg";
const downloadIcon = "/dealer_download_Icon.svg";
const disableSliderIcon = "/disable_dealer_slider.svg";

const TableHeader = (props: any) => {
  const { openFilterDialog, openCustomiseTableDialog } = props;
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
          {props.tabValue === 1 ? (
            <div className={`d-flex align-items-center mx-3 `}>
              <img src={disableSliderIcon} alt="disableSliderIcon"></img>
              <Typography className={`mx-2 ${styles.disableLabelStyle}`}>
                Customize Table
              </Typography>
            </div>
          ) : (
            <div
              className={`d-flex align-items-center mx-3 ${styles.cursorPointer}`}
              onClick={openCustomiseTableDialog}
              data-test-id="assisted-slider-div"
            >
              <img
                src={sliderIcon}
                alt="sliderIcon"
                data-test-id="assisted-slider-icon"
              ></img>
              <Typography
                className={`mx-2 ${styles.labelStyle}`}
                data-test-id="assisted-slider-lbl"
              >
                Customize Table
              </Typography>
            </div>
          )}

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
              className={`mx-2 ${styles.labelStyle}`}
              data-test-id="assisted-filter-lbl"
            >
              Filter
            </Typography>
          </div>

          <div
            className={`d-flex align-items-center mx-3 ${styles.cursorPointer}`}
            data-test-id="assisted-download-div"
          >
            <img
              src={downloadIcon}
              alt="Download Icon"
              data-test-id="assisted-download-icon"
            ></img>
            <Typography
              className={`mx-2 ${styles.labelStyle}`}
              data-test-id="assisted-download-lbl"
            >
              Download PDF
            </Typography>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TableHeader;
