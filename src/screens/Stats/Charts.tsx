import React, {useEffect} from 'react';
import {select} from 'd3-selection';

export default () => {
    useEffect(() => {
        console.log(select('.chart-container'));
    }, []);

    return (
        <div className="chart-container">
        </div>
    );
};