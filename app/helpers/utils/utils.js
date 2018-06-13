// @flow
import utils from '../../assets/styles/utils';

function prefixUtil (className: string) {
    const prefix = 'u-';

    if (className.indexOf(prefix) === 0) {
        return className;
    }

    return `${prefix}${className}`;
}

export default function (classNames: string | Array<string>) {
    if (Array.isArray(classNames)) {
        return classNames.map((className) => utils[prefixUtil(className)] || null);
    }

    return utils[prefixUtil(classNames)] || null;
}
