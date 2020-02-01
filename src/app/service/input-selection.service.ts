import {AbstractService, HttpMethod} from './abstract-service';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {State} from '../store/reducer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {InputItem} from '../model/input-item.model';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InputSelectionService extends AbstractService {

    constructor(private http: HttpClient, private store: Store<State>) {
        super(http, store);
    }

    setInputTo(to: string): void {
        const command = this.generateXml(`<Input><Input_Sel>${to}</Input_Sel></Input>`, HttpMethod.PUT);
        this.executeCommand(command);
    }

    getInputList(): Observable<Array<InputItem>> {
        const command = this.generateXml('<Input><Input_Sel_Item>GetParam</Input_Sel_Item></Input>', HttpMethod.GET);
        return this.sendCommand(command).pipe(map(res => this.parseXml(res)), map(inputs => {
            const itemList = [];
            for (let i = 1; inputs.YAMAHA_AV.Main_Zone[0].Input[0].Input_Sel_Item[0]['Item_' + i]; i++) {
                itemList.push({
                    param: inputs.YAMAHA_AV.Main_Zone[0].Input[0].Input_Sel_Item[0]['Item_' + i][0].Param[0],
                    title: inputs.YAMAHA_AV.Main_Zone[0].Input[0].Input_Sel_Item[0]['Item_' + i][0].Title[0],
                    srcName: inputs.YAMAHA_AV.Main_Zone[0].Input[0].Input_Sel_Item[0]['Item_' + i][0].Src_Name[0]
                });
            }
            return itemList;
        }));
    }
}
