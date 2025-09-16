import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../../shared/material.module'; // your material module
import { LayoutModule } from '../../layout/layout.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, MaterialModule, LayoutModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {}
