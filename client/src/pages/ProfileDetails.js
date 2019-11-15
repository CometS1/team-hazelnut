import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import NavigationBar from "./Navbar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Card from "@material-ui/core/Card";
import { Snackbar, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";

const detailsPageStyle = theme => ({
  detailsContainer: {
    margin: theme.spacing.unit * 2
  },
  container: {
    marginBottom: theme.spacing(100)
  },
  smallAvatar: {
    width: 75,
    height: 75
  },
  bigAvatar: {
    width: 300,
    height: 300
  },
  roundedBigAvatar: {
    width: 300,
    height: 300,
    borderRadius: 10
  },
  root: {
    flexGrow: 1
  },
  marginHorizontal: {
    marginLeft: 60,
    marginRight: 30
  },
  marginBottom: {
    marginBottom: 30
  },
  squareBackground: {
    borderRadius: 0,
    width: 300,
    height: 300
  },
  border: {
    border: 10
  },
  requestBtn: {
    backgroundColor: "red",
    color: "white"
  },

  statusCard: {
    marginBottom: 30,
    width: "80%",
    margin: "auto",
    lineHeight: "26px"
  },

  reviews: {
    margin: "auto",
    width: "80%"
  },

  marginAuto: {
    margin: "auto"
  }
});

class ProfileDetails extends Component {
  state = {
    status: "Available",
    profile: {},
    request: {
      requestedUserId: this.props.match.params.id,
      startDate: "",
      endDate: "",
      accepted: false,
      paid: false,
      firstName: "",
      lastName: "",
      rate: ""
    },
    snackbaropen: false,
    snackbarmsg: ""
  };

  componentDidMount() {
    // Get token from local storage
    const token = localStorage.getItem("jwtToken");

    axios
      .get(`/profile/get/${this.props.match.params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log(res);
        this.setState({
          profile: res.data.profile,
        });
      })
      .catch(err => {
        console.log("Error fetching and parsing data", err);
      });
  }

  handleInputChange = event => {
    const field = event.target.name;
    let request = { ...this.state.request };
    request[field] = event.target.value;
    this.state.request.firstName = this.state.profile.firstName;
    this.state.request.lastName = this.state.profile.lastName;
    this.state.request.rate = this.state.profile.rate;
    this.setState({ request });
  };

  sendRequest = () => {
    const token = localStorage.getItem("jwtToken");
    const request = this.state.request;

    axios
      .post("/users/sendrequest", request, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        this.setState({ snackbarmsg: "Request was sent" });
        this.setState({ snackbaropen: true });
      })
      .catch(err => {
        this.setState({ snackbarmsg: `${err.response.data.error}` });
        this.setState({ snackbaropen: true });
        console.log({ err });
      });
  };
  snackbarClose = event => {
    this.setState({ snackbaropen: false });
  };

  render() {
    const { classes } = this.props;
    const { profile } = this.state;
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
        <NavigationBar></NavigationBar>
        <Grid container className={"pb-1"}>
          <Grid item xs={1}></Grid>
          <Grid item xs={11} className="pl-0">
            <Button component={Link} to={"../sitter-search"}>
              &lt; Back to list
            </Button>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={7}>
            <Grid container align="center">
              <Box width={1} boxShadow={2}>
                <Grid item>
                  <Avatar
                    alt="Your Profile Picture"
                    src={profile.photoUrl}
                    className={classes.bigAvatar}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h4">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                </Grid>
                <Grid item className={classes.marginBottom}>
                  <Typography variant="subtitle2">Loving pet sitter</Typography>
                </Grid>

                <Grid item className={classes.marginBottom}>
                  <Typography variant="subtitle2">{profile.address}</Typography>
                </Grid>
                <Grid
                  item
                  xs={11}
                  align="left"
                  className={classes.marginBottom}
                >
                  <h2>About Me</h2>
                </Grid>
                <Grid
                  item
                  xs={11}
                  align="left"
                  className={classes.marginBottom}
                >
                  <Typography
                    className={classes.marginHorizontal}
                    variant="body1"
                  >
                    {profile.description}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={11}
                  align="left"
                  className={classes.marginBottom}
                >
                  <Avatar
                    alt="Your Pets"
                    src={profile.photoUrl}
                    className={classes.roundedBigAvatar}
                    style={{ borderRadius: 10 }}
                  />
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Box boxShadow={2} className={classes.statusCard}>
              <Grid container align="center" direction="column">
                {/*Add color based on status*/}
                <Box width={1}>
                  <h2>{this.state.status}</h2>
                </Box>
                <Grid item>
                  <h2>${profile.rate}/hr</h2>
                </Grid>
                <Grid item>
                  <Rating value={5} readOnly className={"mb-1"} />
                </Grid>
                <Grid item className={classes.marginBottom}>
                  <TextField
                    id="drop-in"
                    label="Drop In"
                    name="startDate"
                    type="datetime-local"
                    onChange={this.handleInputChange}
                    defaultValue="2019-05-24T10:30"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item className={classes.marginBottom}>
                  <TextField
                    id="drop-out"
                    label="Drop Out"
                    name="endDate"
                    type="datetime-local"
                    onChange={this.handleInputChange}
                    defaultValue="2019-05-24T10:30"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item className={classes.marginBottom}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={this.sendRequest}
                    className={classes.requestBtn}
                  >
                    Send Request
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Grid item spacing={4} className={classes.marginBottom}>
              <Grid
                container
                direction="column"
                align="center"
                className={classes.marginBottom}
              >
                <Typography variant="h4">Reviews</Typography>
              </Grid>

              <Card className={classes.reviews}>
                <Grid container>
                  <Grid item xs={4} className={classes.marginAuto}>
                    <Avatar
                      alt="Your Profile Picture"
                      src={require("../images/07cc6abd390ab904abbf31db5e6ea20357f8b127.png")}
                      className={`${classes.smallAvatar} ${classes.marginAuto}`}
                    />
                  </Grid>
                  <Grid item xs={8} className={classes.marginAuto}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="h5">Sarah Blakeney</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Rating value={5} readOnly />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">
                          I recommend Norma as a pet sitter!
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Card className={classes.reviews}>
              <Grid container>
                <Grid item xs={4} className={classes.marginAuto}>
                  <Avatar
                    alt="Your Profile Picture"
                    src={require("../images/07cc6abd390ab904abbf31db5e6ea20357f8b127.png")}
                    className={`${classes.smallAvatar} ${classes.marginAuto}`}
                  />
                </Grid>
                <Grid item xs={8} className={classes.marginAuto}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="h5">Tom Williams</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Rating value={5} readOnly />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">
                        I recommend Norma as a pet sitter!
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(detailsPageStyle)(ProfileDetails);
