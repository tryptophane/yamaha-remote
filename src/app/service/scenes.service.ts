import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Scene } from '../model/scene.model';
import { SetScenesAction } from '../store/actions/scenes.action';
import { AbstractService, HttpMethod } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class ScenesService extends AbstractService {
  loadScenes(): void {
    const command = this.generateXml(
      '<Config>GetParam</Config>',
      HttpMethod.GET
    );
    this.sendCommand(command)
      .pipe(
        map(res => this.parseXml(res)),
        map(config => {
          const scenes: Array<Scene> = [];

          const scene =
            config.YAMAHA_AV.Main_Zone[0].Config[0].Name[0].Scene[0];

          for (let i = 1; scene[`Scene_${i}`]; i++) {
            scenes.push({
              xmlName: `Scene ${i}`,
              name: scene[`Scene_${i}`][0]
            });
          }

          return scenes;
        })
      )
      .subscribe(scenes => this.store.dispatch(new SetScenesAction(scenes)));
  }

  selectScene(xmlName: string): void {
    const command = this.generateXml(
      `<Scene><Scene_Sel>${xmlName}</Scene_Sel></Scene>`,
      HttpMethod.PUT
    );
    this.executeCommand(command);
  }
}
