import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'binary',
  standalone: true
})
export class BinaryPipe implements PipeTransform {

  transform(value: bigint): string {
    return value.toString(2); // Convert to binary
  }
}
