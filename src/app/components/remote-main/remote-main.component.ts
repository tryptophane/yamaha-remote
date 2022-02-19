import { Store } from '@ngrx/store';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RefreshAllStatusAction } from '../../store/actions/basic-status.action';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import * as fromNetworkName from '../../store/reducer/network-name.reducer';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import { RemoteService } from '../../service/remote-service';

@Component({
  selector: 'app-remote-main',
  templateUrl: './remote-main.component.html',
  styleUrls: ['./remote-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteMainComponent implements OnInit, OnDestroy {
  basicStatusState$: Observable<fromBasicStatus.State>;
  networkNameState$: Observable<fromNetworkName.State>;
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private readonly store: Store<State>,
    private readonly http: HttpClient,
    private readonly service: RemoteService
  ) {
    this.basicStatusState$ = store.select(fromRoot.getBasicStatusState);
    this.networkNameState$ = store.select(fromRoot.getNetworkNameState);
  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    timer(0, 5000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.store.dispatch(new RefreshAllStatusAction()));

    this.service.fetchNetworkName();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  powerButtonClicked(checked: boolean): void {
    if (checked) {
      this.service.powerOn();
    } else {
      this.service.powerOff();
    }
  }
}
