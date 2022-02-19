import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { State } from '../store/reducer';
import { SetServerStatusAction } from '../store/actions/server.action';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class ServerService extends AbstractService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<State>
  ) {
    super(http, store);
  }

  refreshServerStatus(): void {
    const command = this.generateXml(
      '<SERVER><Play_Info>GetParam</Play_Info></SERVER>',
      HttpMethod.GET,
      true
    );
    this.sendCommand(command)
      .pipe(
        map(res => this.parseXml(res)),
        map(status => {
          return {
            artist:
              status.YAMAHA_AV.SERVER[0].Play_Info[0].Meta_Info[0].Artist[0],
            album:
              status.YAMAHA_AV.SERVER[0].Play_Info[0].Meta_Info[0].Album[0],
            song: status.YAMAHA_AV.SERVER[0].Play_Info[0].Meta_Info[0].Song[0],
            availability:
              status.YAMAHA_AV.SERVER[0].Play_Info[0].Feature_Availability[0],
            playback: status.YAMAHA_AV.SERVER[0].Play_Info[0].Playback_Info[0],
            shuffle:
              status.YAMAHA_AV.SERVER[0].Play_Info[0].Play_Mode[0]
                .Shuffle[0] === 'On',
            repeat:
              status.YAMAHA_AV.SERVER[0].Play_Info[0].Play_Mode[0].Repeat[0] ===
              'All'
          };
        })
      )
      // eslint-disable-next-line no-console
      .pipe(tap(status => console.log('server-status: ', status)))
      .subscribe(status =>
        this.store.dispatch(new SetServerStatusAction(status))
      );
  }

  toggleShuffle(on: boolean): void {
    const command = this.generateXml(
      `<SERVER><Play_Control><Play_Mode><Shuffle>${
        on ? 'On' : 'Off'
      }</Shuffle></Play_Mode></Play_Control></SERVER>`,
      HttpMethod.PUT,
      true
    );
    this.executeCommand(command);
  }

  toggleRepeat(on: boolean): void {
    const command = this.generateXml(
      `<SERVER><Play_Control><Play_Mode><Repeat>${
        on ? 'All' : 'Off'
      }</Repeat></Play_Mode></Play_Control></SERVER>`,
      HttpMethod.PUT,
      true
    );
    this.executeCommand(command);
  }
}
