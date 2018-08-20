import React from 'react';
import reactCSS from 'reactcss';
import Picker from './Picker';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import _ from "underscore";
import {determineTextColor, isArraysEqual} from "./Utils";

class PaletteEditor extends React.Component {
    constructor(props){
        super(props);
        this.onChangeColor = this.onChangeColor.bind(this);
        var colors = this.props.settings.get("palette");
        this.state = {
            current:[0, colors[0]],
            colors: colors
        };
    }

    onChangeColor(color) {
        var id = this.state.current[0];
        this.props.settings.setColor(id, color);
        var colors = this.props.settings.get("palette");
        this.setState({
            current:[id, colors[id]],
            colors: colors
        });
    }

    onButtonClick(pair){
        return () => {
            this.setState({current:pair});
        };
    }

    componentDidUpdate() {
        // console.log("PaletteEditor on UPDATE", this.props.settings);
        var colors = this.props.settings.get("palette");
        if(isArraysEqual(this.state.colors, colors)) {
            return;
        }
        var id = this.state.current[0];
        this.setState({
            current:[id, colors[id]],
            colors: colors
        });
    }

    render() {
        var pairs = _.zip(_.range(this.state.colors.length), this.state.colors);

        console.log("Palette editor RENDER", this.state);
        var currentId = this.state.current[0];
        var currentColor = this.state.current[1];
        const styles = {
            pickerRow: {
                marginTop:20
            },
            titleRow: {
                marginBottom:20
            },
            
            picker: {
                width:"100%"
            }
        };

        return (
        <Grid
          container
          spacing={0}
          justify="center"
          alignItems="center"
          >
            <Grid  style={styles.titleRow} item xs={12}>
                <Typography variant="subheading" color="inherit" className="app-bar" >
                  Cell Value/Color
                </Typography>
            </Grid>
            <Grid
              container
              spacing={0}
              justify="flex-start"
              alignItems="center"
              >
            {
                _.map(pairs, (pair) => {
                    var [id, color] = pair;
                    var style = {
                        marginTop:10,
                        marginRight:10,
                        minWidth:50,
                        minHeight:36
                    };
                    if (currentId !== id) {
                        style.backgroundColor = color;
                        style.color = determineTextColor(color);
                    }
                    return (
                            <Button
                                disabled={currentId===id}
                                variant="outlined"
                                onClick={this.onButtonClick(pair)}
                                key={"button-"+id}
                                style={style}
                                >
                                {id}
                            </Button>
                    );
                })
            }
            </Grid>
            <Grid  style={styles.pickerRow} item xs={12}>
                <Picker style={styles.picker} color={currentColor} onChange={this.onChangeColor} />
            </Grid>
        </Grid>
        );
    }
}


export default PaletteEditor;