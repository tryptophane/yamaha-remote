import { combineLatest, EMPTY, Observable, timer } from 'rxjs';
import { filter, map, take, takeWhile } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as fromRoot from '../store/reducer';
import { NetRadioList } from '../model/net-radio-list.model';
import {
  SetListAction,
  SetMenuStatusAction,
  SetRadioStatusAction
} from '../store/actions/netradio.action';
import * as fromNetradio from '../store/reducer/netradio.reducer';
import { AbstractService } from './abstract-service';
import { pick, pickNode, pickNumber } from './xml/xml-picker';

const POLL_INTERVAL_MS = 500;
const MAX_POLL_ATTEMPTS = 100;
const MAX_LIST_LINES = 8;

@Injectable({
  providedIn: 'root'
})
export class NetradioService extends AbstractService {
  netradioState$: Observable<fromNetradio.State>;

  fetchingNetRadioList = false;

  constructor() {
    super();
    this.netradioState$ = this.store.select(fromRoot.getNetradioState);
  }

  moveNetRadioCursor(direction: string): Observable<string> {
    switch (direction) {
      case 'BACK':
        return this.send(
          'PUT',
          ['NET_RADIO', 'List_Control', 'Cursor'],
          'Return'
        );
      case 'DOWN':
        return this.send('PUT', ['NET_RADIO', 'List_Control', 'Page'], 'Down');
      case 'UP':
        return this.send('PUT', ['NET_RADIO', 'List_Control', 'Page'], 'Up');
      default:
        return EMPTY;
    }
  }

  fetchNetRadioList(): void {
    this.fetchingNetRadioList = false;
    this.store.dispatch(new SetMenuStatusAction('Busy'));
    combineLatest([timer(0, POLL_INTERVAL_MS), this.netradioState$])
      .pipe(
        map(([, state]) => state),
        takeWhile(state => state.list?.menuStatus !== 'Ready'),
        take(MAX_POLL_ATTEMPTS),
        filter(() => !this.fetchingNetRadioList)
      )
      .subscribe(() => this.tryToFetchNetRadioList());
  }

  refreshNetRadioStatus(): void {
    const root = ['YAMAHA_AV', 'NET_RADIO', 'Play_Info'] as const;
    this.send('GET', ['NET_RADIO', 'Play_Info'], 'GetParam')
      .pipe(
        map(res => this.parse(res)),
        map(parsed => ({
          station: pick(parsed, [...root, 'Meta_Info', 'Station']) ?? '',
          song: pick(parsed, [...root, 'Meta_Info', 'Song']) ?? ''
        }))
      )
      .subscribe(status =>
        this.store.dispatch(new SetRadioStatusAction(status))
      );
  }

  selectWebRadioListItem(index: number): Observable<string> {
    if (this.fetchingNetRadioList) return EMPTY;
    return this.send(
      'PUT',
      ['NET_RADIO', 'List_Control', 'Direct_Sel'],
      `Line_${index}`
    );
  }

  private tryToFetchNetRadioList(): void {
    this.fetchingNetRadioList = true;
    this.retrieveNetRadioList().subscribe(list => {
      this.store.dispatch(new SetListAction(list));
      this.fetchingNetRadioList = false;
    });
  }

  private retrieveNetRadioList(): Observable<NetRadioList> {
    const root = ['YAMAHA_AV', 'NET_RADIO', 'List_Info'] as const;
    return this.send('GET', ['NET_RADIO', 'List_Info'], 'GetParam').pipe(
      map(res => this.parse(res)),
      map(parsed => {
        const currentList = pickNode(parsed, [...root, 'Current_List']) as
          | Record<string, unknown>
          | undefined;
        const lines: Array<{ txt: string; attribute: string; index: number }> =
          [];
        if (currentList) {
          for (let i = 1; i <= MAX_LIST_LINES; i++) {
            const key = `Line_${i}`;
            if (currentList[key] === undefined) break;
            const txt = pick(currentList, [key, 'Txt']);
            const attribute = pick(currentList, [key, 'Attribute']);
            if (txt === undefined || attribute === undefined) break;
            lines.push({ txt, attribute, index: i });
          }
        }
        return {
          menuStatus: pick(parsed, [...root, 'Menu_Status']) ?? '',
          menuLayer: pickNumber(parsed, [...root, 'Menu_Layer']),
          menuName: pick(parsed, [...root, 'Menu_Name']) ?? '',
          currentLine: pickNumber(parsed, [
            ...root,
            'Cursor_Position',
            'Current_Line'
          ]),
          maxLine: pickNumber(parsed, [...root, 'Cursor_Position', 'Max_Line']),
          lines
        };
      })
    );
  }
}
