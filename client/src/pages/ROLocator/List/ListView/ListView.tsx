import React, { useState, createRef, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import { ExpandMore } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import {
    Hidden,
    Typography
  } from "@material-ui/core";
import styles from './ListView.module.scss';
import {
    CustomMenu,
    CustomMenuItem,
  } from "../../../../components/CustomMenu/CustomMenu";
import CustomiseTablePopup from './CustomiseTablePopup/CustomiseTablePopup';
import TableHeader from './TableHeader/TableHeader';
import {tableHeader} from './tableHeader';
import FilterDialog from './ListFilter/FilterDialog';
import { concat, filter, toString } from "lodash";
import {getNonTopFilter, getTopFilter} from './ListFilter/getFilterTypes';


const TableCell = withStyles({
    root: {
        borderBottom: "none"
    }
  })(MuiTableCell);

const ListView = (props: any): JSX.Element => {
    
    const [pageSize, setPageSize] = useState(10);
    //const [places, setPlaces] = useState([]);
    
    const [displayList, setDisplayList] = useState( () => {
        if(props.places) {
            return(props.places.slice(0,2));
        }
        else {
            return [];
        }
    }
        );
    
    const [tableHeaders, setTableHeader] = useState(tableHeader);
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [expandAnchorEl, setExpandAnchorEl] =useState(null);
    const [customiseTableDialogOpen, setCustomiseTableDialogOpen] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = React.useState<Array<any>>([]);
    
    const pageValue: React.RefObject<HTMLInputElement> = createRef();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.target.value = Math.abs(parseInt(e.target.value)).toString();
      };

    let headercount = 0;

    const onChangeCheckedBox = (event : any, value: any) => {
        if(event.target.checked) {
            setSelectedFilters((prevState) => {
                let currentState = concat(prevState, { code: event.target.name, displayName: value });
                if(event.target.name.slice(0, event.target.name.indexOf("-")) === "topFilter") { 
                    let selectedFilter = getNonTopFilter(props.initialData, value);
                    if(selectedFilter) {
                        currentState = concat(currentState, selectedFilter);
                    }
                }
                else {
                    let selectedFilter = getTopFilter(props.initialData, value);
                    if(selectedFilter) {
                        currentState = concat(currentState, selectedFilter);
                    }
                }
                return (currentState);
            });
        }
        else {
            setSelectedFilters((prevState) => {
                let currentState;
                currentState = filter(prevState, (item: any) => {
                    return item.displayName != value;
                });

                return(currentState);
                // return (filter(prevState, (item: any) => {
                //     return item.code != event.target.name;
                // }));
            });
        }
    }
    const clickReset = () => {
        setSelectedFilters([]);
    }

    const goToPage = (): void => {
        const value: number = pageValue.current
          ? parseInt(pageValue.current.value)
          : 1;
        
        if(value<= (Math.ceil(props.places.length/pageSize))){
            setPage(value);
            setDisplayList(props.places.slice((value-1)*pageSize,value*pageSize));
        }
    };

    const handleChangePage = (event: unknown, newPage: number): void => {
        setPage(newPage);
        setDisplayList(props.places.slice((newPage-1)*pageSize,newPage*pageSize));
      };

    const openCustomiseTableDialog = () => {
        setCustomiseTableDialogOpen(true);
    };

    const closeCustomiseTableDialog = () => {
        setCustomiseTableDialogOpen(false);
      };
    
      const closeFilterDialog = () => {
        setFilterDialogOpen(false);
      };

      const clickApply = () => {
        props.setCardStatus(selectedFilters);
        props.filterUrl(selectedFilters);
        closeFilterDialog();
    }

      const openFilterDialog = () => {
        setFilterDialogOpen(true);
        setSelectedFilters(props.globalSelectedFilters)
      };  
    
    const handleClose = (event: unknown, property: string): void => {
        setPageSize(parseInt(property));
        setDisplayList(props.places.slice(0,parseInt(property)));
        setPage(1);
        setAnchorEl(null);
        setExpandAnchorEl(null);
    };

    const handleClick = (event: any) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
      };
    const getheadercount = () => {
        headercount = 0;
        tableHeaders.forEach( (header : any) => {
            if(header.displayStatus) {
                headercount = headercount + 1;
            }
        }
        )
    }
    const headerList = () => {
        getheadercount();
        let headcount = 0
        return(tableHeaders.map( (header : any) => {
            
            if(header.displayStatus) {
                headcount = headcount+1;
                if(headcount === headercount) {
                    return (<TableCell className = {styles.Tableh1}>
                        {header.displayName}
                    </TableCell>)
                }
                else {
                    return (<TableCell className = {`${styles.Tableh1} ${styles.headerborder}`} >
                        {header.displayName}
                    </TableCell>)
                }
            }
        }
        ));
    }
    useEffect( () => {
            setDisplayList(props.places.slice(0,pageSize));
        
        

    },[props.places])
  

    return (
        <>
            
            <Hidden xsDown>
                <div className={`d-flex flex-column ${styles.listviewContainer}`}>
                    <div className={`d-flex flex-row ${styles.menuPanel}`}
                    >
                    <TableHeader
                      onClickDetailView = {props.onClickDetailView}
                      onSearchSelect = {props.onSearchSelect}
                      onSearch = {props.onSearch}
                      searchText={props.searchText}
                      filterParameters={props.filterParameters}
                      //parentSearchCallback={searchCallback}
                      openFilterDialog={openFilterDialog}
                      listView = {props.listView}
                      setPlaces = {props.setPlaces}
                      openCustomiseTableDialog={openCustomiseTableDialog}
                      tabValue={2}
                      data-test-id="serviceReq-search-header"
                    ></TableHeader>
                        <CustomiseTablePopup
                            customiseTableDialogOpen={customiseTableDialogOpen}
                            closeCustomiseTableDialog={closeCustomiseTableDialog}
                            tableHeader = {tableHeader}
                            //customiseTableColumn={customiseTableColumn}
                            //columns={columns}
                        />
                        <FilterDialog
                            filterDialogOpen={filterDialogOpen}
                            closeFilterDialog={closeFilterDialog}
                            initialData={props.initialData}
                            selectedFilters = {selectedFilters}
                            clickApply = {clickApply}
                            clickReset = {clickReset}
                            onChangeCheckedBox = {onChangeCheckedBox}
                            //tabValue={value}
                        ></FilterDialog>
                    </div> 
                    <div className={styles.table}>
                        <TableContainer>
                            <Table>
                                <TableHead className = {styles.tableHeader}
                                >
                                    <TableRow>
                                        
                                        {
                                            headerList()
                                            
                                            // tableHeaders.map( (header : any) => {

                                            //     if(header.displayStatus) {
                                                    
                                            //         return (<TableCell className = {styles.Tableh1}>
                                            //             {header.name}
                                            //         </TableCell>)
                                            //     }
                                            // }
                                            // )
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        displayList.map( (petrolPump : any, index: any) => {
                                            return(
                                            <TableRow 
                                            key = {index}
                                            className = {styles.TableRow}>
                                                {
                                                    tableHeaders.map( (header : any) => {
                                                        if(header.displayStatus) {
                                                            let value, customisedClass;
                                                            let direction = '';
                                                            let hover = ''
                                                            let addresscol = false;
                                                            switch(header.name) {
                                                                case "Fuel Station Name":
                                                                    if(petrolPump?.name?.length > 16) {
                                                                        if(headercount < 4) {
                                                                            value = petrolPump.name
                                                                        } else {
                                                                            value = petrolPump.name.slice(0,16)+',...';
                                                                        }
                                                                    }
                                                                    else {
                                                                        value = petrolPump.name
                                                                    }
                                                                    hover = petrolPump.name;

                                                                    // if(petrolPump.displayName.length > 16) {
                                                                    //     value = petrolPump.displayName.slice(0,16)+',...';
                                                                    // }
                                                                    // else {
                                                                    //     value = petrolPump.displayName
                                                                    // }
                                                                    // hover = petrolPump.displayName;

                                                                    customisedClass = styles.FuelStationName;
                                                                    break;
                                                                case "Address":
                                                                    addresscol = true;
                                                                    //value = petrolPump.formatted_address;
                                                                    

                                                                    if(petrolPump?.address?.line2) {
                                                                        hover = petrolPump.address.line2+", "+petrolPump.address.town;
                                                                        if(hover.length > 25) {
                                                                            if(headercount < 3) {
                                                                                if(hover.length > 50) {
                                                                                    value = hover.slice(0,50)+",...";
                                                                                }
                                                                                else {
                                                                                    value = hover
                                                                                }
                                                                                
                                                                            } else if(headercount < 4) {
                                                                                if(hover.length > 40) {
                                                                                    value = hover.slice(0,40)+",...";
                                                                                }
                                                                                else {
                                                                                    value = hover
                                                                                }
                                                                            }
                                                                             else {
                                                                                value = hover.slice(0,25)+",...";
                                                                            }
                                                                            
                                                                        }
                                                                        else {
                                                                            value = hover
                                                                        }
                                                                    }

                                                                    // if(petrolPump?.formatted_address){
                                                                    //     hover = petrolPump.formatted_address;
                                                                    // if(petrolPump.name.length > 25) {
                                                                    //     value = petrolPump.formatted_address.slice(0,25)+',...';
                                                                    // }
                                                                    // else {
                                                                    //     value = petrolPump.formatted_address;
                                                                    // }
                                                                    // }else{
                                                                    // hover = petrolPump.vicinity;
                                                                    // if(petrolPump.vicinity.length > 25) {
                                                                    //     value = petrolPump.vicinity.slice(0,25)+",...";
                                                                    // }
                                                                    // else {
                                                                    //     value = petrolPump.vicinity
                                                                    // }
                                                                    // }
                                                                    direction = '/rolocator/Direction.svg'
                                                                    
                                                                    customisedClass = styles.Address;
                                                                    break;
                                                                case "Contact Number":
                                                                    // value = "1234567890";
                                                                    value = petrolPump.telephone;
                                                                    customisedClass = styles.Contact
                                                                    break;
                                                                case "Petrol":
                                                                    //value = 91;
                                                                    petrolPump?.weekDayFuelPriceList?.map((fuel: any) => {
                                                                        if(fuel.code === "Petrol") {
                                                                            value = fuel.price;
                                                                        }
                                                                    })
                                                                    customisedClass = styles.Petrol
                                                                    break;
                                                                case "Diesel":
                                                                    //value = 83;
                                                                    petrolPump?.weekDayFuelPriceList?.map((fuel: any) => {
                                                                        if(fuel.code === "Diesel") {
                                                                            value = fuel.price;
                                                                        }
                                                                    })
                                                                    customisedClass = styles.Diesel
                                                                    break;
                                                                case "Speed":
                                                                    //value = 94;
                                                                    petrolPump?.weekDayFuelPriceList?.map((fuel: any) => {
                                                                        if(fuel.code === "Speed") {
                                                                            value = fuel.price;
                                                                        }
                                                                    })
                                                                    customisedClass = styles.Speed
                                                                    break;
                                                                case "State":
                                                                    // petrolPump.address_components.map((addressDetail: any) => {
                                                                    //     if(addressDetail.types[0] === "administrative_area_level_1") {
                                                                    //         value = addressDetail.long_name;
                                                                    //     }
                                                                    // });
                                                                    //value = petrolPump.address_components[5].long_name;
                                                                    value = "Maharashtra"
                                                                    customisedClass = styles.State
                                                                    break;
                                                                case "District":
                                                                    // petrolPump.address_components.map((addressDetail: any) => {
                                                                    //     if(addressDetail.types[0] === "administrative_area_level_2") {
                                                                    //         value = addressDetail.long_name;
                                                                    //     }
                                                                    // })
                                                                    //value = petrolPump.address_components[4].long_name;
                                                                    value = "Mumbai";
                                                                    customisedClass = styles.District
                                                                    break;
                                                            }
                                                                return (<TableCell 
                                                                className ={`${customisedClass} ${styles.Tabledata} ${styles.name}`} >
                                                                {
                                                                    addresscol?<div className = {'d-flex justify-content-between'}>
                                                                        <div title = {hover}>
                                                                        {value}
                                                                        {/* {hover=== ''? '': <span className = {styles.namehover}>{hover}</span>}  */}
                                                                        </div>
                                                                        <div className={styles.direction}>
                                                                            <img onClick={() => {props.onClickListDirection(petrolPump)}} className={styles.direction} src={direction}/>
                                                                        </div>
                                                                    </div> :  <div title = {hover}>
                                                                        {value}
                                                                        {/* {hover=== ''? '': <span className = {styles.namehover}>{hover}</span>} */}
                                                                    </div>
                                                                }
                                                                {/* {value}
                                                                {hover=== ''? '': <span className = {styles.namehover}>{hover}</span>}
                                                                
                                                                
                                                                <img className={styles.direction} src={direction}/> */}
                                                            </TableCell>)
                                                            
                                                        }
                                                    }
                                                    )
                                                }
                                            </TableRow>
                                            );
                                        }
                                        )
                                    }
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </div>   
                    <div className={`d-flex justify-content-between ${styles.footer}`}>
                        <div>
                        <div
                            aria-controls="rowsPerPage-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            data-test-id="serviceReq-pagination-div"
                            //className={`d-flex align-items-center mx-3 ${styles.FuelServicesMenuContainer}`}
                        >
                        <span
                          //className={`mx-2 ${styles.cursorPointer} ${styles.expandLabel}`}
                          data-test-id="serviceReq-view-lbl"
                        >
                          {`View ${pageSize}`}
                        </span>
                            <ExpandMore />
                        </div>
                        <CustomMenu
                        id="rowsPerPage-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        data-test-id="serviceReq-customMenu"
                        onClose={(e) => {
                          setAnchorEl(null);
                        }}
                      >
                        <CustomMenuItem
                          value="10"
                         onClick={(e) => {
                            handleClose(e, "10");
                          }}
                          data-test-id="serviceReq-menuItem-view-10"
                        >
                          View 10
                        </CustomMenuItem>
                        <CustomMenuItem
                          value="20"
                           onClick={(e) => {
                             handleClose(e, "20");
                           }}
                          data-test-id="serviceReq-menuItem-view-20"
                        >
                          View 20
                        </CustomMenuItem>
                      </CustomMenu>
                        </div>
                        <div className={`d-flex flex-row`}>
                        <div>
                            {
                                props.places? <Pagination
                                count={Math.ceil(props.places.length / pageSize)}
                                page={page}
                                color="primary"
                                boundaryCount={2}
                                onChange={handleChangePage}
                                data-test-id="serviceReq-pagination"
                                /> :
                                ""
                            }
                            
                        </div>
                        <div className = {'d-flex flex-row'}>
                            {/* <Typography className = {'align-items-center'}>
                                Go to page
                            </Typography> */}
                            <span>Go to page</span>
                            <input
                            className={`${styles.inputStyle}`}
                            type="number"
                            placeholder=""
                            ref={pageValue}
                            min="1"
                            onChange={handleChange}
                            data-test-id="serviceReq-goTo-input"
                          />
                          <span
                            className={`pl-2 pt-1 ${styles.bottomLabel3} ${styles.cursorPointer}`}
                            onClick={goToPage}
                            data-test-id="serviceReq-goTo-btn"
                          >Go</span>
                        </div>

                        </div>
                    </div>
                </div>  
            </Hidden>
            <Hidden smUp>
                
            </Hidden>
          
        </>
  );
};

export default ListView;