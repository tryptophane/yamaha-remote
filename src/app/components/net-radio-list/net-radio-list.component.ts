import {Component, OnInit} from '@angular/core';
import * as fromNetradio from '../../store/reducer/netradio.reducer';
import {Observable} from 'rxjs';
import * as fromRoot from '../../store/reducer';
import {State} from '../../store/reducer';
import {Store} from '@ngrx/store';
import {SetListAction, SetRadioStatusAction} from '../../store/actions/netradio.action';
import {NetradioService} from '../../service/netradio.service';


@Component({
    selector: 'app-net-radio-list',
    templateUrl: './net-radio-list.component.html',
    styleUrls: ['./net-radio-list.component.scss']
})
export class NetRadioListComponent implements OnInit {

    netradioState$: Observable<fromNetradio.State>;

    constructor(private readonly store: Store<State>,
                private readonly service: NetradioService) {
        this.netradioState$ = store.select(fromRoot.getNetradioState);
    }

    ngOnInit() {
        this.store.dispatch(new SetListAction(null));
        this.store.dispatch(new SetRadioStatusAction(null));
        this.service.fetchNetRadioList();
        this.service.refreshNetRadioStatus();
    }

    selectRadioListLine(line: { txt: string, attribute: string, index: number }) {
        this.service.selectWebRadioListItem(line.index).subscribe(() => {
            if (line.attribute !== 'Item') {
                this.service.fetchNetRadioList();
            }
        });
    }

    moveNetRadioCursor(direction: string) {
        this.service.moveNetRadioCursor(direction).subscribe(() => this.service.fetchNetRadioList());
    }
}
