import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const Title = ({ label }) => {
	return (
		<Typography variant='h4' gutterBottom>
			{label}
		</Typography>
	);
}

Title.propTypes = {
	label: PropTypes.string.isRequired
};
export default Title;