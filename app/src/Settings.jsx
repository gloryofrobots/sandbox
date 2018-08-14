
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
    render() {
        return (
            <div className="center">
                <TextField
                    id="width"
                    label="Width"
                    value={this.state.canvasWidth}
                    onChange={this.handleChange("canvasWidth")}
                    margin="normal"
                    type="number"
                    style={{
                        width:50
                    }}
                    />
                <TextField
                    id="height"
                    label="Height"
                    value={this.state.canvasHeight}
                    onChange={this.handleChange("canvasHeight")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:50
                    }}
                    />
                <TextField
                    id="width"
                    label="Cols"
                    value={this.state.gridWidth}
                    onChange={this.handleChange("gridWidth")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:50
                    }}
                    />
                <TextField
                    id="height"
                    label="Rows"
                    value={this.state.gridHeight}
                    onChange={this.handleChange("gridHeight")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:10,
                        width:50
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
