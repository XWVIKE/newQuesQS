import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {json2html} from '../../assets/js/utils';

@Pipe({
  name: 'bypassSecurityTrustHtml'
})
export class BypassSecurityTrustHtmlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(value: [], ...args: unknown[]): unknown {
    let html = '';
    value.forEach(item => {
      html += json2html(item);
    });
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

}
