import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';


export const drawerListItems = (
  <div>
    <ListItem button component="a" href="https://www.ecloudvalley.com/about/">
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="About us" />
    </ListItem>
    <ListItem button component="a" href="https://www.ecloudvalley.com/managed-services/">
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary="Services" />
    </ListItem>
  </div>
);

export const otherListItems = (
  <div>
    <ListItem button component="a" href="https://www.ecloudvalley.com/contact_us/">
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="Feedback" />
    </ListItem>
  </div>
);
