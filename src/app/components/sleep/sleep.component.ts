import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { RemoteService } from '../../service/remote-service';
import { BasicStatusStore } from '../../store/basic-status.store';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMiniFabButton, MatTooltip, MatIcon]
})
export class SleepComponent {
  protected readonly service = inject(RemoteService);
  protected readonly basicStatusStore = inject(BasicStatusStore);
  private readonly snackBar = inject(MatSnackBar);

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: 'sleep-snack-bar'
    });
  }

  toggleSleep(actual: string): void {
    this.service
      .toggleSleep(actual)
      .pipe(switchMap(() => this.basicStatusStore.refresh()))
      .subscribe(state =>
        this.openSnackBar(
          state.sleep !== this.service.sleepStates[0]
            ? `Going to sleep in ${state.sleep}`
            : 'Sleep Off'
        )
      );
  }
}
