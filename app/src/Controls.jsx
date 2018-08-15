
import React from 'react';


class Controls extends React.Component {
    constructor(props){
        super(props);
    }

    shouldComponentUpdate(){
        return false;
    }
              // <p>Use -1 steps for infinite loop </p>
    render() {
        return (
            <div id="grid-wrapper"> 
                <canvas id="grid" className="grid-view"> </canvas>
            </div>
        );
        }
}

export default Controls;