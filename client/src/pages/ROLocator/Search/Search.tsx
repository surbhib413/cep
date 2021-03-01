import React, { useState, useEffect, useRef, createRef, Fragment } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
    Button, Typography,
} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import { CustomMenu, CustomMenuItem } from "../../../components/CustomMenu/CustomMenu";
import { BorderColor } from '@material-ui/icons';
import { isTaggedTemplateExpression } from 'typescript';
import { toLower } from 'lodash';
// import { CustomMenuItem } from "../../components/CustomMenu/CustomMenu";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { getROLocations } from '../../../lib/api/roLocator/getROLocations';
import { ContactsOutlined } from '@material-ui/icons';
const googleDirectionIcon = "googleDirectionIcon.svg";
const searchIcon = "/rolocator/search.svg";
const petrolPumpIcon = "/rolocator/petrolPump_icon.svg";
const defaultIcon = "/rolocator/location_Icon.svg"


type SearchProps = {
    map?: google.maps.Map<Element>;
    scriptLoaded: boolean;
    onSearchSelectedListner: Function;
    onSearchResultsListner?: Function;
    onNearbyPlacesListner: Function;
    disableDirectionBtn?: boolean;
    placeholder?: string;
    onDirectionBtnClickListner?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    searchBoxText?: string;
    currentLocation?: GeolocationPosition;
    filterParameters: string;
    onClickDetailView: Function;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: "#FFF",
            border: "solid 1px #cddae0",
            boxShadow: "none",
            borderRadius: "3px"
        },
        searchContainer: {
            position: 'relative',
        },
        searchSuggestionsBox: {
            position: "absolute",
            backgroundColor: "#fff",
            zIndex: 10,
            right: "0",
            left: "0",
            boxShadow: "0 5px 15px 0 rgba(0, 0, 0, 0.08)",
            borderRadius: "3px",
            "&:after": {
                zIndex: 10,
                fontWeight: "normal",
                border: "6px solid transparent",
                BorderColor: "#fff transparent transparent transparent",
            }
        },
        searchLists: {
            fontSize: "14px",
            color: "#354463",
            margin: "0",
            padding: "0",
            backgroundColor: "transparent",
            "&:hover": {
                backgroundColor: "transparent",
                color: "#354463",
                fontWeight: "normal",
            }
        },
        input: {
            marginLeft: '16px',
            flex: 1,
            border: "0px solid",
            "&:focus": {
                outline: "none",
            },
        },
        listContainer: {
            display: "flex",
            padding: "8px 8px",
        },
        placeIcon: {
            width: "20px",
            height: "20px",
            color: "#97a2a8",
            marginRight: "10px",
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: '4px 0px',
        },
        btnWidth: {
            minWidth: 40
        }
    }),
)

export default function Search({ currentLocation, placeholder, scriptLoaded, searchBoxText, onSearchSelectedListner, onDirectionBtnClickListner, disableDirectionBtn, onSearchResultsListner, onNearbyPlacesListner, map, filterParameters, onClickDetailView}: SearchProps) {
    const classes = useStyles();
    const [searchText, setSearchText] = useState<string>('');
    const autoCompleteRef: any = createRef();
    let autoComplete: google.maps.places.Autocomplete;
    let autoCompleteService: google.maps.places.AutocompleteService;
    const [open, setOpen] = React.useState(false);
    const [searchList, setSearchList] = useState<Array<any>>([]);

    /************************* Places Script Load Triggering ************************************/

    useEffect(() => {
        if (scriptLoaded) {
            // initGoogleAutocomplete();
        }
    }, [scriptLoaded]);

    useEffect(() => {
        if (searchBoxText) {
            setSearchText(searchBoxText)
        } else if (searchBoxText == "") {
            setSearchText("")
        }
    }, [searchBoxText]);

    /************************* INIT Google Autocomplete ************************************/

    // const initGoogleAutocomplete = () => {
    //     const options = {
    //         componentRestrictions: { country: "in" },
    //         fields: ["all"],
    //         strictBounds: false,
    //         types: ["establishment","post"],
    //     };
    //     autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, options);
    //     google.maps.event.clearInstanceListeners(autoCompleteRef.current);
    //     autoComplete.getPlace();
    //     autoComplete.addListener("place_changed", () =>
    //         handleAutocompleteSearchSelect()
    //     );
    //     autoCompleteService = new google.maps.places.AutocompleteService();
    // }

    const currentLocationLoad = async () => {
        if (scriptLoaded && currentLocation && !searchBoxText) {
            onSearchSelectedListner([{ geometry: { location: new window.google.maps.LatLng(currentLocation?.coords.latitude, currentLocation?.coords.longitude) } }], 'Current location')
            setSearchList([]);
        }
    }

    useEffect(() => {
        currentLocationLoad();
    }, [scriptLoaded, currentLocation])

    /************************* SEARCH LISTNERS ************************************/

    // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSearchText(event.target.value);
    // autoCompleteService = new google.maps.places.AutocompleteService();
    // autoCompleteService.getPlacePredictions({
    //     input: event.target.value,
    //     componentRestrictions: { country: "in" },
    //     types: ["establishment"],
    // }, (data) => {
    //     setSearchList(data);
    // });
    // }


    /************************* SEARCH LISTNERS ************************************/

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpen(true);
        setSearchText(event.target.value);
        if (event.target.value === "") {
            setSearchList([]);
        }
        else {
            autoCompleteService = new google.maps.places.AutocompleteService();
            autoCompleteService.getPlacePredictions({
                input: event.target.value,
                componentRestrictions: { country: "in" },
                types: ["establishment", "geocode"],

            }, (data) => {
                setSearchList(data);
            });
        }
    };

    // const handleAutocompleteSearchSelect = async () => {
    //     const addressObject = autoComplete.getPlace();
    //     const text = addressObject?.formatted_address;
    //     setSearchText(text as string);
    //     let placeData: Array<any> = [addressObject];
    //     onSearchSelectedListner(placeData,text)

    //     if (placeData.length != 0) {
    //         let nearby = new window.google.maps.places.PlacesService(document.createElement('div'))

    //         let roData = await getROLocations(placeData[0].geometry.location.lat(), placeData[0].geometry.location.lng(), filterParameters);
    //         onNearbyPlacesListner(roData.pointOfServices, placeData[0].geometry.location.lat(), placeData[0].geometry.location.lng());

    //         nearby.nearbySearch({
    //             location: placeData[0].geometry.location,
    //             radius: 2000,
    //             type: 'gas_station',
    //             keyword: 'Bharat Petroleum'
    //         }, (data: any) => {
    //             // onNearbyPlacesListner(addGeoLoc(data, roData.retailOutlets), placeData[0].geometry.location.lat(), placeData[0].geometry.location.lng());
    //         })
    //     }
    // }

    const selectPlace = (list: any, isFromSearchButton: string) => {
        if(scriptLoaded){
            const placesService = new google.maps.places.PlacesService(document.createElement('div'));
                placesService.getDetails({
                    placeId: isFromSearchButton ? searchList[0]?.place_id : list?.place_id
                }, async (placeDetail: google.maps.places.PlaceResult) => {
                    if (placeDetail?.geometry) {
                        // let lat: number = placeDetail?.geometry?.location.lat();
                        // let lng: number = placeDetail?.geometry?.location.lng();
                        // let roData = await getROLocations(lat,lng, filterParameters);
                        // onNearbyPlacesListner(roData.pointOfServices, placeDetail.geometry.location.lat(), placeDetail.geometry.location.lng());
                        
                        onClickDetailView(false);
                        setSearchText(placeDetail.formatted_address as string);
                        onSearchSelectedListner([placeDetail], placeDetail.formatted_address)
                        setSearchList([]);
                    }
                })
        }
    }
    /****************** To set the Icon on suggestion List ***************/
    const setIconType = (list: any) => {
        const isGasStation = list.types.includes("gas_station");
        if (isGasStation) {
            return <img className={classes.placeIcon} src={petrolPumpIcon} alt="requestSentImg" />;
        }
        else {
            return <img className={classes.placeIcon} src={defaultIcon} alt="requestSentImg" />;
        }
    }
    /*********** Function to Show highligted Text in Suggestions List ***************/
    const showSuggestionList = (str: any) => {
        let inputText = searchText && searchText;
        return str.replace(new RegExp(inputText, "gi"),(match:string) => `<b>${match}</b>`);
    }
    const createMarkup = (html : string) => {
        return { __html : html }
    }

    const handleClickAway = () => {
        setOpen(false);
    };

    return (
        <div className={classes.searchContainer}>
            <div className={classes.root}>
                <input
                    className={classes.input}
                    ref={autoCompleteRef}
                    autoComplete="off"
                    onChange={handleSearch}
                    // onKeyUp={keyUpHandler}
                    placeholder={placeholder}
                    value={searchText as string}
                    id="autocomplete"
                    disabled={!scriptLoaded}
                />
                <Button className={`p-0 ${classes.btnWidth}`} onClick={() => selectPlace("", "isFromSearchButton")}>
                    <img
                        src={searchIcon}
                        className={classes.iconButton}

                    />
                </Button>
                {!disableDirectionBtn && onDirectionBtnClickListner ? <>
                    <Divider className={classes.divider} orientation="vertical" />
                    <Button className={`p-0 ${classes.btnWidth}`} onClick={onDirectionBtnClickListner}>
                        <img className={'p-0'}
                            src={googleDirectionIcon}
                        />
                    </Button>

                </> : null}
            </div>
            {/* Display Suggestion List */}
            <ClickAwayListener
                onClickAway={handleClickAway}
            >
                <div className={classes.searchSuggestionsBox}>
                    {open ? (
                        <Fragment>
                            {searchList && searchList.map((list: any, index: number) => {
                                return (
                                    <div className={classes.listContainer}>
                                        {setIconType(list)}
                                        <CustomMenuItem className={classes.searchLists} key={list.description} value={list.description} onClick={() => selectPlace(list, "")}>
                                            {/* {list.description} */}
                                            <Typography dangerouslySetInnerHTML={createMarkup(showSuggestionList(list.description))} />                                            {/* {} */}
                                        </CustomMenuItem>
                                    </div>
                                )
                            })}
                        </Fragment>
                    ) : null}
                </div>
            </ClickAwayListener>
        </div>
    );
}
