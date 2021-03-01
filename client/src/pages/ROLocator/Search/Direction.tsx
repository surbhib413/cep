import React, { useState, useEffect, useRef, createRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SyncAltOutlinedIcon from '@material-ui/icons/SyncAltOutlined';
import styles from "../ROLocator.module.scss";
import Search from './Search';

const googleDirectionIcon = "googleDirectionIcon.svg";
const webRadioButton = "/Web_radiobutton.svg";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: "100%",
            border: "solid 1px #cddae0",
            boxShadow: "none",
            marginBottom: 16,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
            border: "0px solid",
            "&:focus": {
                outline: "none",
            },
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
        path: {
            borderLeft: "1px dotted black",
            height: 30.6,
            margin: "0px 0px 0 11px",
        },
        directionIcons: {
            display: "flex",
            flexDirection: "column",
            marginLeft: 10,
            marginRight: 10,
        },
        webRadioButton: {
            padding: 0,
            height: 24,
            width: 24,
            color: "#6e7a93",
        },
    }),
)

type DirectionProps = {
    map?: google.maps.Map<Element>;
    scriptLoaded: boolean;
    onNearbyPlacesListner: Function;
    onStartSearchSelectedListner: Function;
    onEndSearchSelectedListner: Function;
    interChangeDirections: Function
    startsearchBoxText?:string;
    endsearchBoxText?: string;
    filterParameters: string;
    onClickDetailView: Function;
};

enum searchTypes {
    START = 'START_Location',
    DESTINATION = 'DESTINATION_location'
}

export default function Direction(props: DirectionProps) {
    const classes = useStyles();
    
    // Function to get searched data from child component i.e. search.tsx
    const onSearchSelect = (type: searchTypes, data :  Array<any>,searchBoxText : string) => {
        console.log("DIREcTION search result ", type, data)
        if(type == searchTypes.START){
            props.onStartSearchSelectedListner(data,searchBoxText);
        }else{
            props.onEndSearchSelectedListner(data,searchBoxText);
        }
    }

    const onSearchNearPlaces = (type: searchTypes, data: Array<any>) => {
        console.log("Gas Stations Present Nerby ", type,  data)
        props.onNearbyPlacesListner(data);
    }
    
    return (

        <div className='d-flex align-items-center'>
            <div className={classes.directionIcons}>
                <img
                    src={webRadioButton}
                    className={`mb-1 ${classes.webRadioButton}`}
                    alt=""
                />
                <span className={classes.path}></span>
                <IconButton type="submit" className={`mt-1 ${classes.webRadioButton}`} aria-label="search">
                    <LocationOnOutlinedIcon />
                </IconButton>
            </div>
            <div className='mr-2 ml-2 w-100'>
                <div className='mb-1'>
                    <Search {...props} searchBoxText={props.startsearchBoxText} disableDirectionBtn={true} onSearchSelectedListner={(data :  Array<any>,searchBoxText : string) => onSearchSelect(searchTypes.START,data,searchBoxText)} onNearbyPlacesListner={(data :  Array<any>) => onSearchNearPlaces(searchTypes.START,data)} placeholder="Search by name, state, city or pincode" filterParameters={props.filterParameters}/>
                </div>
                <div className='mt-1'>
                    <Search {...props}  searchBoxText={props.endsearchBoxText} disableDirectionBtn={true} onSearchSelectedListner={(data :  Array<any>,searchBoxText : string) => onSearchSelect(searchTypes.DESTINATION,data,searchBoxText)} onNearbyPlacesListner={(data :  Array<any>) => onSearchNearPlaces(searchTypes.DESTINATION,data)} placeholder="Search by name, state, city or pincode" filterParameters={props.filterParameters}/>
                </div>
            </div>
            <div className={classes.directionIcons}>
                <IconButton type="submit" className={`${styles.webRadioButtonArrow}`} aria-label="search" onClick={() => props.interChangeDirections()}>
                    <SyncAltOutlinedIcon />
                </IconButton>
            </div>
        </div>
    );
}
