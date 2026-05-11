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
import { NgIf, AsyncPipe } from '@angular/common';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { RefreshAllStatusAction } from '../../store/actions/basic-status.action';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import * as fromNetworkName from '../../store/reducer/network-name.reducer';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import { RemoteService } from '../../service/remote-service';
import { SleepComponent } from '../sleep/sleep.component';
import { ScenesComponent } from '../scenes/scenes.component';
import { DspSelectionComponent } from '../dsp-selection/dsp-selection.component';
import { InputSelectionComponent } from '../input-selection/input-selection.component';
import { VolumeControlComponent } from '../volume-control/volume-control.component';
import { NetRadioListComponent } from '../net-radio-list/net-radio-list.component';
import { PlaybackControlComponent } from '../playback-control/playback-control.component';
import { PlayModeComponent } from '../play-mode/play-mode.component';
import { PlaybackInfoComponent } from '../playback-info/playback-info.component';
import { OptionsComponent } from '../options/options.component';
import { CursorControlComponent } from '../cursor-control/cursor-control.component';

@Component({
  selector: 'app-remote-main',
  templateUrl: './remote-main.component.html',
  styleUrls: ['./remote-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    MatButtonToggle,
    MatIcon,
    SleepComponent,
    ScenesComponent,
    DspSelectionComponent,
    InputSelectionComponent,
    VolumeControlComponent,
    NetRadioListComponent,
    PlaybackControlComponent,
    PlayModeComponent,
    PlaybackInfoComponent,
    OptionsComponent,
    CursorControlComponent,
    MatCard,
    AsyncPipe
  ]
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
