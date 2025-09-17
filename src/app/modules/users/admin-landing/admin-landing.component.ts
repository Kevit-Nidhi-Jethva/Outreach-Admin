import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../workspaces/workspace.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss']
})
export class AdminLandingComponent implements OnInit {
  workspaces: any[] = [];
  loading = false;

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadWorkspaces();
  }

 loadWorkspaces() {
  this.loading = true;
  this.workspaceService.list().subscribe({
    next: res => {
      this.workspaces = (res || []).sort((a, b) => a.name.localeCompare(b.name));
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load workspaces' });
    }
  });
}


  manageUsers(ws: any) {
    // navigate to the workspace users route handled by WorkspacesRoutingModule
    this.router.navigate(['/dashboard/workspaces', ws._id, 'users']);
  }
}
