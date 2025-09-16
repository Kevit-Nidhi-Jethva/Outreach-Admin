import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from '../modules/users/user-list/user-list.component';
import { UserFormComponent } from '../modules/users/user-form/user-form.component';
import { UserDetailComponent } from '../modules/users/user-detail/user-detail.component';

@NgModule({
  declarations: [UserListComponent, UserFormComponent, UserDetailComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [UserListComponent, UserFormComponent, UserDetailComponent]
})
export class SharedModule {}
