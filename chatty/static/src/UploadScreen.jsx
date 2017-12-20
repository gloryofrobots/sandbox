import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { Grid, Row, Col } from 'react-material-responsive-grid';

class App extends React.Component {
  render() {
    return (
      <Grid>
         <Row>
            <Col xs4={4} lg={6}>
               <p>This column consumes the entire row for extra-small,
               small, and medium screens.  For large and extra-large
               screens, it consumes half of the row.</p>
            </Col>
            <Col hiddenDown="md" lg={6}>
               <p>This column isn't visible for extra-small, small, 
               and medium screens, but is visible for large and 
               extra-large screens.  It consumes half of the row.</p>
            </Col>
            <Col hiddenDown="sm" hiddenUp="xl" md={12}>
               <p>This column is only visible for medium and large
               screens and consumes the entire row.</p>
            </Col>
            <Col hidden={['sm8', 'sm', 'lg']} xs4={4}>
               <p>This column is hidden for small and large screens
               and consumes the entire row.</p>
            </Col>
         </Row>
      </Grid>
    );
  }
}
class ContactList extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    
    render() {
        return (
            <div>
              <MuiThemeProvider >
                <List className="ContactList">
                <Subheader>Recent chats</Subheader>
                <ListItem
                    primaryText="Brendan Lim"
                    leftAvatar={<Avatar src="images/ok-128.jpg" />}
                    rightIcon={<CommunicationChatBubble />}
                />
                <ListItem
                    primaryText="Eric Hoffman"
                    leftAvatar={<Avatar src="images/kolage-128.jpg" />}
                    rightIcon={<CommunicationChatBubble />}
                />
                </List>
                <List className="ContactList">
                <Subheader>Previous chats</Subheader>
                <Divider/>
                <ListItem
                    primaryText="Chelsea Otakan"
                    leftAvatar={<Avatar src="images/chexee-128.jpg" />}
                />
                <ListItem
                    primaryText="James Anderson"
                    leftAvatar={<Avatar src="images/jsa-128.jpg" />}
                />
                </List>
                </MuiThemeProvider>
            </div>
        );
    }
}
 

class UploadScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    
    render() {
        return (
        <div className="ChatApp">
            <MuiThemeProvider>
            <div>
                <AppBar
                    title="Chat"
                />
                <Grid className="ChatApp-Grid">
                    <Row>
                        <Col xs4={4} lg={4}>
                          <ContactList/>
                        </Col>
                        <Col xs4={4} lg={4}>
                          <ContactList/>
                        </Col>
                    </Row>
                </Grid>
            </div>
            </MuiThemeProvider>
        </div>
        );
    }
}
export default UploadScreen;

