import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './login.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopInterceptor } from './noop.interceptor';
import {QuesComponent} from './component/ques/ques.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';



const router: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'ques', component: QuesComponent, canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule],
  providers: [LoginGuard, { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }
  ]
})
export class AppRoutingModule {
}
