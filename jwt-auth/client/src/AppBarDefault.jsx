import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

const AppBarButton = (props) => (
    <FlatButton
       label={props.label}
       hoverColor="#006064"
       onClick={(event) => props.onClick(event)} />
);

const AppBarDefault = (props) => (
    <AppBar
       title={props.title}
       className="app-bar"
       iconElementRight={<AppBarButton
                            label={props.rightButtonLabel}
                            onClick={(event) => props.onRightButtonClick(event)}/>}
       showMenuIconButton={false}
      />
);

export default AppBarDefault;