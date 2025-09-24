import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  items = [
    { icon: 'groups', label: 'Workspaces', route: ['/app/workspaces'] },
    { icon: 'person', label: 'Workspace-Users', route: ['/app/users'] }
  ];

  constructor(private router: Router) {}

  navigate(r: any[]) {
    this.router.navigate(r);
  }
}
