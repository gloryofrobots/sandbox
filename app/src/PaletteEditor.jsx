import React from 'react';
import reactCSS from 'reactcss';
import Picker from './Picker';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import _ from "underscore";


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
    render() {
        var pairs = _.zip(_.range(this.state.colors.length), this.state.colors);

        console.log("RENDER", this.state);
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
            justify="flex-start" >
            <Grid  style={styles.titleRow} item xs={12}>
                <Typography variant="subheading" color="inherit" className="app-bar" >
                  Cell Value/Color
                </Typography>
            </Grid>
            {
                _.map(pairs, (pair) => {
                    var style = {
                        marginRight:10,
                        minWidth:50,
                        minHeight:36
                    };
                    if (currentId !== pair[0]) {
                        style.backgroundColor = pair[1];
                    }
                    backgroundColor:pair[1]
                    return (
                        <Grid
                          key={"g0-"+pair[0]}
                          item xs={1}>
                            <Button
                                disabled={currentId===pair[0]}
                                variant="outlined"
                                onClick={this.onButtonClick(pair)}
                                key={"button-"+pair[0]}
                                style={style}
                                >
                                {pair[0]}
                            </Button>
                        </Grid>
                    );
                })
            }

            <Grid  style={styles.pickerRow} item xs={12}>
                <Picker style={styles.picker} color={currentColor} onChange={this.onChangeColor} />
            </Grid>
        </Grid>
        );
    }
}


export default PaletteEditor;