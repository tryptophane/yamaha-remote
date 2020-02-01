import {Component} from '@angular/core';
import {CursorControlService} from '../../service/cursor-control.service';

@Component({
    selector: 'app-cursor-control',
    templateUrl: './cursor-control.component.html',
    styleUrls: ['./cursor-control.component.scss']
})
export class CursorControlComponent {

    constructor(public readonly service: CursorControlService) {
    }
}
