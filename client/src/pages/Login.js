import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import "../App.scss";
import Button from "@material-ui/core/Button";

import { withRouter } from "react-router-dom";

const initalState = {
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
  errors: ""
};

class LoginPage extends Component {
  state = initalState;

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleEnterButton = event => {
    if (event.keyCode === 13){document.getElementById('loginButton').click()}
  }

  validate = () => {
    let emailError = "";
    var re = /[^@]+@[^.]+..+/;
    var test = re.test(this.state.email);
    if (!test === true) { emailError = "Invalid email"; }

    if (emailError) {
      this.setState({ emailError });
      return false;
    }

    this.setState({ emailError: undefined });
    return true;
  };

  handleSubmit = event => {
    event.preventDefault();
    const isValid = this.validate();

    if (isValid) {
      const { email, password } = this.state;

      const data = {
        email: email,
        password: password
      };
      axios
        .post("/users/login", data)
        .then(res => {
          const { token } = res.data;
          const decoded = jwt_decode(token);
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("userId", decoded.id);
          this.props.history.push("/profile");
        })
        .catch(err => {
          this.setState({
            errors: err.response.data.error // Error messages from backend
          });
        });
    }
  };

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <div className="container">
              <div className="infoBox ">
                <form onSubmit={this.handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <h1 className="center">LogIn</h1>
                    </Grid>
                    {this.state.errors ? (
                      <Grid
                        item
                        xs={12}
                        className="pb-0 pt-0"
                        style={{ color: "red" }}
                      >
                        <p className="mb-0 mt-0">{this.state.errors}</p>
                      </Grid>
                    ) : null}
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
                        onKeyDown={this.handleEnterButton}
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
                        onKeyDown={this.handleEnterButton}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8} className="center">
                      <Button
                        id="loginButton"
                        variant="contained"
                        onClick={this.handleSubmit}
                        fullWidth
                        className="submit-button"
                        size="large"
                      >
                        Login
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item xs={12} className="center">
                      <p>
                        Don't have an Account? <a href="../signup">Register</a>
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
export default withRouter(LoginPage);
