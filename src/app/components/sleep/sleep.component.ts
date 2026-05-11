import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { skip, switchMap, take, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { RemoteService } from '../../service/remote-service';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.scss'],
  imports: [NgIf, MatMiniFabButton, MatTooltip, MatIcon, AsyncPipe]
})
export class SleepComponent {
  private readonly store = inject<Store<State>>(Store);
  protected readonly service = inject(RemoteService);
  private readonly snackBar = inject(MatSnackBar);

  basicStatusState$: Observable<fromBasicStatus.State>;

  constructor() {
    this.basicStatusState$ = this.store.select(fromRoot.getBasicStatusState);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: 'sleep-snack-bar'
    });
  }

  toggleSleep(actual: string): void {
    this.service
      .toggleSleep(actual)
      .pipe(
        tap(() => this.service.refreshBasicStatus()),
        switchMap(() => this.basicStatusState$.pipe(skip(1), take(1)))
      )
      .subscribe(state =>
        this.openSnackBar(
          state.sleep !== this.service.sleepStates[0]
            ? `Going to sleep in ${state.sleep}`
            : 'Sleep Off'
        )
      );
  }
}
