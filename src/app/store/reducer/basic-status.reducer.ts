import {
  BasicStatusActions,
  BasicStatusActionTypes
} from '../actions/basic-status.action';

export interface State {
  volume: number;
  on: boolean;
  muted: boolean;
  currentInput: string;
  adaptiveDRCEnabled: boolean;
  enhancer: boolean;
  direct: boolean;
  threeDCinemaDsp: boolean;
  bass: number;
  treble: number;
  dsp: string;
  sleep: string;
  error: boolean;
}

const initialState: State = {
  volume: -500,
  on: false,
  muted: false,
  currentInput: '',
  adaptiveDRCEnabled: false,
  enhancer: false,
  direct: false,
  threeDCinemaDsp: false,
  bass: 0,
  treble: 0,
  dsp: '',
  sleep: '',
  error: false
};

export function reducer(
  state: State = initialState,
  action: BasicStatusActions
): State {
  switch (action.type) {
    case BasicStatusActionTypes.SET_BASIC_STATUS: {
      return Object.assign({}, state, action.payload);
    }
    case BasicStatusActionTypes.SET_ERROR: {
      return Object.assign({}, state, { error: action.payload });
    }
    default: {
      return state;
    }
  }
}
