import React from 'react';
import { Typography } from '@material-ui/core';

export default ({variant}: any) => {
    return <Typography variant={variant || 'h5'} component={variant || 'h5'} color="textSecondary" gutterBottom>Nothing to display</Typography>
};