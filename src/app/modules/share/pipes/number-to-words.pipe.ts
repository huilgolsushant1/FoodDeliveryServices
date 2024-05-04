import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return 'zero';
    }

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = [
      'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion'];

    const numToWords = (num: number): string => {
      if (num < 10) {
        return ones[num];
      } else if (num < 20) {
        return teens[num - 10];
      } else if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return tens[ten] + (one ? '-' + ones[one] : '');
      } else {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        return ones[hundred] + ' hundred' + (remainder ? ' and ' + numToWords(remainder) : '');
      }
    };

    const chunks = [];
    while (value > 0) {
      chunks.push(value % 1000);
      value = Math.floor(value / 1000);
    }

    let result = '';
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i]) {
        result = numToWords(chunks[i]) + ' ' + thousands[i] + ' ' + result;
      }
    }

    return result.trim();
  }

}
