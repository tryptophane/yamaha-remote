import {Component} from '@angular/core';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../store/reducer';
import {State} from '../../store/reducer';
import {Observable} from 'rxjs';
import {RemoteService} from '../../service/remote-service';
import {skip, switchMap, take, tap} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-sleep',
    templateUrl: './sleep.component.html',
    styleUrls: ['./sleep.component.scss']
})
export class SleepComponent {

    basicStatusState$: Observable<fromBasicStatus.State>;

    constructor(private readonly store: Store<State>,
                private readonly service: RemoteService,
                private readonly snackBar: MatSnackBar) {
        this.basicStatusState$ = store.select(fromRoot.getBasicStatusState);
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, null, {duration: 2000, panelClass: 'sleep-snack-bar'});
    }

    toggleSleep(actual: string): void {
        this.service.toggleSleep(actual).pipe(
            tap(() => this.service.refreshBasicStatus()),
            switchMap(() => this.basicStatusState$.pipe(skip(1), take(1))))
            .subscribe(state =>
                this.openSnackBar(state.sleep !== this.service.sleepStates[0] ? `Going to sleep in ${state.sleep}` : 'Sleep Off'));
    }
}
