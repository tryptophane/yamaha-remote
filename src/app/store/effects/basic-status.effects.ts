import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { NetradioService } from '../../service/netradio.service';
import { AirplayService } from '../../service/airplay.service';
import { SpotifyService } from '../../service/spotify.service';
import { ServerService } from '../../service/server.service';
import { RemoteService } from '../../service/remote-service';

@Injectable()
export class BasicStatusEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(RemoteService);
  private readonly netradioService = inject(NetradioService);
  private readonly airplayService = inject(AirplayService);
  private readonly spotifyService = inject(SpotifyService);
  private readonly serverService = inject(ServerService);

  refreshAllStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[BASIC_STATUS] Refresh all status'),
      switchMap(() => this.service.fetchBasicStatus()),
      tap(basicStatus => {
        if (basicStatus?.on) {
          const currentInput = basicStatus.currentInput;
          if (!currentInput || currentInput === 'NET RADIO') {
            this.netradioService.refreshNetRadioStatus();
          } else if (!currentInput || currentInput === 'Spotify') {
            this.spotifyService.refreshSpotifyStatus();
          } else if (!currentInput || currentInput === 'SERVER') {
            this.serverService.refreshServerStatus();
          } else if (!currentInput || currentInput === 'AirPlay') {
            this.airplayService.refreshAirplayStatus();
          }
        }
      }),
      map(basicStatus => ({
        type: '[BASIC_STATUS] Set basic status',
        payload: basicStatus
      }))
    )
  );
}
