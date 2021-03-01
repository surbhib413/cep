import CustomDialogComponent from "../../../../../components/Dialog/Dialog";
import { CustomButton } from "../../../../../components/CustomButton/CustomButton";
import {
    Checkbox,
    DialogContent,
    DialogTitle,
    DialogActions,
  } from "@material-ui/core";
import { useEffect, useState } from "react";
import styles from './CustomiseTablePopup.module.scss';
const CustomiseTable = (props: any) => {

    const [check, setcheck] = useState(true);
    //const header = 
    const [tableHeader, setTableHeader] = useState(() => {
        return (props.tableHeader.map((header:any) => {
            return(JSON.parse(JSON.stringify(header)));
        }))
    })

    const onChange = (header: any ) => {
        let checked = header.displayStatus;
        
        header.displayStatus = !checked;
        
        setcheck(!check);
    }
    const applyChanges = () => {
        props.tableHeader.map((header: any, index: number)=> {
            
                header.displayStatus = tableHeader[index].displayStatus;
        
        })
        props.closeCustomiseTableDialog();
        
    }

    // const tableHeader = props.tableHeader.map((header:any) => {
    //     return(JSON.parse(JSON.stringify(header)));
    // });

    useEffect(() => {
    },[props.tableHeader])

    return (
        <CustomDialogComponent
          scroll="paper"
          aria-labelledby="simple-dialog-title"
          open={props.customiseTableDialogOpen}
        >
            <DialogTitle>
                <div className="d-flex bd-highlight">
                <div
                    className={`w-100 align-items-center justify-content-center`}
                >
                    <span
                        className={`${styles.title}`}
                        data-test-id="serviceReq-customiseTbl-lbl"
                    >
                        Customise Table
                    </span>
                </div>
                <div className={`p-2 justify-content-end `}>
                    <img
                        className={`${styles.closeIcon}`}
                        data-test-id="serviceReq-customiseTbl-closeImg"
                        src="/close_Icon.svg"
                        alt="closeIcon"
                        onClick={props.closeCustomiseTableDialog}
                    />
                </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <div
                    //className={`d-flex flex-column justify-content-center pt-3 ${styles.selectionDiv}`}
                >
                    
                    {
                        tableHeader.map((header: any) => {
                           
                            let selectedClass;
                            header.displayStatus ? selectedClass = styles.SelectedBG : selectedClass = styles.UnselectedBG

                            return(
                            <div className= {selectedClass}//{`d-flex flex-row ${styles.SelectedBG} `}
                            >
                                
                                <img className={`pl-2 pr-3`} src="/Move.svg" alt="MoveImage"></img>
                                <Checkbox
                                    checked={header.displayStatus}
                                    onChange={()=> {
                                        onChange(header);
                                    }}
                                    name={header.name}
                                    color="primary"
                                    //disabled
                                    data-test-id="serviceReq-applicationId-chk"
                                />
                                <span data-test-id="serviceReq-applicationId-lbl">
                                    {header.name}
                                </span>
                            </div>
                            );
                        })
                    }
                    
                </div>
            </DialogContent>
            <DialogActions>
                <CustomButton
                    color="primary"
                    variant="contained"
                    onClick={applyChanges}
                    data-test-id="serviceReq-apply-btn"
                >
                    APPLY
                </CustomButton>
            </DialogActions>

        </CustomDialogComponent>
        
    );

}

export default CustomiseTable;