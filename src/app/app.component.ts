import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RemoteMainComponent } from './components/remote-main/remote-main.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoteMainComponent]
})
export class AppComponent {}
