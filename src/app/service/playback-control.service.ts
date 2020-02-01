import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService, HttpMethod} from './abstract-service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../store/reducer';

@Injectable({
    providedIn: 'root',
})
export class PlaybackControlService extends AbstractService {

    constructor(private http: HttpClient, private store: Store<State>) {
        super(http, store);
    }

    stop(): Observable<string> {
        const command = this.generateXml('<Play_Control><Playback>Stop</Playback></Play_Control>', HttpMethod.PUT);
        return this.sendCommand(command);
    }

    pause(): Observable<string> {
        const command = this.generateXml('<Play_Control><Playback>Pause</Playback></Play_Control>', HttpMethod.PUT);
        return this.sendCommand(command);
    }

    play(): Observable<string> {
        const command = this.generateXml('<Play_Control><Playback>Play</Playback></Play_Control>',
            HttpMethod.PUT);
        return this.sendCommand(command);
    }

    skip(): Observable<string> {
        const command = this.generateXml('<Play_Control><Playback>Skip Fwd</Playback></Play_Control>', HttpMethod.PUT);
        return this.sendCommand(command);
    }

    rewind(): Observable<string> {
        const command = this.generateXml('<Play_Control><Playback>Skip Rev</Playback></Play_Control>', HttpMethod.PUT);
        return this.sendCommand(command);
    }
}
