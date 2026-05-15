import { Injectable } from '@angular/core';
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
    this.basicStatusStore
      .refresh()
      .subscribe(state => this.setVolumeTo(state.volume + byN));
  }

  sendMute(on: boolean): void {
    this.sendAndRefreshZone('PUT', ['Volume', 'Mute'], on ? 'On' : 'Off');
  }
}
