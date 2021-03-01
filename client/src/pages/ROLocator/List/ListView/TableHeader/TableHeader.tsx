import React, { useEffect, useRef, useState } from "react";
import styles from "./TableHeader.module.scss";
import { Typography, Container, InputBase } from "@material-ui/core";
import Search from '../../../Search/Search';

const SearchIcon = "/dealer_Icon_Search.svg";
const sliderIcon = "/dealer_slider_Icon.svg";
const filterIcon = "/dealer_filter_Icon.svg";
const downloadIcon = "/dealer_download_Icon.svg";
const disableSliderIcon = "/disable_dealer_slider.svg";

const TableHeader = (props: any) => {

  const [isSearch, setIsSearch] = useState("");
  //const [places, setPlaces] = useState([]);
  const [selectedLatLng, setSelectedLatLng] = React.useState<google.maps.LatLng>();
  const [scriptLoaded, setScriptLoaded] = useState(true);
  const [map, setMap] = React.useState<google.maps.Map<Element>>();

  const { //openFilterDialog, 
    openCustomiseTableDialog } = props;
  const handleSearch = (event: React.FocusEvent<HTMLInputElement>): void => {
    //props.parentSearchCallback(event.target.value);
  };

  const handleEmptySearch = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    if (event.target.value.length === 0) {
      //props.parentSearchCallback(event.target.value);
    }
  };

  const onSearch = (query: any) => {
    console.log("Gas Stations in Parent")
    props.setPlaces(query);
  }

    // Function to get searched data from child component i.e. search.tsx
    const onSearchSelect = (userSearchData: any, searchBoxText : string) => {
      if (userSearchData && userSearchData.length) {
        setIsSearch(userSearchData);
        // setSelectedLatLng(new google.maps.LatLng(userSearchData[0].geometry.latitude,userSearchData[0].geometry.longitude))
        setSelectedLatLng(userSearchData[0].geometry.location);
  
      }
    }
  

  return (
    <Container 
        className={`p-0 align-items-center ${styles.appBarContainer}`}
        >
      <div 
      className={`d-flex align-items-center justify-content-between ${styles.search}`}
      >
          
        <div
          className={`d-flex align-items-center mx-3 ${styles.searchContainer}`}
        >
          {/* <Search placeholder="Search by name, state, city or pincode" disableDirectionBtn={true} onSearchSelectedListner={onSearchSelect} onNearbyPlacesListner={onSearch} scriptLoaded={scriptLoaded} map={map} /> */}

          <Search onClickDetailView={props.onClickDetailView} searchBoxText={props.searchText} onSearchSelectedListner={props.onSearchSelect} onNearbyPlacesListner={props.onSearch} placeholder="Search by name, state, city or pincode" disableDirectionBtn={true} scriptLoaded={scriptLoaded} map={map} filterParameters={props.filterParameters} />
        </div>
        <div className={`d-flex align-items-center`}
        >
          
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
          

          <div
            className={`d-flex align-items-center mx-3 ${styles.cursorPointer}`}
            onClick={props.openFilterDialog}
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
        </div>
      </div>
    </Container>
  );
};

export default TableHeader;
