// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  deepOrange300, deepOrange400, deepOrange500, deepOrange700, deepOrange600,
  blueA100, blue300, blue500, blue600, blue700,
  lightBlue300,
  cyan300,
  grey100, grey300, grey400,
  lime500,
  yellowA400,
  yellow300,
  red400,
  brown400,
  amber500,
  cyanA400,
  orange300, orange500, orange800,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepOrange500,
    primary2Color: deepOrange600,
    primary3Color: grey300,
    accent1Color: blue300,
    accent2Color: orange500,
    accent3Color: grey300,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: deepOrange500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
  appBar: {
    height: 50,
  },
});

export default muiTheme;
