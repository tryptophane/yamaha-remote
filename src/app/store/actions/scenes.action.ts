import { Action } from '@ngrx/store';
import { type } from '../util';
import { Scene } from '../../model/scene.model';

export const ScenesActionTypes = {
  SET_SCENES: type('[SCENES] Set scenes')
};

export class SetScenesAction implements Action {
  type: string = ScenesActionTypes.SET_SCENES;
  payload: Array<Scene>;

  constructor(scenes: Array<Scene>) {
    this.payload = scenes;
  }
}

export type ScenesActions = SetScenesAction;
