// @flow
import { get } from 'lodash';

function getValue (obj: Object, path: string) {
    return path.indexOf('.') > -1 ? get(obj, path) : obj[path];
}

export function sortBy (arr, fieldName, flags, sortProcessCall) {
    const SORT_NUMERIC = 2;
    const SORT_CASE_INSENSITIVE = 4;

    if (!arr) {
        return [];
    }

    if (!flags) {
        flags = 0;
    }

    if ((flags & SORT_NUMERIC) > 0) {

        arr.sort((a, b) => {
            return processFlags(b) - processFlags(a);
        });

        return;
    }

    return arr.sort(sortFields);

    function sortFields (a, b) {

        var a1 = processFlags(a);
        var b1 = processFlags(b);

        if (a1 < b1) {
            return -1;
        }

        if (a1 > b1) {
            return 1;
        }

        return 0;
    }

    function processFlags (item) {

        var val = item[fieldName];

        if (sortProcessCall) {
            val = sortProcessCall(item, val);
        }

        if ((flags & SORT_CASE_INSENSITIVE) > 0) {
            val = val.toLowerCase();
        }

        return val;
    }
}

export function sortByDateAsc (a: Object, b: Object, path: string = 'date') {
    return getValue(a, path) > getValue(b, path) ? 1 : -1;
}

export function sortByDateDesc (a: Object, b: Object, path: string = 'date') {
    return getValue(a, path) < getValue(b, path) ? 1 : -1;
}

export function sortByStringAsc (a: Object, b: Object, path: string) {
    return getValue(a, path).localeCompare(getValue(b, path));
}

export function sortByStringDesc (a: Object, b: Object, path: string) {
    return -getValue(a, path).localeCompare(getValue(b, path));
}

export function arrayToString (arr: Array<string>, joiner: string = ', ') {
    return arr.filter((component) => component && component !== ',').join(joiner);
}

export function convertToArray (value) {
    return value.constructor === Array ? value : [value];
}

export function convertArrayToGroupedMap (arr, key, value) {
    return arr.reduce((map, obj) => {
        map[obj[key]] = map[obj[key]] || [];
        map[obj[key]].push(value ? obj[value] : obj);

        return map;
    }, {});
}

export function convertArrayToMap (arr, keyName, valueName) {

    arr = arr || [];

    const obj = {};

    arr.forEach((objVal) => {
        obj[objVal[keyName]] = valueName ? objVal[valueName] : objVal;
    });

    return obj;
}

export function removeDuplicatedArrayValues (arr, valueName) {

    const obj = arr.reduce((objMap, item) => {
        objMap[item[valueName]] = item;

        return objMap;
    }, {});

    return Object.keys(obj).reduce((newArr, key) => {
        newArr.push(obj[key]);

        return newArr;
    }, []);
}
