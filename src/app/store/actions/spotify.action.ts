import { Action } from '@ngrx/store';
import { type } from '../util';
import { SpotifyStatus } from '../../model/spotify-status.model';

export const SpotifyActionTypes = {
  SET_SPOTIFY_STATUS: type('[SPOTIFY] Set status')
};

export class SetSpotifyStatusAction implements Action {
  type: string = SpotifyActionTypes.SET_SPOTIFY_STATUS;
  payload: SpotifyStatus;

  constructor(status: SpotifyStatus) {
    this.payload = status;
  }
}

export type SpotifyActions = SetSpotifyStatusAction;
