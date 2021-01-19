import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
    constructor (private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // 拦截请求,给请求头添加token
    let url = req.url // 可以对url进行处理
    let tokens = localStorage.getItem("token");
    let token = 'JWT ' + tokens;
    // 登录请求排除在外
    if (!url.includes('login')&&tokens) {
        req = req.clone({
            url, // 处理后的url,再赋值给req
            headers: req.headers.set('Authorization', token)//请求头统一添加token
        })
    }
    return next.handle(req).pipe(
        tap(
         event => {
          if (event instanceof HttpResponse) {
          //  console.log(event);
           if (event.status >= 500) {
            // 处理错误
            alert("接口出错")
           }
          }
         },
         error => {
          // token过期 服务器错误等处理
          this.router.navigate(['/login']);
         })
       );
  }
}
