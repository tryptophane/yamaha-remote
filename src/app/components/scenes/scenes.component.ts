import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatButton } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import * as fromRoot from '../../store/reducer';
import { State } from '../../store/reducer';
import { ScenesService } from '../../service/scenes.service';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton]
})
export class ScenesComponent implements OnInit {
  private readonly store = inject<Store<State>>(Store);
  private readonly service = inject(ScenesService);

  protected readonly scenesState = toSignal(
    this.store.select(fromRoot.getScenesState).pipe(distinctUntilChanged())
  );

  ngOnInit() {
    this.service.loadScenes();
  }

  selectScene(xmlName: string) {
    this.service.selectScene(xmlName);
  }
}
