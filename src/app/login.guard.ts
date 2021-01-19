import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {
  constructor(private router: Router) {
    this.router = router;
  }

  /**
   * 路由检查
   * @param route 路由
   * @param state 状态
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = localStorage.getItem('token');
    if (user && user !== undefined) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
