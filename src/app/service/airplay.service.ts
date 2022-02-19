import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { State } from '../store/reducer';
import { SetAirplayStatusAction } from '../store/actions/airplay.action';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class AirplayService extends AbstractService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<State>
  ) {
    super(http, store);
  }

  refreshAirplayStatus(): void {
    const command = this.generateXml(
      '<AirPlay><Play_Info>GetParam</Play_Info></AirPlay>',
      HttpMethod.GET,
      true
    );
    this.sendCommand(command)
      .pipe(
        map(res => this.parseXml(res)),
        map(status => {
          return {
            artist:
              status.YAMAHA_AV.AirPlay[0].Play_Info[0].Meta_Info[0].Artist[0],
            album:
              status.YAMAHA_AV.AirPlay[0].Play_Info[0].Meta_Info[0].Album[0],
            song: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Meta_Info[0].Song[0],
            availability:
              status.YAMAHA_AV.AirPlay[0].Play_Info[0].Feature_Availability[0],
            playback: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Playback_Info[0]
          };
        })
      )
      // eslint-disable-next-line no-console
      .pipe(tap(status => console.log('airplay-status: ', status)))
      .subscribe(status =>
        this.store.dispatch(new SetAirplayStatusAction(status))
      );
  }
}
