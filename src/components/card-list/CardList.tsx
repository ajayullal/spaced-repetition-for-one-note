import React from 'react';
import { Grid, Card, CardContent, Typography, makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
    card: {
        cursor: 'pointer'
    }
});


export default ({items, onClick, displayPropName, id}: any) => {
    const classes = useStyles();

    return (
        items.length > 0?
        (<Grid spacing={5} container>
            {
                items.map((item: any) => {
                    return (
                        <Grid onClick={() => onClick(item)} xs={12} item md={6} key={item.id}>
                            <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        {item[displayPropName]}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })
            }
        </Grid>):
        <Typography variant="h6" component="h6" color="textSecondary" gutterBottom>Nothing to display</Typography>
    );
}