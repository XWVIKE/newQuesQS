import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuesComponent} from './component/ques/ques.component';
import {LoginComponent} from './component/login/login.component';


const router: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'ques', component: QuesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
