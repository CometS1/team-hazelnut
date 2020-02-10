import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import NavigationBar from "./Navbar";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";

import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import axios from "axios";

import Moment from 'react-moment';

const photoPageStyle = theme => ({
  root: {
    backgroundColor: '#f8f6f6'
  },
  bigAvatar: {
    width: 100,
    height: 100,
    margin: "10px"
  },
  contactBtn: {
    backgroundColor: "orange",
    color: "#fff"
  },

  payBtn: {
    backgroundColor: "green",
    color: "#fff"
  }
});

const initalState = {
  //Need to fix status per request
  status: "",
  sentRequests: [],
  recievedRequests: [],
};

class MyJobsPage extends Component {
  state = initalState;
  
  componentDidMount() {

    const token = localStorage.getItem("jwtToken");

    //Deal with status later
    axios.get("/users/getRequestsWithProfile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        this.setState({
          sentRequests: res.data.requests
        })
        console.log(res.data.requests);
      })
      .catch(err => {
        console.log("Error fetching user sent requests and parsing data", err);
      })

    axios.get("/users/getRequestedWithProfile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        this.setState({
          recievedRequests: res.data.requests
        })
        console.log(res.data.requests);
      })
      .catch(err => {
        console.log("Error fetching requests for user and parsing data", err);
      })
  }

  jobRequestResponse = event => {
    console.log("in accept")
    console.log(event)
    console.log(event.currentTarget.value)
    this.setState({ status: event.currentTarget.value })
    console.log(this.state)
  };

  render() {
    const { classes } = this.props
    return (
      <div>
        <NavigationBar></NavigationBar>
        <Grid container className={classes.root}>
          <Grid container>
            <Grid item xs={12} className="center">
              <h1>My Job Requests</h1>
            </Grid>
            <Grid item xs={12} className="center">
              <h2>Sent Job Requests</h2>
            </Grid>

            <Grid container spacing={3} align="column" justify="center">

              {this.state.sentRequests.map((request, key) =>
                <Grid item xs={8} key={key}>
                  <Card>
                    <div>
                      <Grid container spacing={3}>
                        <Grid
                          item
                          xs={2}
                          container
                          spacing={0}
                          align="center"
                          justify="center"
                          direction="column"
                        >
                          <Avatar
                            alt="Remy Sharp"
                            src={require("../images/07cc6abd390ab904abbf31db5e6ea20357f8b127.png")}
                            className={classes.bigAvatar}
                          />
                        </Grid>

                        <Grid item xs={10}>
                          <Grid container spacing={3} align="column">
                            <Grid item xs={3}>
                              <CardContent className="pb-0">
                                <Typography component="h5" variant="h5">
                                  {request.profileInfo.firstName} {request.profileInfo.lastName}
                                </Typography>
                              </CardContent>
                            </Grid>
                            <Grid item xs={3}>
                              <Box
                                component="fieldset"
                                borderColor="transparent"
                                className="mt-1 pt-0"
                              >
                                <Rating value={5} readOnly />
                              </Box>
                            </Grid>

                            <Grid item xs={2}>
                              <CardContent className="pb-0">
                                <Typography component="h5" variant="h5">
                                  ${request.profileInfo.rate}/hr
                          </Typography>
                              </CardContent>
                            </Grid>

                            <Grid item xs={4}>
                              <CardContent className="pb-0">
                                <Typography component="h5" variant="h5">
                                  Status: {request.accepted === false ? "Pending" : "Accepted"}
                                </Typography>
                              </CardContent>
                            </Grid>

                            <Grid container align="column">

                              <Grid item xs={3} className="pt-0">
                                <CardContent className="pt-0">
                                  <Typography component="h5" variant="h5">
                                    {request.profileInfo.address}
                                  </Typography>
                                </CardContent>
                              </Grid>

                              <Grid item xs={4} className="pt-0">
                                <CardContent className="pt-0">
                                  <Typography component="h5" variant="h5">
                                    <Moment format="MM/DD - h:mA">{request.startDate}</Moment>
                                    <br></br>
                                    <Moment format="MM/DD - h:mA">{request.endDate}</Moment>
                                  </Typography>
                                </CardContent>
                              </Grid>

                              <Grid item xs={3} className="pt-0 pr-2">
                                <Button
                                  variant="contained"
                                  className={classes.payBtn}
                                  fullWidth
                                  size="large"
                                >
                                  Pay Now
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  </Card>
                </Grid>

              )}
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>

          <Grid item xs={12} className="center">
            <h2>Recieved Job Requests</h2>
          </Grid>

          {/* Loop code will start from here */}

          <Grid item xs={2}></Grid>

          <Grid container spacing={3} align="column" justify="center">
            {this.state.recievedRequests.map((request, key) =>
              <Grid item key={key} xs={8}>
                <Card className="mt-1 mb-1">
                  <div>
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={2}
                        container
                        spacing={0}
                        align="center"
                        justify="center"
                        direction="column"
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src={require("../images/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png")}
                          className={classes.bigAvatar}
                        />
                      </Grid>

                      <Grid item xs={10}>
                        <Grid container spacing={3}>
                          <Grid item xs={3}>
                            <CardContent className="pb-0">
                              <Typography component="h5" variant="h5">
                                {request.profileInfo.firstName} {request.profileInfo.lastName}
                              </Typography>
                            </CardContent>
                          </Grid>
                          <Grid item xs={3}>
                            <Box
                              component="fieldset"
                              borderColor="transparent"
                              className="mt-1 pt-0"
                            >
                              <Rating value={5} readOnly />
                            </Box>
                          </Grid>

                          <Grid item xs={2}>
                            <CardContent className="pb-0">
                              <Typography component="h5" variant="h5">
                                ${request.profileInfo.rate}/hr
                          </Typography>
                            </CardContent>
                          </Grid>

                          <Grid item xs={4}>
                            <CardContent className="pb-0">
                              <Typography component="h5" variant="h5">
                                {this.state.status === ""
                                  ? "Status: Pending"
                                  : this.state.status === "accepted"
                                    ? "Status: Accepted"
                                    : "Status: Declined"}
                              </Typography>
                            </CardContent>
                          </Grid>

                          <Grid container align="column">

                            <Grid item xs={3} className="pt-0">
                              <CardContent className="pt-0">
                                <Typography component="h5" variant="h5">
                                  {request.profileInfo.address}
                                </Typography>
                              </CardContent>
                            </Grid>

                            <Grid item xs={4} className="pt-0">
                              <CardContent className="pt-0">
                                <Typography component="h5" variant="h5">
                                  <Moment format="MM/DD - h:mA">{request.startDate}</Moment>
                                  <br></br>
                                  <Moment format="MM/DD - h:mA">{request.endDate}</Moment>
                                </Typography>
                              </CardContent>
                            </Grid>

                            {/*Fix status to buttons later*/}

                            <Grid item xs={2} className="pt-0">
                              {this.state.status === "" ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                  size="large"
                                  onClick={this.jobRequestResponse}
                                  value="accepted"
                                >
                                  Accept
                          </Button>
                              ) : (
                                  ""
                                )}
                            </Grid>

                            <Grid item xs={2} className="pt-0 pr-2">
                              {this.state.status === "" ? (
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  fullWidth
                                  size="large"
                                  onClick={this.jobRequestResponse}
                                  value="declined"
                                >
                                  Decline
                          </Button>
                              ) : this.state.status === "accepted" ? (
                                <Button
                                  variant="contained"
                                  className={classes.contactBtn}
                                  fullWidth
                                  size="large"
                                >
                                  Contact User
                          </Button>
                              ) : (
                                    ""
                                  )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(photoPageStyle)(MyJobsPage);
