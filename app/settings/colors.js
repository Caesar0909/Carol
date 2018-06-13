// @flow
// Color names generated from http://chir.ag/projects/name-that-color/

let colors = {
    'blue': {
        'daintree': '#002631',
        'spectra': '#2e505c',
        'lynch': '#638294',
        'boston': '#2f96b4',
        'robins-egg': '#49B3E2',
        'robins-egg--darker': '#00bdbb', // shade{#00cdcb, 8%},
        'robins-egg--lighter': '#40dad8', // tint{#00cdcb, 25%},
        'gumbo': '#78a4a3',
        'rock': '#9fbecf',
        'twilight': '#f2ffff',
        'sky': '#9FBECF'
    },
    'gray': {
        'aztec': '#0a1217',
        'outer-space': '#2d343e',
        'outer-space--darker': '#2b3438',
        'limed-spruce': '#384349',
        'river-bed': '#454f54',
        'emperor': '#545454',
        'abbey': '#555c60',
        'juniper': '#708e99',
        'slate': '#718897',
        'boulder': '#767676',
        'boulder-darker': '#6d6d6d', // shade{#767676, 8%},
        'boulder--lighter': '#8b8b8b', // tint{#767676, 15%},
        'hit': '#a1afb3',
        'silver-chalice': '#acacac',
        'silver-chalice--darker': '#929292', // shade{#acacac, 15%},
        'silver': '#bebebe',
        'alto': '#d2d2d2',
        'alto--darker': '#c1c1c1', // shade{#d2d2d2, 8%},
        'alto--lighter': '#d9d9d9', // tint{#d2d2d2, 15%},
        'tiara': '#c8d2d6',
        'porcelain': '#e5e9ea',
        'black-squeeze': '#f4f8fb',
        'black-squeeze--darker': '#edf1f3', // shade{#f4f8fb, 3%},
        'white-smoke': '#f3f3f3',
        'black-smoke': '#4A4A4AC0',
        'white-smoke--lighter': '#DDE3E8',
        'clear-link': '#AAB7BA'
    },
    'green': {
        'gable': '#1b343d',
        'fruit-salad': '#51a351',
        'light-background': '#10617B',
        'dark-background': '#093447',
        'selected': '#0E5269',
        'green-gray': '#364152',
        'arrow': '#4eb052',
        'map-circle-stroke': '#44C4DB',
        'map-circle-fill': 'rgba(68,196,219,0.15)'
    },
    'orange': {
        'burnt-sienna': '#ee7c60',
        'jaffa': '#f68c45',
        'jaffa--darker': '#e2813f', // shade{#f68c45, 8%},
        'saffron': '#f8c236',
        'saffron--darker': '#e4b232' // shade{#f8c236, 8%}
    },
    'red': {
        'venetian-red': '#d0021b',
        'red': '#fb0f02',
        'sunset': '#f65445',
        'raddish': '#F97979',
        'raddish--dark': '#DB2C48',
        'red--back': '#fd5559'
    },
    'yellow': {
        'saffron': '#f8c236',
        'supernova': '#ffcb0a',
        'star': '#fbda61'
    },
    'purple': {
        'main': '#6F4FB0',
        'dark': '#2C0D3A',
        'bg--color': '#2C0D3A',
        'light': '#FC6180',
        'text': '#9a8ca0',
        'border': '#956ADB',
        'active': '#A887D8',
        'background': '#2C0D3A'
    },
    'transparent': 'transparent',


    'black': {
        'main': '#4a4a4a',
        'light': '#9B9B9B'
    },
    'newblue': {
        'main': '#6f85ff'
    },
    'newgray': {
        'border': '#f3f3f4',
        'shadow': '#c8c9ca',
        'graph': '#cecece',
        'text': '#555457'
    },
    'shadow': {
        'black': 'rgba(0,0,0,0.15)'
    },
    'dim': 'rgba(255, 255, 255, 0.9)'
};

colors = Object.assign({}, colors);

colors = Object.assign(colors, {
    'core': {
        'danger': colors['red']['sunset'],
        'default': colors['gray']['outer-space'],
        'highlight': colors['red']['raddish'],
        'muted': colors['gray']['alto'],
        'primary': colors['blue']['robins-egg'],
        'subtle': colors['gray']['silver-chalice'],
        'text': colors['gray']['hit'],
        'text--darker': colors['gray']['juniper'],
        'text--dark': colors['gray']['limed-spruce'],
        'text--darkest': colors['blue']['daintree'],
        'warning': colors['orange']['jaffa'],
        'button--primary-start': colors['red']['raddish'],
        'button--primary-end': colors['red']['raddish--dark']
    }
});

colors = Object.assign(colors, {
    'buttons': {
        'danger': {
            'primary': colors['core']['danger']
        },
        'default': {
            'primary': colors['core']['default']
        },
        'muted': {
            'primary': colors['core']['muted'],
            'start': colors['core']['button--primary-start'],
            'end': colors['core']['button--primary-end'],
            'secondary': '#fff'
        },
        'primary': {
            'primary': colors['core']['primary'],
            'start': '#A887D8',
            'end': colors['purple']['main'],
            'secondary': '#fff',
            'border': 'transparent'
        },
        'transparent': {
            'primary': colors['core']['primary'],
            'start': 'transparent',
            'end': 'transparent',
            'secondary': '#fff',
            'border': colors['purple']['border']
        },
        'subtle': {
            'primary': colors['core']['subtle']
        },
        'text': {
            'primary': colors['core']['text']
        },
        'warning': {
            'primary': colors['core']['warning']
        },
        'white': {
            'primary': '#fff',
            'start': '#fff',
            'end': '#fff',
            'secondary': colors['red']['raddish']
        }
    }
});

colors = Object.assign(colors, {
    'divider': {
        'default': colors['shadow']['black'],
        'lighter': colors['gray']['black-squeeze--darker']
    }
});

export default colors;
