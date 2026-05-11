import { Action } from '@ngrx/store';
import {
  NetworkNameActionTypes,
  SetNetworkNameAction
} from '../actions/network-name.action';

export interface State {
  networkName: string;
}

const initialState: State = {
  networkName: ''
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case NetworkNameActionTypes.SET_NETWORK_NAME: {
      return Object.assign({}, state, {
        networkName: (action as SetNetworkNameAction).payload
      });
    }
    default: {
      return state;
    }
  }
}
