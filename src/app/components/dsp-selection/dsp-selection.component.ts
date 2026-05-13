import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { MatFormField } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

import { DspSelectionService } from '../../service/dsp-selection.service';

@Component({
  selector: 'app-dsp-select',
  templateUrl: './dsp-selection.component.html',
  styleUrls: ['./dsp-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatSelect, MatOption]
})
export class DspSelectionComponent {
  private readonly service = inject(DspSelectionService);

  readonly selectedDsp = input.required<string>();

  readonly disabled = input(false);

  readonly presets: Array<string> = [
    'Hall in Munich',
    'Hall in Vienna',
    'Chamber',
    'Cellar Club',
    'The Roxy Theatre',
    'The Bottom Line',
    'Sports',
    'Action Game',
    'Roleplaying Game',
    'Music Video',
    'Standard',
    'Spectacle',
    'Sci-Fi',
    'Adventure',
    'Drama',
    'Mono Movie',
    'Surround Decoder',
    '2ch Stereo',
    '5ch Stereo',
    'Straight'
  ];

  changeSelected(dsp: string): void {
    this.service.setStraight(dsp === 'Straight');
    if (dsp !== 'Straight') {
      this.service.select(dsp);
    }
  }
}
