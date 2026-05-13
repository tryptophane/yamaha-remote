import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { OptionsService } from '../../service/options.service';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatSlider, MatSliderThumb, FormsModule, MatSlideToggle]
})
export class OptionsComponent {
  readonly service = inject(OptionsService);

  readonly basicStatusState = input.required<fromBasicStatus.State>();
}
