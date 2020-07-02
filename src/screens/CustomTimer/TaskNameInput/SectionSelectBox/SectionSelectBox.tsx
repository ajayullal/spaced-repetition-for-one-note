import React, { useContext } from 'react';
import { Select, MenuItem, Typography, LinearProgress } from '@material-ui/core';
import { TaskNameContext } from '../TaskNameProvider';
import classes from '../_taskNameInput.module.scss';
import * as actions from '../state/actions';

const SectionSelectBox = () => {
    const taskNameContext: any = useContext(TaskNameContext);
    const { sections, loadingSections } = taskNameContext;

    const SectionSelection = (
        <>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className={classes.selectBox}
                value={taskNameContext.selectedSection || {}}
                onChange={(event) => {
                    let selectedSection = event.target.value;
                    taskNameContext.dispatch({ type: actions.SELECT_SECTION, selectedSection })
                }}>
                {
                    sections?.map((section: any) => {
                        return (
                            <MenuItem key={section.id} value={section}>{section.displayName}</MenuItem>
                        );
                    })
                }
            </Select>
        </>
    );

    return (
        <>
            <Typography color="textSecondary" gutterBottom>
                Sections:
            </Typography>

            {loadingSections ? (<LinearProgress color="secondary" />) : SectionSelection}
        </>
    );
};

export default SectionSelectBox;