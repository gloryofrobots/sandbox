
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import _ from "underscore";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 100,
    marginRight: 100,
  },
});


class Settings extends React.Component {
    constructor(props){
        super(props);
        this.onSubmit = props.onSubmit;
        this.state = props.settings;
        this.submitSettings = this.submitSettings.bind(this);
    }

    handleChange(name) {
        return (event) => {
            this.setState({
            [name]: event.target.value
            });
        };
    }
    submitSettings() {
        var settings = _.mapObject(this.state, (val, key) => parseInt(val));
        this.onSubmit(settings);
    }

              // <p>Use -1 steps for infinite loop </p>
    render() {
        var inputWidth = 50;
        return (
            <div className="center">
                <TextField
                    label="Width"
                    value={this.state.canvasWidth}
                    onChange={this.handleChange("canvasWidth")}
                    margin="normal"
                    type="number"
                    style={{
                        width:inputWidth
                    }}
                    />
                <TextField
                    label="Height"
                    value={this.state.canvasHeight}
                    onChange={this.handleChange("canvasHeight")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:inputWidth
                    }}
                    />
                <TextField
                    label="Cols"
                    value={this.state.gridWidth}
                    onChange={this.handleChange("gridWidth")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:inputWidth
                    }}
                    />
                <TextField
                    label="Rows"
                    value={this.state.gridHeight}
                    onChange={this.handleChange("gridHeight")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:inputWidth
                    }}
                    />
                <TextField
                    label="Steps (-1 == infinite)"
                    value={this.state.countSteps}
                    onChange={this.handleChange("countSteps")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:150
                    }}
                    />
                <TextField
                    label="Interval (ms)"
                    value={this.state.interval}
                    onChange={this.handleChange("interval")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:100
                    }}
                    />
                <TextField
                    label="Cell margin"
                    value={this.state.cellMargin}
                    onChange={this.handleChange("cellMargin")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:100
                    }}
                    />
               <Button variant="outlined"
                        style={{
                            marginLeft:10
                        }}
                       onClick={this.submitSettings} >Create</Button>
            </div>
            );
        }
}

export default withStyles(styles)(Settings);
