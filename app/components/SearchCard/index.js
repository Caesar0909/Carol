// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styles from './styles';

const SearchCard = ({
    tagLabel,
    title1,
    title2,
    description1,
    description2,
    description3
}) => {
    return (
        <View>
            <View style={styles.tagWrapper}>
                <Text style={styles.tagLabel}>
                    {tagLabel}
                </Text>
            </View>
            <Text style={styles.title1}>
                {title1}
            </Text>
            <Text style={styles.title2}>
                {title2}
            </Text>
            <View style={styles.divider} />
            <View
                style={styles.bottomContainer}
            >
                <Text style={styles.description1}>
                    {description1}
                </Text>
                <Text style={styles.description2}>
                    {description2}
                </Text>
                <Text style={styles.description3}>
                    {description3}
                </Text>
            </View>
        </View>
    );
};

SearchCard.defaultProps = {
    tagLabel: '',
    title1: '',
    title2: '',
    description1: '',
    description2: '',
    description3: ''
};

SearchCard.propTypes = {
    tagLabel: PropTypes.string,
    title1: PropTypes.string,
    title2: PropTypes.string,
    description1: PropTypes.string,
    description2: PropTypes.string,
    description3: PropTypes.string
};

export default SearchCard;
