import {AbstractService, HttpMethod} from './abstract-service';
import {map, tap} from 'rxjs/operators';
import {SetAirplayStatusAction} from '../store/actions/airplay.action';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {State} from '../store/reducer';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AirplayService extends AbstractService {

    constructor(private http: HttpClient, private store: Store<State>) {
        super(http, store);
    }

    refreshAirplayStatus(): void {
        const command = this.generateXml('<AirPlay><Play_Info>GetParam</Play_Info></AirPlay>', HttpMethod.GET, true);
        this.sendCommand(command).pipe(map(res => this.parseXml(res)), map(status => {
            return {
                artist: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Meta_Info[0].Artist[0],
                album: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Meta_Info[0].Album[0],
                song: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Meta_Info[0].Song[0],
                availability: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Feature_Availability[0],
                playback: status.YAMAHA_AV.AirPlay[0].Play_Info[0].Playback_Info[0]
            };
        })).pipe(tap(status => console.log('airplay-status: ', status)))
            .subscribe(status => this.store.dispatch(new SetAirplayStatusAction(status)));
    }
}
