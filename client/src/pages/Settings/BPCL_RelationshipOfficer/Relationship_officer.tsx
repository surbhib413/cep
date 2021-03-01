import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, makeStyles, InputAdornment, Snackbar, Hidden } from "@material-ui/core";
// import styles from "./../Settings.module.scss";
import styles from "./relationshipofficer.module.scss";
import Divider from '@material-ui/core/Divider';
import Navigation from '../Navigation'
import { CustomLabel } from "../../../components/CustomTextField/CustomLabel";
import { CustomButton } from "../../../components/CustomButton/CustomButton";
import CustomTextField from "../../../components/CustomTextField/CustomTextField";
import { getRelationshipOfficerdata } from "../../../lib/api/smartfleet/settings/bpclrelationshipofficer";
import Card from '../Card'
import { useRouter } from "next/router";


// const useStyles = makeStyles({
//   textField: {
//     // backgroundColor: 'transparent',
//     backgroundColor: 'pale-grey'
    
//   }
// });

const BPCLRelationshipOfficer = (props: any): JSX.Element => {
  
  const router = useRouter();
  const backIcon = "/Back_Icon.svg"; 
  const [edit,setEdit] = useState(false);
  const [initialData,setInitialData] = useState(props.initialData);
  const [validInput,setValidInput] = useState(false);
  // const classes = useStyles();
  
  
  const initFields = {
    name: "",
    mobileNumber: "",
    email: "",
  }

  const [fields, setFields] = React.useState(initFields);

  useEffect(() => {

  const { initialData } = props;
    if (initialData) {
      console.log("initialData", initialData);
          
      const initialFields = {
        name: initialData[0]?.name,
        mobileNumber: initialData[0]?.mobileNumber,
        email: initialData[0]?.email,        
      };     
      setFields(initialFields);
     
    }
  }, []);



  return (
    <Container>

      <Grid container  spacing={10} className={styles.padTop} >

        <Grid item xs={12} sm={2} className={`${styles.mobileSideBar} py-0`}>sidebar</Grid>
        <Grid item xs={12} sm={10} className={`${styles.mainGridContainer}`}>
          <Hidden smDown>
            <Grid item xs={12} sm={4} >
            <Card />
              <Navigation isModified={validInput} />
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={8} >

            <div className={`ml-3 mr-2`}>
              <div className={`d-flex align-items-baseline justify-content-between ml-2`}>
                <Typography className={`${styles.relationshipoff}`}  >
                   
                    <Hidden smUp>
                      <img
                        className={`mr-3 ${styles.backToMyProfile}`}
                        src={backIcon}
                        alt=""
                        onClick={() => router.back()}
                      />
                    </Hidden>
                    BPCL Relationship Officer
                    
                </Typography>
              </div>
              <Divider className={`${styles.secDivider} mb-3 ml-2 `} />

              <Grid container>

                <Grid item xs={12} sm={6} className="px-2">
                    <div>
                      <CustomLabel htmlFor="">
                        Name
                      </CustomLabel>
                      <CustomTextField
                        className={`${styles.textField}`}
                        variant="outlined"
                        placeholder="Adam Scott"
                        disabled={!edit}
                        name="name"
                        value={fields.name}
                      />
                    </div>
                </Grid>

                <Grid item xs={12} sm={6} className="px-2">
                  <div>
                    <CustomLabel htmlFor="">
                      Mobile Number
                    </CustomLabel>
                    <CustomTextField
                      className={`${styles.textField}`}
                      variant="outlined"
                      placeholder="9820098200"
                      disabled={!edit}
                      name="mobile"
                      value={fields.mobileNumber}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} className="px-2">
                  <div>
                    <CustomLabel htmlFor="">
                      Email ID
                    </CustomLabel>
                    <CustomTextField
                      className={`${styles.textField}`}
                      variant="outlined"
                      placeholder="adamscott@gmail.com"
                      disabled={!edit}
                      name="email"
                      value={fields.email}
                    />
                  </div>
                </Grid>
               
              </Grid>
              
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BPCLRelationshipOfficer;