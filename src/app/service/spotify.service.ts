import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { State } from '../store/reducer';
import { SetSpotifyStatusAction } from '../store/actions/spotify.action';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService extends AbstractService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<State>
  ) {
    super(http, store);
  }

  refreshSpotifyStatus(): void {
    const command = this.generateXml(
      '<Spotify><Play_Info>GetParam</Play_Info></Spotify>',
      HttpMethod.GET,
      true
    );
    this.sendCommand(command)
      .pipe(
        map(res => this.parseXml(res)),
        map(status => {
          return {
            artist:
              status.YAMAHA_AV.Spotify[0].Play_Info[0].Meta_Info[0].Artist,
            album: status.YAMAHA_AV.Spotify[0].Play_Info[0].Meta_Info[0].Album,
            track: status.YAMAHA_AV.Spotify[0].Play_Info[0].Meta_Info[0].Track,
            availability:
              status.YAMAHA_AV.Spotify[0].Play_Info[0].Feature_Availability[0],
            playback: status.YAMAHA_AV.Spotify[0].Play_Info[0].Playback_Info[0]
          };
        })
      )
      // eslint-disable-next-line no-console
      .pipe(tap(status => console.log('spotify-status: ', status)))
      .subscribe(status =>
        this.store.dispatch(new SetSpotifyStatusAction(status))
      );
  }
}
