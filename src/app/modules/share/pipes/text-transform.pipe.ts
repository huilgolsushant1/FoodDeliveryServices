import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {
  transform(value: string): string {
    // Capitalize the first letter of each word and insert spaces
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}