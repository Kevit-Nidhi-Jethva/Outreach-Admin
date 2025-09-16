import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    // verify first then check role
    return this.auth.verifyToken().pipe(map(valid => {
      if (!valid) {
        this.router.navigate(['/login']);
        return false;
      }
      const isAdmin = this.auth.isAdminSync();
      if (!isAdmin) {
        // not an admin: you can redirect to a "no access" or dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }));
  }
}
