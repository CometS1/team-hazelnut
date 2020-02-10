import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import "../App.scss";
import Button from "@material-ui/core/Button";

import { Snackbar, IconButton } from "@material-ui/core";

export const snackbarmsg = "wow";

const initalState = {
  name: "",
  nameError: "",
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
  snackbaropen: false,
  confirmPassword: "",
  errors: ""
};

class SignUpPage extends Component {
  state = initalState;

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handleNameChange = event => {
    if (event.target.value.match("^[a-zA-Z]*$") != null) {
      this.setState({ name: event.target.value });
    }
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = event => {
    this.setState({ confirmPassword: event.target.value });
  };

  emailValidate = () => {
    let emailError = "";
    var re = /[^@]+@[^.]+..+/;
    var test = re.test(this.state.email);
    if (!test === true) {
      emailError = "Invalid email";
    }
    
    if (emailError) {
      this.setState({ emailError });
      return false;
    }
    this.setState({ emailError: undefined });
    return true;
  };

  nameValidate = () => {
    let nameError = "";

    if (this.state.name.length < 1) {
      nameError = "Please enter your name";
    }

    if (nameError) {
      this.setState({ nameError });
      return false;
    }
    this.setState({ nameError: undefined });
    return true;
  };

  passwordValidate = () => {

    this.setState({ emailError: undefined });
    return true;
  };
  
  nameValidate = () => {
    let nameError = "";
    
    if (this.state.name.length < 1) {
      nameError = "Please enter your name";
    }
    
    if (nameError) {
      this.setState({ nameError });
      return false;
    }
    this.setState({ nameError: undefined });
    return true;
  };

  passwordValidate = () => {
    let passwordError = "";
    
    if (this.state.password.length < 6) {
      passwordError = "Password is too short";
    }
    
    if (passwordError) {
      this.setState({ passwordError });
      this.setState({
        snackbaropen: true,
        snackbarmsg: "Password is too short!"
      });

      return false;
    }
    this.setState({ passwordError: undefined });
    return true;
  };

  handleSubmit = event => {
    event.preventDefault();
    const emailIsValid = this.emailValidate();
    const nameIsValid = this.nameValidate();
    const passwordIsValid = this.passwordValidate();
    if (emailIsValid && nameIsValid && passwordIsValid) {
      console.log(this.state);
      this.setState(initalState);

      const { name, email, password, confirmPassword } = this.state;

      const newUser = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      }

      axios.post('/users/register', newUser)
      .then(res => {
          const { token } = res.data;
          const decoded = jwt_decode(token);
          localStorage.setItem('jwtToken', token);
          localStorage.setItem("userId", decoded.id);
          this.props.history.push('/');
      })
      .catch(err => {
          this.setState({
            errors: err.response.data.error  // Error messages from backend
          });
      });
    }
  };

  snackbarClose = event => {
    this.setState({ snackbaropen: false });
  };

  enableEdit = event => {
    this.setState({ disabled: false });
  };

  handleEnterButton = event => {
    if (event.keyCode === 13){document.getElementById('signup-button').click()}
  }

  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
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
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <div className="container">
              <div className="infoBox ">
                <form onSubmit={this.handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <h1 className="center">Sign Up</h1>
                    </Grid>

                    {
                      (this.state.errors)
                      ? <Grid item xs={12} className="pb-0 pt-0" style={{ color: "red" }}>
                          <p className="mb-0 mt-0">{this.state.errors}</p>
                        </Grid>
                      : null
                    }

                    <Grid item xs={12} className="pb-0 pt-0">
                      <p className="mb-0 mt-0">NAME</p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="name"
                        id="outlined-name"
                        placeholder="Name"
                        margin="normal"
                        variant="outlined"
                        type="text"
                        value={this.state.name}
                        onChange={this.handleNameChange}
                        fullWidth
                      />
                      <div style={{ color: "red" }}>{this.state.nameError}</div>
                    </Grid>

                    <Grid item xs={12} className="pb-0 pt-0">
                      <p className="mb-0 mt-0">EMAIL ADDRESS</p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="email"
                        id="outlined-email"
                        placeholder="Email"
                        margin="normal"
                        variant="outlined"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        {this.state.emailError}
                      </div>
                    </Grid>

                    <Grid item xs={12} className="pb-0 pt-0">
                      <p className="mb-0 mt-0">PASSWORD</p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="password"
                        id="outlined-password"
                        placeholder="Password"
                        margin="normal"
                        variant="outlined"
                        type="password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        {this.state.passwordError}
                      </div>
                    </Grid>

                    <Grid item xs={12} className="pb-0 pt-0">
                      <p className="mb-0 mt-0">CONFIRM PASSWORD</p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="confirmPassword"
                        id="outlined-password"
                        placeholder="Confrim Password"
                        margin="normal"
                        variant="outlined"
                        type="password"
                        value={this.state.confirmPassword}
                        onChange={this.handleConfirmPasswordChange}
                        onKeyDown={this.handleEnterButton}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8} className="center">
                      <Button
                        id="signup-button"
                        variant="contained"
                        onClick={this.handleSubmit}
                        fullWidth
                        className="submit-button"
                        size="large"
                      >
                        Sign Up
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item xs={12} className="center">
                      <p>
                        Already have an Account? <a href="../login">Login</a>
                      </p>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </div>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </div>
    );
  }
}

export default SignUpPage;
