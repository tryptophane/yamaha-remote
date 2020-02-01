import {Action} from '@ngrx/store';
import {type} from '../util';
import {State} from '../reducer/basic-status.reducer';

export const BasicStatusActionTypes = {
    SET_BASIC_STATUS: type('[BASIC_STATUS] Set basic status'),
    REFRESH_ALL_STATUS: type('[BASIC_STATUS] Refresh all status')
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

export type BasicStatusActions = SetBasicStatusAction | RefreshAllStatusAction;
