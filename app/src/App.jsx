import React from 'react';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {getTheme} from "./Theme";
import Drawer from '@material-ui/core/Drawer';

import {
  Switch,
  Route,
  withRouter,
 NavLink,
    Link,
    BrowserRouter as Router,
} from 'react-router-dom';

import GOLScreen from './GOLScreen';
import BBScreen from './BBScreen';
import CONF from "./CONF";

import './App.css';


injectTapEventPlugin();

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }

                // <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    render() {
        return (
          <MuiThemeProvider theme={getTheme()}>
              <AppBar position="static" className="app-bar">
                <Toolbar>
                  <Typography variant="title" color="inherit" className="app-bar" >
                    Cellular Automatons
                  </Typography>
                </Toolbar>
              </AppBar>
                <Router>
                    <div>
                    <ul>
                        <li>
                            <Link to="gol">Game Of Life</Link>
                        </li>
                        <li>
                            <Link to="bb">Brians Brain</Link>
                        </li>
                    </ul>

                    <div>
                        <Grid container  justify="center">
                            <Grid item xs={12}>
                                <p className="center">
                                    <Button variant="outlined" id="start">Start</Button>
                                    <Button variant="outlined"  id="next">Next</Button>
                                    <Button variant="outlined"  id="loop">Loop</Button>
                                    <Button variant="outlined"  id="stop">Stop</Button>
                                </p>

                            </Grid>
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>
                        <div id="grid-wrapper"> 
                        <canvas id="grid" className="grid-view"> </canvas>
                        </div>
                    </div>
                    <hr />

                        <Route path="/" render={(props)=> (<GOLScreen />)}/>
                        <Route path="/gol" render={(props)=> (<GOLScreen />)}/>
                        <Route path="/bb" render={(props)=> (<BBScreen />)}/>
                    </div>
                </Router>
         </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
