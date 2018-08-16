
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import _ from "underscore";
import CONF from "./CONF";

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

const STR_SETTINGS = ["family", "params"];

class Settings extends React.Component {
    constructor(props){
        super(props);
        this.onSubmit = props.onSubmit;
        this.state = Object.assign({}, props.settings);
        this.state.rules =  CONF.RULES[this.state.family];
        // console.log(this.state.rules);
        if (this.state.rules.length > 0) {
            this.state.rule = this.state.rules[0].rule;
        }
        console.log("SETATE SETTINGS", this.state);
        this.submitSettings = this.submitSettings.bind(this);
        this.handleChangeRule = this.handleChangeRule.bind(this);
        this.handleChangeFamily = this.handleChangeFamily.bind(this);
    }

    handleChangeFamily(event) {
        var family = event.target.value;
        var rules = CONF.RULES[family];
        var rule;
        if (rules.length > 0) {
            rule = rules[0].rule;
        }

        this.setState({
            family:family,
            rules:rules,
            rule:rule
        });
    }

    handleChangeRule(event) {
            this.setState({
                rule: event.target.value,
                params: event.target.value
            });
    }

    handleChange(name) {
        return (event) => {
            this.setState({
            [name]: event.target.value
            });
        };
    }
    submitSettings() {
        var settings = _.mapObject(
            this.state,
            (val, key) => {
                // console.log("KEY", key,val,typeof key, key in STR_SETTINGS);
                // if(!(key in STR_SETTINGS)){
                if(STR_SETTINGS.includes(key)){
                    // console.log("KEY", key,val,typeof key, STR_SETTINGS.includes(key));

                    return val;
                } else {
                    return parseInt(val, 10);
                }
            }
        );
        console.log("SUBMIT", STR_SETTINGS, settings, this.state);
        this.onSubmit(settings);
    }

    render() {
        console.log("Settings.state", this.state);
        var inputWidth = 50;
        var marginLeft = 10;

        var RuleSelect = (<Button disabled>None</Button>);

        if(this.state.rule !== undefined) {
            RuleSelect = (
                <FormControl
                    style={{
                        marginLeft:marginLeft,
                    }}
                    >
                    <InputLabel shrink>
                        Rule
                    </InputLabel>
                    <Select
                        value={this.state.rule}
                        onChange={this.handleChangeRule}>
                        {
                            _.map(this.state.rules, (rule) => {
                                console.log("rule", rule);
                                return (<MenuItem key={rule.rule} value={rule.rule}>{rule.name}</MenuItem>);
                            })
                        }
                    </Select>
                </FormControl>
            );
        }
        return (
            <div>
            <div className="center">
                <FormControl>
                    <InputLabel shrink>
                        Automaton
                    </InputLabel>
                    <Select
                        value={this.state.family}
                        onChange={this.handleChangeFamily}>
                        <MenuItem value={"gl"}>Game Of Life</MenuItem>
                        <MenuItem value={"bb"}>Brians Brain</MenuItem>
                    </Select>
                </FormControl>
                {RuleSelect}
                <TextField
                    label="Edit rule"
                    value={this.state.params}
                    onChange={this.handleChange("params")}
                    margin="normal"
                    style={{
                        marginLeft:marginLeft,
                        width:200
                    }}
                    />
            </div>
            <div className="center">
                <TextField
                    label="Width"
                    value={this.state.canvasWidth}
                    onChange={this.handleChange("canvasWidth")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:marginLeft,
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
                        marginLeft:marginLeft,
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
                        marginLeft:marginLeft,
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
                        marginLeft:marginLeft,
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
                        marginLeft:marginLeft,
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
                        marginLeft:marginLeft,
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
                        marginLeft:marginLeft,
                        width:100
                    }}
                    />
               <Button variant="outlined"
                        style={{
                            marginLeft:marginLeft
                        }}
                       onClick={this.submitSettings} >Create</Button>
            </div>
            </div>
            );
        }
}
Settings.STR_SETTINGS = STR_SETTINGS;

export default withStyles(styles)(Settings);
