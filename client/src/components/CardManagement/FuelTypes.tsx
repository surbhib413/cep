import React, { useEffect, useState } from 'react'
import { indexOf } from "lodash";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core"
import styles from "./BulkActionPopup.module.scss" 

export default function fuelTypesOptions(props: any): JSX.Element {
    const { fuelTypeData } = props;
    const { columns = 3, onChangeHandler, selectedFuelTypes, disabled = false } = props;

    return (
        <React.Fragment>
            {
                fuelTypeData.map((fuelType: any) => {
                    if(fuelType.code != '' && fuelType.displayName != ''){
                        return (
                            <Grid item xs={columns} sm={columns} key={fuelType.code}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            color="primary"
                                            name={fuelType.code}
                                            onChange={onChangeHandler}
                                            checked={indexOf(selectedFuelTypes, fuelType.code) > -1}
                                            disabled={disabled}
                                        />
                                    }
                                    label={<span className={styles.fuelTypeLabel}>{fuelType.displayName}</span>
                                    }
                                />
                            </Grid>
                        );
                    }    
                })
            }
        </React.Fragment>
    )
} 
