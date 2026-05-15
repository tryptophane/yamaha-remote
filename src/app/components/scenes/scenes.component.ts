import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ScenesService } from '../../service/scenes.service';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton]
})
export class ScenesComponent implements OnInit {
  protected readonly service = inject(ScenesService);

  ngOnInit() {
    this.service.loadScenes();
  }

  selectScene(xmlName: string) {
    this.service.selectScene(xmlName);
  }
}
