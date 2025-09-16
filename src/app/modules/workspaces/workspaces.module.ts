import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { WorkspacesRoutingModule } from './workspaces-routing.module';


import { WorkspaceListComponent } from '../workspaces/workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from '../workspaces/workspace-form/workspace-form.component';
import { WorkspaceDetailComponent } from '../workspaces/workspace-detail/workspace-detail.component';
import { WorkspaceViewComponent } from './workspace-view/workspace-view.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
declarations: [
WorkspaceListComponent,
WorkspaceFormComponent,
WorkspaceDetailComponent,
WorkspaceViewComponent,
],
imports: [
CommonModule,
ReactiveFormsModule,
FormsModule,
HttpClientModule,
RouterModule,
WorkspacesRoutingModule,
SharedModule,
],
providers: [],
})
export class WorkspacesModule {}
