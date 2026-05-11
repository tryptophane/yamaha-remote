import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import * as fromScenes from '../../store/reducer/scenes.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { ScenesService } from '../../service/scenes.service';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss'],
  imports: [NgFor, MatButton, AsyncPipe]
})
export class ScenesComponent implements OnInit {
  private readonly store = inject<Store<State>>(Store);
  private readonly service = inject(ScenesService);

  scenesState$: Observable<fromScenes.State>;

  constructor() {
    this.scenesState$ = this.store.select(fromRoot.getScenesState);
  }

  ngOnInit() {
    this.service.loadScenes();
  }

  selectScene(xmlName: string) {
    this.service.selectScene(xmlName);
  }
}
