import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';


@Injectable({ providedIn: 'root' })
export class UserService {
private baseUrl = '/api/workspaces'; // we'll append /:workspaceId/users


constructor(private http: HttpClient) {}


list(workspaceId: string, params?: any): Observable<User[]> {
let httpParams = new HttpParams();
if (params) {
Object.keys(params).forEach(k => httpParams = httpParams.set(k, params[k]));
}
return this.http.get<User[]>(`${this.baseUrl}/${workspaceId}/users`, { params: httpParams });
}


get(workspaceId: string, userId: string): Observable<User> {
return this.http.get<User>(`${this.baseUrl}/${workspaceId}/users/${userId}`);
}


create(workspaceId: string, payload: Partial<User>): Observable<User> {
return this.http.post<User>(`${this.baseUrl}/${workspaceId}/users`, payload);
}


update(workspaceId: string, userId: string, payload: Partial<User>): Observable<User> {
return this.http.put<User>(`${this.baseUrl}/${workspaceId}/users/${userId}`, payload);
}


delete(workspaceId: string, userId: string): Observable<any> {
return this.http.delete(`${this.baseUrl}/${workspaceId}/users/${userId}`);
}
}