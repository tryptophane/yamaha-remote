import {AbstractService, HttpMethod} from './abstract-service';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {State} from '../store/reducer';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OptionsService extends AbstractService {

    constructor(private http: HttpClient, private store: Store<State>) {
        super(http, store);
    }

    adaptiveDRC(on: boolean): void {
        const command = this.generateXml(`<Sound_Video><Adaptive_DRC>${on ? 'Auto' : 'Off'}</Adaptive_DRC></Sound_Video>`, HttpMethod.PUT);
        this.executeCommand(command);
    }

    enhancer(on: boolean): void {
        const command = this.generateXml(`<Surround><Program_Sel><Current><Enhancer>${on ? 'On' : 'Off'}</Enhancer></Current></Program_Sel></Surround>`,
            HttpMethod.PUT);
        this.executeCommand(command);
    }

    direct(on: boolean): void {
        const command = this.generateXml(`<Sound_Video><Direct><Mode>${on ? 'On' : 'Off'}</Mode></Direct></Sound_Video>`, HttpMethod.PUT);
        this.executeCommand(command);
    }

    threeDCinemaDsp(on: boolean): void {
        const command = this.generateXml(`<Surround><_3D_Cinema_DSP>${on ? 'Auto' : 'Off'}</_3D_Cinema_DSP></Surround>`, HttpMethod.PUT);
        this.executeCommand(command);
    }

    setBass(to: number): void {
        const command = this.generateXml(`<Sound_Video><Tone><Bass><Val>${to}</Val><Exp>1</Exp><Unit>dB</Unit></Bass></Tone></Sound_Video>`,
            HttpMethod.PUT);
        this.executeCommand(command);
    }

    setTreble(to: number): void {
        const command = this.generateXml(`<Sound_Video><Tone><Treble><Val>${to}</Val><Exp>1</Exp><Unit>dB</Unit></Treble></Tone></Sound_Video>`,
            HttpMethod.PUT);
        this.executeCommand(command);
    }
}
