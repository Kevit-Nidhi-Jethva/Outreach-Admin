import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from '../workspaces/workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from '../workspaces/workspace-form/workspace-form.component';
import { WorkspaceViewComponent } from '../workspaces/workspace-view/workspace-view.component';
import { UserListComponent } from '../users/user-list/user-list.component';
import { UserFormComponent } from '../users/user-form/user-form.component';
import { UserDetailComponent } from '../users/user-detail/user-detail.component';

const routes: Routes = [
  // Workspace routes
  { path: '', component: WorkspaceListComponent },
  { path: 'new', component: WorkspaceFormComponent },
  { path: ':id', component: WorkspaceViewComponent },
  { path: ':id/edit', component: WorkspaceFormComponent },

  // Workspace Users sub-routes
  { path: ':id/users', component: UserListComponent },
  { path: ':id/users/new', component: UserFormComponent },
  { path: ':id/users/:userId', component: UserDetailComponent },
  { path: ':id/users/:userId/edit', component: UserFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacesRoutingModule {}
