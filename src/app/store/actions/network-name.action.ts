import {Action} from '@ngrx/store';
import {type} from '../util';

export const NetworkNameActionTypes = {
    SET_NETWORK_NAME: type('[BASIC_STATUS] Set network name')
};

export class SetNetworkNameAction implements Action {
    type: string = NetworkNameActionTypes.SET_NETWORK_NAME;
    payload: string;

    constructor(name: string) {
        this.payload = name;
    }
}

export type BasicStatusActions = SetNetworkNameAction;
