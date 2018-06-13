import React from 'react';
import PropTypes from 'prop-types';

import {
  Divider,
  T
} from '../index';

import { ratio } from '../../helpers/windowSize';
import c from '../../helpers/color';

export const TitleDescription = ({ title, description }) => (
    <Divider
        style={{
            paddingHorizontal: 20 * ratio,
            paddingVertical: 20 * ratio
        }}
    >
        <T
            style={{
                fontSize: 18 * ratio
            }}
        >
            { title }
        </T>
        <T style={{
            marginTop: 5 * ratio,
            fontSize: 12 * ratio,
            color: c('black light')
        }}>
            { description }
        </T>
    </Divider>
);

TitleDescription.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

export default TitleDescription;
