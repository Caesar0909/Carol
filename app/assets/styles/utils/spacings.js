// @flow
import spacings from '../../../settings/spacings';

const spacingTypes = {
    m: 'margin',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    mt: 'marginTop',
    mh: 'marginHorizontal',
    mv: 'marginVertical',
    p: 'padding',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    pt: 'paddingTop',
    ph: 'paddingHorizontal',
    pv: 'paddingVertical'
};

const spacingUtils = Object.keys(spacings).map((spacing) => {
    return Object.keys(spacingTypes).reduce((arr, prop) => {
        arr.push({
            [`u-spacing-${prop}-${spacing}`]: {
                [spacingTypes[prop]]: spacings[spacing]
            }
        }, {
            [`u-spacing-n-${prop}-${spacing}`]: {
                [spacingTypes[prop]]: spacings[spacing] * -1
            }
        });

        return arr;
    }, []);
})
.reduce((a, b) => a.concat(b), [])
.reduce((obj, item) => {
    const key = Object.keys(item)[0];

    obj[key] = item[key];

    return obj;
}, {});

export default spacingUtils;
