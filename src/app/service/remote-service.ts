import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetNetworkNameAction } from '../store/actions/network-name.action';
import { SleepStates } from '../model/sleep-states.enum';
import { AbstractService } from './abstract-service';
import { pick } from './xml/xml-picker';

@Injectable({ providedIn: 'root' })
export class RemoteService extends AbstractService {
  sleepStates: Array<string> = Object.values(SleepStates);

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
      .subscribe(name => this.store.dispatch(new SetNetworkNameAction(name)));
  }
}
