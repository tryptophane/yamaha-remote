import { EMPTY, Observable, timer } from 'rxjs';
import { filter, map, take, takeWhile } from 'rxjs/operators';
import { Injectable, signal } from '@angular/core';
import { NetRadioList } from '../model/net-radio-list.model';
import { NetRadioStatus } from '../model/net-radio-status.model';
import { AbstractService } from './abstract-service';
import { pick, pickNode, pickNumber } from './xml/xml-picker';

const POLL_INTERVAL_MS = 500;
const MAX_POLL_ATTEMPTS = 100;
const MAX_LIST_LINES = 8;

@Injectable({
  providedIn: 'root'
})
export class NetradioService extends AbstractService {
  readonly status = signal<NetRadioStatus | null>(null);
  readonly list = signal<NetRadioList | null>(null);

  private fetchingNetRadioList = false;

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
    this.markListBusy();
    timer(0, POLL_INTERVAL_MS)
      .pipe(
        takeWhile(() => this.list()?.menuStatus !== 'Ready'),
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
      .subscribe(status => this.status.set(status));
  }

  selectWebRadioListItem(index: number): Observable<string> {
    if (this.fetchingNetRadioList) return EMPTY;
    return this.send(
      'PUT',
      ['NET_RADIO', 'List_Control', 'Direct_Sel'],
      `Line_${index}`
    );
  }

  private markListBusy(): void {
    const current = this.list();
    this.list.set(
      current
        ? { ...current, menuStatus: 'Busy' }
        : {
            menuStatus: 'Busy',
            menuLayer: 0,
            menuName: '',
            currentLine: 0,
            maxLine: 0,
            lines: []
          }
    );
  }

  private tryToFetchNetRadioList(): void {
    this.fetchingNetRadioList = true;
    this.retrieveNetRadioList().subscribe(list => {
      this.list.set(list);
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
