import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { WorkspaceUser } from '../../../core/models/workspace-user.model';
import { MessageService } from 'primeng/api';
import { ConfirmationDialogService } from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  workspaceId!: string;
  users: WorkspaceUser[] = [];
  loading = true;

  // Add User Modal properties
  displayAddUserModal = false;
  userForm = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    workspaceId: '',
    role: 'Editor' as 'Editor' | 'Viewer'
  };
  isSubmitting = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.workspaceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    if (this.workspaceId) {
      this.userService.listByWorkspace(this.workspaceId).subscribe({
        next: data => {
          // ✅ flatten workspace-specific role into top-level for UI
          this.users = data.map(u => {
            const ws = u.workspaces?.find(w => String(w.workspaceId) === String(this.workspaceId));
            return { ...u, role: ws?.role || 'N/A' };
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load workspace users'
          });
        }
      });
    } else {
      this.userService.listAll().subscribe({
        next: data => {
          // ✅ for global list, take first workspace role if exists
          this.users = data.map(u => ({
            ...u,
            role: u.workspaces?.[0]?.role || 'N/A'
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users'
          });
        }
      });
    }
  }

  addUser() {
    this.displayAddUserModal = true;
    this.resetUserForm();
  }

  closeAddUserModal() {
    this.displayAddUserModal = false;
    this.resetUserForm();
  }

  resetUserForm() {
    this.userForm = {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      workspaceId: this.workspaceId || '',
      role: 'Editor'
    };
    this.formErrors = {};
  }

  submitAddUser() {
    // Reset form errors
    this.formErrors = {};
    this.isSubmitting = true;

    // Validate required fields
    if (!this.userForm.name.trim()) {
      this.formErrors['name'] = 'Full name is required';
    }
    if (!this.userForm.email.trim()) {
      this.formErrors['email'] = 'Email address is required';
    } else if (!this.isValidEmail(this.userForm.email)) {
      this.formErrors['email'] = 'Please enter a valid email address';
    }
    if (!this.userForm.password) {
      this.formErrors['password'] = 'Password is required';
    } else if (this.userForm.password.length < 6) {
      this.formErrors['password'] = 'Password must be at least 6 characters long';
    }
    if (!this.userForm.workspaceId) {
      this.formErrors['workspaceId'] = 'Workspace is required';
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

    // Prepare user data
    const userData: any = {
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      password: this.userForm.password,
      workspaces: [{ workspaceId: this.userForm.workspaceId, role: this.userForm.role }]
    };

    // Only include phoneNumber if it's not empty
    if (this.userForm.phoneNumber?.trim()) {
      userData.phoneNumber = this.userForm.phoneNumber.trim();
    }

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully!'
        });
        this.closeAddUserModal();
        this.loadUsers(); // Refresh user list
        this.isSubmitting = false;
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error.error?.message || 'Failed to create user';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });

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

  view(user: WorkspaceUser) {
    const path = this.workspaceId
      ? ['/app/workspaces', this.workspaceId, 'users', user._id]
      : ['/app/users', user._id];
    this.router.navigate(path);
  }

  edit(user: WorkspaceUser) {
    const path = this.workspaceId
      ? ['/app/workspaces', this.workspaceId, 'users', user._id, 'edit']
      : ['/app/users', user._id, 'edit'];
    this.router.navigate(path);
  }

  delete(user: WorkspaceUser) {
    this.confirmationDialogService.confirmDelete(user.name, 'user').subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.userService.deleteUser(user._id!).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'User deleted'
              });
              this.loadUsers();
            },
            error: () =>
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Delete failed'
              })
          });
        }
      }
    });
  }

  back() {
    this.router.navigate(['/app/users']);
  }
}
