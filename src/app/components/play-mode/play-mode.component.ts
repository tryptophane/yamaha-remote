import {Component} from '@angular/core';
import * as fromServer from '../../store/reducer/server.reducer';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../store/reducer';
import {State} from '../../store/reducer';
import {Observable} from 'rxjs';
import {ServerService} from '../../service/server.service';

@Component({
    selector: 'app-play-mode',
    templateUrl: './play-mode.component.html',
    styleUrls: ['./play-mode.component.scss']
})
export class PlayModeComponent {

    serverState$: Observable<fromServer.State>;

    constructor(private readonly store: Store<State>,
                public readonly service: ServerService) {
        this.serverState$ = store.select(fromRoot.getServerState);
    }
}
