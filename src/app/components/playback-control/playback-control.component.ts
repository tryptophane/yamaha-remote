/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal
} from '@angular/core';
import { timer } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { PlaybackControlService } from '../../service/playback-control.service';
import { AirplayService } from '../../service/airplay.service';
import { SpotifyService } from '../../service/spotify.service';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-playback-control',
  templateUrl: './playback-control.component.html',
  styleUrls: ['./playback-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatCard]
})
export class PlaybackControlComponent {
  private readonly service = inject(PlaybackControlService);
  private readonly airplayService = inject(AirplayService);
  private readonly spotifyService = inject(SpotifyService);
  private readonly serverService = inject(ServerService);

  readonly currentInput = input.required<string>();

  protected readonly playback: Signal<string> = computed(() => {
    switch (this.currentInput()) {
      case 'SERVER':
        return this.serverService.status()?.playback ?? '';
      case 'Spotify':
        return this.spotifyService.status()?.playback ?? '';
      case 'AirPlay':
        return this.airplayService.status()?.playback ?? '';
      default:
        return '';
    }
  });

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

  private refreshStatus(): void {
    switch (this.currentInput()) {
      case 'SERVER':
        this.serverService.refreshServerStatus();
        break;
      case 'Spotify':
        this.spotifyService.refreshSpotifyStatus();
        break;
      case 'AirPlay':
        this.airplayService.refreshAirplayStatus();
        break;
      default:
        break;
    }
  }
}
