import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketRateFormater'
})
export class MarketRateFormaterPipe implements PipeTransform {

  transform(value: number) {
    if(Number.isNaN(value)){
      return '';
    }

    if(value >= 10000000){
      return '1cr+';
    }

    let newVal = Math.round(value).toLocaleString('en-IN');
    if(newVal != '0'){
      return newVal;
    }else{
      return '';
    };
  }

}
