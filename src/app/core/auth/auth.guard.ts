import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { jwtDecode }from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  isAdmin: boolean;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired || !decoded.isAdmin) {
        this.authService.logout();
        return false;
      }
      return true;
    } catch {
      this.authService.logout();
      return false;
    }
  }
}
