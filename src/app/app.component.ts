import { Component } from '@angular/core';
import { RemoteMainComponent } from './components/remote-main/remote-main.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RemoteMainComponent]
})
export class AppComponent {
  title = 'yamaha-remote';
}
