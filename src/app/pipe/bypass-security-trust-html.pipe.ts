import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {jsonToHtml, isJSON} from '../../assets/js/utils';

@Pipe({
  name: 'bypassSecurityTrustHtml'
})
export class BypassSecurityTrustHtmlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(value: any, ...args: unknown[]): unknown {
    if (typeof value === 'object') {
      return this.domSanitizer.bypassSecurityTrustHtml(jsonToHtml(value));
    } else if (isJSON(value)) {
      return this.domSanitizer.bypassSecurityTrustHtml(jsonToHtml(JSON.parse(value)));
    } else {
      return this.domSanitizer.bypassSecurityTrustHtml(value);
    }

  }

}
