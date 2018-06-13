// @flow
import camelcase from 'camelcase';

export default function generateStyleUtils (name: Array<string> | string, props: Object) {
    const isNameArray = Array.isArray(name);
    const isPropsArray = Array.isArray(props);
    const keys = isPropsArray ? props : Object.keys(props);

    return keys.reduce((obj, key) => {
        const className = `u-${isNameArray ? name[0] : String(name)}-${key}`;
        const propertyName = camelcase(isNameArray ? name[1] : name);

        obj[className] = {};
        obj[className][propertyName] = isPropsArray ? key : props[key];

        return obj;
    }, {});
}
