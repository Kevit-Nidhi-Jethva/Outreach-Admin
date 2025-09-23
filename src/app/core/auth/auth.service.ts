import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/user';
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/loginadmin`, credentials).pipe(
      tap((response) => {
        if (response?.token && typeof localStorage !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user)); // ✅ stringify properly
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload?.name || null;
  }

  getCurrentUser(): any {
  const user = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (e) {
    console.warn('Invalid user in localStorage, clearing it', e);
    if (typeof localStorage !== 'undefined') localStorage.removeItem('user');
    return null;
  }
}

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return of(!isExpired);
    } catch {
      return of(false);
    }
  }

  isAdminSync(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.isAdmin === true;
    } catch {
      return false;
    }
  }

}
