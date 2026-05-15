import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SleepStates } from '../model/sleep-states.enum';
import { AbstractService } from './abstract-service';
import { AirplayService } from './airplay.service';
import { NetradioService } from './netradio.service';
import { ServerService } from './server.service';
import { SpotifyService } from './spotify.service';
import { pick } from './xml/xml-picker';

@Injectable({ providedIn: 'root' })
export class RemoteService extends AbstractService {
  sleepStates: Array<string> = Object.values(SleepStates);

  readonly networkName = signal<string>('');

  private readonly netradio = inject(NetradioService);
  private readonly spotify = inject(SpotifyService);
  private readonly server = inject(ServerService);
  private readonly airplay = inject(AirplayService);

  powerOn(): void {
    this.sendAndRefreshZone('PUT', ['Power_Control', 'Power'], 'On');
  }

  powerOff(): void {
    this.sendAndRefreshZone('PUT', ['Power_Control', 'Power'], 'Standby');
  }

  toggleSleep(actualValue: string): Observable<string> {
    const i = this.sleepStates.indexOf(actualValue);
    if (i < 0) return EMPTY;
    const nextIndex = (i + 1) % this.sleepStates.length;
    const newValue = this.sleepStates[nextIndex];
    return this.sendZone('PUT', ['Power_Control', 'Sleep'], newValue);
  }

  fetchNetworkName(): void {
    this.send('GET', ['System', 'Misc', 'Network', 'Network_Name'], 'GetParam')
      .pipe(
        map(res => this.parse(res)),
        map(
          parsed =>
            pick(parsed, [
              'YAMAHA_AV',
              'System',
              'Misc',
              'Network',
              'Network_Name'
            ]) ?? ''
        )
      )
      .subscribe(name => this.networkName.set(name));
  }

  /**
   * Refresh basic status and, when on, cascade a refresh of the currently
   * selected input's status (NET RADIO / Spotify / SERVER / AirPlay).
   */
  refreshAll(): void {
    this.basicStatusStore.refresh().subscribe(state => {
      if (!state.on) return;
      switch (state.currentInput) {
        case 'NET RADIO':
          this.netradio.refreshNetRadioStatus();
          break;
        case 'Spotify':
          this.spotify.refreshSpotifyStatus();
          break;
        case 'SERVER':
          this.server.refreshServerStatus();
          break;
        case 'AirPlay':
          this.airplay.refreshAirplayStatus();
          break;
        default:
          break;
      }
    });
  }
}
