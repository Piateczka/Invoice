import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefixCurrency'
})
export class PrefixCurrencyPipe implements PipeTransform {

  transform(value: any, prefix: string): any {
    return `${value} ${prefix}`;
  }

}
