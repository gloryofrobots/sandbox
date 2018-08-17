'use strict'

import React from 'react';
import reactCSS from 'reactcss';
import Picker from './Picker';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import _ from "underscore";


var COLORS = [
    '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B',
    '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00',
    '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
    '#333333', '#808080', '#cccccc', '#D33115',
    '#E27300', '#FCC400', '#B0BC00', '#68BC00',
    '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
    '#000000', '#666666', '#B3B3B3', '#9F0500',
    '#C45100', '#FB9E00', '#808900', '#194D33',
    '#0C797D', '#0062B1', '#653294', '#AB149E'
];

COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]

class PaletteEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            colors: _.clone(COLORS)
        };
    }

  onChangeColor(id) {
      return (color) => {
          this.state.colors[id] = color;
          this.setState({});
      };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    console.log("color", color);
    this.setState({ color: color.hex });
  };


  render() {
    var pairs = _.zip(_.range(this.state.colors.length), this.state.colors);
    return (
      <Grid
        container
        spacing={0}
        justify="flex-start" >
        {
            _.map(pairs, (pair) => {
                return (
                    <Grid
                      key={"g0-"+pair[0]}
                      item xs={1}>
                        <Grid
                          key={"g1-"+pair[0]}
                          container
                          spacing={0}
                          direction="row"
                          justify="flex-start"
                          alignItems="center">
                          <Picker key={"picker-"+pair[0]} color={pair[1]}
                                  onChange={this.onChangeColor(pair[0])}
                                  />
                          <Button
                              variant="outlined"
                            key={"button-"+pair[0]}
                            style={{marginRight:10, minWidth:50, minHeight:36}}
                            >
                            {pair[0]}
                          </Button>
                        </Grid>
                    </Grid>

                );
            })
        }
      </Grid>
    )
  }
}


export default PaletteEditor;