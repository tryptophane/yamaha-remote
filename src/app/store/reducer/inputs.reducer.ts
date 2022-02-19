import { InputItem } from '../../model/input-item.model';
import { InputsActions, InputsActionTypes } from '../actions/inputs.action';

export interface State {
  inputList: Array<InputItem>;
}

const initialState: State = {
  inputList: []
};

export function reducer(
  state: State = initialState,
  action: InputsActions
): State {
  switch (action.type) {
    case InputsActionTypes.SET_INPUT_LIST: {
      return Object.assign({}, state, { inputList: action.payload });
    }
    default: {
      return state;
    }
  }
}
