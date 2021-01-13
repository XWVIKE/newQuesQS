import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { BypassSecurityTrustHtmlPipe } from './pipe/bypass-security-trust-html.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { OptionLabelPipe } from './pipe/option-label.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ToHtmlStringPipe } from './pipe/to-html-string.pipe';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    BypassSecurityTrustHtmlPipe,
    OptionLabelPipe,
    ToHtmlStringPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    DragDropModule,
    EditorModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
  exports: [BypassSecurityTrustHtmlPipe, OptionLabelPipe]
})
export class AppModule { }
