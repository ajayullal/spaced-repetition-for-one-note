
import React, {useContext} from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import TaskNameProvider, {TaskNameContext} from  './TaskNameProvider';
import * as actions from './state/actions';

import classes from './_taskNameInput.module.scss';
import NotebookSelectBox from './NotebookSelectBox/NotebookSelectBox';
import SectionSelectBox from './SectionSelectBox/SectionSelectBox';
import { routerService } from '../../../services';

const TaskNameInput = ({ notebooks }: any) => {
    const taskNameContext: any = useContext(TaskNameContext);
    const {loadingSections, taskName, selectedSection, selectedNotebook} = taskNameContext;
    const timerUrl = routerService.getRouteUrl('timer');

    const viewPageInfo = () => {
        let search = `?pageTitle=${encodeURIComponent(taskName)}&sectionId=${selectedSection.id}&sectionName=${selectedSection.displayName}&noteBook=${selectedNotebook.displayName}`;
        routerService.gotoUrl(`${timerUrl}${search}`);
    }

    return (
        <>
            <div className={classes.selectBoxCntr}>
                <Grid className={classes.selectBoxGrid} item xs={12} md={6}>
                    <NotebookSelectBox></NotebookSelectBox>
                </Grid>

                <Grid className={classes.selectBoxGrid} item xs={12} md={6}>
                    <SectionSelectBox></SectionSelectBox>
                </Grid>
            </div>

            <TextField
                fullWidth
                autoComplete="off"
                className={`${classes.taskInput} searchBox`}
                id="outlined-secondary"
                label="Task Name"
                variant="outlined"
                onChange={(event: any) => {
                    const searchTxt = event.target.value.trim();
                    taskNameContext.dispatch({type: actions.UPDATE_TASK_NAME, taskName: searchTxt});
                }}
            />

            <Button disabled={loadingSections || !taskName} onClick={() => { viewPageInfo() }} variant="contained" color="primary">Add</Button>
        </>
    );
};

export default () => {
    return (
        <>
            <TaskNameProvider>
                <TaskNameInput></TaskNameInput>
            </TaskNameProvider>
        </>
    );
};