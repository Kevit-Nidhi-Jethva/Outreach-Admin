import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { WorkspacesRoutingModule } from './workspaces-routing.module';


import { WorkspaceListComponent } from '../workspaces/workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from '../workspaces/workspace-form/workspace-form.component';
import { WorkspaceDetailComponent } from '../workspaces/workspace-detail/workspace-detail.component';
import { WorkspaceViewComponent } from './workspace-view/workspace-view.component';
import { SharedModule } from '../../shared/shared.module';

import { UsersModule } from '../users/users.module';


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
UsersModule,
ToastModule,
ButtonModule,
CardModule,
TableModule,
],
providers: [],
})
export class WorkspacesModule {}
