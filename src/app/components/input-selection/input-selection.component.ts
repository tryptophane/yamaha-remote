import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatFormField } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { SetInputListAction } from '../../store/actions/inputs.action';
import { InputSelectionService } from '../../service/input-selection.service';

@Component({
  selector: 'app-input-selection',
  templateUrl: './input-selection.component.html',
  styleUrls: ['./input-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatSelect, MatOption]
})
export class InputSelectionComponent implements OnInit {
  private readonly store = inject<Store<State>>(Store);
  protected readonly service = inject(InputSelectionService);

  readonly currentInput = input.required<string>();

  readonly disabled = input(false);

  protected readonly inputsState = toSignal(
    this.store.select(fromRoot.getInputsState).pipe(distinctUntilChanged())
  );

  ngOnInit() {
    this.fetchInputList();
  }

  fetchInputList(): void {
    this.service.getInputList().subscribe(list => {
      this.store.dispatch(new SetInputListAction(list));
    });
  }
}
