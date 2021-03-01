
import React, { useState, useEffect } from "react";
import styles from './PetrolPumpList.module.scss';
import SearchDetail from "../SearchDetail/SearchDetail";
const backImg = "/rolocator/W_Icon_Web.svg";

const PetrolPumpList = (props: any): JSX.Element => {
    const pageSize = 5;
    const [distance, setDistance] = useState<Array<any>>([]);;
    const [displayList, setDisplayList] = useState([]);
    const [prevButton, setPrevButton] = useState(false);
    const [origin, setOrigin] = useState({});
    const [nextButton, setNextButton] = useState(() => {
        let status;
        if (props.list.length > pageSize) {
            status = true;
        }
        else {
            status = false;
        }
        return status;
    });
    const [startingNumber, setStartingNumber] = useState(0);
    const [endingNumber, setEndingNumber] = useState(() => {
        let number;
        if (props.list.length > pageSize) {
            number = pageSize;
        }
        else {
            number = props.list.length;
        }
        return number;
    }
    );

    //const [details, setDetails] = useState();

    const nextPage = () => {
        setDisplayList(props.list.slice(startingNumber + pageSize, endingNumber + pageSize));
        setStartingNumber(startingNumber + pageSize);
        if (props.list?.length > endingNumber + pageSize) {
            setEndingNumber(endingNumber + pageSize)
        }
        else {
            setEndingNumber(props.list.length);
        }
        if (!prevButton) {
            setPrevButton(true);
        }
        if (props.list?.length <= endingNumber + pageSize) {
            setNextButton(false);
        }

    }

    const prevPage = () => {
        if (startingNumber - pageSize === 0) {
            setPrevButton(false);
        }
        if (!nextButton) {
            setNextButton(true);
        }

        setDisplayList(props.list.slice(startingNumber - pageSize, endingNumber - (endingNumber - startingNumber)));
        setStartingNumber(startingNumber - pageSize);
        setEndingNumber(endingNumber - (endingNumber - startingNumber))


    }

    const toggleView = (data: any, distance: string) => {
        let detailView = !props.detailView;
        // setHideResults(detailView);
        data ? props.setDetails( {
            ...data,
            distance: distance
        }) : null;
        console.log('I got clicked..............');
        props.onClickDetailView(detailView);
    }
    useEffect(() => {
        //getDirection("", props.searchText);
    },[displayList]);


    const getDirection = (desLat : any, desLng : any, srcLat: any, srcLng : any)=> {

        //     //origin: "Grand Southern Trunk Rd, Meenambakkam, Chennai, Tamil Nadu 600027, India",
        //     //destination: "Chennai, Kannappar Thidal, Periyamet, Chennai, Tamil Nadu 600003, India",

        if(distance.length < pageSize) {
        
        const service = new google.maps.DistanceMatrixService();
                                    service.getDistanceMatrix(
                                        {
                                            origins: [``+srcLat+`,`+srcLng+``],
                                            destinations: [``+desLat+`,`+desLng+``],
                                            travelMode: google.maps.TravelMode.DRIVING,
                                            unitSystem: google.maps.UnitSystem.METRIC,
                                            avoidHighways: false,
                                            avoidTolls: false,
                                        },
                                        (response, status) => {
                                            let distance:String;
                                            if (status == 'OK') {
                                                distance = response.rows[0].elements[0].distance.text;
                                            }
                                            else {
                                                distance = "";
                                            }
                                            
                                            console.log("DIRECTION MATRIX ",response);
                                            setDistance((previousState) => {
                                                previousState.push(distance);
                                                return previousState;
                                            })
 
                                        });
        }
                                      
    }

    useEffect(() => {
        if(props.scriptLoaded && (props.currentLocation||props.selectedLatLng)){
            const service = new google.maps.DistanceMatrixService();
            setDistance([]);
            let origin : any;
            if(props.isDirectionEnabled && props.directionStartLatLng) {
                origin = [`` + props.directionStartLatLng.lat() + `,` + props.directionStartLatLng.lng() + ``]
                setOrigin({
                    lat : props.directionStartLatLng.lat(),
                    lng : props.directionStartLatLng.lng()
                })
            }
            else if(props.currentLocation || props.selectedLatLng) {
                if(props.selectedLatLng) {
                    origin = [`` + props.selectedLatLng.lat() + `,` + props.selectedLatLng.lng() + ``]
                    setOrigin({
                        lat : props.selectedLatLng.lat(),
                        lng : props.selectedLatLng.lng()
                    })
                } else {
                    setOrigin({
                        lat : props.currentLocation.coords.latitude,
                        lng : props.currentLocation.coords.longitude
                    })
                    origin = [`` + props.currentLocation.coords.latitude + `,` + props.currentLocation.coords.longitude + ``]
                }
            }
            
            displayList.forEach((listItem : any,index) => {
                
                if(origin !== ['undefined,undefined']) { 

                service.getDistanceMatrix(
                    {
                        origins: origin,
                        destinations: [`` + listItem.geoPoint.latitude + `,` + listItem.geoPoint.longitude + ``],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false,
                    },
                    (response, status) => {
                        let dis = "";
                        if (status == 'OK') {
                            dis = response.rows[0].elements[0].distance.text;
                        }
                        console.log("DISTANCE => ",index,dis);
                        setDistance((prevState) => {
                            let distanceArr = [...prevState];
                            distanceArr.push(dis);
                            return distanceArr;
                        });
                });}
            })
        }
    },[props.directionStartLatLng,props.scriptLoaded, props.currentLocation, props.isDirectionEnabled, displayList]);

    useEffect(() => {
        let list = props?.list?.length > 5 ? props.list.slice(0, pageSize) : props.list
        setDisplayList(list);
        setStartingNumber(0);
        setPrevButton(false);
        setEndingNumber(() => {
            let number;
            if (props.list) {
                if (props.list?.length > pageSize) {
                    number = pageSize;
                }
                else {
                    number = props.list.length;
                }
            }
            return number;
        });
        setNextButton(() => {
            let status;
            if (props.list?.length > pageSize) {
                status = true;
            }
            else {
                status = false;
            }
            return status;
        });
    }, [props.list])

    return (
        <>
            <div className={`${styles.showAllResult}`} >
                <div className={styles.ShowResult}>
                    {!props.detailView ? <>
                        <p className={styles.Showingresult}>Showing result {endingNumber === 0 ? startingNumber : startingNumber + 1} to {endingNumber} of {props.list?.length}</p>
                        <button disabled={!prevButton} className={styles.pagetransaction} onClick={prevPage}><img
                            src='/rolocator/W_Icon_lessthan.svg'
                        ></img></button>
                        <button disabled={!nextButton} className={styles.pagetransaction} onClick={nextPage}><img
                            src='/rolocator/W_Icon_greaterthan.svg'
                        ></img></button>
                    </> : null}
                </div>
                <div className={`${styles.showListing}`}>
                    <div className="">

                        {

                            props.detailView ?
                                <SearchDetail details={props.details} origin = {origin}></SearchDetail>
                                :
                                displayList ?
                                    displayList.map((petrolPump: any, index: any) => {
                                        let address;
                                        let name;
                                        let fulladdress;

                                        if (petrolPump.address) {
                                            fulladdress = petrolPump.address.line2 + ", " + petrolPump.address.town;
                                            if (fulladdress.length > 35) {
                                                address = fulladdress.slice(0, 35) + ",...";
                                            }
                                            else {
                                                address = fulladdress
                                            }
                                        }

                                        // if (petrolPump?.formatted_address) {
                                        //     fulladdress = petrolPump.formatted_address;
                                        //     if (petrolPump.formatted_address.length > 35) {
                                        //         address = petrolPump.formatted_address.slice(0, 35) + ",...";
                                        //     }
                                        //     else {
                                        //         address = petrolPump.formatted_address
                                        //     }
                                        // } else {
                                        //     fulladdress = petrolPump.vicinity;
                                        //     if (petrolPump.vicinity.length > 35) {
                                        //         address = petrolPump.vicinity.slice(0, 35) + ",...";
                                        //     }
                                        //     else {
                                        //         address = petrolPump.vicinity
                                        //     }
                                        // }

                                        // if (petrolPump.name.length > 29) {
                                        //     name = petrolPump.name.slice(0, 29) + ",...";
                                        // }
                                        // else {
                                        //     name = petrolPump.name
                                        // }

                                        if (petrolPump.name.length > 29) {
                                            name = petrolPump.name.slice(0, 29) + ",...";
                                        }
                                        else {
                                            name = petrolPump.name
                                        }

                                        let openStatus;

                                        if (petrolPump.openingHours.weekDayOpeningList[0].closed) {
                                            openStatus = "Closed Opens on " + petrolPump?.openingHours?.weekDayOpeningList[0]?.openingTime?.formattedHour
                                        }
                                        else {
                                            openStatus = "Open until " + petrolPump?.openingHours?.weekDayOpeningList[0]?.closingTime?.formattedHour
                                        }

                                        return (<div key={index}
                                            onClick={() => toggleView(petrolPump, distance[index])}
                                            className={`d-flex flex-row justify-content-between ${styles.Rectangle}`}
                                        >
                                            <div
                                                className={styles.Details}
                                            >
                                                <div className={styles.Loremipsumdol}>
                                                    <p className={styles.name}>{name}
                                                    </p>
                                                </div>
                                                <div className={styles.label}>
                                                    <div>
                                                        <p
                                                            className={`${styles.Address} ${styles.name}`}
                                                        >{
                                                                address
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className={styles.Address}
                                                        >
                                                            {openStatus}
                                                            {/* Open until 1:00am */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`d-flex flex-column ${styles.centerField}`}
                                            >
                                                { }
                                            </div>
                                            <div
                                                className={`d-flex flex-column ${styles.Direction}`}
                                            >
                                                <img src='/rolocator/Direction.svg' onClick={() => props.onClickListDirection(petrolPump)} />
                                                <p
                                                    className={styles.Directionlabel}
                                                >
                                                    {distance[index]}
                                                </p>
                                            </div>

                                        </div>);
                                    }

                                    )
                                    : ""
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default PetrolPumpList;
