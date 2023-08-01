/**
 * get sector by id
 * @param {Array} sectors 
 * @param {string} id 
 * @returns {Object | null}
 */
export function getSectorById(sectors, id) {
	for (let item of sectors) {
		if (item.id === id) {
			return item;
		}

		let sector;
		if (item.children.length > 0) {
			for (let child of item.children) {
				if (child.id === id) {
					return child;
				}
				sector = getSectorById(child.children, id);
				if (sector) return sector;
			}
		}
	}
	return null;
}

/**
 * map current node item
 * @param {Object} node 
 * @param {string} parentId 
 * @returns {Object}
 */
function mapItem(node, parentId) {
	if (!node || typeof node != 'object') return {};
	const { id, name, children } = node;
	
	return { 
		id,
		name,
		parentId,
		children: children.length > 0 ? children.map(childNode => mapItem(childNode, id)) : []
	}
}

/**
 * map data json to nodes items
 * @param {*} data 
 * @returns {Object} 
 */
export function mapToNodes(data) {
	if (!data) return {};
	try {
    const response = typeof data === 'string' ? JSON.parse(data) : data;
		const items = response.data?.roots || [];
		return items.map(item => mapItem(item));
	}
	catch (error) {
		console.log('Error parsing JSON:', error, data);
		return {}
	}
}
