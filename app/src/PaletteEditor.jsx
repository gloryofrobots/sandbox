import React from 'react';
import reactCSS from 'reactcss';
import Picker from './Picker';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import _ from "underscore";


class PaletteEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentButton:null,
            colors: this.props.settings.get("palette")
        };
    }

  onChangeColor(id) {
      return (color) => {
          this.state.colors[id] = color;
          this.props.settings.set("palette", this.state.colors);
          this.setState({});
      };
  }

  onButtonClick(id){
      return () => {
          this.setState({currentButton:id});
      };
  }

  render() {
    var pairs = _.zip(_.range(this.state.colors.length), this.state.colors);
    const styles = {
        colorButton: {
            marginRight:10,
            minWidth:50,
            minHeight:36,
        }
    };
    return (
      <Grid
        container
        spacing={0}
        justify="center" >
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
                            disabled={this.state.currentButton===pair[0]}
                            variant="outlined"
                            onClick={this.onButtonClick(pair[0])}
                            key={"button-"+pair[0]}
                            style={styles.colorButton}
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