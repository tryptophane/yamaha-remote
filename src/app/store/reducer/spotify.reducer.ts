import { Action } from '@ngrx/store';
import { SpotifyStatus } from '../../model/spotify-status.model';
import {
  SetSpotifyStatusAction,
  SpotifyActionTypes
} from '../actions/spotify.action';

export interface State {
  status: SpotifyStatus | null;
}

const initialState: State = {
  status: null
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SpotifyActionTypes.SET_SPOTIFY_STATUS: {
      return Object.assign({}, state, {
        status: (action as SetSpotifyStatusAction).payload
      });
    }
    default: {
      return state;
    }
  }
}
