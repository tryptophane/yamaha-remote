import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputItem } from '../model/input-item.model';
import { AbstractService } from './abstract-service';
import { pick, pickNode } from './xml/xml-picker';

@Injectable({
  providedIn: 'root'
})
export class InputSelectionService extends AbstractService {
  setInputTo(to: string): void {
    this.sendAndRefreshZone('PUT', ['Input', 'Input_Sel'], to);
  }

  getInputList(): Observable<Array<InputItem>> {
    return this.sendZone('GET', ['Input', 'Input_Sel_Item'], 'GetParam').pipe(
      map(res => this.parse(res)),
      map(parsed => {
        const node = pickNode(parsed, [
          'YAMAHA_AV',
          this.zone,
          'Input',
          'Input_Sel_Item'
        ]) as Record<string, unknown> | undefined;
        const items: Array<InputItem> = [];
        if (!node) return items;
        for (let i = 1; node[`Item_${i}`] !== undefined; i++) {
          const param = pick(node, [`Item_${i}`, 'Param']);
          const title = pick(node, [`Item_${i}`, 'Title']);
          const srcName = pick(node, [`Item_${i}`, 'Src_Name']);
          if (
            param === undefined ||
            title === undefined ||
            srcName === undefined
          ) {
            break;
          }
          items.push({ param, title, srcName });
        }
        return items;
      })
    );
  }
}
