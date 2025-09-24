import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertDialogService } from './components/alert-dialog/alert-dialog.service';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    AlertDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmationDialogComponent,
    AlertDialogComponent
  ],
  providers: [AlertDialogService]
})
export class SharedModule {}
