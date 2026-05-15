import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class PlaybackControlService extends AbstractService {
  stop(): Observable<string> {
    return this.sendPlayback('Stop');
  }

  pause(): Observable<string> {
    return this.sendPlayback('Pause');
  }

  play(): Observable<string> {
    return this.sendPlayback('Play');
  }

  skip(): Observable<string> {
    return this.sendPlayback('Skip Fwd');
  }

  rewind(): Observable<string> {
    return this.sendPlayback('Skip Rev');
  }

  private sendPlayback(value: string): Observable<string> {
    return this.sendZone('PUT', ['Play_Control', 'Playback'], value);
  }
}
