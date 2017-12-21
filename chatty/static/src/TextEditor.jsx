import React, { Component } from 'react';
import CodeMirror from "react-codemirror";

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');

class TextEditor extends Component {
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
            <p className="center-align">--text-editor--</p>

            <CodeMirror
                value='var revelation = "I ♥ spoons";'
                options={{
                    mode: 'javascript',
                    theme: 'material',
                    lineNumbers: true
                }}
                onChange={(editor, data, value) => this.onTextChange(editor, data, value)
                }
                />
            </div>
        );
    }
}


export default TextEditor;