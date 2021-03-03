import { bool, string } from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'; // eslint-disable-line import/no-extraneous-dependencies

import BaseText from '../../Generic/BaseText';

const CardBodyField = ({
  dependency, label, value, bold,
}) => {
  const variantStyle = bold ? 'title' : '';

  if (dependency) {
    return (
      <Grid style={styles.root}>
        <Row>
          <Col size={1}>
            <BaseText>
              {label}
            </BaseText>
          </Col>
          <Col size={2}>
            <BaseText variant={variantStyle}>
              {value}
            </BaseText>
          </Col>
        </Row>
      </Grid>
    );
  }

  return null;
};

CardBodyField.propTypes = {
  dependency: string,
  label: string,
  value: string,
  bold: bool,
};

CardBodyField.defaultProps = {
  dependency: null,
  label: null,
  value: null,
  bold: false,
};

export default CardBodyField;

const styles = StyleSheet.create({
  root: {
    marginVertical: 5,
  },
});