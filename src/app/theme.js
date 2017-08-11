// @flow

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import props from '../variables.css'

export default getMuiTheme({
  palette: {
    primary1Color: props['--colorPrimary1'],
    primary2Color: props['--colorPrimary2'],
    primary3Color: props['--colorPrimary3'],
    accent1Color: props['--colorAccent1'],
    accent2Color: props['--colorAccent2'],
    accent3Color: props['--colorAccent3'],
    textColor: props['--colorDarkBlack'],
    alternateTextColor: props['--colorWhite'],
    canvasColor: props['--colorWhite'],
    borderColor: props['--colorBorder'],
    disabledColor: props['--colorDarkGray'],
    pickerHeaderColor: props['--colorPrimary1'],
    clockCircleColor: props['--colorVeryDarkGray'],
    shadowColor: props['--colorFullBlack'],
  },
  appBar: {
    height: 50,
  },
})
