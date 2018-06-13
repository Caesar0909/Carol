// @flow
import I18n from 'react-native-i18n';

export function toFormattedNumber (number: number, precision?: number) {
    let options = { precision: 0 };

    switch (I18n.currentLocale()) {
        case 'pt-BR':
            options = { ...options, delimiter: '.', separator: ',' };
            break;
        default:
            options = { ...options, delimiter: ',', separator: '.' };
            break;
    }

    if (precision) {
        options = { ...options, precision };
    }

    return I18n.toNumber(number, options);
}

export function abbreviate (number) {
    if (number >= 1000) {
        return `${number / 1000}k`;
    }

    return number;
}

export function getLocaleStringOf (num) {

    if (num === null || num === undefined) {
        return num;
    }

    if (typeof(num) === 'string') {
        num = parseFloat(num);
    }

    return num.toLocaleString();
}
