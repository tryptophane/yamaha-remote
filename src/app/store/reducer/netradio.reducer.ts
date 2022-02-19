import {
  NetradioActions,
  NetRadioActionTypes
} from '../actions/netradio.action';
import { NetRadioStatus } from '../../model/net-radio-status.model';
import { NetRadioList } from '../../model/net-radio-list.model';

export interface State {
  status: NetRadioStatus;
  list: NetRadioList;
}

const initialState: State = {
  status: null,
  list: null
};

export function reducer(
  state: State = initialState,
  action: NetradioActions
): State {
  switch (action.type) {
    case NetRadioActionTypes.SET_RADIO_STATUS: {
      return Object.assign({}, state, { status: action.payload });
    }
    case NetRadioActionTypes.SET_LIST: {
      return Object.assign({}, state, { list: action.payload });
    }
    case NetRadioActionTypes.SET_MENU_STATUS: {
      const newList = Object.assign({}, state.list, {
        menuStatus: action.payload
      });
      return Object.assign({}, state, { list: newList });
    }
    default: {
      return state;
    }
  }
}
