import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import NavigationBar from "./Navbar";
import React, { Component } from "react";
import SideNavigationBar from "./SideNavBar";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Snackbar, IconButton, Divider } from "@material-ui/core";

function DataDisplay(props) {
  return (
    <Grid item container>
      <Grid item sm={2} xs={12}>
        <Typography variant="subtitle1" className="center">{props.title}</Typography>
      </Grid>
      <Grid item sm={8} xs={12}>
        <Typography variant="h6" component={props.component} className="center font-medium">{props.label}</Typography>
      </Grid>
    </Grid>
  )
}

function EditBox(props) {
  return (
    <Grid item>
      <TextField
        disabled={props.disabled}
        id={props.id}
        label={props.label}
        name={props.name}
        onChange={props.onChange}
        placeholder={props.placeholder}
        value={props.value}
        variant="outlined"
      />
    </Grid>
  )
}

function HLine(){
  return (
    <Grid item xs={12}><Divider></Divider></Grid>
  )
}

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
    hideEdit: "none",
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
      .get(`profile/get/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.profile) { this.setState({ user: res.data.profile }); }
      })
      .catch(err => { console.log({ err }); });
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
    this.setState({ disabled: false, hideEdit: "" });
  };

  cancelEdit = event => {
    this.setState({ disabled: true, hideEdit: "none" });
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
              <form
                noValidate
                autoComplete="off"
                method="POST"
                onSubmit={this.handleSubmit}
              >
                <Grid container justify="center" spacing={3} className="p-1">

                  <Grid item>
                    {this.state.errors ? (
                      <div style={{ color: "red" }}>
                        <p>{this.state.errors.firstName}</p>
                        <p>{this.state.errors.lastName}</p>
                        <p>{this.state.errors.gender}</p>
                        <p>{this.state.errors.birthDate}</p>
                        <p>{this.state.errors.email}</p>
                        <p>{this.state.errors.phone}</p>
                        <p>{this.state.errors.address}</p>
                        <p>{this.state.errors.description}</p>
                        <p>{this.state.errors.rate}</p>
                      </div>
                    ) : null}
                  </Grid>

                  {!this.state.disabled ?
                    <Grid container direction="row" justify="center" spacing={3}>

                      {/* First name */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-firstName"
                        label="First Name"
                        name="firstName"
                        onChange={this.handleInputChange}
                        placeholder="John"
                        value={this.state.user.firstName}
                        variant="outlined"
                      ></EditBox>

                      {/* Last name */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={this.handleInputChange}
                        placeholder="Doe"
                        value={this.state.user.lastName}
                        variant="outlined"
                      ></EditBox>

                      {/* Gender */}
                      <Grid item>
                        <TextField
                          disabled={this.state.disabled}
                          id="standard-gender"
                          label="Gender"
                          name="gender"
                          onChange={this.handleInputChange}
                          select
                          value={this.state.user.gender}
                          variant="outlined"
                        >
                          <MenuItem value="">
                            <em>Gender</em>
                          </MenuItem>
                          <MenuItem value={"male"}>Male</MenuItem>
                          <MenuItem value={"female"}>Female</MenuItem>
                        </TextField>
                      </Grid>

                      {/* DOB */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-birthDate"
                        label="Birth Date"
                        name="birthDate"
                        onChange={this.handleInputChange}
                        type="date"
                        value={this.state.user.birthDate}
                        variant="outlined"
                      ></EditBox>

                      {/* Email */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-email"
                        label="Email Address"
                        name="email"
                        onChange={this.handleInputChange}
                        placeholder="john-doe.s@gmail.com"
                        value={this.state.user.email}
                        variant="outlined"
                      ></EditBox>

                      {/* Phone number */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-phone"
                        label="Phone Number"
                        name="phone"
                        onChange={this.handleInputChange}
                        value={this.state.user.phone}
                        variant="outlined"
                      ></EditBox>

                      {/* Address */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-address"
                        label="Address"
                        name="address"
                        onChange={this.handleInputChange}
                        placeholder="Address"
                        value={this.state.user.address}
                        variant="outlined"
                      ></EditBox>

                      {/* Description */}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-description"
                        label="Describe Yourself"
                        name="description"
                        onChange={this.handleInputChange}
                        placeholder="About you"
                        value={this.state.user.description}
                        variant="outlined"
                      ></EditBox>

                      {/*Hourly Rate*/}
                      <EditBox
                        disabled={this.state.disabled}
                        id="standard-rate"
                        label="Hourly Rate"
                        name="rate"
                        onChange={this.handleInputChange}
                        placeholder="Your hourly rate"
                        type="number"
                        value={this.state.user.rate}
                        variant="outlined"
                      ></EditBox>
                    </Grid>
                    :
                    <Grid container direction="row" justify="center" spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h3" className="center">{this.state.user.firstName} {this.state.user.lastName}</Typography>
                      </Grid>
                      <DataDisplay title="Gender" label={this.state.user.gender}></DataDisplay>
                      <HLine></HLine>
                      <DataDisplay title="Birthday" label={this.state.user.birthDate}></DataDisplay>
                      <HLine></HLine>
                      <DataDisplay title="Email" label={this.state.user.email}></DataDisplay>
                      <HLine></HLine>
                      <DataDisplay title="Phone" label={this.state.user.phone}></DataDisplay>
                      <HLine></HLine>
                      <DataDisplay title="Address" label={this.state.user.address}></DataDisplay>
                      <HLine></HLine>
                      <DataDisplay title="Description" label={this.state.user.description}></DataDisplay>
                      <HLine></HLine>
                      <DataDisplay title="Rate" label={"$" + this.state.user.rate + " an hour"}></DataDisplay>
                      <HLine></HLine>
                    </Grid>

                  }{/*Add display of profile */}

                  <Grid item>
                    <Button
                      size="large"
                      variant="contained"
                      className="submit-button"
                      onClick={this.handleSubmit}
                      disabled={this.state.disabled}
                    >
                      Save
                        </Button>
                  </Grid>
                  <Grid item>
                    <Button
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
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={this.cancelEdit}
                      >
                        Cancel
                          </Button>
                    </Grid>
                  ) : (
                      <Grid item></Grid>
                    )}

                </Grid>
              </form>
            </div>
          </div>
        </div>
        {/* <SimpleSnackbar></SimpleSnackbar> */}
      </div>
    );
  }
}

export default EditProfilePage;
