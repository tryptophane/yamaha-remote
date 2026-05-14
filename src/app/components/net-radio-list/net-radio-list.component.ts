import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import {
  SetListAction,
  SetRadioStatusAction
} from '../../store/actions/netradio.action';
import { NetradioService } from '../../service/netradio.service';
import { FixAmpPipe } from '../../utils/fix-amp.pipe';

@Component({
  selector: 'app-net-radio-list',
  templateUrl: './net-radio-list.component.html',
  styleUrls: ['./net-radio-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatNavList,
    MatListItem,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    FixAmpPipe
  ]
})
export class NetRadioListComponent implements OnInit {
  private readonly store = inject<Store<State>>(Store);
  private readonly service = inject(NetradioService);

  protected readonly netradioState = toSignal(
    this.store.select(fromRoot.getNetradioState).pipe(distinctUntilChanged())
  );

  ngOnInit() {
    this.store.dispatch(new SetListAction(null));
    this.store.dispatch(new SetRadioStatusAction(null));
    this.service.fetchNetRadioList();
    this.service.refreshNetRadioStatus();
  }

  selectRadioListLine(line: { txt: string; attribute: string; index: number }) {
    this.service.selectWebRadioListItem(line.index).subscribe(() => {
      if (line.attribute !== 'Item') {
        this.service.fetchNetRadioList();
      }
    });
  }

  moveNetRadioCursor(direction: string) {
    this.service
      .moveNetRadioCursor(direction)
      .subscribe(() => this.service.fetchNetRadioList());
  }
}
