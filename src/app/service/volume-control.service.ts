import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class VolumeControlService extends AbstractService {
  setVolumeTo(to: string | number): void {
    const command = this.generateXml(
      `<Volume><Lvl><Val>${to}</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume>`,
      HttpMethod.PUT
    );
    this.executeCommand(command);
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
        tap(basicStatus => {
          this.setVolumeTo(basicStatus.volume + byN);
        })
      )
      .subscribe();
  }

  sendMute(on: boolean): void {
    this.executeCommand(
      this.generateXml(
        `<Volume><Mute>${on ? 'On' : 'Off'}</Mute></Volume>`,
        HttpMethod.PUT
      )
    );
  }
}
