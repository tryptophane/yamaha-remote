import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import * as fromInputs from '../../store/reducer/inputs.reducer';
import * as fromRoot from '../../store/reducer';
import {State} from '../../store/reducer';
import {Store} from '@ngrx/store';
import {SetInputListAction} from '../../store/actions/inputs.action';
import {InputSelectionService} from '../../service/input-selection.service';

@Component({
    selector: 'app-input-selection',
    templateUrl: './input-selection.component.html',
    styleUrls: ['./input-selection.component.scss']
})
export class InputSelectionComponent implements OnInit {

    @Input()
    currentInput: string;

    @Input()
    disabled = false;

    inputsState$: Observable<fromInputs.State>;

    constructor(private readonly store: Store<State>, private readonly service: InputSelectionService) {
        this.inputsState$ = store.select(fromRoot.getInputsState);
    }

    ngOnInit() {
        this.fetchInputList();
    }

    fetchInputList(): void {
        this.service.getInputList().subscribe(list => {
            this.store.dispatch(new SetInputListAction(list));
        });
    }
}
