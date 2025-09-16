import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from './workspace-form/workspace-form.component';
import { WorkspaceUsersComponent } from './workspace-users/workspace-users.component';

const routes: Routes = [
  { path: '', component: WorkspaceListComponent },
  { path: 'create', component: WorkspaceFormComponent },
  { path: ':id/edit', component: WorkspaceFormComponent },
  { path: ':id/users', component: WorkspaceUsersComponent }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class WorkspacesRoutingModule {}
