
import React, { useEffect, useState } from "react";
import { CustomButton } from "src/components/CustomButton/CustomButton";
import { Typography, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import styles from './SearchDetail.module.scss';
import DeleteIcon from '@material-ui/icons/Delete';
import { getRoLocatorDetailData } from "../../../lib/api/roLocator/roLocator";
import { weekdays } from "moment";
const petrolImg = "/rolocator/Group 30681.svg";
const dieselImg = "/rolocator/Group 30679.svg";
const cngImg = "/rolocator/CNG.svg";
const lpgImg = "/rolocator/Group 30074.svg";

const fleetcardImg = "/rolocator/Group 30835.svg";
const automationImg = "/rolocator/Automation.svg";
const bathImg = "/rolocator/Bath.svg";
const lpgImage = "/rolocator/Group 31045.svg";
const parkingImg = "/rolocator/Parking  Facility.svg";
const deliveryImg = "/rolocator/Group 31046.svg";
const locationImg = "/rolocator/W_Icon_Location.svg";
const timeImg = "/rolocator/Group 30640.svg";
const phoneImg = "/rolocator/W&M_Icons_SuccessPage-RelationshipOfficer.svg";
const directionBtn = "/rolocator/Group 30653.svg";
const shareBtn = "/rolocator/Group 30654.svg";
const dieselIcon = "/rolocator/Diesel.svg";
const lubricantsIcon = "/rolocator/Lubricants.svg";
const Speed_97Icon = "/rolocator/Speed 97.png";
const smartFleetIcon = "/rolocator/W_Icon_Credit Mgmnt.svg";
const inOutIcon = "/rolocator/In and out.svg";
const laundaryIcon = "/rolocator/Laundary.svg";
const vehicleServiceIcon = "/rolocator/Vehicle Service Center.svg";
const electricityChargingIcon = "/rolocator/Electricity Charging Stations.svg";
const airFillingIcon = "/rolocator/Air Filling.svg";
const pureSureIcon = "/rolocator/Pure for Sure.svg";
const twentyFourIcon = "/rolocator/24_7.svg";
const ATMIcon = "/rolocator/ATM.svg";
const policeStationIcon = "/rolocator/Police Station.svg";
const dhabaIcon = "/rolocator/Dhaba.svg";
const BathAmenitiesIcon = "/rolocator/Bath_Amenities.svg";
const dormitoryIcon = "/rolocator/Dormitory.svg";
const cutOnDividerIcon = "/rolocator/Cut on  Divider.svg";
const emergencyIcon = "/rolocator/Emergency.svg";
const cookingIcon = "/rolocator/Cooking.svg";
const CNG_AmenitiesIcon = "/rolocator/CNG_Amenities.svg";
const LPG_AmenitiesIcon = "/rolocator/LPG_Amenities.svg";


const SearchDetail = (props: any): JSX.Element => {
    const [amenitiesData, setAmenitiesData] = useState([]);

    const getDirection = () => {
        //window.location.href = "https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=LAT,LNG";
        window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&origin="+props.origin?.lat+","+props.origin?.lng+"&destination="+props?.details?.geoPoint?.latitude+","+props?.details?.geoPoint?.longitude);
    }

    useEffect(() => {
        console.log('THIS IS THE DETAILS DATA............', props?.details);
        console.log('props.details.......', props?.details?.roId);
        getDetailsData();
    }, []);

    const getDetailsData = async () => {
        const data = {
            roId: props?.details?.roId
        }
        const response = await getRoLocatorDetailData(data);
        setAmenitiesData(response?.data?.amenities);
        console.log('response data from API.............', response);
    }

    return (
        <>
            <div className={styles.results}>
                <div className="d-flex">
                    <div className="d-flex">
                        <span className={styles.title}>{props?.details?.name}</span>
                    </div>
                    <div className="d-flex ml-auto">
                        <span className={styles.labelStyle}>{ props?.details?.distance ?  `(${props?.details?.distance})` : null}</span>
                    </div>
                </div>

                <div className={`d-flex flex-row justify-content-between ${styles.Rectangle}`}>
                    <div className={styles.Details}>
                        <div className={`d-flex flex-row m-2 ${styles.Loremipsumdol}`}>
                            <img className="mr-2" src={locationImg} alt="locationImg"></img>
                            {/* <span>L.B.S Marg Mumbai, Mumbai Suburban, 400070, Maharashtra.</span> */}
                            <span>{props?.details?.address?.line2 + ", "}{props?.details?.address?.postalCode + ", "}{props?.details?.address?.town + "."}</span>
                        </div>
                        <div className={`d-flex flex-row m-2 ${styles.label}`}>
                            <img className="mr-2" src={timeImg} alt="timeImg"></img>
                            <span className={styles.Address}>
                                {
                                    props?.details?.openingHours.weekDayOpeningList[0].closed ?
                                        "Open until: " : " Open now: "
                                }
                                {
                                    props?.details?.openingHours.weekDayOpeningList[0]?.openingTime?.formattedHour + " - " +
                                    props?.details?.openingHours.weekDayOpeningList[0]?.closingTime?.formattedHour
                                }
                            </span>
                        </div>
                        <div className={`d-flex flex-row m-2 ${styles.label}`}>
                            <img className="mr-2" src={phoneImg} alt="phoneImg"></img>
                            <span className={styles.Address}>{props?.details?.telephone}</span>
                        </div>
                    </div>
                </div>

                <div className={`d-flex flex-row justify-content-around`}>
                    <CustomButton onClick={getDirection} variant="outlined" color="primary" startIcon={<img src={directionBtn} alt="directionBtn"></img>}>
                        Direction
                    </CustomButton>
                    <CustomButton variant="outlined" color="primary" startIcon={<img src={shareBtn} alt="shareBtn"></img>}>
                        Share
                    </CustomButton>
                </div>
                <hr className={`mt-3 ${styles.headerDivider}`}></hr>

                <div className="d-flex flex-column">
                    <div className="d-flex">
                        <p className={styles.title}>Fuel Available</p>
                    </div>
                    <div className="d-flex  px-3">
                        <Grid container className={`pb-0 pb-sm-4`}>
                            {
                                props?.details?.weekDayFuelPriceList?.map((item: any, index: any) => {
                                    return (
                                        <>
                                            {
                                                item.code === "Petrol" ?
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        className={"my-2"}
                                                    >
                                                        <div className="d-flex flex-row justify-content-center">
                                                            <div className={`d-flex justify-content-center ${styles.flexStart}`}>
                                                                <img src={petrolImg} alt="petrolImg"></img>
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className={`ml-2 ${styles.labelStyle}`}>{item.displayName}</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    :
                                                    null
                                            }

                                            {
                                                item.code === "High_Speed_Desiel" ?
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        className={"my-2"}
                                                    >
                                                        <div className="d-flex flex-row justify-content-center">
                                                            <div className={`d-flex justify-content-center ${styles.flexStart}`}>
                                                                <img src={dieselIcon} alt="dieselImg"></img>
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className={`ml-2 ${styles.labelStyle}`}>{item.displayName}</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    :
                                                    null
                                            }

                                            {
                                                item.code === "CNG" ?
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        className={"my-2"}
                                                    >
                                                        <div className="d-flex flex-row justify-content-center">
                                                            <div className={`d-flex justify-content-center ${styles.flexStart}`}>
                                                                <img src={cngImg} alt="cngImg"></img>
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className={`ml-2 ${styles.labelStyle}`}>{item.displayName}</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    :
                                                    null
                                            }

                                            {
                                                item.code === "Speed" ?
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        className={"my-2"}
                                                    >
                                                        <div className="d-flex flex-row justify-content-center">
                                                            <div className={`d-flex justify-content-center ${styles.flexStart}`}>
                                                                <img src={lpgImg} alt="lpgImg"></img>
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className={`ml-2 ${styles.labelStyle}`}>{item.displayName}</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    :
                                                    null
                                            }

                                            {
                                                item.code === "Lubricants" ?
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        className={"my-2"}
                                                    >
                                                        <div className="d-flex flex-row justify-content-center">
                                                            <div className={`d-flex justify-content-center ${styles.flexStart}`}>
                                                                <img src={lubricantsIcon} alt="lubricantsIcon"></img>
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className={`ml-2 ${styles.labelStyle}`}>{item.displayName}</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    :
                                                    null
                                            }

                                            {
                                                item.code === "Speed_97" ?
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        className={"my-2"}
                                                    >
                                                        <div className="d-flex flex-row justify-content-center">
                                                            <div className={`d-flex justify-content-center ${styles.flexStart}`}>
                                                                <img src={Speed_97Icon} alt="Speed_97Icon"></img>
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className={`ml-2 ${styles.labelStyle}`}>{item.displayName}</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    :
                                                    null
                                            }
                                        </>
                                    )
                                })
                            }
                        </Grid>
                    </div>
                </div>

                <hr className={`${styles.headerDivider}`}></hr>

                <div className="d-flex flex-column">
                    <div className="d-flex">
                        <p className={styles.title}>Today's Prices <span className={styles.subTitle}>
                            ({
                                props?.details?.weekDayFuelPriceList[0]?.weekDay + " " + props?.details?.weekDayFuelPriceList[0]?.date?.slice(0,10) + " " +props?.details?.weekDayFuelPriceList[0]?.date?.slice(11,16) + " hrs"
                            })
                            </span></p>
                    </div>
                    <div className={`d-flex justify-content-center pt-3`}>
                        <Grid container className={`mb-2 ${styles.subContainer}`}>
                            {
                                props?.details?.weekDayFuelPriceList?.map((item: any, index: any) => {
                                    return (
                                        index <= 3 ?
                                            <>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={3}
                                                    className={styles.textAlignCenter}
                                                //className={`mb-2 ${styles.subContainer}`}
                                                >
                                                    <span className={styles.distance}> {item.displayName}</span>
                                                </Grid>
                                            </>
                                            :
                                            null
                                    )
                                })
                            }
                        </Grid>
                    </div>

                    <div className={`d-flex justify-content-around`}>
                        <Grid container className={`mb-2 ${styles.subContainer2}`}>
                            {
                                props?.details?.weekDayFuelPriceList?.map((item: any, index: any) => {
                                    return (
                                        index <= 3 ?
                                            <>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={3}
                                                    className={styles.textAlignCenter}
                                                //className={`mb-2 ${styles.subContainer2}`}
                                                >
                                                    <span className={styles.distance}> &#8377; {item.price}</span>
                                                </Grid>
                                            </>
                                            :
                                            null
                                    )
                                })
                            }
                        </Grid>
                    </div>

                    <div className={`d-flex justify-content-around`}>
                        <Grid container className={`mb-2 ${styles.subContainer}`}>
                            {
                                props?.details?.weekDayFuelPriceList?.map((item: any, index: any) => {
                                    return (
                                        index >= 4 ?
                                            <>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={3}
                                                    className={styles.textAlignCenter}
                                                //className={`mb-2 ${styles.subContainer}`}
                                                >
                                                    <span className={styles.distance}> {item.displayName}</span>
                                                </Grid>
                                            </>
                                            :
                                            null
                                    )
                                })
                            }
                        </Grid>
                    </div>

                    <div className={`d-flex justify-content-around`}>
                        <Grid container className={`mb-2 ${styles.subContainer2}`}>
                            {
                                props?.details?.weekDayFuelPriceList?.map((item: any, index: any) => {
                                    return (
                                        index >= 4 ?
                                            <>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={3}
                                                    className={styles.textAlignCenter}
                                                //className={`mb-2 ${styles.subContainer2}`}
                                                >
                                                    <span className={styles.distance}> &#8377; {item.price}</span>
                                                </Grid>
                                            </>
                                            :
                                            null
                                    )
                                })
                            }
                        </Grid>
                    </div>

                </div>
                <hr className={`${styles.headerDivider}`}></hr>

                <div className="d-flex flex-column">
                    <div className="d-flex">
                        <p className={styles.title}>Amenities</p>
                    </div>
                    <Grid container className={`pb-0 pb-sm-4`}>
                        {
                            amenitiesData?.map((item: any, index: any) => {
                                return (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            className={"my-2"}
                                        >
                                            {
                                                item === "Air_Filling" ?
                                                    <div className="d-flex flex-row">
                                                        <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                            <img src={airFillingIcon} alt="fleetcardImg"></img>
                                                        </div>
                                                        <div className={`d-flex justify-content-center align-items-center`}>
                                                            <span className={styles.labelStyle} > Air Filling</span>
                                                        </div>
                                                    </div>
                                                    : null

                                            }
                                            {
                                                item === "Parking" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={parkingImg} alt="parkingImg"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >{item}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                            {
                                                item === "In_Out" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={inOutIcon} alt="inOutIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >In Out</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                            {
                                                item === "Pure_Sure" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={pureSureIcon} alt="inOutIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Pure Sure</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                            {
                                                item === "SmartFleet_SmartDrive" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={smartFleetIcon} alt="smartFleetIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >SmartFleet/SmartDrive</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                            {
                                                item === "TWO_FOUR_SEVEN" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={twentyFourIcon} alt="twentyFourIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >24/7</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                            {
                                                item === "Automation" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={automationImg} alt="Automation"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Automation</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null

                                            }
                                            {
                                                item === "ATM" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={ATMIcon} alt="ATMIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >ATM</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "CNG" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={CNG_AmenitiesIcon} alt="CNG_AmenitiesIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >CNG</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "LPG" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={LPG_AmenitiesIcon} alt="LPG_AmenitiesIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >LPG</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "door_delivery" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={deliveryImg} alt="door_delivery"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Door Delivery</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Laundary" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={laundaryIcon} alt="laundaryIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Laundary</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Cooking" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={cookingIcon} alt="cookingIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Cooking</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Emergency" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={emergencyIcon} alt="emergencyIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Emergency</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "cut_on_divider" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={cutOnDividerIcon} alt="cutOnDividerIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Cut on divider</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "dormitory" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={dormitoryIcon} alt="dormitoryIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Dormitory</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Bath" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={BathAmenitiesIcon} alt="BathAmenitiesIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Bath</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Dhaba" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={dhabaIcon} alt="dhabaIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Dhaba</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Dhaba" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={laundaryIcon} alt="dhabaIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Dhaba</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "vehicle_service_center" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={vehicleServiceIcon} alt="vehicleServiceIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Vehicle Service Center</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "electricity_Charging_station" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={electricityChargingIcon} alt="electricityChargingIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Electricity Charging Station</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Hospital" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={electricityChargingIcon} alt="electricityChargingIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Electricity Charging Station</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Hospital" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={electricityChargingIcon} alt="hospitalIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Hospital</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                            {
                                                item === "Police_Station" ?
                                                    <>
                                                        <div className="d-flex flex-row">
                                                            <div className={`d-flex mr-2 justify-content-center align-items-center ${styles.circle}`}>
                                                                <img src={policeStationIcon} alt="policeStationIcon"></img>
                                                            </div>
                                                            <div className={`d-flex justify-content-center align-items-center`}>
                                                                <span className={styles.labelStyle} >Police Station</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }

                                        </Grid>
                                    </>
                                )
                            }) 
                        }
                    </Grid>
                </div>
            </div>
        </>
    );
};

export default SearchDetail;
