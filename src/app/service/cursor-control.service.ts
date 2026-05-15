import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class CursorControlService extends AbstractService {
  cursorCommand(command: string): void {
    this.sendAndRefreshZone('PUT', ['Cursor_Control', 'Cursor'], command);
  }

  menuCommand(command: string): void {
    this.sendAndRefreshZone('PUT', ['Cursor_Control', 'Menu_Control'], command);
  }
}
