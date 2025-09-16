import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  workspaceId?: string;
  id?: string;
  user?: User;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    public router: Router
  ) {}

  ngOnInit() {
    this.workspaceId = this.route.snapshot.paramMap.get('id') || undefined;
    this.id = this.route.snapshot.paramMap.get('userId') || undefined;
    if (this.workspaceId && this.id) this.load();
  }

  load() {
    this.loading = true;
    this.service.get(this.workspaceId!, this.id!).subscribe({
      next: u => {
        this.user = u;
        this.loading = false;
      }
    });
  }

  edit() {
    this.router.navigate(['edit']);
  }
}
