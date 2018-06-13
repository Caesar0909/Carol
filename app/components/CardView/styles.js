// @flow
import colors from '../../settings/colors';
import c from '../../helpers/color';
import s from '../../helpers/spacing';

const cardViewDefaults = {
    'cardView': {
        borderRadius: 0
    },
    'cardView--align-center': {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default Object.assign({}, cardViewDefaults);
