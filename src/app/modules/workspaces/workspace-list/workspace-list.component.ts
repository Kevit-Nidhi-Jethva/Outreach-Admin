import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { Workspace } from '../../../core/models/workspace.model';
import { AuthService } from '../../../core/auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
})
export class WorkspaceListComponent implements OnInit {
  workspaces: Workspace[] = [];
  loading = false;
  error: string | null = null;
  currentUserName: string | null = null;

  constructor(
    private service: WorkspaceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getUserNameFromToken();
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.service.list().subscribe({
      next: (data) => {
        this.workspaces = data.map((ws) => ({
          ...ws,
          createdBy: this.currentUserName || ws.createdBy,
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load workspaces';
        this.loading = false;
      },
    });
  }

  view(id: string) {
    this.router.navigate([id], { relativeTo: this.activatedRoute });
  }

  edit(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.activatedRoute });
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this workspace?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Workspace deleted' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Delete failed' });
      },
    });
  }

  newWorkspace() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  back() {
    this.router.navigate(['/dashboard']); // if needed, optional
  }
}
