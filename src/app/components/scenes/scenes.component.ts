import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromScenes from '../../store/reducer/scenes.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { ScenesService } from '../../service/scenes.service';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss']
})
export class ScenesComponent implements OnInit {
  scenesState$: Observable<fromScenes.State>;

  constructor(
    private readonly store: Store<State>,
    private readonly service: ScenesService
  ) {
    this.scenesState$ = store.select(fromRoot.getScenesState);
  }

  ngOnInit() {
    this.service.loadScenes();
  }

  selectScene(xmlName: string) {
    this.service.selectScene(xmlName);
  }
}
