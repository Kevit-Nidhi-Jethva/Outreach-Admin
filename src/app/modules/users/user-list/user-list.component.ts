import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { WorkspaceUser } from '../../../core/models/workspace-user.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  workspaceId!: string;
  users: WorkspaceUser[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.workspaceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    if (this.workspaceId) {
      this.userService.listByWorkspace(this.workspaceId).subscribe({
        next: data => {
          // ✅ flatten workspace-specific role into top-level for UI
          this.users = data.map(u => {
            const ws = u.workspaces?.find(w => String(w.workspaceId) === String(this.workspaceId));
            return { ...u, role: ws?.role || 'N/A' };
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load workspace users'
          });
        }
      });
    } else {
      this.userService.listAll().subscribe({
        next: data => {
          // ✅ for global list, take first workspace role if exists
          this.users = data.map(u => ({
            ...u,
            role: u.workspaces?.[0]?.role || 'N/A'
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users'
          });
        }
      });
    }
  }

  addUser() {
    if (this.workspaceId) {
      this.router.navigate(['/dashboard/workspaces', this.workspaceId, 'users', 'new']);
    } else {
      this.router.navigate(['/dashboard/users/new']);
    }
  }

  view(user: WorkspaceUser) {
    const path = this.workspaceId
      ? ['/dashboard/workspaces', this.workspaceId, 'users', user._id]
      : ['/dashboard/users', user._id];
    this.router.navigate(path);
  }

  edit(user: WorkspaceUser) {
    const path = this.workspaceId
      ? ['/dashboard/workspaces', this.workspaceId, 'users', user._id, 'edit']
      : ['/dashboard/users', user._id, 'edit'];
    this.router.navigate(path);
  }

  delete(user: WorkspaceUser) {
    if (!confirm(`Delete ${user.name}?`)) return;
    this.userService.deleteUser(user._id!).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'User deleted'
        });
        this.loadUsers();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Delete failed'
        })
    });
  }

  back() {
    this.router.navigate(['/dashboard/users']);
  }
}
