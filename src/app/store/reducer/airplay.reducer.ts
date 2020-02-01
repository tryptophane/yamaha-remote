import {AirplayStatus} from '../../model/airplay-status.model';
import {AirplayActions, AirplayActionTypes} from '../actions/airplay.action';

export interface State {
    status: AirplayStatus;
}

const initialState: State = {
    status: null
};

/* tslint:disable:no-switch-case-fall-through */
export function reducer(state: State = initialState, action: AirplayActions): State {
    switch (action.type) {
        case AirplayActionTypes.SET_AIRPLAY_STATUS: {
            return Object.assign({}, state, {status: action.payload});
        }
        default: {
            return state;
        }
    }
}
