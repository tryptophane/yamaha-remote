import { Action } from '@ngrx/store';
import { ServerStatus } from '../../model/server-status.model';
import {
  ServerActionTypes,
  SetServerStatusAction
} from '../actions/server.action';

export interface State {
  status: ServerStatus | null;
}

const initialState: State = {
  status: null
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ServerActionTypes.SET_SERVER_STATUS: {
      return Object.assign({}, state, {
        status: (action as SetServerStatusAction).payload
      });
    }
    default: {
      return state;
    }
  }
}
