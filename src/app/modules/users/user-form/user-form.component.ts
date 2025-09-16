import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  workspaceId?: string;
  id?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['viewer', Validators.required]
    });

    this.workspaceId = this.route.snapshot.paramMap.get('id') || undefined;
    this.id = this.route.snapshot.paramMap.get('userId') || undefined;
    if (this.id) this.load();
  }

  load() {
    this.loading = true;
    this.service.get(this.workspaceId!, this.id!).subscribe({
      next: u => {
        this.form.patchValue(u);
        this.loading = false;
      }
    });
  }

  save() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.loading = true;
    const payload = this.form.value;
    const obs = this.id
      ? this.service.update(this.workspaceId!, this.id, payload)
      : this.service.create(this.workspaceId!, payload);
    obs.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['admin/workspaces', this.workspaceId, 'users']);
      },
      error: () => (this.loading = false)
    });
  }
}
