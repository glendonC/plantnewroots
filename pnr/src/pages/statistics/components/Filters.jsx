import React, { useState } from 'react';

const Filters = ({ onFilterChange }) => {
    const [filter, setFilter] = useState('');

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        onFilterChange(e.target.value);
    };

    return (
        <div>
            <label htmlFor="filter">Filter Results:</label>
            <select id="filter" value={filter} onChange={handleFilterChange}>
                <option value="">Select Filter</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastYear">Last Year</option>
            </select>
        </div>
    );
};

export default Filters;
