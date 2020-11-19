import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from "./Table.jsx";
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: 30,
    borderWidth: 1,
    borderRadius: 75,
  }
});

class faceDetail extends Component{
  render(){
    const {classes} = this.props;
    return(
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h2">Programming</Typography>
          <Table
            tableHeaderColor="primary"
            tableHead={['Language','Use for','framework experience','Proficiency']}
            tableData={[
                [ "Python" , "data processing & analysis" , "Flask" , "intermediate" ] ,
                [ "Java" , "system & web application" , "Spring MVC, Android, JSP" , "intermediate" ] ,
                [ "Html" , "web view" , "Html5" , "intermediate" ] ,
                [ "SQL" , "database query" , "MySQL" , "novice" ] ,
                [ "Javascript" , "web application" , "React, Node.js" , "basic" ] ,
                [ "PHP" , "back-end script" , "Laravel" , "basic" ]
            ]}
          /></Paper>
      </div>
    );
  }
}

faceDetail.defaultProps = {
    tableHeaderColor: 'gray'
}
faceDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf(['warning','primary','danger','success','info','rose','gray']),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(styles)(faceDetail);
