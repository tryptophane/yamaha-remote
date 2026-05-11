import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import * as fromServer from '../../store/reducer/server.reducer';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-play-mode',
  templateUrl: './play-mode.component.html',
  styleUrls: ['./play-mode.component.scss'],
  imports: [MatButton, MatIcon, AsyncPipe]
})
export class PlayModeComponent {
  private readonly store = inject<Store<State>>(Store);
  readonly service = inject(ServerService);

  serverState$: Observable<fromServer.State>;

  constructor() {
    this.serverState$ = this.store.select(fromRoot.getServerState);
  }
}
