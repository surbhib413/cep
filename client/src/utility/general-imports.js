// React
import React, { useEffect, useState, useContext } from "react";

// React-redux
import { useDispatch, useSelector } from "react-redux";

// Router
import { useRouter } from "next/router";

// Material UI
import { createStyles, makeStyles, withStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
 
import {
    Box,
    Typography,
    Checkbox,
    OutlinedInput,
    InputAdornment,
    Button,
    ButtonGroup,
    Tabs,
    Grid,
    FormControlLabel,
    Radio,
    Tooltip,
    Grow,
    Popper,
    MenuItem,
    MenuList,
    ClickAwayListener,
    Collapse, 
    IconButton, 
    SwipeableDrawer,
    Dialog,
    TextField,
    Container,
    Hidden,
    FormControl,
    ListItemText,
    
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { Alert } from "@material-ui/lab";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close"

// Lodash
import { 
    includes, 
    filter, 
    concat, 
    toString, 
    isNumber, 
    toNumber,
    indexOf,
    toLower,
    cloneDeep,
    isEmpty
} from "lodash"

// moment
import moment from "moment";

// Formik
import { Formik } from "formik";

// Yup
import * as Yup from "yup";

export {
    React,
    useEffect,
    useState,
    useSelector,
    useDispatch,
    useRouter,
    useContext,
    createStyles,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Checkbox,
    OutlinedInput,
    InputAdornment,
    Button,
    ButtonGroup,
    Tabs,
    Grid,
    FormControlLabel,
    Radio,
    Pagination,
    Alert,
    includes, 
    filter, 
    concat, 
    toString, 
    isNumber, 
    toNumber,
    moment,
    withStyles,
    Tooltip,
    Box,
    Grow,
    Popper,
    MenuItem,
    MenuList,
    ClickAwayListener,
    Collapse, 
    IconButton, 
    SwipeableDrawer,
    MuiDialogTitle,
    MuiDialogContent,
    MuiDialogActions,
    CloseIcon,
    indexOf,
    toLower,
    Dialog,
    TextField,
    Container,
    Hidden,
    FormControl,
    ListItemText,
    cloneDeep,
    Formik,
    Yup,
    isEmpty
}


