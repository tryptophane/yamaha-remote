import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { SetAirplayStatusAction } from '../store/actions/airplay.action';
import { AbstractService } from './abstract-service';
import { pick } from './xml/xml-picker';

@Injectable({
  providedIn: 'root'
})
export class AirplayService extends AbstractService {
  refreshAirplayStatus(): void {
    const root = ['YAMAHA_AV', 'AirPlay', 'Play_Info'] as const;
    this.send('GET', ['AirPlay', 'Play_Info'], 'GetParam')
      .pipe(
        map(res => this.parse(res)),
        map(parsed => ({
          artist: pick(parsed, [...root, 'Meta_Info', 'Artist']) ?? '',
          album: pick(parsed, [...root, 'Meta_Info', 'Album']) ?? '',
          song: pick(parsed, [...root, 'Meta_Info', 'Song']) ?? '',
          availability: pick(parsed, [...root, 'Feature_Availability']) ?? '',
          playback: pick(parsed, [...root, 'Playback_Info']) ?? ''
        })),
        // eslint-disable-next-line no-console
        tap(status => console.debug('airplay-status: ', status))
      )
      .subscribe(status =>
        this.store.dispatch(new SetAirplayStatusAction(status))
      );
  }
}
