import React from 'react';
import useData from './useData';
import { LinearProgress } from '@material-ui/core';
import mons from '../../../services/microsoft-one-note.service';
import * as actions from './state/actions';
export const TaskNameContext = React.createContext({});

export default ({ children }: any) => {
    const [state, dispatch]: any = useData();

    const loadSections = (notebookId: string) => {
        dispatch({type: actions.SET_LOADING_SECTIONS, value: true})

        mons.getAllSection(notebookId).then((sections: any) => {
            dispatch({type: actions.SET_SECTIONS, sections: [...sections, state.custom]})
            dispatch({type: actions.SET_LOADING_SECTIONS, value: false})
            dispatch({type: actions.SELECT_SECTION, selectedSection: sections[0]})
        });
    };

    const props = {
        loadSections
    };

    return (<>
        <TaskNameContext.Provider value={{...state, ...props, dispatch}}>
            {
                !state?.notebooks || !state?.sections ? (<LinearProgress color="secondary" />) : children
            }
        </TaskNameContext.Provider>
    </>);
};