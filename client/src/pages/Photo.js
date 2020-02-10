import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { Snackbar, IconButton } from "@material-ui/core";
import NavigationBar from "./Navbar";
import SideNavigationBar from "./SideNavBar";
import Button from "@material-ui/core/Button";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import "../App.scss";

const photoPageStyle = theme => ({
  photoContainer: {
    margin: theme.spacing(2)
  },
  container: {
    marginBottom: theme.spacing(100)
  },
  bigAvatar: {
    width: 200,
    height: 200
  },

  buttonText: {
    textTransform: "none"
  }
});

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.handlePhotoChange = this.handlePhotoChange.bind(this);
  }

  handlePhotoChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    let image = this.state.file;
    if (image) {
      let formData = new FormData();
      formData.append("image", image);
      axios
        .post("/files/image-upload", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          // res.data.imageUrl has the public image url you can use
          console.log(res.data);
        })
        .catch(err => {
          console.log({ err });
        });
    }
  };

  render() {
    console.log(this.state.file);
    const { classes } = this.props;
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
        <div className="pageArea">
          <div className="infoArea">
            <div className="menuArea">
              <SideNavigationBar></SideNavigationBar>
            </div>
            <div className="settingsArea">
              <div className={classes.photoContainer}>
                <div>
                  <form>
                    <Grid container spacing={3}>
                      <Grid item xs={12} className="center">
                        <h1>Profile Photo</h1>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        justify="center"
                        alignItems="center"
                      >
                        <Avatar
                          alt="Your Profile Picture"
                          src={this.state.file}
                          className={classes.bigAvatar}
                          onClick={this.changePhoto}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        justify="center"
                        alignItems="center"
                      >
                        <Typography className="center" color="textSecondary">
                          Be sure to use a photo that clearly shows your face
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        container
                        spacing={10}
                        justify="center"
                        alignItems="center"
                        style={{ margin: 20 }}
                      >
                        <input
                          accept="image/*"
                          className={`${classes.input} ${"invisible"}`}
                          id="contained-button-file"
                          multiple
                          type="file"
                          name="photo"
                          onChange={this.handlePhotoChange}
                        />
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="outlined"
                            color="secondary"
                            component="span"
                            size="large"
                            className={classes.buttonText}
                          >
                            Upload a file from your device
                          </Button>
                        </label>
                      </Grid>
                      <Grid item xs={4}></Grid>
                      <Grid item xs={4} className="center">
                        <Button
                          fullWidth
                          size="large"
                          variant="contained"
                          className="submit-button"
                          onClick={this.handleSubmit}
                        >
                          Save
                        </Button>
                      </Grid>
                      <Grid item xs={4}></Grid>
                    </Grid>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* <SimpleSnackbar></SimpleSnackbar> */}
        </div>
      </div>
    );
  }
}

export default withStyles(photoPageStyle)(PhotoPage);
