import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';
import { MatFormField } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { InputSelectionService } from '../../service/input-selection.service';

@Component({
  selector: 'app-input-selection',
  templateUrl: './input-selection.component.html',
  styleUrls: ['./input-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatSelect, MatOption]
})
export class InputSelectionComponent implements OnInit {
  protected readonly service = inject(InputSelectionService);

  readonly currentInput = input.required<string>();

  readonly disabled = input(false);

  ngOnInit() {
    this.service.loadInputList();
  }
}
