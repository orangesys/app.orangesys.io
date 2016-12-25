import React from 'react';
// import React, { PropTypes } from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import styles from './index.css';

const HeaderUnAuth = () => (
  <header className={styles.whole}>
    <div className={styles['top-bar']} />
    <Grid>
      <Row className={styles.main}>
        <Col xs={6} sm={4} md={2} className={styles.brand}>
          Orangesys
        </Col>
      </Row>
    </Grid>
  </header>
);

HeaderUnAuth.propTypes = {
};

export default HeaderUnAuth;
