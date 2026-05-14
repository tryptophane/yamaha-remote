import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-play-mode',
  templateUrl: './play-mode.component.html',
  styleUrls: ['./play-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon]
})
export class PlayModeComponent {
  private readonly store = inject<Store<State>>(Store);
  readonly service = inject(ServerService);

  protected readonly serverState = toSignal(
    this.store.select(fromRoot.getServerState).pipe(distinctUntilChanged())
  );
}
