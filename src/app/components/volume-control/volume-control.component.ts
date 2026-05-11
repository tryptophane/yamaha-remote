import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { VolumeControlService } from '../../service/volume-control.service';
import { State } from '../../store/reducer';
import * as fromRoot from '../../store/reducer';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';

@Component({
  selector: 'app-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss'],
  imports: [
    NgIf,
    MatMiniFabButton,
    MatIcon,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    MatButtonToggle,
    AsyncPipe
  ]
})
export class VolumeControlComponent {
  @Input()
  disabled = false;

  basicStatusState$: Observable<fromBasicStatus.State>;

  constructor(
    private readonly store: Store<State>,
    readonly service: VolumeControlService
  ) {
    this.basicStatusState$ = store.select(fromRoot.getBasicStatusState);
  }
}
