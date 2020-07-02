import * as actions from './actions';

const custom = { displayName: 'Custom', id: 0 };
export const initialState = {notebooks: null, sections: null, selectedNotebook: {}, taskName: '', selectedSection: {}, custom};

function reducer(state=initialState, action){
    switch(action.type){
        case actions.SET_NOTEBOOKS: return {...state, notebooks: action.notebooks};
        case actions.SET_SECTIONS: return {...state, sections: action.sections};
        case actions.SELECT_NOTEBOOK: return {...state, selectedNotebook: action.selectedNotebook};
        case actions.UPDATE_TASK_NAME: return {...state, taskName: action.taskName};
        case actions.LOAD_SECTIONS: return {...state};
        case actions.SELECT_SECTION: return {...state, selectedSection: action.selectedSection};
        case actions.SET_LOADING_SECTIONS: return {...state, loadingSections: action.value};
        default: return state;
    }
}

export default reducer;