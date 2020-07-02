import { useEffect, useReducer } from 'react';
import mons from '../../../services/microsoft-one-note.service';
import * as actions from './state/actions';
import reducer, {initialState} from './state/reducer';

export default () => {
    let [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        mons.getAllNoteBooks().then(notebooks => {
            notebooks.push(state.custom);
            dispatch({type: actions.SET_NOTEBOOKS, notebooks});
            dispatch({type: actions.SET_SECTIONS, sections: [state.custom]});
            dispatch({type: actions.SELECT_NOTEBOOK, selectedNotebook: state.custom});
            dispatch({type: actions.SELECT_SECTION, selectedSection: state.custom});
        });
    }, [state.custom]);

    return [state, dispatch];
};