import { Action } from '@ngrx/store';
import { InputItem } from '../../model/input-item.model';
import {
  InputsActionTypes,
  SetInputListAction
} from '../actions/inputs.action';

export interface State {
  inputList: Array<InputItem>;
}

const initialState: State = {
  inputList: []
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case InputsActionTypes.SET_INPUT_LIST: {
      return Object.assign({}, state, {
        inputList: (action as SetInputListAction).payload
      });
    }
    default: {
      return state;
    }
  }
}
