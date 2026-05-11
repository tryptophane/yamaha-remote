import { Action } from '@ngrx/store';
import {
  NetRadioActionTypes,
  SetListAction,
  SetMenuStatusAction,
  SetRadioStatusAction
} from '../actions/netradio.action';
import { NetRadioStatus } from '../../model/net-radio-status.model';
import { NetRadioList } from '../../model/net-radio-list.model';

export interface State {
  status: NetRadioStatus | null;
  list: NetRadioList | null;
}

const initialState: State = {
  status: null,
  list: null
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case NetRadioActionTypes.SET_RADIO_STATUS: {
      return Object.assign({}, state, {
        status: (action as SetRadioStatusAction).payload
      });
    }
    case NetRadioActionTypes.SET_LIST: {
      return Object.assign({}, state, {
        list: (action as SetListAction).payload
      });
    }
    case NetRadioActionTypes.SET_MENU_STATUS: {
      const newList = Object.assign({}, state.list, {
        menuStatus: (action as SetMenuStatusAction).payload
      });
      return Object.assign({}, state, { list: newList });
    }
    default: {
      return state;
    }
  }
}
