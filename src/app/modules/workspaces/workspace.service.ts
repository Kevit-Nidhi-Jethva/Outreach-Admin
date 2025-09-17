import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workspace } from '../../core/models/workspace.model';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private base = 'http://localhost:3000/workspace';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  list(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.base}/all`, {
      headers: this.headers(),
    });
  }

  get(id: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${this.base}/${id}`, {
      headers: this.headers(),
    });
  }

  create(data: Partial<Workspace>): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.base}/create`, data, {
      headers: this.headers(),
    });
  }

  update(id: string, data: Partial<Workspace>): Observable<Workspace> {
    return this.http.put<Workspace>(`${this.base}/${id}`, data, {
      headers: this.headers(),
    });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`, {
      headers: this.headers(),
    });
  }
  //   getAll(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.base}/all`, this.headers());
  // }

  // getById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.base}/${id}`, this.headers());
  // }
}
