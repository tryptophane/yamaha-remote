import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { VolumeControlService } from '../../service/volume-control.service';
import { BasicStatusStore } from '../../store/basic-status.store';

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
  protected readonly service = inject(VolumeControlService);
  protected readonly basicStatusStore = inject(BasicStatusStore);

  protected readonly disabled = input(false);
}
