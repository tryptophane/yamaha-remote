import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class DspSelectionService extends AbstractService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<State>
  ) {
    super(http, store);
  }

  select(dsp: string): void {
    const command = this.generateXml(
      `<Surround><Program_Sel><Current><Sound_Program>${dsp}</Sound_Program></Current></Program_Sel></Surround>`,
      HttpMethod.PUT
    );
    this.executeCommand(command);
  }

  setStraight(straight: boolean): void {
    const command = this.generateXml(
      `<Surround><Program_Sel><Current><Straight>${
        straight ? 'On' : 'Off'
      }</Straight></Current></Program_Sel></Surround>`,
      HttpMethod.PUT
    );
    this.executeCommand(command);
  }
}
