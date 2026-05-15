import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { dbValue } from './xml/xml-builder';

@Injectable({
  providedIn: 'root'
})
export class OptionsService extends AbstractService {
  adaptiveDRC(on: boolean): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Sound_Video', 'Adaptive_DRC'],
      on ? 'Auto' : 'Off'
    );
  }

  enhancer(on: boolean): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Surround', 'Program_Sel', 'Current', 'Enhancer'],
      on ? 'On' : 'Off'
    );
  }

  direct(on: boolean): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Sound_Video', 'Direct', 'Mode'],
      on ? 'On' : 'Off'
    );
  }

  threeDCinemaDsp(on: boolean): void {
    this.sendAndRefreshZone(
      'PUT',
      // eslint-disable-next-line no-underscore-dangle
      ['Surround', '_3D_Cinema_DSP'],
      on ? 'Auto' : 'Off'
    );
  }

  setBass(to: number): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Sound_Video', 'Tone', 'Bass'],
      dbValue(to)
    );
  }

  setTreble(to: number): void {
    this.sendAndRefreshZone(
      'PUT',
      ['Sound_Video', 'Tone', 'Treble'],
      dbValue(to)
    );
  }
}
