import { Action } from '@ngrx/store';
import { AirplayStatus } from '../../model/airplay-status.model';
import {
  AirplayActionTypes,
  SetAirplayStatusAction
} from '../actions/airplay.action';

export interface State {
  status: AirplayStatus | null;
}

const initialState: State = {
  status: null
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case AirplayActionTypes.SET_AIRPLAY_STATUS: {
      return Object.assign({}, state, {
        status: (action as SetAirplayStatusAction).payload
      });
    }
    default: {
      return state;
    }
  }
}
