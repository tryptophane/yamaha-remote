import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CursorControlService } from '../../service/cursor-control.service';

@Component({
  selector: 'app-cursor-control',
  templateUrl: './cursor-control.component.html',
  styleUrls: ['./cursor-control.component.scss'],
  imports: [MatCard, MatButton, MatIcon]
})
export class CursorControlComponent {
  constructor(readonly service: CursorControlService) {}
}
