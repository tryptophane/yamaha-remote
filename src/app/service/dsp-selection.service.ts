import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class DspSelectionService extends AbstractService {
  select(dsp: string): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Surround', 'Program_Sel', 'Current', 'Sound_Program'],
      dsp
    );
  }

  setStraight(straight: boolean): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Surround', 'Program_Sel', 'Current', 'Straight'],
      straight ? 'On' : 'Off'
    );
  }
}
