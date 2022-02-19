import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import * as fromNetradio from '../../store/reducer/netradio.reducer';
import * as fromSpotify from '../../store/reducer/spotify.reducer';
import * as fromServer from '../../store/reducer/server.reducer';
import * as fromAirplay from '../../store/reducer/airplay.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.scss']
})
export class PlaybackInfoComponent {
  basicStatusState$: Observable<fromBasicStatus.State>;
  netradioState$: Observable<fromNetradio.State>;
  spotifyState$: Observable<fromSpotify.State>;
  serverState$: Observable<fromServer.State>;
  airplayState$: Observable<fromAirplay.State>;

  constructor(private readonly store: Store<State>) {
    this.basicStatusState$ = store.select(fromRoot.getBasicStatusState);
    this.netradioState$ = store.select(fromRoot.getNetradioState);
    this.spotifyState$ = store.select(fromRoot.getSpotifyState);
    this.serverState$ = store.select(fromRoot.getServerState);
    this.airplayState$ = store.select(fromRoot.getAirplayState);
  }
}
