import { Action } from '@ngrx/store';
import { Scene } from '../../model/scene.model';
import { ScenesActionTypes, SetScenesAction } from '../actions/scenes.action';

export interface State {
  scenes: Array<Scene>;
}

const initialState: State = {
  scenes: []
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ScenesActionTypes.SET_SCENES: {
      return Object.assign({}, state, {
        scenes: (action as SetScenesAction).payload
      });
    }
    default: {
      return state;
    }
  }
}
