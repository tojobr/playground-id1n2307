import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import Paper from '@mui/material/Paper';

import data from './utils/Sectorisation.json';
import Title from './components/Title';
import SummaryTable from './components/SummaryTable';
import CollapsibleItems from './components/CollapsibleItems';

import { mapToNodes } from './actions/sectors.js';
import { loadSectors } from './reducers/sectorSlice';


function App() {
	const [nodes, setNodes] = useState([]);
	const dispatch = useDispatch();

	const fetchData = useCallback(() => {
		const nodes = mapToNodes(data);
		setNodes(nodes);
		dispatch(loadSectors(nodes));
	}, [data]);

	useEffect(() => {
		fetchData();		
	}, [fetchData]);

  return (
    <div className='main'>
      <Paper elevation={3}>
				<div className='collapsible-table'>
					<Title label='Permissions' />
					<CollapsibleItems items={nodes} />
				</div>
				
				<div className='summary-table'>
					<Title label='Récapitulatif' />
					<SummaryTable />
				</div>

			</Paper>
    </div>
  );
}

export default App;
