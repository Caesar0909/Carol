# Carol Mobile

## Creating New Components

### Stateless, Functional Components

```jsx
// @flow
import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';   // Only import what's necessary
import bem, { renderBemChildren } from 'react-native-bem'; // Only import what's necessary
import styles from './styles';

const Test = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('test')}>
            <Text>{props.title} {props.name}</Text>
            {renderBemChildren(props)}
        </View>
    );
};

Test.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    Mfoo: PropTypes.bool, // BEM styling modifiers
    SisBar: PropTypes.bool  // BEM styling states
};

Test.defaultProps = {
    title: 'Mr',
    name: 'McGee'
};

export default Test;
```

## Existing Components

### T

`<T />` is a wrapper around the native `<Text />` component. It sets up consistent default styling while inheriting all of `<Text />`'s props.

```jsx
import T from './components/T/';

<T>Text content</T>
```

**Additional Props**

```js
{
    Mbold: PropTypes.bool,
    Mitalic: PropTypes.bool
}
```

### Icon

```jsx
import Icon from './components/Icon/';

<Icon name="RingWider" fill="#f00" width="50" height="50" viewBox="0 0 348 215" />
```

**defaultProps**

```js
{
    fill: '#000',
    height: '40',
    name: 'LogoFluig',
    viewBox: '0 0 100 100',
    width: '40'
}
```

List of available icons can be found here: `app/assets/icons/svg/index`

## Styling

* Create a `styles.ts` in the component's directory
```js
// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'block': {
        property: value
    },
    'block--modifier': {
        property: value
    },
    'block.state': {
        property: value
    },
    'block__element': {
        property: value
    },
    'block--modifier block__element': {
        property: value
    },
    'block.state block__element': {
        property: value
    }
}
```

Consistent colors and spacing can be maintained with:
* `c('colors object path')`
* `s('spacing key')`

* Import the component's styles

```js
import bem, { renderBemChildren } from 'react-native-bem';
import styles from './styles';
```

* Use `bem` and `renderBemChildren()`

```jsx
<Component style={bem('block', props, css)} />

<ParentComponent style={bem('block', props, css)}>
    {renderBemChildren(props)}
</ParentComponent>
```

**Pro Tip**

Create a shortcut for `bem` in the component's `render()` method to reduce code repetition:

```jsx
const b = (selector) => bem(selector, props, styles);

return (
    <View style={b('block')}>
        <Text style={b('block__element')} />
    </View>
);
```

## Android Setup

**The docs are wrong!**

* Download and install [Android Studio](https://developer.android.com/studio/install.html).
* From `Configure` → `SDK Manager`, install Android 6.0 (Marshmallow) Android SDK Platform 23 & Google APIs Intel x86 Atom System Image
* Set up paths:
```bash
vi ~/.bashrc

export ANDROID_HOME=~/Library/Android/sdk
export PATH=${PATH}${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools
```

You may need to log out, otherwise `source ~/.bashrc` will load your new path changes. You can verify this with `echo $PATH`.

* Run `android avd` and ensure you have a 6.0 device. If you don't, create one and copy its `AVD Name`.
* Run `emulator -avd $AVD_Name`, so something like `emulator -avd Nexus_5_API_23`
* Now run `react-native run-android`

### Using your HOSTS file

`adb remount && adb push /etc/hosts /system/etc`

## Cleaning build cache

**Android**

- Delete the `build` folder from `/android` and `/android/app`
- Run `./gradlew clean` inside `/android`

**iOS**

- Delete the `build` folder inside `/ios`
