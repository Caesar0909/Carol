// @flow
import { get } from 'lodash';
import colors from '../settings/colors';

export default function (path: string ) {
    return get(colors, path.split(' '));
}
