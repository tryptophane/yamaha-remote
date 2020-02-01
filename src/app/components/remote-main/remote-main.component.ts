import {RemoteService} from '../../service/remote-service';
import {Store} from '@ngrx/store';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import * as fromNetworkName from '../../store/reducer/network-name.reducer';
import * as fromRoot from '../../store/reducer';
import {State} from '../../store/reducer';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/internal/Subject';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {timer} from 'rxjs/internal/observable/timer';
import {RefreshAllStatusAction} from '../../store/actions/basic-status.action';


@Component({
    selector: 'app-remote-main',
    templateUrl: './remote-main.component.html',
    styleUrls: ['./remote-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteMainComponent implements OnInit, OnDestroy {

    basicStatusState$: Observable<fromBasicStatus.State>;
    networkNameState$: Observable<fromNetworkName.State>;
    private unsubscribe$: Subject<void> = new Subject();

    constructor(private readonly store: Store<State>,
                private readonly http: HttpClient,
                private readonly service: RemoteService) {

        this.basicStatusState$ = store.select(fromRoot.getBasicStatusState);
        this.networkNameState$ = store.select(fromRoot.getNetworkNameState);
    }

    ngOnInit(): void {
        timer(0, 5000).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(() => this.store.dispatch(new RefreshAllStatusAction()));

        this.service.fetchNetworkName();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    powerButtonClicked(checked: boolean): void {
        (checked ? this.service.powerOn() : this.service.powerOff());
    }
}
