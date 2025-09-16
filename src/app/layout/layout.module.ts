import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module'; // your wrapper module
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent],
  imports: [CommonModule, RouterModule, MaterialModule, LayoutRoutingModule],
  exports: [LayoutComponent, HeaderComponent, SidebarComponent]
})
export class LayoutModule {}
