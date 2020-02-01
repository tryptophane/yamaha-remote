import {Action} from '@ngrx/store';
import {type} from '../util';
import {ServerStatus} from '../../model/server-status.model';

export const ServerActionTypes = {
    SET_SERVER_STATUS: type('[SERVER] Set status')
};

export class SetServerStatusAction implements Action {
    type: string = ServerActionTypes.SET_SERVER_STATUS;
    payload: ServerStatus;

    constructor(status: ServerStatus) {
        this.payload = status;
    }
}

export type ServerActions = SetServerStatusAction;
