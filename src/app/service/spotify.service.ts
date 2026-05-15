/* eslint-disable no-console */
import { Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { SpotifyStatus } from '../model/spotify-status.model';
import { AbstractService } from './abstract-service';
import { pick } from './xml/xml-picker';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService extends AbstractService {
  readonly status = signal<SpotifyStatus | null>(null);

  refreshSpotifyStatus(): void {
    const root = ['YAMAHA_AV', 'Spotify', 'Play_Info'] as const;
    this.send('GET', ['Spotify', 'Play_Info'], 'GetParam')
      .pipe(
        map(res => this.parse(res)),
        map(parsed => ({
          artist: pick(parsed, [...root, 'Meta_Info', 'Artist']) ?? '',
          album: pick(parsed, [...root, 'Meta_Info', 'Album']) ?? '',
          track: pick(parsed, [...root, 'Meta_Info', 'Track']) ?? '',
          availability: pick(parsed, [...root, 'Feature_Availability']) ?? '',
          playback: pick(parsed, [...root, 'Playback_Info']) ?? ''
        })),
        tap(status => console.debug('spotify-status: ', status))
      )
      .subscribe(status => this.status.set(status));
  }
}
