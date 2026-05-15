import { Injectable, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { Scene } from '../model/scene.model';
import { AbstractService } from './abstract-service';
import { pick, pickNode } from './xml/xml-picker';

@Injectable({
  providedIn: 'root'
})
export class ScenesService extends AbstractService {
  readonly scenes = signal<Array<Scene>>([]);

  loadScenes(): void {
    this.sendZone('GET', ['Config'], 'GetParam')
      .pipe(
        map(res => this.parse(res)),
        map(parsed => {
          const node = pickNode(parsed, [
            'YAMAHA_AV',
            this.zone,
            'Config',
            'Name',
            'Scene'
          ]) as Record<string, unknown> | undefined;
          const scenes: Array<Scene> = [];
          if (!node) return scenes;
          for (let i = 1; node[`Scene_${i}`] !== undefined; i++) {
            const name = pick(node, [`Scene_${i}`]);
            if (name === undefined) break;
            scenes.push({ xmlName: `Scene ${i}`, name });
          }
          return scenes;
        })
      )
      .subscribe(scenes => this.scenes.set(scenes));
  }

  selectScene(xmlName: string): void {
    this.sendAndRefreshZone('PUT', ['Scene', 'Scene_Sel'], xmlName);
  }
}
