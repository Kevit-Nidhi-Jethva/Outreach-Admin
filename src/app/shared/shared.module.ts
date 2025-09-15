import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { HighlightDirective } from './directives/highlight.directive';



@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    TruncatePipe,
    HighlightDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
