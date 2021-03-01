import React, { useEffect, useRef, useState, MouseEvent } from "react";
import {
  Grid,
  Typography,
  Hidden,
  Container,
  Paper,
  FormControlLabel,
  Radio,
  Button,
  Tabs,
  Tab,
  ButtonGroup,
  Checkbox
} from "@material-ui/core";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import styles from "./ROLocator.module.scss";
import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { useRouter } from "next/router";
import Map from "./Map";
import { Link } from "react-router-dom";
import Search from "./Search/Search";
import Direction from "./Search/Direction";

import StartEndDirectionSearch from "./StartEndDirectionSearch";

import ListView from './List/ListView/ListView';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { concat, filter, toString } from "lodash";
import { ROLocatorFilter } from "./Filter/ROLocatorFilter";
import PetrolPumpList from './List/PetrolPumpList';
import {getROLocations} from '../../lib/api/roLocator/getROLocations';
import SearchDetail from "./SearchDetail/SearchDetail";
import {getFuelStationBetweenPointAandB} from '../../lib/api/roLocator/getFuelStationBetweenPointAandB';
import {getNonTopFilter, getTopFilter} from './List/ListView/ListFilter/getFilterTypes';
const locationImg = "/rolocator/location.svg";
const backImg = "/rolocator/back.svg";
const FilterIcon = "/filter.svg"

const CustomAccordion = withStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f9fbff",
      //marginBottom: 8,
      "@media (max-width:600px)": {
        //marginBottom: 4,
      },
      position: "inherit",
      //
      // border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      // '&:not(:last-child)': {
      //   borderBottom: 0,
      // },
      // '&:before': {
      //   display: 'none',
      // },
      "&$expanded": {
        margin: 0,
      },
    },
    expanded: {},
  })
)((props: any) => <Accordion {...props}></Accordion>);

const CustomAccordionSummary = withStyles((theme: Theme) =>
  createStyles({
    root: {
      //backgroundColor: "#eff3fa",
      minHeight: 40,
      //position: "sticky",
      //zIndex: 20,
      //top: 56,
      "@media (min-width:600px)": {
        borderRadius: 4,
        // top: 295,
      },
      "&$expanded": {
        minHeight: 50,
      },
    },
    content: {
      margin: 0,
      "&$expanded": {
        margin: 0,
      },
    },
    expanded: {},
  })
)((props: any) => <AccordionSummary {...props}></AccordionSummary>);

const CustomAccordionDetails = withStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "0px 0px",
    },
  })
)((props: any) => <AccordionDetails {...props}></AccordionDetails>);


const ROLocator = (props: any): JSX.Element => {
  const [expanded, setExpanded] = React.useState<any>(false);
  const [cardStatus, setCardStatus] = React.useState<Array<any>>([]);
  const [currentLocation, setCurrentLocation] = React.useState<GeolocationPosition>();
  const [currentLocationAddress, setCurrentLocationAddress] = React.useState<string>();
  const [currentLocationError, setCurrentLocationError] = React.useState<GeolocationPositionError>();

  const [listView, setListView] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [places, setPlaces] = useState([]);
  const [map, setMap] = React.useState<google.maps.Map<Element>>();
  const [selectedLatLng, setSelectedLatLng] = React.useState<google.maps.LatLng>();
  const [directionStartLatLng, setdirectionStartLatLng] = React.useState<google.maps.LatLng>();
  const [directionEndLatLng, setdirectionEndLatLng] = React.useState<google.maps.LatLng>();
  const [isDirectionEnabled, setisDirectionEnabled] = React.useState<boolean>();

  const [searchText, setSearchText] = React.useState<string>();
  const [startSearchText, setStartSearchText] = React.useState<string>();
  const [endSearhText, setEndSearchText] = React.useState<string>();
  const [detailView, setDetailView] = useState(false);
  const [filterParameters, setFilterParameters] = useState("");
  const [details, setDetails] = useState();
  let displayFilter = 3;

  // For Getting and Setting Location Permission of Browser 
  useEffect(() => {
    handleLocationPermmision();
    console.log('This is the initial data for roLocator............', props.response.data);
  }, []);

  // useEffect for loading google map javscript api script tag
  useEffect(() => {
    if (!window.google) {
      let mapScriptTag: HTMLScriptElement = document.createElement('script');
      mapScriptTag.type = 'text/javascript';
      mapScriptTag.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASwAb2leunIAzAmtYnpShW23JP7N7KZrc&libraries=places,geometry`;
      mapScriptTag.id = 'google-map-id'
      let x = document.getElementsByTagName('script')[0];
      x.parentNode!.insertBefore(mapScriptTag, x);
      mapScriptTag.addEventListener('load', e => {
        setScriptLoaded(true)
      })
    } else {
      setScriptLoaded(true)
    }

    return () => {
      if (!listView) {
        let scriptToDelete: HTMLScriptElement = document.getElementById("google-map-id") as HTMLScriptElement;
        scriptToDelete?.parentNode!.removeChild(scriptToDelete);
      }
    }
  }, [])

  const handleLocateMeClick = (event: any) => {
    // if (currentLocation && map) {
    //   if(isDirectionEnabled){
    //     map.panTo(new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude));
    //   }else{
    //     if(directionStartLatLng){
    //       map.panTo(directionStartLatLng);
    //       map.setZoom(10);
    //     }else{
    //       setSelectedLatLng(new google.maps.LatLng({ lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude }));
    //     }
    //   }
    // } else {
    //   handleLocationPermmision();
    // }
    handleLocationPermmision();
  }

  /********************  FILTER ******************************/

  const handleAccordianExpand = (panel: any) => (
    event: any,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
  };

  const filterUrl = async (cardStatus : any) => {
    let filterCategory :any;
    let value : any;
    let isNewCategory = true;
    let filterParameter = ""
    if(cardStatus) {
    cardStatus.map((item: any) => {
        value = item.code.slice(0, item.code.indexOf("-"));
        isNewCategory = true;
        if(filterCategory) {
        filterCategory.map((filterobject: any) =>{
          if(filterobject.name === value) {
            isNewCategory = false;
            filterobject.filters.push(item.code.slice(item.code.indexOf("-")+1));
          }
        });
        } else {
          isNewCategory = false;
          if(!(item.code.slice(0, item.code.indexOf("-")) === "topFilter")) {
            filterCategory = [{
              name : value,
              filters : [item.code.slice(item.code.indexOf("-")+1)]
            }]
          }
          
        }
        if(isNewCategory) {
          if(!(item.code.slice(0, item.code.indexOf("-")) === "topFilter")) {
          filterCategory.push({
            name : value,
            filters : [item.code.slice(item.code.indexOf("-")+1)]
          })
          }
        }

    });
    }
    if(filterCategory) {
    filterCategory.map( (filterobject : any) => {
      filterParameter = filterParameter+ "&" + filterobject.name+ "=";
      filterobject.filters.map((checkedValue : any) => {
        filterParameter = filterParameter+checkedValue+",";
      });

      filterParameter = filterParameter.slice(0, filterParameter.length -1 );
    });
    }
    
    setFilterParameters(filterParameter);
    
    // if(selectedLatLng) {
    //   let query = await getROLocations(selectedLatLng.lat(), selectedLatLng.lng(), filterParameter);
    //   if(query.pointOfServices) {
    //     setPlaces(query.pointOfServices);
    //   }
    // }
}

  const handleCardStatusChangeCallback = (
    event: React.ChangeEvent<HTMLInputElement>, value: any
  ) => {
    console.log('This is the value........', value);
    event.persist();
    // event.target.checked
    //   ? setCardStatus((prevState) => concat(prevState, [event.target.name]))
    //   : setCardStatus((prevState) =>
    //     filter(prevState, (item: any) => {
    //       return item != event.target.name;
    //     })
    //   );
    event.target.checked
    ? setCardStatus((prevState) => {
      let currentState = concat(prevState, { code: event.target.name, displayName: value });
      if(event.target.name.slice(0, event.target.name.indexOf("-")) === "topFilter") { 
        let selectedFilter = getNonTopFilter(props.response.data, value);
        if(selectedFilter) {
            currentState = concat(currentState, selectedFilter);
        }
      }
      else {
        let selectedFilter = getTopFilter(props.response.data, value);
        if(selectedFilter) {
            currentState = concat(currentState, selectedFilter);
        }
      }
      filterUrl(currentState);
      return(currentState);
    })
    : setCardStatus((prevState) =>{
    let currentState = filter(prevState, (item: any) => {
        //return item.code != event.target.name;
        return item.displayName != value;
      });
      filterUrl(currentState);
      return(currentState);
    });
  };

  /******************** SEARCH *********************************/

  const onSearch = (nearbyPlaceData: any, latitude: number, longitude : number) => {
    if(nearbyPlaceData) {
      setPlaces(nearbyPlaceData);
    }else {
      setPlaces([]);
    }
    
    // setLatitude(latitude);
    // setLongitude(longitude);
  }

  // Function to get searched data from child component i.e. search.tsx
  const onSearchSelect = (userSearchData: any, searchBoxText: string) => {
    if(searchBoxText == "Current location"){
      setSearchText(currentLocationAddress);
    }else{
      setSearchText(searchBoxText);
    }
    if (userSearchData && userSearchData.length) {
      setSelectedLatLng(userSearchData[0].geometry.location);
    }
  }

  const onEndSearchSelect = async (data: any, searchBoxText: string) => {
    if (data && data.length) {
      // setisDirectionEnabled(true);
      // let resData;
      setDetailView(false);
      setEndSearchText(searchBoxText);
      setdirectionEndLatLng(data[0].geometry.location);
      
    }
  }

  const onStartSearchSelect = async (data: any, searchBoxText: string) => {
    // let resData;
    if (data && data.length) {
      // setisDirectionEnabled(true);
      setDetailView(false);
      setStartSearchText(searchBoxText);
      setdirectionStartLatLng(data[0].geometry.location);
    }
  }

  const interChangeDirections = async () => {
    if (startSearchText === undefined)
    {
      setDetailView(false);
      setisDirectionEnabled(true)
      setdirectionEndLatLng(selectedLatLng);
      setEndSearchText("")
      setStartSearchText(endSearhText);
      setdirectionStartLatLng(directionEndLatLng);
      // setdirectionEndLatLng("");
    }
    else {
        setDetailView(false);
        setisDirectionEnabled(true)
        setdirectionEndLatLng(selectedLatLng);
        setEndSearchText(searchText);
        let startSearch = startSearchText
        setStartSearchText(endSearhText);
        setEndSearchText(startSearch);
        let directionStart = directionStartLatLng;
        setdirectionStartLatLng(directionEndLatLng);
        setdirectionEndLatLng(directionStart);
    }
  }

  const onDirectionBtnClickListner = (event: React.MouseEvent<HTMLButtonElement>) => {
    
    setisDirectionEnabled(true);
   
      setEndSearchText(searchText);
   
        setisDirectionEnabled(true)
        currentLocation && setdirectionStartLatLng(new google.maps.LatLng(currentLocation.coords.latitude,currentLocation.coords.longitude));
        setdirectionEndLatLng(selectedLatLng);
        currentLocationAddress && setStartSearchText(currentLocationAddress)
        setEndSearchText(searchText);
    
  }

  const onHeaderBackBtnClickLister = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDirectionEnabled && listView) {
      setListView(false);
      if (isDirectionEnabled) {
        setEndSearchText(searchText);
        setdirectionEndLatLng(selectedLatLng);
      }
    }else if (isDirectionEnabled && detailView) {
      setDetailView(false);
      setisDirectionEnabled(false);
      setdirectionStartLatLng(undefined);
      setdirectionEndLatLng(undefined);
      setSearchText(endSearhText)
      setSelectedLatLng(directionEndLatLng)
      setStartSearchText("");
      setEndSearchText("");
      setdirectionEndLatLng(undefined);
      setdirectionStartLatLng(undefined)
    }
    else if (isDirectionEnabled) {
      setisDirectionEnabled(false);
      setdirectionStartLatLng(undefined);
      setdirectionEndLatLng(undefined);
      setSearchText(endSearhText)
      setSelectedLatLng(directionEndLatLng)
      setStartSearchText("");
      setEndSearchText("");
      setdirectionEndLatLng(undefined);
      setdirectionStartLatLng(undefined)
    } else if (listView) {
      setListView(false);
      if (isDirectionEnabled) {
        setStartSearchText(searchText);
      }
    } else if (detailView) {
      setDetailView(false);
    }
  }


  useEffect(() => {
    /** API call for calling Routes when ever user enters direction View */
    async function callRouteAPI() {
      if(directionStartLatLng?.lat() && directionStartLatLng?.lng() && directionEndLatLng?.lat() && directionEndLatLng?.lng()) {
        let resData = await getFuelStationBetweenPointAandB(directionStartLatLng?.lat(), directionStartLatLng?.lng(), directionEndLatLng?.lat(), directionEndLatLng?.lng());
        if(resData) {
          if(resData?.pointOfServices) {
            setPlaces(resData.pointOfServices);
          }
          else {
            setPlaces([]);
          }
        }
      }
      // else{
      //   setPlaces([]);
      // }
    }

    if(isDirectionEnabled){
      callRouteAPI();
    }
    
    
  },[isDirectionEnabled,directionStartLatLng,directionEndLatLng])

  useEffect(() => {
    /** API call for calling Routes when ever user enters Search View */
    async function callNearbyPlacesAPI() {
      if (selectedLatLng) {
        let query = await getROLocations(selectedLatLng.lat(), selectedLatLng.lng(), filterParameters);
        if (query.pointOfServices) {
          setPlaces(query.pointOfServices);
        }else{
          setPlaces([]);
        }
      }
    }

    if(!isDirectionEnabled){
      callNearbyPlacesAPI();
    }
  },[isDirectionEnabled,selectedLatLng,filterParameters])

  /********************  MAP ***********************************/

  const onMapLoad = (map: google.maps.Map<Element>) => { /* Listner function from Map.tsx we can customize map object directly over here */
    setMap(map);
  }

  /********************  UTILITY ***********************************/
 
  const handleLocationPermmision = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((data: GeolocationPosition) => {
        setCurrentLocation({ coords : { latitude:19.023011, longitude :  72.871346 }})
        if(scriptLoaded){
          if(!isDirectionEnabled){
            setSelectedLatLng(new google.maps.LatLng(19.023011,72.871346));
            setSearchText(currentLocationAddress);
          }else{
            setdirectionStartLatLng(new google.maps.LatLng(19.023011,72.871346))
            setStartSearchText(currentLocationAddress)
          }
        }
      }, (error: GeolocationPositionError) => {
        setCurrentLocationError(error)
      });
    } else {
      console.log("Location Not available!");
    }
  }


  useEffect(() => {
    if(scriptLoaded){
      if(currentLocation && !currentLocationAddress){
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: new window.google.maps.LatLng(currentLocation?.coords.latitude, currentLocation?.coords.longitude) }, (
          results: google.maps.GeocoderResult[],
          status: google.maps.GeocoderStatus
        ) => {
          if (status === "OK") {
            if (results[0]) {
              setCurrentLocationAddress(results[0].formatted_address);
              setSearchText(results[0].formatted_address)
            } else {
              // No results found
              setCurrentLocationAddress("Current Location");
              setSearchText("Current Location")
            }
          } else {
            // Get Geocoder location Failed
            setCurrentLocationAddress("Current Location");
            setSearchText("Current Location")
          }
        })
      }
    }
  },[scriptLoaded,currentLocation])

  const onClickListView = () => {
    setListView(true);
    if (isDirectionEnabled) {
      setSearchText(endSearhText);
      setSelectedLatLng(directionEndLatLng);
    }
  }

  const onClickMapView = () => {
    setListView(false);
    if (isDirectionEnabled) {
      setEndSearchText(searchText);
      setdirectionEndLatLng(selectedLatLng);
    }
  }

  const onClickDetailView = (status: boolean) => {
    setDetailView(status);
  }

  /** Click Listner for Direction button on List Item */
  const onClickListDirection = (listData : any) => {
    setListView(false)
    if(currentLocation){
      setStartSearchText(currentLocationAddress);
      setdirectionStartLatLng(new google.maps.LatLng(currentLocation?.coords.latitude,currentLocation?.coords.longitude))  
      setEndSearchText(listData.address.line2);
      setdirectionEndLatLng(new google.maps.LatLng(listData.geoPoint.latitude,listData.geoPoint.longitude));
      setisDirectionEnabled(true)
    }
  }

  return (
    <>
      <div className={styles.customSidebar}></div>
      <Container maxWidth="lg" className={`px-0 pr-sm-4`}>
        <Paper>
          <Grid container className={`${styles.roHeader} px-4 mb-3 pt-3`}>
            <div className={styles.top_bar_ro_locater}>
              {isDirectionEnabled || listView || detailView ? <div className={'d-flex flex-row align-items-center'}> <Button className={styles.btnWidth} onClick={onHeaderBackBtnClickLister}>
                <img
                  src={backImg}
                />
              </Button>
                <Typography variant="subtitle2" className="font-weight-normal">Back</Typography>
              </div> : <Typography className={styles.mainHeader}>Find Fuel Stations</Typography>}

              <div className={styles.locationButton}>
                <Button className={`${styles.btnLocation} mr-4`}
                  onClick={handleLocateMeClick}> <img src={locationImg} alt="" /> Locate me</Button>
                <ButtonGroup color="primary" aria-label="primary" className={styles.tabBtngrp} disableElevation >
                  <Button className={`text-capitalize font-weight-bold ${styles.tabBtn}`} onClick={onClickMapView} variant={listView ? 'outlined' : 'contained'}>Map</Button>
                  <Button className={`text-capitalize font-weight-bold ${styles.tabBtn}`} onClick={onClickListView} variant={!listView ? 'outlined' : 'contained'}>List</Button>
                </ButtonGroup>
              </div>
            </div>
          </Grid>
          {
            listView ? <ListView onClickDetailView={onClickDetailView} onClickListDirection={onClickListDirection} places={places} setPlaces={setPlaces} onSearchSelect={onSearchSelect}
              onSearch={onSearch} searchText={searchText} listView={listView}
              initialData={props.response.data}
              globalSelectedFilters = {cardStatus}
              setCardStatus = {setCardStatus}
              filterUrl = {filterUrl}
               filterParameters={filterParameters}/> :
              <div className={styles.root}>
                <Grid container >

                  {/* GRID LEFT */}
                  <Grid item xs={6} sm={6} className="pr-4 pl-4">
                    <div className={`mt-3`}>
                      {isDirectionEnabled ?
                        <Direction onClickDetailView={onClickDetailView} startsearchBoxText={startSearchText} endsearchBoxText={endSearhText} scriptLoaded={scriptLoaded} map={map} onEndSearchSelectedListner={onEndSearchSelect} onStartSearchSelectedListner={onStartSearchSelect} onNearbyPlacesListner={onSearch} interChangeDirections={interChangeDirections} filterParameters={filterParameters} />
                        : <Search  onClickDetailView={onClickDetailView} searchBoxText={searchText} placeholder='Search by name, state, city or pincode' onSearchSelectedListner={onSearchSelect} onNearbyPlacesListner={onSearch} scriptLoaded={scriptLoaded} map={map} onDirectionBtnClickListner={onDirectionBtnClickListner} currentLocation={currentLocation} filterParameters={filterParameters} />}
                    </div>
                    <div className={`${styles.searchGrid}`}>
                      {!isDirectionEnabled ?
                        <>
                          <CustomAccordion
                            className={styles.customAccordion}
                            expanded={expanded === true}
                            onChange={handleAccordianExpand(true)}
                          >
                            <CustomAccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <div className="d-flex flex-row">
                                {
                                  
                                  !expanded ?
                                    cardStatus.map((item: any, index: any) => {
                                      let name;
                                      
                                      item.displayName.length > 10 ? name = item.displayName.slice(0, 10) + ',...' : name = item.displayName
                                      let filterList = null;
                                      if(item.code.slice(0, item.code.indexOf("-")) === "topFilter") {
                                        displayFilter = displayFilter + 1;
                                      } else {
                                      index < displayFilter ?
                                      filterList =(<div className={'d-flex justify-content-start'} key={item.code}>
                                          <Checkbox
                                            className={styles.test}
                                            color="primary"
                                            checked={true}
                                            onChange={props.handleCardStatusChange}
                                            name={item.code}
                                          />
                                          <p title={item.displayName} className={styles.testp}>{name}</p>
                                        </div>)
                                        : null
                                      }
                                      return (
                                        filterList
                                      )
                                    })
                                    : ""
                                }
                              </div>
                              <div className="d-flex ml-auto align-items-center">
                                {
                                  !expanded && cardStatus.length - 3 -(displayFilter -3) > 0 ?
                                    <div className={`d-flex align-items-center justify-content-center ${styles.countStyle}`}>
                                      {`+${cardStatus.length - 3 - (displayFilter -3)}`}
                                    </div>
                                    : null

                                }
                                <img className={`${styles.imageStyle} mr-1`} src={FilterIcon} alt="FilterIcon"></img>
                                <Typography className={styles.filterLabel}>Filter</Typography>
                              </div>
                            </CustomAccordionSummary>
                            <hr className={`${styles.headerDivider}`}></hr>
                            <CustomAccordionDetails>

                              <ROLocatorFilter
                                selectedFilters={cardStatus}
                                handleCardStatusChange={handleCardStatusChangeCallback}
                                initialData={props.response.data}
                              ></ROLocatorFilter>
                            </CustomAccordionDetails>
                          </CustomAccordion>
                          {
                            expanded ? null : <hr className={`${styles.headerDivider}`}></hr>
                          }
                        </> :
                        <hr className={`${styles.headerDivider}  mt-3`}></hr>
                      }
                      { !expanded ? <PetrolPumpList details={details} setDetails={setDetails}  isDirectionEnabled={isDirectionEnabled} currentLocation={currentLocation} list={places} scriptLoaded={scriptLoaded} detailView={detailView} onClickDetailView={onClickDetailView} onClickListDirection={onClickListDirection} selectedLatLng = {selectedLatLng} directionStartLatLng={directionStartLatLng}  /> : null}
                    </div>
                  </Grid>

                  {/* GRID RIGHT => MAP */}
                  <Grid item xs={6} sm={6} className={styles.map}>
                    <Map
                      id="myMap"
                      options={{
                        center: { lat: 20.5937, lng: 78.9629 },
                        zoom: 4,
                        streetViewControl: false,
                        mapTypeControl: false
                      }}
                      onMapLoad={onMapLoad}
                      scriptLoaded={scriptLoaded}
                      selectedLatLng={selectedLatLng}
                      nearbyPetrolPumps={true}
                      places={places}
                      directionStartLatLng={directionStartLatLng}
                      directionEndLatLng={directionEndLatLng}
                      isDirectionEnabled={isDirectionEnabled}
                    />
                  </Grid>
                </Grid>
              </div>
          }
        </Paper>
      </Container>
    </>
  );
};

export default ROLocator;
