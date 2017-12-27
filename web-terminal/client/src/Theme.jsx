import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

const _getTheme = () => {
  let overwrites = {
    "palette": {
        "primary1Color": "#37474f",
        "canvasColor": "#212121",
        "primary2Color": "#546e7a",
        "accent2Color": "#c5cae9",
        "accent1Color": "#7986cb",
        "textColor": "#ffffff",
        "secondaryTextColor": "#ffffff",
        "alternateTextColor": "#9fa8da",
        "accent3Color": "#8c9eff"
    }
};
  return getMuiTheme(baseTheme, overwrites);
}

const getTheme = () => {
  let overwrites = {
    "palette": {
        "primary1Color": "#37474f",
        "canvasColor": "#212121",
        "primary2Color": "#546e7a",
        "accent2Color": "#c5cae9",
        "accent1Color": "#7986cb",
        "textColor": "#ffffff",
        "secondaryTextColor": "#ffffff",
        "alternateTextColor": "#90a4ae",
        "accent3Color": "#8c9eff"
    }
};
  return getMuiTheme(baseTheme, overwrites);
}
export {getTheme};