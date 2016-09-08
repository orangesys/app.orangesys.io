
import React from 'react';
// import React, { PropTypes } from 'react';
// import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

const style = {
  margin: 12,
};

const UITest = () => (
  <div>
    <AppBar title="Material Tool Bar" />
    <div style={{textAlign: "center", marginTop: 30}}>
      <div>
        <RaisedButton label="Default" style={style} />
        <RaisedButton label="Primary" primary={true} style={style} />
        <RaisedButton label="Secondary" secondary={true} style={style} />
        <RaisedButton label="Disabled" disabled={true} style={style} />
      </div>
      <div style={{ marginTop: 30}}>
        <TextField
          hintText="Hint Text"
        /><br />
        <br />
        <TextField
          hintText="The hint text can be as long as you want, it will wrap."
        /><br />
        <div>
          <Slider defaultValue={0.5} />
        </div>
        <Grid>
          <Row>
            <Col xs={6} md={3}>Hello, world!</Col>
          </Row>
        </Grid>
      </div>
    </div>

  </div>
);

export default UITest;


    // <div>
    //   <Toolbar>
    //     <ToolbarGroup>
    //       <ToolbarTitle text="Options" />
    //       <FontIcon className="muidocs-icon-custom-sort" />
    //       <ToolbarSeparator />
    //       <RaisedButton label="Create Broadcast" primary={true} />
    //       <IconMenu
    //         iconButtonElement={
    //           <IconButton touch={true}>
    //           </IconButton>
    //         }
    //       >
    //         <MenuItem primaryText="Download" />
    //         <MenuItem primaryText="More Info" />
    //       </IconMenu>
    //     </ToolbarGroup>
    //   </Toolbar>
    // </div>
