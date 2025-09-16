import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { Workspace } from '../../../core/models/workspace.model';

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  styleUrls: ['./workspace-form.component.scss']
})
export class WorkspaceFormComponent implements OnInit {
  workspaceForm!: FormGroup;
  isEditMode = false;
  workspaceId!: string;

  constructor(
    private fb: FormBuilder,
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.workspaceId = id;
        this.loadWorkspace(id);
      }
    });
  }

  loadWorkspace(id: string): void {
    this.workspaceService.get(id).subscribe({
      next: (workspace: Workspace) => {
        this.workspaceForm.patchValue({
          name: workspace.name
        });
      },
      error: (err) => {
        console.error('Failed to load workspace', err);
      }
    });
  }

  onSubmit(): void {
    if (this.workspaceForm.invalid) return;

    const data = this.workspaceForm.value;

    if (this.isEditMode) {
      this.workspaceService.update(this.workspaceId, data).subscribe({
        next: () => {
          alert('Workspace updated successfully!');
          this.router.navigate(['../']);
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } else {
      this.workspaceService.create(data).subscribe({
        next: () => {
          alert('Workspace created successfully!');
          this.router.navigate(['../']);
        },
        error: (err) => {
          console.error('Creation failed', err);
        }
      });
    }
  }
}
