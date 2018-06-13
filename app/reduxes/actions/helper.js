import invariant from 'invariant';
import { identity, isFunction, isNull } from 'lodash';

/**
 * Create an action creator that creates actions with types and apiCall keys. Heavily inspired
 * by the createAction function found in redux-actions
 * @param  {Array} types             An array of types that will be called based on api
 *                                   request. Must be in the following order:
 *                                   REQUEST, SUCCESS, FAILURE
 * @param  {Function} apiCall        A function that returns a promise.
 * @param  {Function} payloadCreator A function that defines how the payload is created.
 * @param  {Function} metaCreator    A function that defines how any meta data is created.
 * @return {Function} A function that creates actions.
 */
 // eslint-disable-next-line import/prefer-default-export
export function createApiAction (types, apiCall, payloadCreator = identity, metaCreator) {
	invariant(
		isFunction(apiCall),
		'Expected apiCall to be a function',
	);

	invariant(
		isFunction(payloadCreator) || isNull(payloadCreator),
		'Expected payloadCreator to be a function, undefined or null',
	);

	const finalPayloadCreator = isNull(payloadCreator) || payloadCreator === identity ?
		identity :
		(head, ...args) => (head instanceof Error ? head : payloadCreator(head, ...args));

	const hasMeta = isFunction(metaCreator);

	const actionCreator = (...args) => {
		const payload = finalPayloadCreator(...args);
		const action = { types, apiCall };

		if (payload instanceof Error) {
			action.error = true;
		}

		if (payload !== undefined) {
			action.payload = payload;
		}

		if (hasMeta) {
			action.meta = metaCreator(...args);
		}

		return action;
	};

	return actionCreator;
}
