import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { FixAmpPipe } from '../../utils/fix-amp.pipe';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixAmpPipe]
})
export class PlaybackInfoComponent {
  private readonly store = inject<Store<State>>(Store);

  protected readonly basicStatusState = toSignal(
    this.store.select(fromRoot.getBasicStatusState).pipe(distinctUntilChanged())
  );
  protected readonly netradioState = toSignal(
    this.store.select(fromRoot.getNetradioState).pipe(distinctUntilChanged())
  );
  protected readonly spotifyState = toSignal(
    this.store.select(fromRoot.getSpotifyState).pipe(distinctUntilChanged())
  );
  protected readonly serverState = toSignal(
    this.store.select(fromRoot.getServerState).pipe(distinctUntilChanged())
  );
  protected readonly airplayState = toSignal(
    this.store.select(fromRoot.getAirplayState).pipe(distinctUntilChanged())
  );
}
