import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { UserService } from '../../users/user.service';
import { Workspace } from '../../../core/models/workspace.model';
import { AuthService } from '../../../core/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ConfirmationDialogService } from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { AlertDialogService } from '../../../shared/components/alert-dialog/alert-dialog.service';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
})
export class WorkspaceListComponent implements OnInit {
  workspaces: Workspace[] = [];
  filteredWorkspaces: Workspace[] = [];
  searchTerm = '';
  loading = false;
  error: string | null = null;
  currentUserName: string | null = null;

  // Add Admin Modal properties
  displayAddAdminModal = false;
  adminForm = {
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  };
  isSubmitting = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private service: WorkspaceService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationDialogService: ConfirmationDialogService,
    private alertDialogService: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getUserNameFromToken();
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.service.list().subscribe({
      next: (data) => {
        this.workspaces = data.map((ws) => ({
          ...ws,
          createdBy: this.currentUserName || ws.createdBy,
        }));
        this.filteredWorkspaces = [...this.workspaces];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load workspaces';
        this.loading = false;
      },
    });
  }

  filterWorkspaces() {
    this.filteredWorkspaces = this.workspaces.filter(ws =>
      ws.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  view(id: string) {
    this.router.navigate([id], { relativeTo: this.activatedRoute });
  }

  edit(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.activatedRoute });
  }

  delete(id: string) {
    const workspace = this.workspaces.find(ws => ws._id === id);
    const workspaceName = workspace?.name || 'this workspace';

    this.confirmationDialogService.confirmDelete(workspaceName, 'workspace').subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.service.delete(id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Workspace deleted' });
              this.load();
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Delete failed' });
            },
          });
        }
      }
    });
  }

  newWorkspace() {
    this.router.navigate(['/app/workspaces/new']);
  }

  openAddAdminModal() {
    this.displayAddAdminModal = true;
    this.resetAdminForm();
  }

  closeAddAdminModal() {
    this.displayAddAdminModal = false;
    this.resetAdminForm();
  }

  resetAdminForm() {
    this.adminForm = {
      name: '',
      email: '',
      password: '',
      phoneNumber: ''
    };
    this.formErrors = {};
  }



  submitAddAdmin() {
    // Reset form errors
    this.formErrors = {};
    this.isSubmitting = true;

    // Validate required fields
    if (!this.adminForm.name.trim()) {
      this.formErrors['name'] = 'Full name is required';
    }
    if (!this.adminForm.email.trim()) {
      this.formErrors['email'] = 'Email address is required';
    } else if (!this.isValidEmail(this.adminForm.email)) {
      this.formErrors['email'] = 'Please enter a valid email address';
    }
    if (!this.adminForm.password) {
      this.formErrors['password'] = 'Password is required';
    } else if (this.adminForm.password.length < 6) {
      this.formErrors['password'] = 'Password must be at least 6 characters long';
    }

    // If there are validation errors, stop submission
    if (Object.keys(this.formErrors).length > 0) {
      this.isSubmitting = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix the errors in the form'
      });
      return;
    }

    // Prepare admin data - admins have empty workspaces array since they have access to all workspaces
    const adminData = {
      name: this.adminForm.name.trim(),
      email: this.adminForm.email.trim(),
      password: this.adminForm.password,
      phoneNumber: this.adminForm.phoneNumber?.trim() || undefined
    };

    this.userService.createAdmin(adminData).subscribe({
      next: (response) => {
        this.alertDialogService.showSuccess(
          'Success',
          'Admin user created successfully!'
        ).then(() => {
          this.closeAddAdminModal();
          this.load(); // Refresh workspace list if needed
        });
        this.isSubmitting = false;
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error.error?.message || 'Failed to create user';
        this.alertDialogService.showError(
          'Error',
          errorMessage
        );

        // Handle specific error types
        if (errorMessage.toLowerCase().includes('email')) {
          this.formErrors['email'] = errorMessage;
        } else if (errorMessage.toLowerCase().includes('password')) {
          this.formErrors['password'] = errorMessage;
        }
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  back() {
    this.router.navigate(['/app/workspaces']); // if needed, optional
  }
}
