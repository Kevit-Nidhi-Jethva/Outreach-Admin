import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  workspaceId?: string;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.workspaceId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.workspaceId) this.load();
  }

  load() {
    this.loading = true;
    this.userService.list(this.workspaceId!).subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  newUser() {
    this.router.navigate(['admin/workspaces', this.workspaceId, 'users', 'new']);
  }
  view(u: User) {
    this.router.navigate(['admin/workspaces', this.workspaceId, 'users', u._id]);
  }
  edit(u: User) {
    this.router.navigate([
      'admin/workspaces',
      this.workspaceId,
      'users',
      u._id,
      'edit'
    ]);
  }
  delete(u: User) {
    if (!confirm(`Delete user ${u.name}?`)) return;
    this.userService
      .delete(this.workspaceId!, u._id!)
      .subscribe({ next: () => this.load() });
  }
}
