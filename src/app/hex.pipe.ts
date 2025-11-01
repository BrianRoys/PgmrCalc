import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexPipe',
  standalone: true
})
export class HexPipe implements PipeTransform {

  transform(value: bigint): string {
    return value.toString(16).toUpperCase(); // Convert to hex and make uppercasell;
  }

}
