import {Component, Input} from '@angular/core';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import {Observable} from 'rxjs';
import * as fromRoot from '../../store/reducer';
import {State} from '../../store/reducer';
import {Store} from '@ngrx/store';
import {VolumeControlService} from '../../service/volume-control.service';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss']
})
export class VolumeControlComponent {

    @Input()
    disabled = false;

    basicStatusState$: Observable<fromBasicStatus.State>;

    constructor(private readonly store: Store<State>, public readonly service: VolumeControlService) {
        this.basicStatusState$ = store.select(fromRoot.getBasicStatusState);
    }
}
