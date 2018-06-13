// @flow

export function setValueByPath (obj, path, value) {

    let ref = obj;

    path.split('.').forEach((key, index, arr) => {
        ref = ref[key] = index === arr.length - 1 ? value : ref[key] || {};
    });

    return obj;
}
