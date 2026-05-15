import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AirplayService } from '../../service/airplay.service';
import { NetradioService } from '../../service/netradio.service';
import { ServerService } from '../../service/server.service';
import { SpotifyService } from '../../service/spotify.service';
import { BasicStatusStore } from '../../store/basic-status.store';
import { FixAmpPipe } from '../../utils/fix-amp.pipe';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixAmpPipe]
})
export class PlaybackInfoComponent {
  protected readonly basicStatusStore = inject(BasicStatusStore);
  protected readonly netradioService = inject(NetradioService);
  protected readonly spotifyService = inject(SpotifyService);
  protected readonly serverService = inject(ServerService);
  protected readonly airplayService = inject(AirplayService);
}
