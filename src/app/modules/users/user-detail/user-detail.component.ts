import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { WorkspaceUser } from '../../../core/models/workspace-user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  workspaceId!: string | null;
  userId!: string;
  user!: WorkspaceUser;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.workspaceId = this.route.snapshot.paramMap.get('id');
    const paramId = this.route.snapshot.paramMap.get('userId');
    if (!paramId) throw new Error('User ID not provided in route!');
    this.userId = paramId;
    if (!this.userId) {
      // also support global route param name
      this.userId = this.route.snapshot.paramMap.get('userId') || this.route.snapshot.paramMap.get('userId')!;
    }

    this.userService.getUserById(this.userId).subscribe(u => (this.user = u));
  }

  back(): void {
    if (this.workspaceId) {
      this.router.navigate(['/dashboard/workspaces', this.workspaceId, 'users']);
    } else {
      this.router.navigate(['/dashboard/users']);
    }
  }
}
