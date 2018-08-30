import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './solid.auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = localStorage.getItem('solid-auth-client') ? true : false;

    if (!isLoggedIn) {
      this.router.navigateByUrl('/login');
    }

    return isLoggedIn; /* this.auth.session.pipe(
      take(1),
      map(session => !!session),
      tap(loggedIn => {
        if (!loggedIn) {
          return this.router.navigate(['/']);
        }
      })
    );*/
  }
}
