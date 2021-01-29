import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    spinner: {
        position: 'absolute',
        margin: 'auto',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
}));

export default function Loading() {
    const classes = useStyles();

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item>
                <CircularProgress className={classes.spinner} />
            </Grid>
        </Grid>

    );
}