import Geocoder from 'react-native-geocoding';

Geocoder.setApiKey('AIzaSyCH4Apbw66h8vzG2b9R8HtMlwhnclYoLNs');

export function getStates () {
    return [
        { code: 'DF', name: 'Distrito Federal' },
        { code: 'AC', name: 'Acre' },
        { code: 'AL', name: 'Alagoas' },
        { code: 'AP', name: 'Amapá' },
        { code: 'AM', name: 'Amazonas' },
        { code: 'BA', name: 'Bahia' },
        { code: 'CE', name: 'Ceará' },
        { code: 'ES', name: 'Espírito Santo' },
        { code: 'GO', name: 'Goiás' },
        { code: 'MA', name: 'Maranhão' },
        { code: 'MT', name: 'Mato Grosso' },
        { code: 'MS', name: 'Mato Grosso do Sul' },
        { code: 'MG', name: 'Minas Gerais' },
        { code: 'PA', name: 'Pará' },
        { code: 'PB', name: 'Paraíba' },
        { code: 'PR', name: 'Paraná' },
        { code: 'PE', name: 'Pernambuco' },
        { code: 'PI', name: 'Piauí' },
        { code: 'RJ', name: 'Rio de Janeiro' },
        { code: 'RN', name: 'Rio Grande do Norte' },
        { code: 'RS', name: 'Rio Grande do Sul' },
        { code: 'RO', name: 'Rondônia' },
        { code: 'RR', name: 'Roraima' },
        { code: 'SC', name: 'Santa Catarina' },
        { code: 'SP', name: 'São Paulo' },
        { code: 'SE', name: 'Sergipe' },
        { code: 'TO', name: 'Tocantins' }
    ];
}

export function parseLocation (addresses) {
    let address = addresses && addresses[0];
    
    address = address || {};

    return `${address.city}, ${address.state}, ${address.country}`;
}

export function toLatLng (address) {
    return Geocoder.getFromLocation(address).then(
        json => {
            const location = json.results[0].geometry.location;

            return {
                latitude: location.lat,
                longitude: location.lng
            };
        }
    );
}
