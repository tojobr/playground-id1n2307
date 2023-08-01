import { configureStore } from '@reduxjs/toolkit';

import permissionsReducer from './reducers/permissionSlice';
import sectorsReducer from './reducers/sectorSlice';

/**
 * all reducers
 */
export default configureStore({
  reducer: {
		permissions: permissionsReducer,
		sectors: sectorsReducer
	},
});

/**
 * used by selectors
 * @param state
 * @param path
 * @returns {*}
 */
export function getData(state, path) {
	let data;
	try {
		if (typeof state === "function") {
			throw new Error("The state parameter must not be a function. The error is usually the usage of getState instead of getState(). Path is", path);
		}
		data = path.split('.').reduce((res, prop) => res[prop], state);
		if (data == null) {
			throw new Error('data not found');
		}
	} catch (error) {
		console.error(error);
		return null;
	}
	return data;
}