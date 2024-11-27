import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate',
  standalone: true,
})
export class ShortDatePipe implements PipeTransform {
  transform(date: unknown, ...args: unknown[]): unknown {
    if (typeof date !== 'string') return date;

    return date.slice(5);
  }
}
