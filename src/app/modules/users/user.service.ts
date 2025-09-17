import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WorkspaceUser } from '../../core/models/workspace-user.model';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = 'http://localhost:3000/user';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): { headers: HttpHeaders } {
    const token = this.auth.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  /** Admin: get all users (no workspace filter) */
  listAll(): Observable<WorkspaceUser[]> {
    return this.http.get<WorkspaceUser[]>(`${this.base}/all`, this.headers());
  }

  /** Workspace-specific: attach workspace role as top-level role */
  listByWorkspace(workspaceId: string): Observable<WorkspaceUser[]> {
    return this.listAll().pipe(
      map(users =>
        users
          .filter(u =>
            Array.isArray(u.workspaces) &&
            u.workspaces.some(ws => String(ws.workspaceId) === String(workspaceId))
          )
          .map(u => {
            const ws = u.workspaces?.find(ws => String(ws.workspaceId) === String(workspaceId));
            return {
              ...u,
              role: ws?.role || 'N/A',   // ✅ role only comes from workspace
            } as WorkspaceUser;
          })
      )
    );
  }

  /** Admin: get user by ID (flatten role from workspace) */
  getUserById(userId: string, workspaceId?: string): Observable<WorkspaceUser> {
    return this.http.get<WorkspaceUser>(`${this.base}/${userId}`, this.headers()).pipe(
      map(u => {
        if (workspaceId && Array.isArray(u.workspaces)) {
          const ws = u.workspaces.find(ws => String(ws.workspaceId) === String(workspaceId));
          return { ...u, role: ws?.role || 'N/A' };
        }
        return { ...u, role: u.workspaces?.[0]?.role ?? 'N/A' };
      })
    );
  }

  /** Admin: create user */
  createUser(payload: {
    name: string;
    email: string;
    password: string;
    workspaces: { workspaceId: string; role: 'Editor' | 'Viewer' }[]; // ✅ no global role
    createdBy?: string;
  }): Observable<WorkspaceUser> {
    if (!payload.createdBy) {
      const token = this.auth.getToken();
      if (token) {
        try {
          const pk = JSON.parse(atob(token.split('.')[1]));
          payload.createdBy = pk.id || pk._id || null;
        } catch {
          payload.createdBy = undefined;
        }
      }
    }
    return this.http.post<WorkspaceUser>(`${this.base}/adduser`, payload, this.headers());
  }

  /** Admin: update user (role only from workspaces array) */
  updateUser(
  userId: string,
  payload: Partial<WorkspaceUser>,
  workspaceId?: string
): Observable<WorkspaceUser> {
  let finalPayload: any = { ...payload };

  if (workspaceId && payload.role) {
    // ✅ safely update role inside workspaces
    finalPayload = {
      ...payload,
      workspaces: (payload.workspaces || []).map(ws =>
        String(ws.workspaceId) === String(workspaceId)
          ? { ...ws, role: payload.role }
          : ws
      ),
    };
    delete finalPayload.role; // remove flattened role before sending
  }

  return this.http.put<WorkspaceUser>(`${this.base}/${userId}`, finalPayload, this.headers()).pipe(
    map(u => {
      if (workspaceId && Array.isArray(u.workspaces)) {
        const ws = u.workspaces.find(ws => String(ws.workspaceId) === String(workspaceId));
        return { ...u, role: ws?.role || 'N/A' };
      }
      return { ...u, role: u.workspaces?.[0]?.role ?? 'N/A' };
    })
  );
}


  /** Admin: delete user */
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${userId}`, this.headers());
  }

  /** Logged in user: get my workspaces */
  getMyWorkspaces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/my-workspaces`, this.headers());
  }
}
