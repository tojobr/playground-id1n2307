import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@mui/styles';

import Item from './Item';

const useStyles = makeStyles({
	root: {

	},
	header: {
		width: '100%'
	},
	titleItem: {
		textAlign: 'center',
		minWidth: '20vw',
		maxWidth: '30vw'
	}
});

const CollapsibleItems = ({ items }) => {
	const classes = useStyles();

	return (
		<>
			<div className={classNames(classes.header, 'flexRow')}>
				<div className='flex1'></div>
				<div className={classes.titleItem}>Lecture</div>
				<div className={classes.titleItem}>Modification</div>
			</div>
			{ items.map((item, index) => <Item key={index} node={item} />)}
		</>
	)
}
export default CollapsibleItems;