import {Injectable} from '@angular/core';
import {AbstractService, HttpMethod} from './abstract-service';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {State} from '../store/reducer';

@Injectable({
    providedIn: 'root'
})
export class CursorControlService extends AbstractService {

    constructor(private http: HttpClient, private store: Store<State>) {
        super(http, store);
    }

    cursorCommand(command: string): void {
        const cmd = this.generateXml(`<Cursor_Control><Cursor>${command}</Cursor></Cursor_Control>`,
            HttpMethod.PUT);
        this.executeCommand(cmd);
    }

    menuCommand(command: string): void {
        const cmd = this.generateXml(`<Cursor_Control><Menu_Control>${command}</Menu_Control></Cursor_Control>`,
            HttpMethod.PUT);
        this.executeCommand(cmd);
    }
}
