import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const CustomLoader = (props: any): JSX.Element => { 
    const classes = useStyles();
    const { loader } = props;
    return (
        <div>
            <Backdrop className={classes.backdrop} open={loader}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
export default CustomLoader;
