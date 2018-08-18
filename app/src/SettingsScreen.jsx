
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import PaletteEditor from "./PaletteEditor";
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

import _ from "underscore";

class SettingsScreen extends React.Component {
    constructor(props){
        super(props);
        var settings = props.settings;

        var family = settings.param("family");
        this.state = {
            editEnabled:true,
            settings: settings.toObject(),
            rules: settings.getRules(family),
            rule: settings.getRule(family)
        };

        console.log("SETATE SETTINGS", this.state);
        this.onActionCallback = props.onAction;
        this.onToggleEditor = this.onToggleEditor.bind(this);
        this.submitSettings = this.submitSettings.bind(this);
        this.handleChangeRule = this.handleChangeRule.bind(this);
        this.handleChangeFamily = this.handleChangeFamily.bind(this);
    }

    onToggleEditor() {
        this.setState({
            editEnabled:!this.state.editEnabled
        });
    }

    handleAction(name) {
        return () => {
            this.onActionCallback(name);
            this.submitSettings();
        };
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
            <Grid container spacing={0} justify="center" alignItems="center">
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

            </Grid>
            <Grid container spacing={0} justify="center" alignItems="center">
                <TextField
                    label="Canvas width"
                    value={this.state.settings.canvasWidth}
                    onChange={this.handleChange("canvasWidth")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:marginLeft,
                        width:120
                    }}
                    />
                <TextField
                    label="Canvas height"
                    value={this.state.settings.canvasHeight}
                    onChange={this.handleChange("canvasHeight")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:marginLeft,
                        width:120
                    }}
                    />
                <TextField
                    label="Animation delay (ms)"
                    value={this.state.settings.interval}
                    onChange={this.handleChange("interval")}
                    margin="normal"
                    type="number"
                    style={{
                        marginLeft:marginLeft,
                        width:120
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
            </Grid>

            <Grid container spacing={0} justify="center" alignItems="center">
               <Button variant="outlined"
                        style={{
                            marginLeft:marginLeft
                        }}
                       onClick={this.submitSettings} >Apply</Button>
                <Button
                    variant="outlined"
                    onClick={this.onToggleEditor}
                    style={{marginLeft:30}}>
                    Toggle Editor
                </Button>
            </Grid>
            {
                this.state.editEnabled ?
            (<Grid
                container
                spacing={0}
                justify="center"
                style={{marginTop:10}} >
                <Grid
                    container
                    spacing={0}
                    justify="center" >
                <Button variant="outlined"
                            style={{
                                marginLeft:marginLeft
                            }}
                        onClick={this.handleAction("randomize")} >Randomize</Button>
                <Button variant="outlined"
                            style={{
                                marginLeft:marginLeft
                            }}
                        onClick={this.handleAction("clear")} >Clear</Button>
                <Button variant="outlined"
                            style={{
                                marginLeft:marginLeft
                            }}
                        onClick={this.handleAction("load")} >Load</Button>
                <Button variant="outlined"
                            style={{
                                marginLeft:marginLeft
                            }}
                        onClick={this.handleAction("save")} >Save</Button>

                </Grid>
                <Grid
                container
                spacing={0}
                justify="center"
                style={{marginTop:10}}
                      >
                      <PaletteEditor settings={this.props.settings}/>

                </Grid>
            </Grid> ) :null
            }
        </div>
            );
        }
}

export default SettingsScreen;
