import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MessageService } from 'primeng/api';
import { WorkspaceUser } from '../../../core/models/workspace-user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  workspaceId!: string | null;
  userId!: string | null;
  isEdit = false;
  loading = false;

  roleOptions = [
    { label: 'Editor', value: 'Editor' },
    { label: 'Viewer', value: 'Viewer' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.workspaceId = this.route.snapshot.paramMap.get('id');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.isEdit = !!this.userId;

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['Editor', Validators.required]
    });

    if (this.isEdit && this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: WorkspaceUser) => {
          // Always take role from workspace if available
          const wsRole = user.workspaces?.find(w => w.workspaceId === this.workspaceId)?.role;

          this.form.patchValue({
            name: user.name,
            email: user.email,
            role: wsRole || 'Viewer'   // fallback if role not found
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load user'
          })
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const val = this.form.value;

    if (this.isEdit && this.userId) {
      const body: any = {
        name: val.name,
        email: val.email,
        workspaces: [{ workspaceId: this.workspaceId, role: val.role }]
      };

      this.userService.updateUser(this.userId, body).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'User updated' });
          this.navigateBack();
        },
        error: () => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        }
      });
    } else {
      const body: any = {
        name: val.name,
        email: val.email,
        password: val.password || (val.email ? `${val.email.split('@')[0]}${Date.now()}` : `pw${Date.now()}`),
        workspaces: [{ workspaceId: this.workspaceId, role: val.role }]
      };

      this.userService.createUser(body).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'User created' });
          this.navigateBack();
        },
        error: () => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Create failed' });
        }
      });
    }
  }

  navigateBack(): void {
    if (this.workspaceId) {
      this.router.navigate(['/dashboard/workspaces', this.workspaceId, 'users']);
    } else {
      this.router.navigate(['/dashboard/users']);
    }
  }
}
