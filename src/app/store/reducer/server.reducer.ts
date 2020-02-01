import {ServerStatus} from '../../model/server-status.model';
import {ServerActions, ServerActionTypes} from '../actions/server.action';

export interface State {
    status: ServerStatus;
}

const initialState: State = {
    status: null
};

/* tslint:disable:no-switch-case-fall-through */
export function reducer(state: State = initialState, action: ServerActions): State {
    switch (action.type) {
        case ServerActionTypes.SET_SERVER_STATUS: {
            return Object.assign({}, state, {status: action.payload});
        }
        default: {
            return state;
        }
    }
}
