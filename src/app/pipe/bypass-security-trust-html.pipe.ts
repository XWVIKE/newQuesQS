import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {jsonToHtml} from '../../assets/js/utils';

@Pipe({
  name: 'bypassSecurityTrustHtml'
})
export class BypassSecurityTrustHtmlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(value: [], ...args: unknown[]): unknown {
    return this.domSanitizer.bypassSecurityTrustHtml(jsonToHtml(value));
  }

}
