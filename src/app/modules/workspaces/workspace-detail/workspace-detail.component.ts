import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { Workspace } from '../../../core/models/workspace.model';

@Component({
  selector: 'app-workspace-detail',
  templateUrl: './workspace-detail.component.html',
  styleUrls: ['./workspace-detail.component.scss']
})
export class WorkspaceDetailComponent implements OnInit {
  workspace?: Workspace;
  id?: string;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private service: WorkspaceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) this.load();
  }

  load() {
    this.loading = true;
    this.service.get(this.id!).subscribe({
      next: w => {
        this.workspace = w;
        this.loading = false;
      }
    });
  }

  edit() {
    this.router.navigate(['edit']);
  }

  manageUsers() {
    this.router.navigate(['users']);
  }
}
