import { combineLatest, Observable, of, timer } from 'rxjs';
import { filter, map, take, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromRoot from '../store/reducer';
import { State } from '../store/reducer';
import { NetRadioList } from '../model/net-radio-list.model';
import {
  SetListAction,
  SetMenuStatusAction,
  SetRadioStatusAction
} from '../store/actions/netradio.action';
import * as fromNetradio from '../store/reducer/netradio.reducer';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class NetradioService extends AbstractService {
  netradioState$: Observable<fromNetradio.State>;

  fetchingNetRadioList: boolean;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<State>
  ) {
    super(http, store);
    this.netradioState$ = store.select(fromRoot.getNetradioState);
  }

  moveNetRadioCursor(direction: string): Observable<string> {
    switch (direction) {
      case 'BACK':
        const cmd1 = this.generateXml(
          '<NET_RADIO><List_Control><Cursor>Return</Cursor></List_Control></NET_RADIO>',
          HttpMethod.PUT,
          true
        );
        return this.sendCommand(cmd1);
      case 'DOWN':
        const cmd2 = this.generateXml(
          '<NET_RADIO><List_Control><Page>Down</Page></List_Control></NET_RADIO>',
          HttpMethod.PUT,
          true
        );
        return this.sendCommand(cmd2);
      case 'UP':
        const cmd3 = this.generateXml(
          '<NET_RADIO><List_Control><Page>Up</Page></List_Control></NET_RADIO>',
          HttpMethod.PUT,
          true
        );
        return this.sendCommand(cmd3);
      default:
        return of(null);
    }
  }

  fetchNetRadioList(): void {
    this.fetchingNetRadioList = false;
    this.store.dispatch(new SetMenuStatusAction('Busy'));
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    combineLatest([timer(0, 500), this.netradioState$])
      .pipe(
        map(([x, state]) => state),
        takeWhile(state => state.list.menuStatus !== 'Ready'),
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        take(100),
        filter(() => !this.fetchingNetRadioList)
      )
      .subscribe(x => {
        this.tryToFetchNetRadioList();
      });
  }

  refreshNetRadioStatus(): void {
    const command = this.generateXml(
      '<NET_RADIO><Play_Info>GetParam</Play_Info></NET_RADIO>',
      HttpMethod.GET,
      true
    );
    this.sendCommand(command)
      .pipe(
        map(res => this.parseXml(res)),
        map(radioStatus => {
          return {
            station:
              radioStatus.YAMAHA_AV.NET_RADIO[0].Play_Info[0].Meta_Info[0]
                .Station,
            song: radioStatus.YAMAHA_AV.NET_RADIO[0].Play_Info[0].Meta_Info[0]
              .Song
          };
        })
      )
      .subscribe(status =>
        this.store.dispatch(new SetRadioStatusAction(status))
      );
  }

  selectWebRadioListItem(index: number): Observable<string> {
    return this.selectListItem('NET_RADIO', index);
  }

  private tryToFetchNetRadioList(): void {
    this.fetchingNetRadioList = true;
    this.retrieveNetRadioList().subscribe(list => {
      this.store.dispatch(new SetListAction(list));
      this.fetchingNetRadioList = false;
    });
  }

  private retrieveNetRadioList(): Observable<NetRadioList> {
    const command = this.generateXml(
      '<NET_RADIO><List_Info>GetParam</List_Info></NET_RADIO>',
      HttpMethod.GET,
      true
    );
    return this.sendCommand(command).pipe(
      map(res => this.parseXml(res)),
      map(inputs => {
        const menuStatus =
          inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Menu_Status[0];
        const menuLayer =
          inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Menu_Layer[0];
        const menuName =
          inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Menu_Name[0];
        const currentLine =
          inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Cursor_Position[0]
            .Current_Line[0];
        const maxLine =
          inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Cursor_Position[0]
            .Max_Line[0];

        const lines = [];

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 1; i < 9; i++) {
          if (
            !inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Current_List[0][
              `Line_${i}`
            ]
          ) {
            break;
          }
          lines.push({
            txt: inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Current_List[0][
              `Line_${i}`
            ][0].Txt[0],
            attribute:
              inputs.YAMAHA_AV.NET_RADIO[0].List_Info[0].Current_List[0][
                `Line_${i}`
              ][0].Attribute[0],
            index: i
          });
        }

        return {
          menuStatus,
          menuLayer,
          menuName,
          currentLine,
          maxLine,
          lines
        };
      })
    );
  }

  private selectListItem(listname: string, index: number): Observable<string> {
    if (!this.fetchingNetRadioList) {
      const command = this.generateXml(
        `<${listname}><List_Control><Direct_Sel>Line_${index}</Direct_Sel></List_Control></${listname}>`,
        HttpMethod.PUT,
        true
      );
      return this.sendCommand(command);
    }
  }
}
