import {ActionReducerMap} from '@ngrx/store';
import * as fromBasicStatus from './basic-status.reducer';
import * as fromNetradio from './netradio.reducer';
import * as fromSpotify from './spotify.reducer';
import * as fromServer from './server.reducer';
import * as fromInputs from './inputs.reducer';
import * as fromScenes from './scenes.reducer';
import * as fromAirplay from './airplay.reducer';
import * as fromNetworkName from './network-name.reducer';

export interface State {
    basicStatus: fromBasicStatus.State;
    netradio: fromNetradio.State;
    spotify: fromSpotify.State;
    server: fromServer.State;
    inputs: fromInputs.State;
    scenes: fromScenes.State;
    airplay: fromAirplay.State;
    networkName: fromNetworkName.State;
}

export const reducers: ActionReducerMap<State> = {
    basicStatus: fromBasicStatus.reducer,
    netradio: fromNetradio.reducer,
    spotify: fromSpotify.reducer,
    server: fromServer.reducer,
    inputs: fromInputs.reducer,
    scenes: fromScenes.reducer,
    airplay: fromAirplay.reducer,
    networkName: fromNetworkName.reducer
};

export const getBasicStatusState = (state: State) => state.basicStatus;
export const getNetradioState = (state: State) => state.netradio;
export const getSpotifyState = (state: State) => state.spotify;
export const getServerState = (state: State) => state.server;
export const getInputsState = (state: State) => state.inputs;
export const getScenesState = (state: State) => state.scenes;
export const getAirplayState = (state: State) => state.airplay;
export const getNetworkNameState = (state: State) => state.networkName;
