import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDNI',
  standalone: true,
})
export class FormatDNIPipe implements PipeTransform {
  transform(value: string): unknown {
    return (
      value.substring(0, 2) +
      '.' +
      value.substring(2, 5) +
      '.' +
      value.substring(5, 8)
    );
  }
}
