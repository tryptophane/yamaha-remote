import { Component, Input } from '@angular/core';
import * as fromBasicStatus from '../../store/reducer/basic-status.reducer';
import { OptionsService } from '../../service/options.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  @Input()
  basicStatusState: fromBasicStatus.State;

  constructor(readonly service: OptionsService) {}
}
