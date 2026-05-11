import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import * as fromNetradio from '../../store/reducer/netradio.reducer';
import * as fromSpotify from '../../store/reducer/spotify.reducer';
import * as fromServer from '../../store/reducer/server.reducer';
import * as fromAirplay from '../../store/reducer/airplay.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { FixAmpPipe } from '../../utils/fix-amp.pipe';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.scss'],
  imports: [NgIf, AsyncPipe, FixAmpPipe]
})
export class PlaybackInfoComponent {
  private readonly store = inject<Store<State>>(Store);

  basicStatusState$: Observable<fromBasicStatus.State>;
  netradioState$: Observable<fromNetradio.State>;
  spotifyState$: Observable<fromSpotify.State>;
  serverState$: Observable<fromServer.State>;
  airplayState$: Observable<fromAirplay.State>;

  constructor() {
    this.basicStatusState$ = this.store.select(fromRoot.getBasicStatusState);
    this.netradioState$ = this.store.select(fromRoot.getNetradioState);
    this.spotifyState$ = this.store.select(fromRoot.getSpotifyState);
    this.serverState$ = this.store.select(fromRoot.getServerState);
    this.airplayState$ = this.store.select(fromRoot.getAirplayState);
  }
}
