import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from './workspace-form/workspace-form.component';
import { WorkspaceUsersComponent } from './workspace-users/workspace-users.component';


@NgModule({
  declarations: [
    WorkspaceListComponent,
    WorkspaceFormComponent,
    WorkspaceUsersComponent
  ],
  imports: [
    CommonModule,
    WorkspacesRoutingModule
  ]
})
export class WorkspacesModule { }
