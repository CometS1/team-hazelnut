import React, { Component } from "react";
import axios from "axios";
import openSocket from "socket.io-client";

import "../App.scss";
import NavigationBar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const messagesPageStyle = theme => ({
  list: {
    maxHeight: "81vh",
    overflow: "auto"
  },

  cardStyle: {
    height: "82vh"
  },

  bigAvatar: {
    width: 50,
    height: 50,
    marginBottom: "5px",
    marginTop: "5px",
    marginLeft: "10px",
    marginRight: "10px"
  },

  title: {
    borderTop: "0.5px solid #e6e6e6",
    borderBottom: "0.5px solid #e6e6e6",
    textAlign: "center"
  },
  addIcon: {
    height: "100%",
    verticalAlign: "middle"
  },
  border: {
    border: "0.5px solid #e6e6e6",
    borderRight: "0px"
  },

  messagesArea: {
    height: "70vh",
    overflow: "auto",
  },

  messagingArea: {
    border: "1px solid #e6e6e6"
  },

  textField: {
    width: "100%",
    paddingLeft: "10px"
  },

  input1: {
    height: "8vh"
  },

  buttonContainer: {
    height: "100%"
  },

  sendButton: {
    margin: theme.spacing(1),
    top: "30%",
    backgroundColor: "#f04040"
  },

  sentMessages: {
    textAlign: "right",
    paddingRight: "10px",
    paddingLeft: "10px"
  },
  sentMessageLength: {
    padding: "6px",
  },
  sentMessageLengthLeft: {
    padding: "6px",
    textAlign: "left",
  },
  msg: {
    backgroundColor: "#3385ff",
    color: "white",
    boxShadow: "0px 0px 4px 0px lightgrey",
    borderRadius: "10px",
    padding: "12px"
  },
  msgLeft: {
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px lightgrey",
    borderRadius: "10px",
    padding: "12px"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    maxHeight: "75vh",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
});

class MessagesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      message: "",
      messages: [],
      profiles: [],
      conversationId: "",
      firstName: "",
      lastName: "",
      photoUrl: "",
      open: false,
      token: localStorage.getItem("jwtToken"),
      userId: localStorage.getItem("userId"),
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  // Handle message change
  messageChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.socket = openSocket("http://localhost:3001");
    this.socket.on("new message", msg => {
      this.setState({ messages: [...this.state.messages, msg] });
    });
    this.getProfiles();
    this.getConversations();
  }

  // Get a list of profiles 
  getProfiles() {
    axios.get('/profile/get/', { headers: { Authorization: `Bearer ${this.state.token}` }})
      .then(res => {
        this.setState({
          profiles: res.data.profile 
        });
      })
      .catch(err => {
        console.log("Error fetching and parsing data", err);
      }); 
  }

  // GET a list of conversations and recipient profiles
  getConversations() {
    axios.get('/conversation/list/', { headers: { Authorization: `Bearer ${this.state.token}` }})
      .then(res => {
        this.setState({
          conversations: res.data  
        });
      })
      .catch(err => {
        console.log("Error fetching and parsing data", err);
      }); 
  };

  // Get a conversation Id to start sending messages
  getMessages = e => {
    this.setState({ conversationId: e.target.id });
    this.setState({ firstName: e.target.getAttribute("firstname") });
    this.setState({ lastName: e.target.getAttribute("lastname") });
    this.setState({ photoUrl: e.target.getAttribute("photourl") });

    axios.get(`/conversation/${e.target.id}`, { headers: { Authorization: `Bearer ${this.state.token}` }} )
      .then(res => {
        let msgs = res.data.map(item => ({ 
          id: item._id,
          body: item.body,
          userId: item.userId
        }));
        this.setState({ messages: msgs });
      })
      .catch(err => {
        console.log(err);
      }); 
  };

  // Create a new conversation 
  createConversation = e => {
    e.preventDefault();
    const newConversation = {
      recipientId: e.target.id
    }
    axios.post('/conversation/', newConversation, { headers: { Authorization: `Bearer ${this.state.token}` }} )
      .then(res => {
        console.log(res.data);
        axios.get('/conversation/list/', { headers: { Authorization: `Bearer ${this.state.token}` }})
        .then(res => {
          this.setState({
            conversations: res.data  
          });
        })
        .catch(err => {
          console.log(err);
        }); 
      })
      .catch(err => {
        console.log(err);
      }); 
  }

  // Create a new message
  createMessage = e => {
    e.preventDefault();
    const newMessage = {
      conversationId: this.state.conversationId,
      body: this.state.message,
      userId: this.state.userId
    }
    axios.post(`/conversation/${this.state.conversationId}/message`, newMessage, { headers: { Authorization: `Bearer ${this.state.token}` }} )
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response.data);
      });
    this.socket.emit("new message", newMessage);
    this.setState({ message: "" });   
  }

  render() {
    const { classes } = this.props;
    const message = this.state.messages.map((message, i) => (
      message.userId._id === this.state.userId ? 
        <p key={i} className={classes.sentMessageLength}>
        <span className={classes.msg}>{message.body}</span>
        </p>
      : !message.userId._id ?
        <p key={i} className={classes.sentMessageLength}>
        <span className={classes.msg}>{message.body}</span>
        </p>
      : 
        <p key={i} className={classes.sentMessageLengthLeft}>
        <span className={classes.msgLeft}>{message.body}</span>
        </p>
    ));
    
    return (
      <div>
        <NavigationBar></NavigationBar>
        <Grid container>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={11} className={classes.title}>
                <h3>Inbox Messages</h3>
              </Grid>
              <Grid item xs={1} className={classes.title}>
                <IconButton size="small" className={classes.addIcon} onClick={this.handleOpen}>
                  <AddBoxIcon />
                </IconButton>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={this.state.open}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500
                  }}
                >
                  <Fade in={this.state.open}>
                    <div className={classes.paper}>
                      <h2 id="transition-modal-title" style={{textAlign: "center"}}>Dog Sitters</h2>
                    
                        {this.state.profiles.map(item => (
                          item.userId !== this.state.userId ?
                          <ListItem
                            key={item._id}
                            id={item.userId}
                            button
                            onClick={this.createConversation}
                          > 
                            {item.photoUrl ?
                              <Avatar
                                className={classes.bigAvatar}
                                alt="Remy Sharp" 
                                src={item.photoUrl}
                                id={item.userId}
                              />
                            : <Avatar
                                className={classes.bigAvatar}
                                alt="Remy Sharp" 
                                id={item.userId}
                              >
                                <AccountCircleIcon />
                              </Avatar>   
                            }
                            <Typography id={item.userId} variant="h6">{item.firstName} {item.lastName}</Typography>
                          </ListItem>
                          : null
                        ))}
                       
                    </div>
                  </Fade>
                </Modal>
              </Grid>
              <Grid item xs={12}>
                
                <List className={classes.list}>
                  {this.state.conversations.map(item => (
                    item.members_info[0].userId === this.state.userId ?
                    <ListItem 
                      alignItems="flex-start" 
                      button 
                      key={item._id} 
                      id={item._id} 
                      firstname={item.members_info[1].firstName} 
                      lastname={item.members_info[1].lastName}
                      photourl={item.members_info[1].photoUrl}
                      onClick={this.getMessages} 
                    > 
                      {item.members_info[1].photoUrl ?
                        <Avatar
                          className={classes.bigAvatar}
                          id={item._id} 
                          firstname={item.members_info[1].firstName} 
                          lastname={item.members_info[1].lastName}
                          photourl={item.members_info[1].photoUrl}
                          alt="Remy Sharp" 
                          src={item.members_info[1].photoUrl}
                        />
                      : <Avatar
                          className={classes.bigAvatar} 
                          id={item._id} 
                          firstname={item.members_info[1].firstName} 
                          lastname={item.members_info[1].lastName}
                          photourl={item.members_info[1].photoUrl}
                          alt="Remy Sharp" 
                        >
                          <AccountCircleIcon />
                        </Avatar>  
                      }
                      <Typography 
                        id={item._id} 
                        firstname={item.members_info[1].firstName} 
                        lastname={item.members_info[1].lastName}
                        photourl={item.members_info[1].photoUrl}
                        style={{marginTop: "10px" }} 
                        variant="h6"
                      >
                        {item.members_info[1].firstName} {item.members_info[1].lastName}
                      </Typography>
                    </ListItem>
                  
                  : <ListItem
                      alignItems="flex-start" 
                      button 
                      key={item._id} 
                      id={item._id} 
                      firstname={item.members_info[0].firstName} 
                      lastname={item.members_info[0].lastName}
                      photourl={item.members_info[0].photoUrl}
                      onClick={this.getMessages}
                    > 
                      {item.members_info[0].photoUrl ?
                        <Avatar
                          className={classes.bigAvatar}
                          id={item._id} 
                          firstname={item.members_info[0].firstName} 
                          lastname={item.members_info[0].lastName}
                          photourl={item.members_info[0].photoUrl}
                          alt="Remy Sharp" 
                          src={item.members_info[0].photoUrl}
                        />
                      : <Avatar
                          className={classes.bigAvatar}
                          id={item._id} 
                          firstname={item.members_info[0].firstName} 
                          lastname={item.members_info[0].lastName}
                          photourl={item.members_info[0].photoUrl}
                          alt="Remy Sharp" 
                        >
                          <AccountCircleIcon />
                        </Avatar>  
                      }
                      <Typography 
                        id={item._id} 
                        firstname={item.members_info[0].firstName} 
                        lastname={item.members_info[0].lastName}
                        photourl={item.members_info[0].photoUrl}
                        style={{marginTop: "10px" }} 
                        variant="h6"
                      >
                        {item.members_info[0].firstName} {item.members_info[0].lastName}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container className={classes.border}>
                { this.state.photoUrl ? 
                    <Grid item xs={1}>
                      <Avatar
                      alt="Remy Sharp"
                      className={classes.bigAvatar}
                      src={this.state.photoUrl}
                      />
                    </Grid>    
                  : this.state.photoUrl === null ?
                    <Grid item xs={1}>
                      <Avatar
                      alt="Remy Sharp"
                      className={classes.bigAvatar}
                      >
                        <AccountCircleIcon />
                      </Avatar>  
                    </Grid>
                  : 
                    <Grid item xs={1}>
                      <Avatar
                      alt="Remy Sharp"
                      className={classes.bigAvatar}
                      style={{ backgroundColor: "white"}}
                      />
                    </Grid>
                }
                <Grid item xs={11}>
                  <h3>{this.state.firstName} {this.state.lastName}</h3>
                </Grid>
              </Grid>
            <Grid container className={classes.messagesArea}>
              <Grid item xs={12}>
                <div className={classes.sentMessages}>{message}</div>
              </Grid>
            </Grid>
            
            { this.state.conversationId ? (
              <Grid container className={classes.messagingArea}>
                <Grid item xs={8}>
                  <TextField
                    id="standard-bare"
                    name="message"
                    className={classes.textField}
                    placeholder="Type a message..."
                    margin="normal"
                    value={this.state.message}
                    onChange={this.messageChange}
                    inputProps={{
                      "aria-label": "bare",
                      className: classes.input1
                    }}
                  />
                </Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={2}>
                  <div className={classes.buttonContainer}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      className={classes.sendButton}
                      onClick={this.createMessage}
                    >
                      Send
                    </Button>
                  </div>
                  <Grid item xs={1}></Grid>
                </Grid>
              </Grid> 
              ) : null }

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(messagesPageStyle)(MessagesPage);
