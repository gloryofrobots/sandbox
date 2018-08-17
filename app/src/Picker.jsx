import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker,  ChromePicker, Swatches} from 'react-color';
import _ from "underscore";
import Button from '@material-ui/core/Button';

class Picker extends React.Component {
    constructor(props){
        super(props);
        this.onChange = props.onChange;
        this.state = {
            displayColorPicker: false,
            color: props.color || '#fff'
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
    this.onChange(color.hex);
  };

  render() {
    // console.log("PICKER", this.state);
    const styles = reactCSS({
      'default': {
        button: {
            color: "#fff",
            backgroundColor: `${this.state.color}`,
            '&:hover': {
                backgroundColor: "#ccc"
            },
        },
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${this.state.color}`
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });

    return (
      <div>
        <Button style={ styles.button } onClick={ this.handleClick } />
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <ChromePicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    );
  }
}

        // <div style={ styles.swatch } onClick={ this.handleClick }>
        //   <div style={ styles.color } />
        // </div>
export default Picker;