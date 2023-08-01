import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import { makeStyles } from '@mui/styles';

import { listActiveParentSectors } from '../actions/permissions';
import { getSectors } from '../reducers/sectorSlice';
import { getReadPermissions, getEditPermissions } from '../reducers/permissionSlice';

const START = '{';
const END = '}';

const Line = ({children}) => {
	return <div style={{ marginLeft: 10 }}>{children}</div>;
}

const PermissionLines = ({ permissions = [] }) => {
	return (
		<div style={{ paddingLeft: 15 }}>
			{ permissions.map(id => <Line key={id}>"{id}",</Line>) }
		</div>
	);
}

const JsonDisplay = ({ readPermissions = [], editPermissions = [] }) => {
	return (
		<>
			<div>{START}</div>
			<div style={{ paddingLeft: 10 }}>
				<Line>"perm_0_read ": [</Line>
				<PermissionLines permissions={readPermissions} />
				<Line>],</Line>
				
				<Line>"perm_1_edit": [</Line>
				<PermissionLines permissions={editPermissions} />
				<Line>]</Line>
			</div>
			
			<div>{END}</div>
		</>
	)
};

const FirstList = () => {
	const readPermissions = useSelector(getReadPermissions);
	const editPermissions = useSelector(getEditPermissions);
	
	return (
		<>
			<div>Tous les ids des secteurs autorisés</div>
			<JsonDisplay
				readPermissions={readPermissions}
				editPermissions={editPermissions}
			/>
		</>
	)
};

const SecondList = () => {
	const sectors = useSelector(getSectors);
	const readPermissions = useSelector(getReadPermissions);
	const editPermissions = useSelector(getEditPermissions);

	return (
		<>
			<div>Ids des noeuds de plus haut niveau</div>
			<JsonDisplay
				readPermissions={listActiveParentSectors(readPermissions, sectors)}
				editPermissions={listActiveParentSectors(editPermissions, sectors)}
			/>
		</>
	)
};

const useStyles = makeStyles({
	root: {
		border: '1px solid black',
		alignItems: 'start'
	},
	bloc: {
		padding: 15,
	},
	firstBloc: {
		borderRight: '1px solid black'
	},
	secondBloc: {
		
	}
});

const SummaryTable = () => {
	const [height, setHeight] = useState();
	const classes = useStyles();
	const firstBlocRef = useRef();
	const secondBlocRef = useRef();

	const readPermissions = useSelector(getReadPermissions);
	const editPermissions = useSelector(getEditPermissions);

	useEffect(() => {
		const firstBlocHeight = firstBlocRef.current?.clientHeight || 0;
		const secondBlocHeight = secondBlocRef.current?.clientHeight || 0;
    const height = Math.max(firstBlocHeight, secondBlocHeight);
		setHeight(height);		
  }, [readPermissions, editPermissions]);

	return (
		<div className={classNames(classes.root, 'flexRow')} style={{ minHeight: height }}>
			<div className={classNames(classes.bloc, classes.firstBloc, 'flex1')} ref={firstBlocRef}><FirstList /></div>
			<div className={classNames(classes.bloc, classes.secondBloc, 'flex1')} ref={secondBlocRef}><SecondList /></div>
		</div>
	);
}
export default SummaryTable;