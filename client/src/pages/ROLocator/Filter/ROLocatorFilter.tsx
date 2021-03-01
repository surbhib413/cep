import React, { useEffect, useState } from "react";
import { Typography, Grid, FormControlLabel, Checkbox, withStyles, Theme, createStyles } from "@material-ui/core";
import scssStyles from "./FilterDialog.module.scss";
import { concat, indexOf, filter, toString } from "lodash";
import styles from './FilterDialog.module.scss';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
      display: "inline-flex",
      padding: "0px",
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
      // "& .MuiAccordionSummary-root": {
      //   display: "inline-flex !important",
      //   padding: "0px"
      // }
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

export const ROLocatorFilter = (props: any) => {
  const [cardStatus, setCardStatus] = React.useState<Array<String>>([]);
  const [expandAmenities, setExpandAmenities] = useState(false);

  const handleChange = () => {
    setExpandAmenities ( (prevstate : boolean) => {
      return (!prevstate);
    }

    );
  }
  // const [handleCardStatusChange] = props;
  // const handleCardStatusChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   console.log("[event.target.name]..................", event.target.name);
  //   event.target.checked
  //     ? setCardStatus((prevState) => concat(prevState, [event.target.name]))
  //     : setCardStatus((prevState) =>
  //       filter(prevState, (item) => {
  //         return item != event.target.name;
  //       })
  //     );
  //   props.selectedFilter(cardStatus);
  //   console.log('card status..............', cardStatus);
  // };

  useEffect(() => {
    console.log("Successfully got data from parent component...........");
  })

  return (
    <React.Fragment>
      
      <div className={`d-flex flex-column ${scssStyles.filterCustom} px-0 px-sm-4 py-sm-3 py-3`}>
        {
          props?.initialData?.topFilter ?
            <>
              <Typography variant="h6">Top Filter</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.topFilter.map((item: any, index: any) => {

                    let checked = false;
                    props.selectedFilters.map((filter : any) => {
                      if(filter.code === "topFilter-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"topFilter-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              checked={checked}
                              onChange={(e) => props.handleCardStatusChange(e, item.displayName)}
                              // name="highspeed"
                              name={"topFilter-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }




        {
          props?.initialData?.amenities ?
            <>
              <Typography variant="h6">Amenities</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.amenities.map((item: any, index: any) => {

                    let checked = false;
                    props.selectedFilters.map((filter : any) => {
                      if(filter.code === "amenities-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"amenities-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              checked={checked}
                              onChange={(e) => props.handleCardStatusChange(e, item.displayName)}
                              // name="highspeed"
                              name={"amenities-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }

        {
          props?.initialData?.fuelStationCategory ?
            <>
              <Typography variant="h6">Fuel Station Category</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.fuelStationCategory.map((item: any, index: any) => {

                    let checked = false;
                    props.selectedFilters.map((filter : any) => {
                      if(filter.code === "fuelStationCategory-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"fuelStationCategory-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              checked={checked}
                              onChange={(e) => props.handleCardStatusChange(e, item.displayName)}
                              // name="highspeed"
                              name={"fuelStationCategory-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }



        {
          props?.initialData?.fuelType ?
            <>
              <Typography variant="h6">Fuel Type</Typography>
              <Grid container className={`pb-0 pb-sm-4`}>
                {
                  props.initialData.fuelType.map((item: any, index: any) => {

                    let checked = false;
                    props.selectedFilters.map((filter : any) => {
                      if(filter.code === "fuelType-"+item.code) {
                        checked = true;
                      }
                    }) 

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={`${scssStyles.gridHeight}`}
                        key={"fuelType-" + item.code}
                      >
                        <FormControlLabel
                          className={`mb-0`}
                          control={
                            <Checkbox
                              color="primary"
                              checked={checked}
                              onChange={(e) => props.handleCardStatusChange(e, item.displayName)}
                              // name="highspeed"
                              name={"fuelType-" + item.code}
                            />
                          }
                          // label="High Speed"
                          label={item.displayName}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </>
            : null
        }


        {
          props?.initialData?.lessAmenities ?
            <>
              <CustomAccordion onChange = {handleChange}>
                <CustomAccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {
                    expandAmenities?<Typography variant="h6">Less Amenities</Typography>:<Typography variant="h6">More Amenities</Typography>
                  }
                  
                  
                </CustomAccordionSummary>
                <CustomAccordionDetails>
                  <Grid container className={`pb-0 pb-sm-4`}>
                    {
                      props.initialData.lessAmenities.map((item: any, index: any) => {

                        let checked = false;
                        props.selectedFilters.map((filter : any) => {
                          if(filter.code === "lessAmenities-"+item.code) {
                            checked = true;
                          }
                        }) 

                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            className={`${scssStyles.gridHeight}`}
                            key={"lessAmenities-" + item.code}
                          >
                            <FormControlLabel
                              className={`mb-0`}
                              control={
                                <Checkbox
                                  color="primary"
                                  // checked={fields.iocl}
                                  checked={checked}
                                  onChange={(e) => props.handleCardStatusChange(e, item.displayName)}
                                  // name="highspeed"
                                  name={"lessAmenities-" + item.code}
                                />
                              }
                              // label="High Speed"
                              label={item.displayName}
                            />
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                </CustomAccordionDetails>
              </CustomAccordion>
            </>
            : null
        }
      </div>
    </React.Fragment>
  );
};
