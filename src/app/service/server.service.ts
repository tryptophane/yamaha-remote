import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { SetServerStatusAction } from '../store/actions/server.action';
import { AbstractService } from './abstract-service';
import { pick } from './xml/xml-picker';

@Injectable({
  providedIn: 'root'
})
export class ServerService extends AbstractService {
  refreshServerStatus(): void {
    const root = ['YAMAHA_AV', 'SERVER', 'Play_Info'] as const;
    this.send('GET', ['SERVER', 'Play_Info'], 'GetParam')
      .pipe(
        map(res => this.parse(res)),
        map(parsed => ({
          artist: pick(parsed, [...root, 'Meta_Info', 'Artist']) ?? '',
          album: pick(parsed, [...root, 'Meta_Info', 'Album']) ?? '',
          song: pick(parsed, [...root, 'Meta_Info', 'Song']) ?? '',
          availability: pick(parsed, [...root, 'Feature_Availability']) ?? '',
          playback: pick(parsed, [...root, 'Playback_Info']) ?? '',
          shuffle: pick(parsed, [...root, 'Play_Mode', 'Shuffle']) === 'On',
          repeat: pick(parsed, [...root, 'Play_Mode', 'Repeat']) === 'All'
        })),
        // eslint-disable-next-line no-console
        tap(status => console.debug('server-status: ', status))
      )
      .subscribe(status =>
        this.store.dispatch(new SetServerStatusAction(status))
      );
  }

  toggleShuffle(on: boolean): void {
    this.sendAndRefresh(
      'PUT',
      ['SERVER', 'Play_Control', 'Play_Mode', 'Shuffle'],
      on ? 'On' : 'Off'
    );
  }

  toggleRepeat(on: boolean): void {
    this.sendAndRefresh(
      'PUT',
      ['SERVER', 'Play_Control', 'Play_Mode', 'Repeat'],
      on ? 'All' : 'Off'
    );
  }
}
