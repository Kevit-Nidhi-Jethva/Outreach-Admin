import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from './workspace-form/workspace-form.component';
import { WorkspaceViewComponent } from './workspace-view/workspace-view.component';
import { UserListComponent } from '../users/user-list/user-list.component';
import { UserFormComponent } from '../users/user-form/user-form.component';
import { UserDetailComponent } from '../users/user-detail/user-detail.component';

const routes: Routes = [
  // Workspaces CRUD
  { path: '', component: WorkspaceListComponent },
  { path: 'new', component: WorkspaceFormComponent },
  { path: ':id', component: WorkspaceViewComponent },
  { path: ':id/edit', component: WorkspaceFormComponent },

  // Users nested under a specific workspace
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
