import {Action} from '@ngrx/store';
import {type} from '../util';
import {InputItem} from '../../model/input-item.model';

export const InputsActionTypes = {
    SET_INPUT_LIST: type('[INPUTS] Set Input list')
};

export class SetInputListAction implements Action {
    type: string = InputsActionTypes.SET_INPUT_LIST;
    payload: Array<InputItem>;

    constructor(state: Array<InputItem>) {
        this.payload = state;
    }
}

export type InputsActions = SetInputListAction;
