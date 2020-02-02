import {Action} from '@ngrx/store';
import {type} from '../util';
import {State} from '../reducer/basic-status.reducer';

export const BasicStatusActionTypes = {
    SET_BASIC_STATUS: type('[BASIC_STATUS] Set basic status'),
    REFRESH_ALL_STATUS: type('[BASIC_STATUS] Refresh all status'),
    SET_ERROR: type('[BASIC_STATUS] Set error')
};

export class SetBasicStatusAction implements Action {
    type: string = BasicStatusActionTypes.SET_BASIC_STATUS;
    payload: State;

    constructor(state: State) {
        this.payload = state;
    }
}

export class RefreshAllStatusAction implements Action {
    type: string = BasicStatusActionTypes.REFRESH_ALL_STATUS;
    payload: void;
}

export class SetErrorAction implements Action {
    type: string = BasicStatusActionTypes.SET_ERROR;
    payload: boolean;

    constructor(error: boolean) {
        this.payload = error;
    }
}

export type BasicStatusActions = SetBasicStatusAction | RefreshAllStatusAction | SetErrorAction;
