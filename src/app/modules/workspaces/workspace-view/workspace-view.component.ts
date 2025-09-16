import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { Workspace } from '../../../core/models/workspace.model';

@Component({
  selector: 'app-workspace-view',
  templateUrl: './workspace-view.component.html',
  styleUrls: ['./workspace-view.component.scss']
})
export class WorkspaceViewComponent implements OnInit {
  workspace: Workspace | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadWorkspace(id);
    } else {
      this.error = 'Invalid workspace ID';
      this.loading = false;
    }
  }

  loadWorkspace(id: string) {
    this.loading = true;
    this.workspaceService.get(id).subscribe({
      next: (res) => {
        this.workspace = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching workspace:', err);
        this.error = 'Failed to load workspace';
        this.loading = false;
      }
    });
  }

  backToList() {
    this.router.navigate(['/dashboard/workspaces']);
  }
}
