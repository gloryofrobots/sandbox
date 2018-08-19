import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class AppMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    handleAction(name) {
        return () => {
            this.props.onAction(name);
            this.handleClose();
        };

    }

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;
        const open = Boolean(anchorEl);
        return (
        <div>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleClose}
            >
            <MenuItem onClick={this.handleAction("defaultSettings")}>Revert to default settings</MenuItem>
            </Menu>
        </div>
        );
    }
}

AppMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppMenu);
