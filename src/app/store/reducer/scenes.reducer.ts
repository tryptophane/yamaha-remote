import { BasicStatusActions } from '../actions/basic-status.action';
import { Scene } from '../../model/scene.model';
import { ScenesActionTypes } from '../actions/scenes.action';

export interface State {
  scenes: Array<Scene>;
}

const initialState: State = {
  scenes: []
};

export function reducer(
  state: State = initialState,
  action: BasicStatusActions
): State {
  switch (action.type) {
    case ScenesActionTypes.SET_SCENES: {
      return Object.assign({}, state, { scenes: action.payload });
    }
    default: {
      return state;
    }
  }
}
