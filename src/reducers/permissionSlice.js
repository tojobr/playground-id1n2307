import { createSlice } from '@reduxjs/toolkit';
import { getData } from '../store';

/**
 * check if all children are checked
 * @param {Object} parent 
 * @param {Array} currentPermissions 
 * @returns {boolean}
 */
function areCheckedChildren(parent, currentPermissions) {
	if (!parent || !parent.children.length) return false;
	const children = parent.children;
	return children.every(child => currentPermissions.find(id => id === child.id));
}

/**
 * update permissions for current item, nested children and parent
 * @param {*} param0 
 * @returns {Array} newPermissions
 */
function updatePermissions({ item, currentPermissions, parent, action = 'add' }) {
	if (!item || !currentPermissions) return currentPermissions;
	let newPermissions = currentPermissions.slice(0);
	const isParent = item.children?.length > 0;
	const exists = currentPermissions.includes(item.id);

	if (action === 'remove' && exists) {
		//-----------------//
		//----- remove ----//
		//-----------------//
		const index = newPermissions.indexOf(item.id);
		newPermissions.splice(index, 1);

		if (isParent && areCheckedChildren(item, newPermissions)) {
			// it's a parent node, then we should uncheck all children nodes
			const children = item.children;
			children.forEach(child => {
				newPermissions = updatePermissions({item: child, currentPermissions: newPermissions, action: 'remove'});
			});
		}

	} else if (action === 'add' && !exists) {
		//-----------------//
		//------ add ------//
		//-----------------//
		newPermissions.push(item.id);
		
		if (isParent) {
			// it's a parent node, then we should check children node
			const children = item.children;
			children.forEach(child => {
				newPermissions = updatePermissions({item: child, currentPermissions: newPermissions, action: 'add'});
			});
		}
	}

	return newPermissions;
}

/**
 * set permission
 * @param {Object} state 
 * @param {Object} currentSector 
 * @param {string} [permissionType] 
 * @param {string} [permissionAction] 
 * @returns {Array} newPermissions
 */
function setPermission({state, currentSector, permissionType = 'readPermissions', permissionAction = 'add'}) {
	return updatePermissions({ item: currentSector, currentPermissions: state[permissionType], action: permissionAction });
}

/**
 * set permission for current parent node
 * @param {Object} parent 
 * @param {Array} currentPermissions 
 * @returns {Array}
 */
function setParentPermission({ parent, currentPermissions, permissionAction = 'add' }) {
	if (permissionAction === 'add' && areCheckedChildren(parent, currentPermissions)) {
		// if we add permission for a child node and all children are checked, then we should check parent node
		return updatePermissions({ item: parent, currentPermissions, action: permissionAction });
	}
	if (permissionAction === 'remove') {
		// if we remove permission for a child node, then we should uncheck all active parent nodes
		return updatePermissions({ item: parent, currentPermissions, action: permissionAction });
	}
	return currentPermissions;
}

export const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    editPermissions: [],
		readPermissions: [],
  },
  reducers: {
    addReadPermissions: (state, action) => {
			state.readPermissions = setPermission({ state, currentSector: action.payload });
    },
		removeReadPermissions: (state, action) => {
			state.readPermissions = setPermission({ state, currentSector: action.payload, permissionAction: 'remove' });			
    },
		addParentReadPermission: (state, action) => {
			state.readPermissions = setParentPermission({ parent: action.payload, currentPermissions: state.readPermissions });
		},
		removeParentReadPermission: (state, action) => {
			state.readPermissions = setParentPermission({ parent: action.payload, currentPermissions: state.readPermissions, permissionAction: 'remove' });
		},
		addEditPermissions: (state, action) => {
			state.editPermissions = setPermission({ state, currentSector: action.payload, permissionType: 'editPermissions' });
    },
		removeEditPermissions: (state, action) => {
			state.editPermissions = setPermission({ state, currentSector: action.payload, permissionType: 'editPermissions', permissionAction: 'remove' });
    },
		addParentEditPermission: (state, action) => {
			state.editPermissions = setParentPermission({ parent: action.payload, currentPermissions: state.editPermissions });
		},
		removeParentEditPermission: (state, action) => {
			state.editPermissions = setParentPermission({ parent: action.payload, currentPermissions: state.editPermissions, permissionAction: 'remove' });
		}
  }
});

// selectors
export function getReadPermissions(state) {
	return getData(state, 'permissions.readPermissions');
}

export function getEditPermissions(state) {
	return getData(state, 'permissions.editPermissions');
}

// Action creators are generated for each case reducer function
export const {
	addReadPermissions, removeReadPermissions,
	addParentReadPermission, removeParentReadPermission,
	addEditPermissions, removeEditPermissions,
	addParentEditPermission, removeParentEditPermission,
} = permissionSlice.actions;

export default permissionSlice.reducer;