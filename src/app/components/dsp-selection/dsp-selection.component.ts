import { Component, Input } from '@angular/core';
import { DspSelectionService } from '../../service/dsp-selection.service';

@Component({
  selector: 'app-dsp-select',
  templateUrl: './dsp-selection.component.html',
  styleUrls: ['./dsp-selection.component.scss']
})
export class DspSelectionComponent {
  @Input()
  selectedDsp: string;

  @Input()
  disabled = false;

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

  constructor(private readonly service: DspSelectionService) {}

  changeSelected(dsp: string): void {
    this.service.setStraight(dsp === 'Straight');
    if (dsp !== 'Straight') {
      this.service.select(dsp);
    }
  }
}
