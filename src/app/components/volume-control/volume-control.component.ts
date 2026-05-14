import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { toSignal } from '@angular/core/rxjs-interop';
import { VolumeControlService } from '../../service/volume-control.service';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';

@Component({
  selector: 'app-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMiniFabButton,
    MatIcon,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    MatButtonToggle
  ]
})
export class VolumeControlComponent {
  private readonly store = inject<Store<State>>(Store);
  protected readonly service = inject(VolumeControlService);

  protected readonly disabled = input(false);

  protected readonly basicStatusState = toSignal(
    this.store.select(fromRoot.getBasicStatusState).pipe(distinctUntilChanged())
  );
}
