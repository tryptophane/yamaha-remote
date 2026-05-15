import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-play-mode',
  templateUrl: './play-mode.component.html',
  styleUrls: ['./play-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon]
})
export class PlayModeComponent {
  readonly service = inject(ServerService);
}
