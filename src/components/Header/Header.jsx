import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
// import Toolbar from "@material-ui/core";
// import Typography from "@material-ui/core/Typography";
//import useStyles from './styles';
// import logo from "../../assets/logo.png";

export default function Header() {
  //const classes = useStyles();

  return (
    <AppBar position="absolute" color="default">
      <Toolbar></Toolbar>
    </AppBar>
  );
}
