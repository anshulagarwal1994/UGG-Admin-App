import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TenantEditRoutingModule } from './tenant-edit-routing.module';
import { TenantEditComponent } from './tenant-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TenantEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    TenantEditRoutingModule,
    MatSlideToggleModule
  ]
})
export class TenantEditModule { }
