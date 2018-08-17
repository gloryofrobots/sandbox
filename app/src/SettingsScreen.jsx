
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

class SettingsScreen extends React.Component {
    constructor(props){
        super(props);
        var settings = props.settings;

        var family = settings.param("family");
        this.state = {
            settings: settings.toObject(),
            rules: settings.getRules(family),
            rule: settings.getRule(family)
        };

        console.log("SETATE SETTINGS", this.state);
        this.submitSettings = this.submitSettings.bind(this);
        this.handleChangeRule = this.handleChangeRule.bind(this);
        this.handleChangeFamily = this.handleChangeFamily.bind(this);
    }

    handleChangeFamily(event) {
        var family = event.target.value;
        var rules = this.props.settings.getRules(family);
        var rule = this.props.settings.getRule(family);

        this.setState({
            rules:rules,
            rule:rule,
            settings: this.updatedSettings("family", event.target.value)
        });
    }

    handleChangeRule(event) {
        console.log("CHANGE RULE", event.target.value);
        this.setState({
            rule: event.target.value,
            settings: this.updatedSettings("params", event.target.value)
        });
    }

    updatedSettings(key, val) {
        var settings = _.clone(this.state.settings);
        settings[key] = val;
        // console.log("upfated", settings);
        return settings;
    }

    handleChange(name) {
        return (event) => {
            this.setState({
                settings: this.updatedSettings(name, event.target.value)
             });
        };
    }

    submitSettings() {
        this.props.settings.update(this.state.settings);
        console.log("SUBMIT", this.state, this.props.settings.toObject());
        this.setState({
            settings:this.props.settings.toObject()
        });
    }

    render() {
        console.log("SETTEDIT STATE", this.state);
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
                        value={this.state.settings.family}
                        onChange={this.handleChangeFamily}>
                        <MenuItem value={"gl"}>Game Of Life</MenuItem>
                        <MenuItem value={"bb"}>Brians Brain</MenuItem>
                    </Select>
                </FormControl>
                {RuleSelect}
                <TextField
                    label="Edit rule"
                    value={this.state.settings.params}
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
                    value={this.state.settings.canvasWidth}
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
                    value={this.state.settings.canvasHeight}
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
                    value={this.state.settings.gridWidth}
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
                    value={this.state.settings.gridHeight}
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
                    value={this.state.settings.countSteps}
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
                    value={this.state.settings.interval}
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
                    value={this.state.settings.cellMargin}
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

export default SettingsScreen;
