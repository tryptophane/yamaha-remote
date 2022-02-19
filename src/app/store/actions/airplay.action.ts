import { Action } from '@ngrx/store';
import { type } from '../util';
import { AirplayStatus } from '../../model/airplay-status.model';

export const AirplayActionTypes = {
  SET_AIRPLAY_STATUS: type('[AIRPLAY] Set status')
};

export class SetAirplayStatusAction implements Action {
  type: string = AirplayActionTypes.SET_AIRPLAY_STATUS;
  payload: AirplayStatus;

  constructor(status: AirplayStatus) {
    this.payload = status;
  }
}

export type AirplayActions = SetAirplayStatusAction;
