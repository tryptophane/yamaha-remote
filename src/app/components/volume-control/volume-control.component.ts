import { Component, inject, input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { VolumeControlService } from '../../service/volume-control.service';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';

@Component({
  selector: 'app-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss'],
  imports: [
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
  private readonly store = inject<Store<State>>(Store);
  readonly service = inject(VolumeControlService);

  readonly disabled = input(false);

  basicStatusState$: Observable<fromBasicStatus.State>;

  constructor() {
    this.basicStatusState$ = this.store.select(fromRoot.getBasicStatusState);
  }
}
