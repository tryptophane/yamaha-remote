import {SpotifyStatus} from '../../model/spotify-status.model';
import {SpotifyActions, SpotifyActionTypes} from '../actions/spotify.action';

export interface State {
    status: SpotifyStatus;
}

const initialState: State = {
    status: null
};

/* tslint:disable:no-switch-case-fall-through */
export function reducer(state: State = initialState, action: SpotifyActions): State {
    switch (action.type) {
        case SpotifyActionTypes.SET_SPOTIFY_STATUS: {
            return Object.assign({}, state, {status: action.payload});
        }
        default: {
            return state;
        }
    }
}
