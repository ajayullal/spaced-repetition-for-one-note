import React, { useContext } from 'react';
import { Select, MenuItem, Typography } from '@material-ui/core';
import { TaskNameContext } from '../TaskNameProvider';
import classes from '../_taskNameInput.module.scss';
import * as actions from '../state/actions';

const NotebookSelectBox = () => {
    const taskNameContext: any = useContext(TaskNameContext);
    const { notebooks, custom, dispatch } = taskNameContext;

    return (
        <>
            <Typography color="textSecondary" gutterBottom>
                Notebook:
            </Typography>

            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={taskNameContext.selectedNotebook|| {}}
                className={classes.selectBox}
                onChange={(event) => {
                    let selectedNotebook: any = event.target.value;
                    taskNameContext.dispatch({ type: actions.SELECT_NOTEBOOK, selectedNotebook })
                    
                    if(selectedNotebook === custom){
                        dispatch({type: actions.SET_SECTIONS, sections: [custom]})
                        dispatch({type: actions.SELECT_SECTION, selectedSection:custom})
                    }else{
                        taskNameContext.loadSections(selectedNotebook.id);
                    }
                }}>
                {
                    notebooks?.map((notebook: any) => {
                        return (
                            <MenuItem key={notebook.id} value={notebook}>{notebook.displayName}</MenuItem>
                        );
                    })
                }
            </Select>
        </>
    );
};

export default NotebookSelectBox;