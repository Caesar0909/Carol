// @flow
import colors from '../../settings/colors';
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export const buttonBorderRadius = 4;

const buttonDefaults = {
    'button': {
        alignItems: 'center',
        borderRadius: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 0
    },
    'button.is-disabled': {
        opacity: 0.7
    },
    'button__icon': {
        marginRight: s('default')
    },
    'button__label': {
        fontSize: 14,
        textAlign: 'center'
    }
};

const buttonColors = Object.keys(colors['buttons']).reduce((obj, color) => {
    const blockName = `button--color-${color}`;
    const secondaryColor = c(`buttons ${color} secondary`) || '#fff';

    obj[blockName] = {

    };
    obj[`${blockName} gradient`] = {
        startColor: c(`buttons ${color} start`),
        endColor: c(`buttons ${color} end`),
        borderColor: c(`buttons ${color} border`)
    };


    obj[`${blockName} button__label`] = {
        color: secondaryColor,
        backgroundColor: c('transparent')
    };

    return obj;
}, {});

export default Object.assign({}, buttonDefaults, buttonColors);
