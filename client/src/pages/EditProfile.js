import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import NavigationBar from "./Navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";

import SideNavigationBar from "./SideNavBar";

import Button from "@material-ui/core/Button";

import { Snackbar, IconButton } from "@material-ui/core";

class EditProfilePage extends Component {
  state = {
    user: {
      userId: "",
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      rate: ""
    },
    errors: {
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      rate: ""
    },
    disabled: true,
    snackbaropen: false,
    snackbarmsg: "",
    formChanges: false
  };

  componentWillMount() {
    this.prefillProfile();
  }

  prefillProfile() {
    const token = localStorage.getItem("jwtToken");
    const id = jwt_decode(token).id;
    axios
      .get(`profile/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data.profile) {
          this.setState({ user: res.data.profile });
        }
      })
      .catch(err => {
        console.log({ err });
      });
  }

  createProfile() {
    const token = localStorage.getItem("jwtToken");
    const valid = this.checkValid();

    if (valid) {
      axios
        .post("profile/create", this.state.user, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          this.setState({ user: res.data });
          this.setState({ snackbaropen: true });
        })
        .catch(err => {
          console.log({ err });
        });
    } else {
      this.setState({ snackbarmsg: "You have errors with your profile details" });
      this.setState({ snackbaropen: true });
    }
  }

  checkValid() {
    var valid = true;
    var checkErrors = {
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      rate: ""
    }
    if (this.state.user.firstName.length < 1) {
      valid = false;
      checkErrors.firstName = "First name is invalid"
    } else { checkErrors.firstName = "" }

    if (this.state.user.lastName.length < 1) {
      valid = false;
      checkErrors.lastName = "Last name is invalid"
    } else { checkErrors.lastName = "" }

    if (this.state.user.gender.length < 1) {
      valid = false;
      checkErrors.gender = "Gender is invalid"
    } else { checkErrors.gender = "" }

    if (this.state.user.birthDate.length < 1) {
      valid = false;
      checkErrors.birthDate = "Birth Date is invalid"
    } else { checkErrors.birthDate = "" }

    if (this.state.user.email.length < 1) {
      valid = false;
      checkErrors.email = "Email is invalid"
    } else { checkErrors.email = "" }

    if (this.state.user.phone.length < 10) {
      valid = false;
      checkErrors.phone = "Phone Number is invalid"
    } else { checkErrors.phone = "" }

    if (this.state.user.address.length < 1) {
      valid = false;
      checkErrors.address = "Address is invalid"
    } else { checkErrors.address = "" }

    if (this.state.user.description.length < 1) {
      valid = false;
      checkErrors.description = "Description is invalid"
    } else { checkErrors.description = "" }

    if (this.state.user.rate.length < 1) {
      valid = false;
      checkErrors.rate = "Rate is invalid"
    } else { checkErrors.rate = "" }

    this.setState({
      errors: checkErrors
    })
    return valid;
  }

  updateProfile() {
    const token = localStorage.getItem("jwtToken");
    const id = this.state.user.userId;

    const valid = this.checkValid();

    if (valid) {
      axios
        .put(`profile/update/${id}`, this.state.user, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          this.setState({ user: res.data });
          this.setState({ snackbarmsg: "Profile Saved" });
          this.setState({ snackbaropen: true });
        })
        .catch(err => {
          this.setState({ snackbarmsg: "Your details do not meet the necessary criteria." });
          this.setState({ snackbaropen: true });
          console.log({ err });
        });
    }
    else {
      this.setState({ snackbarmsg: "You have errors with your profile details" });
      this.setState({ snackbaropen: true });
    }
  }

  handleInputChange = event => {
    const field = event.target.name;
    let user = { ...this.state.user };
    user[field] = event.target.value;
    this.setState({ user });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.user.userId) {
      this.updateProfile();
    } else {
      this.createProfile();
    }

    this.setState({ disabled: true });
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  snackbarClose = event => {
    this.setState({ snackbaropen: false });
  };

  enableEdit = event => {
    this.setState({ disabled: false, edit: "1" });
  };

  cancelEdit = event => {
    this.setState({ disabled: true, edit: "0" });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.snackbaropen}
          autoHideDuration={3000}
          onClose={this.snackbarClose}
          message={<span id="message-id">{this.state.snackbarmsg}</span>}
          action={[
            <IconButton
              key="close"
              arial-label="Close"
              color="inherit"
              onClick={this.snackbarClose}
            ></IconButton>
          ]}
        />
        <NavigationBar></NavigationBar>
        <div className="pageArea">
          <div className="infoArea">
            <div className="menuArea">
              <SideNavigationBar></SideNavigationBar>
            </div>
            <div className="settingsArea">
              <Grid container spacing={3}>
                <Grid item xs={12} className="center">
                  <h1>Edit Profile</h1>
                </Grid>
                <Grid item xs={12}>
                  <form
                    noValidate
                    autoComplete="off"
                    method="POST"
                    onSubmit={this.handleSubmit}
                  >
                    <Grid container spacing={3} className="pb-1">
                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>FIRST NAME</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.firstName}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="firstName"
                              id="standard-firstName"
                              placeholder="John"
                              value={this.state.user.firstName}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* Last name */}

                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>LAST NAME</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.lastName}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="lastName"
                              id="standard-lastName"
                              placeholder="Doe"
                              value={this.state.user.lastName}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* Gender */}

                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>GENDER</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.gender}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              select
                              name="gender"
                              id="standard-gender"
                              label="gender"
                              value={this.state.user.gender}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            >
                              <MenuItem value="">
                                <em>Gender</em>
                              </MenuItem>
                              <MenuItem value={"male"}>Male</MenuItem>
                              <MenuItem value={"female"}>Female</MenuItem>
                            </TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* DOB */}

                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>BIRTH DATE</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.birthDate}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              type="date"
                              name="birthDate"
                              id="standard-birthDate"
                              value={this.state.user.birthDate}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* Email */}

                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>EMAIL ADDRESS</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.email}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="email"
                              placeholder="john-doe.s@gmail.com"
                              id="standard-email"
                              value={this.state.user.email}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* Phone number */}

                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>PHONE NUMBER</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.phone}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="phone"
                              id="standard-phone"
                              value={this.state.user.phone}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* Address */}

                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>WHERE YOU LIVE</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.address}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="address"
                              placeholder="Address"
                              id="standard-address"
                              value={this.state.user.address}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/* Description */}
                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>DESCRIBE YOURSELF</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.description}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="description"
                              placeholder="About you"
                              id="standard-description"
                              value={this.state.user.description}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      {/*Hourly Rate*/}
                      <Grid item xs={1}></Grid>
                      <Grid item xs={9}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} className="text-right">
                            <p>YOUR HOURLY RATE</p>
                            {this.state.errors ? (
                              <div style={{ color: "red" }}>
                                {this.state.errors.rate}
                              </div>
                            ) : null}
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              name="rate"
                              placeholder="Your hourly rate"
                              id="standard-rate"
                              type="number"
                              value={this.state.user.rate}
                              onChange={this.handleInputChange}
                              margin="normal"
                              variant="outlined"
                              disabled={this.state.disabled}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>

                      <Grid item xs={4}></Grid>

                      <Grid item xs={4} className="center">
                        <Button
                          fullWidth
                          size="large"
                          variant="contained"
                          className="submit-button"
                          onClick={this.handleSubmit}
                          disabled={this.state.disabled}
                        >
                          Save
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          fullWidth
                          size="large"
                          variant="contained"
                          className="submit-button"
                          onClick={this.enableEdit}
                          disabled={!this.state.disabled}
                        >
                          Edit
                        </Button>
                      </Grid>

                      {!this.state.disabled ? (
                        <Grid item xs={2}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            size="large"
                            onClick={this.cancelEdit}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      ) : (
                          <Grid item xs={2}></Grid>
                        )}
                      <Grid item xs={2}></Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        {/* <SimpleSnackbar></SimpleSnackbar> */}
      </div>
    );
  }
}

export default EditProfilePage;
