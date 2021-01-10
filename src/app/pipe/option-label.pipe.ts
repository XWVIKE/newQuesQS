import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'optionLabel'
})
export class OptionLabelPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return arr[value];
  }

}
