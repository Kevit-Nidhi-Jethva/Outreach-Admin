import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  // admin landing: shows workspaces list and Manage Users button
  { path: '', component: AdminLandingComponent },

  // optional global users list & form (admin)
  { path: 'list', component: UserListComponent },
  { path: 'new', component: UserFormComponent },
  { path: ':userId', component: UserDetailComponent },
  { path: ':userId/edit', component: UserFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
