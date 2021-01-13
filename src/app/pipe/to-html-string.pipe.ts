import {Pipe, PipeTransform} from '@angular/core';
import {jsonToHtml, isJSON} from '../../assets/js/utils';

@Pipe({
  name: 'toHtmlString'
})
export class ToHtmlStringPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (isJSON(value)) {
      return jsonToHtml(JSON.parse(value));
    } else {
      return value;
    }
  }

}
