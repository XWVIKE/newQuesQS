import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { BypassSecurityTrustHtmlPipe } from './pipe/bypass-security-trust-html.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { OptionLabelPipe } from './pipe/option-label.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ToHtmlStringPipe } from './pipe/to-html-string.pipe';
import { AppRoutingModule } from './app-routing.module';
import { QuesComponent } from './component/ques/ques.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { editpasswordComponent } from './component/ques/dialog/editpassword.dialog'

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    BypassSecurityTrustHtmlPipe,
    OptionLabelPipe,
    ToHtmlStringPipe,
    QuesComponent,
    LoginComponent,
    RegisterComponent,
    editpasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    DragDropModule,
    EditorModule,
    AppRoutingModule,
  ],
  entryComponents: [
    editpasswordComponent
  ],
  providers: [ { provide:  NZ_I18N, useValue: zh_CN, }],
  bootstrap: [AppComponent],
  exports: [BypassSecurityTrustHtmlPipe, OptionLabelPipe]
})
export class AppModule { }
