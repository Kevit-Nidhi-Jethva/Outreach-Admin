import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  items = [
    { icon: 'dashboard', label: 'Dashboard', route: ['/dashboard'] },
    { icon: 'groups', label: 'Workspaces', route: ['/dashboard/workspaces'] },
    { icon: 'person', label: 'Users', route: ['/dashboard/users'] }
  ];

  constructor(private router: Router) {}

  navigate(r: any[]) {
    this.router.navigate(r);
  }
}
