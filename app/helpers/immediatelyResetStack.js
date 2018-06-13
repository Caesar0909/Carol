// @flow
import { NavigationActions } from 'react-navigation';

export default function immediatelyResetStack (props, routeName, params) {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName, params })
        ]
    });

    props.navigation.dispatch(resetAction);
}

export function immediatelyNavigate (props, routeName, params) {
    const navigateAction = NavigationActions.navigate({ routeName, params });

    props.navigation.dispatch(navigateAction);
}
