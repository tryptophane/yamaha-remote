import { BasicStatusActions } from '../actions/basic-status.action';
import { NetworkNameActionTypes } from '../actions/network-name.action';

export interface State {
  networkName: string;
}

const initialState: State = {
  networkName: ''
};

export function reducer(
  state: State = initialState,
  action: BasicStatusActions
): State {
  switch (action.type) {
    case NetworkNameActionTypes.SET_NETWORK_NAME: {
      return Object.assign({}, state, { networkName: action.payload });
    }
    default: {
      return state;
    }
  }
}
