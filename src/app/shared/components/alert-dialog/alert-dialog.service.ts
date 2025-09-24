import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent, AlertDialogData } from '../alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AlertDialogService {

  constructor(private dialog: MatDialog) {}

  /**
   * Opens a success alert dialog
   */
  showSuccess(title: string, message: string, confirmText?: string): Promise<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'success',
      confirmText: confirmText || 'OK'
    });
  }

  /**
   * Opens an error alert dialog
   */
  showError(title: string, message: string, confirmText?: string): Promise<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'error',
      confirmText: confirmText || 'OK'
    });
  }

  /**
   * Opens a warning alert dialog
   */
  showWarning(title: string, message: string, confirmText?: string): Promise<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'warning',
      confirmText: confirmText || 'OK'
    });
  }

  /**
   * Opens an info alert dialog
   */
  showInfo(title: string, message: string, confirmText?: string): Promise<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'info',
      confirmText: confirmText || 'OK'
    });
  }

  /**
   * Opens a generic alert dialog
   */
  openDialog(data: AlertDialogData): Promise<boolean> {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data,
      disableClose: false,
      width: '450px',
      maxWidth: '90vw',
      panelClass: 'alert-dialog-panel'
    });

    return dialogRef.afterClosed().toPromise();
  }
}
