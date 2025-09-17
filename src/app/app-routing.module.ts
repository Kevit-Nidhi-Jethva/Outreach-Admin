import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'workspaces',
        loadChildren: () =>
          import('./modules/workspaces/workspaces.module').then(m => m.WorkspacesModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then(m => m.UsersModule),
      },
      { path: '', redirectTo: 'workspaces', pathMatch: 'full' }, // Default inside dashboard
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
