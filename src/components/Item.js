import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { getSectorById } from '../actions/sectors';
import { getSectors } from '../reducers/sectorSlice';
import { 
	addReadPermissions, removeReadPermissions, getReadPermissions,
	addEditPermissions, removeEditPermissions, getEditPermissions,
	addParentReadPermission, removeParentReadPermission,
	addParentEditPermission, removeParentEditPermission,
} from '../reducers/permissionSlice';

const useStyles = makeStyles({
	root: {
		maxWidth: '60vw',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	id: {
		marginLeft: 8,
	},
	name: {
		minWidth: 'max-content',
		fontSize: 18,
		fontWeight: 600
	},
	checkBoxItem: {
		minWidth: '20vw',
		maxWidth: '30vw'
	}
});

const RowItem = ({ id, name }) => {
	const classes = useStyles();
	return (
		<div className={classNames(classes.root, 'flexRow flex1')}>
			<div className={classes.name}>{name}</div>
			<div className={classes.id}>{id} </div>			
		</div>
	)
};

const Item = ({ node }) => {
	const classes = useStyles();
	const [isOpen, setIsOpen] = useState(false);
	const [readPermission, setReadPermission] = useState(false);
	const [editPermission, setEditPermission] = useState(false);
	
	const dispatch = useDispatch();
	const currentReadPermissions = useSelector(getReadPermissions);
	const currentEditPermissions = useSelector(getEditPermissions);
	const sectors = useSelector(getSectors);
	

	useEffect(() => {
		const hasPermission = (node, permissions) => {
			return permissions.includes(node.id);
		}
		setReadPermission(hasPermission(node, currentReadPermissions));
		setEditPermission(hasPermission(node, currentEditPermissions));
	}, [currentReadPermissions, currentEditPermissions, node]);

	const handlePermission = (event, permissionType) => {
		const checked = event.target.checked;

		let setPermission, addPermission, removePermission, addParentPermission, removeParentPermission;
		if (permissionType === 'readPermissions') {
			setPermission = setReadPermission;
			addPermission = addReadPermissions;
			removePermission = removeReadPermissions;
			addParentPermission = addParentReadPermission;
			removeParentPermission = removeParentReadPermission;
		} else {
			setPermission = setEditPermission;
			addPermission = addEditPermissions;
			removePermission = removeEditPermissions;
			addParentPermission = addParentEditPermission;
			removeParentPermission = removeParentEditPermission;
		}

		// update state
    setPermission(checked);
		
		if (checked) {
			// add permission for current node
			dispatch(addPermission(node));

			// add permission for parent node
			let currentParent = getSectorById(sectors, node.parentId);
			while (currentParent) {
				dispatch(addParentPermission(currentParent));
				currentParent = getSectorById(sectors, currentParent.parentId);
			}
			
		} else {
			// remvoe permission for current node
			dispatch(removePermission(node));

			// remove permission for active parent node
			let currentParent = getSectorById(sectors, node.parentId);
			while (currentParent) {
				dispatch(removeParentPermission(currentParent));
				currentParent = getSectorById(sectors, currentParent.parentId);
			}
		}
	}

	const hasChildren = node.children.length > 0;
	return (
		<>
			<div className='flexRow fullWidth'>
				<IconButton
					aria-label="expand row"
					size='small'
					onClick={() => setIsOpen(!isOpen)}
					disabled={!hasChildren}
				>
					{isOpen ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
				<RowItem id={node.id} name={node.name} />
				<Checkbox
					checked={readPermission}
					disableRipple
					inputProps={{ 'aria-labelledby': `read-${node.id}` }}
					className={classes.checkBoxItem}
					onChange={(event) => handlePermission(event, 'readPermissions')}
				/>
				<Checkbox
					checked={editPermission}
					disableRipple
					inputProps={{ 'aria-labelledby': `edit-${node.id}` }}
					className={classes.checkBoxItem}
					onChange={(event) => handlePermission(event, 'editPermissions')}
				/>
			</div>
			
			<Collapse in={isOpen} timeout="auto" unmountOnExit>
				<Box sx={{ paddingLeft: '20px' }}>
					{ node.children.map(child => <Item key={child.id} node={child} />)}
				</Box>
				
			</Collapse>
			
		</>
	)
};
export default Item;