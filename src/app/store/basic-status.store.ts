/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { buildCommand } from '../service/xml/xml-builder';
import { postYamahaCommand } from '../service/xml/http';
import {
  parseResponse,
  pick,
  pickFlag,
  pickNumber
} from '../service/xml/xml-picker';

const ZONE = 'Main_Zone';

export interface BasicStatusState {
  volume: number;
  on: boolean;
  muted: boolean;
  currentInput: string;
  adaptiveDRCEnabled: boolean;
  enhancer: boolean;
  direct: boolean;
  threeDCinemaDsp: boolean;
  bass: number;
  treble: number;
  dsp: string;
  sleep: string;
  error: boolean;
}

const initialState: BasicStatusState = {
  volume: -500,
  on: false,
  muted: false,
  currentInput: '',
  adaptiveDRCEnabled: false,
  enhancer: false,
  direct: false,
  threeDCinemaDsp: false,
  bass: 0,
  treble: 0,
  dsp: '',
  sleep: '',
  error: false
};

const at = (...rest: Array<string>): ReadonlyArray<string> => [
  'YAMAHA_AV',
  ZONE,
  'Basic_Status',
  ...rest
];

const parseBasicStatus = (parsed: unknown): BasicStatusState => {
  const isStraight =
    pick(parsed, at('Surround', 'Program_Sel', 'Current', 'Straight')) === 'On';
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
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BasicStatusStore = signalStore(
  { providedIn: 'root' },
  withState<BasicStatusState>(initialState),
  withMethods(store => {
    const httpClient = inject(HttpClient);

    /**
     * Fetch the receiver's basic status, patch the store, and emit the new
     * state. Subscribe to chain follow-up work (e.g., cascade refreshes).
     */
    const refresh = (): Observable<BasicStatusState> => {
      const xml = buildCommand('GET', [ZONE, 'Basic_Status'], 'GetParam');
      return postYamahaCommand(httpClient, xml, true).pipe(
        tap(response => {
          if (!response) patchState(store, { error: true });
        }),
        filter((response): response is string => !!response),
        map(response => {
          const parsed = parseResponse(response);
          console.debug('basic-status (from receiver): ', parsed);
          const next = parseBasicStatus(parsed);
          console.debug('basic-status (parsed): ', next);
          patchState(store, next);
          return next;
        }),
        catchError(() => {
          patchState(store, { error: true });
          return EMPTY;
        })
      );
    };

    return {
      refresh,
      setError: (error: boolean) => patchState(store, { error })
    };
  })
);
