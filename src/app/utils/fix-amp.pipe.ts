import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixAmp'
})
export class FixAmpPipe implements PipeTransform {
  transform(value: string, ...args: Array<unknown>): string {
    return value?.toString().replace(/\&amp\;/g, ' & ');
  }
}
