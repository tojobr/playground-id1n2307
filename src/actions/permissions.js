
import { getSectorById } from './sectors';

/**
 * get id of top parent for current item
 * @param {Array} sectors 
 * @param {string} id 
 * @param {Array} currentPermissions 
 * @returns {string}
 */
function getTopParentById({ sectors, id, currentPermissions }) {
	if (!sectors || !id || !currentPermissions) return null;
	const currentSector = getSectorById(sectors, id);
	const parentId = currentSector.parentId;
	if (parentId && currentPermissions.includes(parentId)) {
		return getTopParentById({ sectors, id: parentId, currentPermissions });
	}
	return id;
}

/**
 * list active parent sectors for current permissions
 * @param {Array} currentPermissions 
 * @param {Array} sectors 
 * @returns {Array}
 */
export function listActiveParentSectors(currentPermissions = [], sectors = []) {
	const parentSectors = new Set();
	currentPermissions.forEach(permissionId => {
		const topParentId = getTopParentById({ sectors, id: permissionId, currentPermissions });
		if (!parentSectors.has(topParentId)) {
			parentSectors.add(topParentId);
		}		
	});
	return Array.from(parentSectors);
}