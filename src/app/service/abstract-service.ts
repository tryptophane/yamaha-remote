/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import {
  SetBasicStatusAction,
  SetErrorAction
} from '../store/actions/basic-status.action';
import * as fromBasicStatus from '../store/reducer/basic-status.reducer';
import { State } from '../store/reducer';

export enum HttpMethod {
  GET = 'GET',
  PUT = 'PUT'
}

export abstract class AbstractService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly ngrxStore: Store<State>
  ) {}

  get zone(): string {
    return 'Main_Zone';
  }

  sendCommand(xml: string, returnNullOnError = false): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/xml');
    console.log('Sending XML: ', xml);
    return this.httpClient
      .post('/YamahaRemoteControl/ctrl', xml, { headers, responseType: 'text' })
      .pipe(
        take(1),
        catchError(err => {
          if (err.error instanceof Error) {
            console.error(
              'Error while sending XML to receiver:',
              err.error.message
            );
          } else {
            console.error(
              `Receiver returned code ${err.status}, body was: ${err.error}`
            );
          }
          return returnNullOnError ? of('ERROR') : EMPTY;
        }),
        map(o => (o !== 'ERROR' ? o.toString() : null))
      );
  }

  executeCommand(xml: string): void {
    this.sendCommand(xml).subscribe(() => this.refreshBasicStatus());
  }

  generateXml(cmd: string, method: HttpMethod, noZone?: boolean): string {
    return (
      '<YAMAHA_AV cmd="' +
      method +
      '">' +
      (noZone ? '' : '<' + this.zone + '>') +
      cmd +
      (noZone ? '' : '</' + this.zone + '>') +
      '</YAMAHA_AV>'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseXml(xmlStr: string): any {
    let result;
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const parser = require('xml2js');
    parser.Parser().parseString(xmlStr, (e, r) => (result = r));
    return result;
  }

  dispatchBasicStatus(status: fromBasicStatus.State): void {
    this.ngrxStore.dispatch(new SetBasicStatusAction(status));
  }

  refreshBasicStatus(): void {
    this.fetchBasicStatus().subscribe(status =>
      this.dispatchBasicStatus(status)
    );
  }

  fetchBasicStatus(): Observable<fromBasicStatus.State> {
    const command = this.generateXml(
      '<Basic_Status>GetParam</Basic_Status>',
      HttpMethod.GET
    );
    return this.sendCommand(command, true).pipe(
      map(response => {
        if (!response) {
          this.ngrxStore.dispatch(new SetErrorAction(true));
        } else {
          const basicStatus = this.parseXml(response);
          console.log('basic-status (from receiver): ', basicStatus);

          const state = {
            volume: Number(
              basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0].Volume[0]
                .Lvl[0].Val[0]
            ),
            muted:
              basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0].Volume[0]
                .Mute[0] !== 'Off',
            on:
              basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                .Power_Control[0].Power[0] === 'On',
            off:
              basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                .Power_Control[0].Power[0] !== 'On',
            currentInput:
              basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0].Input[0]
                .Input_Sel[0],
            error: false,
            partyModeEnabled: (() => {
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Party_Info[0] === 'On'
                );
              } catch (e) {
                return 'Not Available';
              }
            }).apply(this),
            pureDirectEnabled: (() => {
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Pure_Direct[0].Mode[0] === 'On'
                );
              } catch (e) {
                return 'Not Available';
              }
            }).apply(this),
            bass: (() => {
              try {
                return Number(
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Tone[0].Bass[0].Val[0]
                );
              } catch (e) {
                return 0;
              }
            }).apply(this),
            treble: (() => {
              try {
                return Number(
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Tone[0].Treble[0].Val[0]
                );
              } catch (e) {
                return 0;
              }
            }).apply(this),
            subwooferTrim: (() => {
              try {
                return Number(
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0].Volume[0]
                    .Subwoofer_Trim[0].Val[0]
                );
              } catch (e) {
                return 0;
              }
            }).apply(this),
            dialogueLift: (() => {
              try {
                return Number(
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Dialogue_Adjust[0].Dialogue_Lift[0]
                );
              } catch (e) {
                return 0;
              }
            }).apply(this),
            dialogueLevel: (() => {
              try {
                return Number(
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Dialogue_Adjust[0].Dialogue_Lvl[0]
                );
              } catch (e) {
                return 0;
              }
            }).apply(this),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            YPAOVolumeEnabled: (() => {
              // values 'Off' or 'Auto'
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].YPAO_Volume[0] !== 'Off'
                );
              } catch (e) {
                return false;
              }
            }).apply(this),
            extraBassEnabled: (() => {
              // values 'Off' or 'Auto'
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Extra_Bass[0] !== 'Off'
                );
              } catch (e) {
                return false;
              }
            }).apply(this),
            adaptiveDRCEnabled: (() => {
              // values 'Off' or 'Auto'
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Adaptive_DRC[0] !== 'Off'
                );
              } catch (e) {
                return false;
              }
            }).apply(this),
            enhancer: (() => {
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Surround[0].Program_Sel[0].Current[0].Enhancer[0] !== 'Off'
                );
              } catch (e) {
                return false;
              }
            }).apply(this),
            direct: (() => {
              try {
                return (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Sound_Video[0].Direct[0].Mode[0] !== 'Off'
                );
              } catch (e) {
                return false;
              }
            }).apply(this),
            threeDCinemaDsp: (() => {
              try {
                return (
                  // eslint-disable-next-line no-underscore-dangle
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Surround[0]._3D_Cinema_DSP[0] !== 'Off'
                );
              } catch (e) {
                return false;
              }
            }).apply(this),
            dsp: (() => {
              try {
                if (
                  basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                    .Surround[0].Program_Sel[0].Current[0].Straight[0] === 'On'
                ) {
                  return 'Straight';
                }
                return basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                  .Surround[0].Program_Sel[0].Current[0].Sound_Program[0];
              } catch (e) {
                return false;
              }
            }).apply(this),
            sleep: (() => {
              try {
                return basicStatus.YAMAHA_AV[this.zone][0].Basic_Status[0]
                  .Power_Control[0].Sleep[0];
              } catch (e) {
                return false;
              }
            }).apply(this)
          };
          console.log('basic-status (parsed): ', state);
          return state;
        }
      })
    );
  }
}
