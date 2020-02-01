import {Action} from '@ngrx/store';
import {type} from '../util';
import {NetRadioStatus} from '../../model/net-radio-status.model';
import {NetRadioList} from '../../model/net-radio-list.model';

export const NetRadioActionTypes = {
    SET_RADIO_STATUS: type('[NETRADIO] Set radio status'),
    SET_LIST: type('[NETRADIO] Set List'),
    SET_MENU_STATUS: type('[NETRADIO] Set menu status ')
};

export class SetRadioStatusAction implements Action {
    type: string = NetRadioActionTypes.SET_RADIO_STATUS;
    payload: NetRadioStatus;

    constructor(status: NetRadioStatus) {
        this.payload = status;
    }
}

export class SetListAction implements Action {
    type: string = NetRadioActionTypes.SET_LIST;
    payload: NetRadioList;

    constructor(list: NetRadioList) {
        this.payload = list;
    }
}

export class SetMenuStatusAction implements Action {
    type: string = NetRadioActionTypes.SET_MENU_STATUS;
    payload: string;

    constructor(status: string) {
        this.payload = status;
    }
}

export type NetradioActions = SetRadioStatusAction | SetListAction | SetMenuStatusAction;
