
import React, { Component } from 'react';
import CodeMirror from "react-codemirror";

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');

            // <CodeMirror
            //     value='var revelation = "I ♥ spoons";'
            //     className="output-text"
            //     style={{height:"80vh"}}
            //     options={{
            //         mode: 'javascript',
            //         theme: 'material',
            //         lineNumbers: true,
            //         readOnly:false,
            //         viewportMargin:Infinity
            //     }}
            //     onChange={(editor, data, value) => this.onTextChange(editor, data, value)
            //     }
            //     />
class OutputView extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    onTextChange(editor, data, value) {
    }
    render () {  
        return (
            <div className="widget-header">
              <div className="output-text"/>
            </div>
        );
    }
}


export default OutputView;