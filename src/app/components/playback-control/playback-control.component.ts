/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, Input } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs/operators';
import * as fromSpotify from '../../store/reducer/spotify.reducer';
import * as fromServer from '../../store/reducer/server.reducer';
import * as fromAirplay from '../../store/reducer/airplay.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { PlaybackControlService } from '../../service/playback-control.service';
import { RemoteService } from '../../service/remote-service';
import { AirplayService } from '../../service/airplay.service';
import { SpotifyService } from '../../service/spotify.service';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-playback-control',
  templateUrl: './playback-control.component.html',
  styleUrls: ['./playback-control.component.scss']
})
export class PlaybackControlComponent {
  @Input()
  currentInput: string;

  spotifyState$: Observable<fromSpotify.State>;
  serverState$: Observable<fromServer.State>;
  airplayState$: Observable<fromAirplay.State>;

  constructor(
    private readonly store: Store<State>,
    private readonly service: PlaybackControlService,
    private readonly remoteService: RemoteService,
    private readonly airplayService: AirplayService,
    private readonly spotifyService: SpotifyService,
    private readonly serverService: ServerService
  ) {
    this.spotifyState$ = store.select(fromRoot.getSpotifyState);
    this.serverState$ = store.select(fromRoot.getServerState);
    this.airplayState$ = store.select(fromRoot.getAirplayState);
  }

  pause(): void {
    this.service
      .pause()
      .pipe(
        switchMap(() => timer(0, 500)),
        take(6)
      )
      .subscribe(() => this.refreshStatus());
  }

  play(): void {
    this.service
      .play()
      .pipe(
        switchMap(() => timer(0, 500)),
        take(6)
      )
      .subscribe(() => this.refreshStatus());
  }

  stop(): void {
    this.service
      .stop()
      .pipe(
        switchMap(() => timer(0, 500)),
        take(6)
      )
      .subscribe(() => this.refreshStatus());
  }

  skipNext(): void {
    this.service
      .skip()
      .pipe(
        switchMap(() => timer(0, 500)),
        take(6)
      )
      .subscribe(() => this.refreshStatus());
  }

  skipPrevious(): void {
    this.service
      .rewind()
      .pipe(
        switchMap(() => timer(0, 500)),
        take(6)
      )
      .subscribe(() => this.refreshStatus());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getState(): Observable<any> {
    if (this.currentInput === 'SERVER') {
      return this.serverState$;
    } else if (this.currentInput === 'Spotify') {
      return this.spotifyState$;
    } else if (this.currentInput === 'AirPlay') {
      return this.airplayState$;
    }
  }

  private refreshStatus(): void {
    if (this.currentInput === 'SERVER') {
      this.serverService.refreshServerStatus();
    } else if (this.currentInput === 'Spotify') {
      this.spotifyService.refreshSpotifyStatus();
    } else if (this.currentInput === 'AirPlay') {
      this.airplayService.refreshAirplayStatus();
    }
  }
}
