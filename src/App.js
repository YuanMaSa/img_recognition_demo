import React from 'react';
import './App.css';
import Table from "./Table.jsx";
import PropTypes from 'prop-types';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { PacmanLoader } from 'react-spinners';
// import Paper from '@material-ui/core/Paper';
import { drawerListItems, otherListItems } from './drawerList';
import Webcam from "react-webcam";

import Amplify, { API, Storage } from 'aws-amplify';
import aws_exports from './aws-exports';
// import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure(aws_exports);
var input_pic_name;
var time;
var timestamp;

async function detectFaces(bytes){ // function to call api gateway and lambda to upload image and call Rekognition
  const apiName = "api6832f3b1";
  const path = "/items"
  time = Date.now();
  timestamp = Math.floor(time / 1000);
  input_pic_name = timestamp.toString();

  await Storage.put(input_pic_name + '.jpg', bytes)
  .then (result => console.log(result))
  .catch(err => console.log(err));

  const headers = {
    "Content-Type": "application/json",
  };
  const body = {
    "image": input_pic_name + '.jpg'
  };
  console.log(body);

  const init = {
   body: body,
   headers: headers
 };
 console.log(init);

 return await API.post(apiName, path, init);
}

const new_font_theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});
// stylesheet of every component
const styles = theme => ({
  root: {
    flexGrow: 1,
    // height: 440,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    useNextVariants: true,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
    backgroundColor: '#000000',
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: 240,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    padding: '0 8px',
    marginLeft: 'auto',
    marginRight: 'auto',
    ...theme.mixins.toolbar,
  },
  videoFrame: {
    // margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  button: {
   margin: theme.spacing.unit * 4,
   textTransform: 'none',
   fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 16,
 },
 chip: {
    margin: theme.spacing.unit / 2,
  },
  videoContainer: {
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    width: '100%',
    video: {
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
    },
    // height: '100%',
    // overflow: 'hidden',
  },
});

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      loading: false,
      isHidden: true,
      auth: true,
      anchorEl: null,
      drawer_open: false,
      videoSrc: null,
      image: null,
      rekognition_callback: null,
      age: null,
      gender: null,
      emotion: null,
      isSmile: null,
      label_items: null,
      size: false,
      mobile_horizon: false,
      fullSize: false,
    };
  }


// ---function of drawer event control---

  toggleDrawer = (open) => () => {
    this.setState({
      drawer_open: open,
    });
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

// ---function of webcam and canvas---

  setRef = webcam => {
    this.webcam = webcam;
    console.log(webcam);
  };

  capture = async () => {
    const imageSrc = this.webcam.getScreenshot();
    const imageCanvas = this.webcam.getCanvas();
    this.setState({videoSrc: imageSrc});
    this.setState({image: imageCanvas});
    console.log(imageSrc);
    console.log("canvas: " + imageCanvas);
    const context = this.canvas.getContext("2d");

    if (this.state.size === true){
      context.drawImage(imageCanvas, 0, 0, 240, 320);
    }
    if (this.state.mobile_horizon){
      context.drawImage(imageCanvas, 0, 0, 320, 240);
    }
    if (this.state.fullSize){
      context.drawImage(imageCanvas, 0, 0, 640, 480);
    }


    const img = this.dataURItoBlob(imageSrc)
    console.log(img);
    this.setState({loading: true});

    try {
      const faceDetections = await detectFaces(img); // wait for lambda calling Rekognition
      console.log(faceDetections);
      this.setState({
        rekognition_callback: faceDetections.body.FaceDetails[0]
      });
      console.log(faceDetections.body.FaceDetails[0]); // get FaceDetails json
      var low_age = JSON.stringify(faceDetections.body.FaceDetails[0].AgeRange.Low);
      var high_age = JSON.stringify(faceDetections.body.FaceDetails[0].AgeRange.High);
      var predict_age = (parseInt(low_age) + parseInt(high_age)) / 2; // get the age in json
      this.setState({
        age: predict_age.toString()
      });
      console.log(predict_age);
      var gender = faceDetections.body.FaceDetails[0].Gender.Value; // get the gender in json
      this.setState({
        gender: gender
      });
      console.log(gender);
      // take low age if detect a girl
      if (gender === "Female"){
        this.setState({
          age: low_age
        });
        console.log("girl detect");
      }
      var emotions = faceDetections.body.FaceDetails[0].Emotions[0].Type; // get the emotions in json
      this.setState({
        emotion: emotions
      });
      console.log(emotions);
      var isSmile = faceDetections.body.FaceDetails[0].Smile.Value; //get isSmile in json
      if (isSmile){
        this.setState({
          isSmile: "yes"
        });
      } else{
        this.setState({
          isSmile: "no"
        });
      }
      console.log("isSmile: " + isSmile);
      this.setState({
        loading: false
      });
      console.log(faceDetections.label);
      await this.setState({
        label_items: JSON.parse(faceDetections.label)
      }); // wait for label items in json and set the state
    } catch (err) {
      console.log("error", err);
    }

  };

    dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString
    });
  }

  resize() {
    console.log(window.innerWidth);
    this.setState({size: window.innerWidth <= 480});
    this.setState({mobile_horizon: window.innerWidth > 480 && window.innerWidth <= 760});
    this.setState({fullSize: window.innerWidth > 760});
  } // detect the device width to check if mobile then set size to true

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }


  componentDidUpdate() {

  }


  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const videoConstraints = {
      facingMode: {
        exact: "user",
        minWidth: { min: 320, ideal: 1280 },
        minHeight: { min: 240, ideal: 720 },
        aspectRatio: 1.777777778,
        frameRate: { max: 30 },
      }
    };

    const drawerList = (
      <MuiThemeProvider theme={new_font_theme}>
      <div className={classes.list}>
        <List>{drawerListItems}</List>
        <Divider />
        <List>{otherListItems}</List>
      </div>
    </MuiThemeProvider>
  ); // hamburger menu items

    let label_chip;
    if(this.state.label_items != null){
      console.log(this.state.label_items.Labels);
      label_chip = (this.state.label_items.Labels.map((type,index) =>
        <Chip key={index} className={classes.chip} label={type['Name']}/>
        )
      );
    } else {
      label_chip = <Chip className={classes.chip} label={"nothing for now"}/>
    } // chips event detect below scene detection

    let canvas_item; // size of canvas
    let canvas_topic; // size of "detect your beautiful face"
    let video_topic;
    let video_screen; // size of capure webcam

    if(this.state.size){ // if mobile event then set size
      console.log("mobile event");
      video_screen = (
        <Webcam
          screenshotFormat="image/jpeg"
          ref={this.setRef}
          width={240}
          height={320}
          audio={false}
          videoConstraints={videoConstraints}
          // style={{minWidth:'100%', minHeight: '100%', }}
          />
      );
      canvas_item = (
        <canvas
        ref={canvas => this.canvas = canvas}
        width={240}
        height={320}
      />);
      video_topic = (
        <Typography noWrap variant="h6">
          Take a photo here
        </Typography>
      );
      canvas_topic = (
        <Typography noWrap variant="h6">
          Detect your beautiful face
        </Typography>
      );
    }
    if (this.state.mobile_horizon){
      video_screen = (
        <Webcam
          screenshotFormat="image/jpeg"
          ref={this.setRef}
          width={320}
          height={240}
          audio={false}
          videoConstraints={videoConstraints}
          // style={{minWidth:'100%', minHeight: '100%', }}
          />
      );
      canvas_item = (
        <canvas
        ref={canvas => this.canvas = canvas}
        width={320}
        height={240}
      />);
      video_topic = (
        <Typography noWrap variant="h6">
          Take a photo here
        </Typography>
      );
      canvas_topic = (
        <Typography noWrap variant="h6">
          Detect your beautiful face
        </Typography>
      );
    }
    if (this.state.fullSize) { // None of mobile event then set normal size
      video_screen = (
        <Webcam
          screenshotFormat="image/jpeg"
          ref={this.setRef}
          width={640}
          height={480}
          audio={false}/>
      );
      canvas_item = (
        <canvas
          ref={canvas => this.canvas = canvas}
          width={640}
          height={480}
        />
      );
      video_topic = (
        <Typography noWrap variant="h4">
          Take a photo here
        </Typography>
      );
      canvas_topic = (
        <Typography noWrap variant="h4">
          Detect your beautiful face
        </Typography>
      );
    }


    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon onClick={this.toggleDrawer(true)}/>
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              eCloudvalley demo
            </Typography>
            <img src={require('./ecloudture_logo.png')} alt="icon" height="10%" width="10%"/>
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Drawer open={this.state.drawer_open} onClose={this.toggleDrawer(false)}
          classes={{paper: classes.drawerPaper}}>
          <div className={classes.toolbar}>
            <img src={require('./ecloud.svg')} alt="icon" height="57" width="75"/>
          </div>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            {drawerList}
          </div>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Grid container spacing={24}>

            <Grid item xs={6} className={classes.videoFrame} align="center">

              {video_topic}
              <hr style={{borderColor: "transparent"}}/>
              <div className={classes.videoContainer}>
              {video_screen}
              </div>
              <center>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
                size="large"
                onClick={this.capture}>
                Click it
              </Button>
              </center>

            </Grid>
            <Grid item xs={6} className={classes.videoFrame} margin="auto" align="center">
              {canvas_topic}
              <hr style={{borderColor: "transparent"}}/>
              <div>
              {canvas_item}
              </div>
              <hr style={{borderColor: "transparent"}}/>
                <Typography variant="h5">Analysis Result</Typography>
                <PacmanLoader color={'#36D7B7'} loading={this.state.loading}/>
                <Table
                  tableHeaderColor="primary"
                  tableHead={['Age','Gender','Emotions','Smile']}
                  tableData={[
                      [this.state.age , this.state.gender, this.state.emotion, this.state.isSmile] ,
                  ]}
                />
                <hr style={{borderColor: "transparent"}}/>
                <Typography variant="h5">Scene detection</Typography>
                {label_chip}
            </Grid>

        </Grid>

        </main>
      </div>
    );
  }
}
App.defaultProps = {
    tableHeaderColor: 'gray'
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf(['warning','primary','danger','success','info','rose','gray']),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
// export default withAuthenticator(withStyles(styles)(App, true));
export default withStyles(styles)(App);
