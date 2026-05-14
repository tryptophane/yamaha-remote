/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  Signal
} from '@angular/core';
import { distinctUntilChanged, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs/operators';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { toSignal } from '@angular/core/rxjs-interop';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { PlaybackControlService } from '../../service/playback-control.service';
import { AirplayService } from '../../service/airplay.service';
import { SpotifyService } from '../../service/spotify.service';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-playback-control',
  templateUrl: './playback-control.component.html',
  styleUrls: ['./playback-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatCard, NgTemplateOutlet]
})
export class PlaybackControlComponent {
  private readonly store = inject<Store<State>>(Store);
  private readonly service = inject(PlaybackControlService);
  private readonly airplayService = inject(AirplayService);
  private readonly spotifyService = inject(SpotifyService);
  private readonly serverService = inject(ServerService);

  readonly currentInput = input.required<string>();

  spotifyState = toSignal(
    this.store.select(fromRoot.getSpotifyState).pipe(distinctUntilChanged())
  );
  serverState = toSignal(
    this.store.select(fromRoot.getServerState).pipe(distinctUntilChanged())
  );
  airplayState = toSignal(
    this.store.select(fromRoot.getAirplayState).pipe(distinctUntilChanged())
  );

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

  getState(): Signal<unknown> {
    const currentInput = this.currentInput();
    if (currentInput === 'SERVER') {
      return this.serverState;
    } else if (currentInput === 'Spotify') {
      return this.spotifyState;
    } else if (currentInput === 'AirPlay') {
      return this.airplayState;
    }
    return signal(undefined);
  }

  private refreshStatus(): void {
    const currentInput = this.currentInput();
    if (currentInput === 'SERVER') {
      this.serverService.refreshServerStatus();
    } else if (currentInput === 'Spotify') {
      this.spotifyService.refreshSpotifyStatus();
    } else if (currentInput === 'AirPlay') {
      this.airplayService.refreshAirplayStatus();
    }
  }
}
