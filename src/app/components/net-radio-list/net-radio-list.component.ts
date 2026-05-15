import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
  protected readonly service = inject(NetradioService);

  ngOnInit() {
    this.service.list.set(null);
    this.service.status.set(null);
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
