import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'binaryPipe',
  standalone: true
})

export class BinaryPipe implements PipeTransform {
  transform(value: bigint): string {
    return value.toString(2); // Convert to binary
  }
}
