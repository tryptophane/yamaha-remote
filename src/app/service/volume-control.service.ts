import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { AbstractService } from './abstract-service';
import { dbValue } from './xml/xml-builder';

@Injectable({
  providedIn: 'root'
})
export class VolumeControlService extends AbstractService {
  setVolumeTo(to: string | number): void {
    this.sendAndRefreshZone('PUT', ['Volume', 'Lvl'], dbValue(to));
  }

  volumeUp(by: string | number): void {
    this.adjustVolumeBy(by);
  }

  volumeDown(by: string | number): void {
    this.adjustVolumeBy(-by);
  }

  adjustVolumeBy(by: string | number): void {
    const byN = Number(by);
    this.fetchBasicStatus()
      .pipe(
        take(1),
        tap(basicStatus => this.setVolumeTo(basicStatus.volume + byN))
      )
      .subscribe();
  }

  sendMute(on: boolean): void {
    this.sendAndRefreshZone('PUT', ['Volume', 'Mute'], on ? 'On' : 'Off');
  }
}
