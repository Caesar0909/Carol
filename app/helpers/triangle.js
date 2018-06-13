// @flow
export default function triangle (color: string, width: number = 5, height: number = 10, direction: string = 'right') {
    let borderProps = {};

    if (direction === 'down') {
        borderProps.borderTopColor = color;
        borderProps.borderBottomWidth = 0;
        borderProps.borderLeftWidth = width / 2;
        borderProps.borderRightWidth = width / 2;
        borderProps.borderTopWidth = height;
    }
    else if (direction === 'left') {
        borderProps.borderRightColor = color;
        borderProps.borderBottomWidth = height / 2;
        borderProps.borderLeftWidth = 0;
        borderProps.borderRightWidth = width;
        borderProps.borderTopWidth = height / 2;
    }
    else if (direction === 'right') {
        borderProps.borderLeftColor = color;
        borderProps.borderBottomWidth = height / 2;
        borderProps.borderLeftWidth = width;
        borderProps.borderRightWidth = 0;
        borderProps.borderTopWidth = height / 2;
    }
    else if (direction === 'up') {
        borderProps.borderBottomColor = color;
        borderProps.borderBottomWidth = height;
        borderProps.borderLeftWidth = width / 2;
        borderProps.borderRightWidth = width / 2;
        borderProps.borderTopWidth = 0;
    }

    return {
        borderColor: 'transparent',
        height: 0,
        width: 0,
        ...borderProps
    };
}
