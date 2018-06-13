// @flow
import moment from 'moment';
import I18n from 'react-native-i18n';

// $FlowFixMe
require('moment/locale/pt-br');

(moment: any).updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'seconds',
        m: '1 min.',
        mm: '%d mins.',
        h: '1 hr.',
        hh: '%d hrs.',
        d: '1 day',
        dd: '%d days',
        M: '1 mo.',
        MM: '%d mos.',
        y: '1 yr.',
        yy: '%d yrs.'
    }
});

(moment: any).updateLocale('pt-br', {
    relativeTime: {
        future: 'em %s',
        past: '%s atrás',
        s: 'segundos',
        m: '1 min.',
        mm: '%d mins.',
        h: '1 hr.',
        hh: '%d hrs.',
        d: '1 dia',
        dd: '%d dias',
        M: '1 mês',
        MM: '%d meses',
        y: '1 ano',
        yy: '%d anos'
    }
});

export function toFormattedDate (date: string) {
    switch (I18n.currentLocale()) {
        case 'pt-BR':
            return moment(date).locale('pt-br').format('ll');
        default:
            return moment(date).locale('en').format('ll');
    }
}

export function fromNow (date: string, withoutSuffix: boolean) {
    let formattedDate = moment(date).fromNow(withoutSuffix);

    if (formattedDate.indexOf(I18n.t(['date', 'seconds'])) > -1 || formattedDate.indexOf('1 min.') > -1) {
        formattedDate = I18n.t(['date', 'justNow']);
    }

    return formattedDate;
}

export function fromNowUnlessEarlierThan (date: string, withoutSuffix: boolean, earlierThanLimit: number = 3) {
    const now = moment(new Date());
    const differenceInDays = now.diff(date, 'days');

    if (differenceInDays > earlierThanLimit) {
        return toFormattedDate(date);
    }

    return fromNow(date, withoutSuffix);
}
