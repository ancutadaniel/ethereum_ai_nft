import React from 'react';

import classes from './MetadataView.module.css';

const MetadataView = ({ isWaiting, url }) => {
    if (isWaiting || !url) return null;
    return (
        <p className={classes.metadata}>
            View <a href={url} target="_blank" rel="noreferrer">Metadata</a>
        </p>
    );
};

export default MetadataView;
