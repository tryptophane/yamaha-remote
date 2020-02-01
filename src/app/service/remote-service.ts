import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {State} from '../store/reducer';
import {AbstractService, HttpMethod} from './abstract-service';
import {SetNetworkNameAction} from '../store/actions/network-name.action';
import {SleepStates} from '../model/sleep-states.enum';
import {EMPTY} from 'rxjs/internal/observable/empty';

@Injectable()
export class RemoteService extends AbstractService {

    sleepStates: Array<string> = Object.keys(SleepStates).map(k => SleepStates[k]);

    constructor(private http: HttpClient, private store: Store<State>) {
        super(http, store);
    }

    powerOn(): void {
        const command = this.generateXml('<Power_Control><Power>On</Power></Power_Control>', HttpMethod.PUT);
        this.executeCommand(command);
    }

    powerOff(): void {
        const command = this.generateXml('<Power_Control><Power>Standby</Power></Power_Control>', HttpMethod.PUT);
        this.executeCommand(command);
    }

    toggleSleep(actualValue: string): Observable<string> {
        let newValue;
        const i = this.sleepStates.indexOf(actualValue);
        if (i >= 0 && i < this.sleepStates.length) {
            if (i === this.sleepStates.length - 1) {
                newValue = this.sleepStates[0];
            } else {
                newValue = this.sleepStates[i + 1];
            }
        }
        if (newValue) {
            const command = this.generateXml(`<Power_Control><Sleep>${newValue}</Sleep></Power_Control>`, HttpMethod.PUT);
            return this.sendCommand(command);
        }
        return EMPTY;
    }

    fetchNetworkName(): void {
        const command = this.generateXml('<System><Misc><Network><Network_Name>GetParam</Network_Name></Network></Misc></System>',
            HttpMethod.GET, true);
        this.sendCommand(command).pipe(
            map(res => this.parseXml(res)),
            map(json => json.YAMAHA_AV.System[0].Misc[0].Network[0].Network_Name[0]))
            .subscribe(name => this.store.dispatch(new SetNetworkNameAction(name)));
    }
}
