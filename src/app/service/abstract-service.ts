/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import {
  SetBasicStatusAction,
  SetErrorAction
} from '../store/actions/basic-status.action';
import * as fromBasicStatus from '../store/reducer/basic-status.reducer';
import { State } from '../store/reducer';
import { buildCommand, HttpMethod, XmlValue } from './xml/xml-builder';
import { parseResponse, pick, pickFlag, pickNumber } from './xml/xml-picker';

export { HttpMethod };

export abstract class AbstractService {
  protected readonly httpClient = inject(HttpClient);
  protected readonly store: Store<State> = inject(Store);

  get zone(): string {
    return 'Main_Zone';
  }

  /** PUT/GET a YAMAHA_AV command built from a path and a value. */
  protected send(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue,
    returnNullOnError = false
  ): Observable<string> {
    return this.sendRaw(buildCommand(method, path, body), returnNullOnError);
  }

  /** Send a command, then refresh the cached basic-status (used after writes). */
  protected sendAndRefresh(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue
  ): void {
    this.send(method, path, body).subscribe(() => this.refreshBasicStatus());
  }

  /** Like `send`, but automatically prepends the active zone to the path. */
  protected sendZone(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue,
    returnNullOnError = false
  ): Observable<string> {
    return this.send(method, [this.zone, ...path], body, returnNullOnError);
  }

  /** Like `sendAndRefresh`, but automatically prepends the active zone to the path. */
  protected sendAndRefreshZone(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue
  ): void {
    this.sendZone(method, path, body).subscribe(() =>
      this.refreshBasicStatus()
    );
  }

  /** Parse a raw XML response into a JS object tree. */
  protected parse(xml: string): unknown {
    return parseResponse(xml);
  }

  fetchBasicStatus(): Observable<fromBasicStatus.State> {
    return this.sendZone('GET', ['Basic_Status'], 'GetParam', true).pipe(
      tap(response => {
        if (!response) this.store.dispatch(new SetErrorAction(true));
      }),
      filter((response): response is string => !!response),
      map(response => {
        const parsed = this.parse(response);
        console.debug('basic-status (from receiver): ', parsed);
        const status = this.parseBasicStatus(parsed);
        console.debug('basic-status (parsed): ', status);
        return status;
      })
    );
  }

  refreshBasicStatus(): void {
    this.fetchBasicStatus().subscribe(status =>
      this.store.dispatch(new SetBasicStatusAction(status))
    );
  }

  private parseBasicStatus(parsed: unknown): fromBasicStatus.State {
    const at = (...rest: Array<string>): ReadonlyArray<string> => [
      'YAMAHA_AV',
      this.zone,
      'Basic_Status',
      ...rest
    ];
    const isStraight =
      pick(parsed, at('Surround', 'Program_Sel', 'Current', 'Straight')) ===
      'On';
    return {
      volume: pickNumber(parsed, at('Volume', 'Lvl', 'Val')),
      muted: pickFlag(parsed, at('Volume', 'Mute')),
      on: pick(parsed, at('Power_Control', 'Power')) === 'On',
      currentInput: pick(parsed, at('Input', 'Input_Sel')) ?? '',
      error: false,
      bass: pickNumber(parsed, at('Sound_Video', 'Tone', 'Bass', 'Val')),
      treble: pickNumber(parsed, at('Sound_Video', 'Tone', 'Treble', 'Val')),
      adaptiveDRCEnabled: pickFlag(parsed, at('Sound_Video', 'Adaptive_DRC')),
      enhancer: pickFlag(
        parsed,
        at('Surround', 'Program_Sel', 'Current', 'Enhancer')
      ),
      direct: pickFlag(parsed, at('Sound_Video', 'Direct', 'Mode')),
      // eslint-disable-next-line no-underscore-dangle
      threeDCinemaDsp: pickFlag(parsed, at('Surround', '_3D_Cinema_DSP')),
      dsp: isStraight
        ? 'Straight'
        : (pick(
            parsed,
            at('Surround', 'Program_Sel', 'Current', 'Sound_Program')
          ) ?? ''),
      sleep: pick(parsed, at('Power_Control', 'Sleep')) ?? ''
    };
  }

  private sendRaw(xml: string, returnNullOnError: boolean): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/xml');
    console.debug('Sending XML: ', xml);
    return this.httpClient
      .post('/YamahaRemoteControl/ctrl', xml, {
        headers,
        responseType: 'text' as const
      })
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
        map(o => (o !== 'ERROR' ? o : ''))
      );
  }
}
