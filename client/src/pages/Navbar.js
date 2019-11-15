import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import axios from "axios";

import NotificationButton from "./NotificationButton";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  logInNavbar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    position: "fixed"
  },
  loggedInNavbar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    position: "static"
  }
});

class NavigationBar extends Component {
  state = {
    anchorEl: null,
    setAnchorEl: null,
    token: localStorage.getItem("jwtToken"),
    userId: localStorage.getItem("userId"),
    profile: {}
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = event => {
    event.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  };

  componentDidMount() {
    axios.get(`/profile/get/${this.state.userId}`, { headers: { Authorization: `Bearer ${this.state.token}` } })
    .then(res => {
        this.setState({
            profile: res.data.profile
        });
    })
    .catch(err => {
        console.log("Error fetching and parsing data", err);
    });
  }
  
  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const { profile } = this.state;

    let buttons;

    if (this.state.token) {
      buttons = (
        <div>
          <Button component={Link} to={"/profile"}>
            BECOME A SITTER
          </Button>
          <Button component={Link} to={"/sitter-search"}>
            My Sitters
          </Button>
          <NotificationButton></NotificationButton>
          <Button component={Link} to={"/messages"}>
            Messages
          </Button>
          <IconButton aria-label="avatar" onClick={this.handleClick}>
            <Avatar
              alt="Remy Sharp"
              src={profile.photoUrl}
              className={classes.bigAvatar}
            />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem component={Link} to={"/profile"}>
              Profile
            </MenuItem>
            <MenuItem component={Link} to={"/my-jobs"}>
              My Jobs
            </MenuItem>
            <MenuItem onClick={this.handleClose}>My account</MenuItem>
            <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
          </Menu>
        </div>
      );
    } else {
      buttons = (
        <div>
          <Button
            className={classes.menuButton}
            color="inherit"
            component={Link}
            to={"/profile"}
          >
            BECOME A SITTER
          </Button>
          <Button
            className={classes.menuButton}
            variant="outlined"
            color="secondary"
            component={Link}
            to={"/login"}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={"/signup"}
          >
            Sign Up
          </Button>
        </div>
      );
    }

    return (
      <div className={classes.root}>
      <AppBar className={this.state.token ? classes.loggedInNavbar : classes.logInNavbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img
              src={require("../images/loving-sitter-logo.png")}
              alt="logo of app"
            />
          </Typography>
          {buttons}
        </Toolbar>
      </AppBar>
    </div>
    );
  };
}

export default withStyles(styles, { withTheme: true })(NavigationBar);