import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DriverRegistrationReportComponent } from './driver-registration-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DriverRegistrationReportComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class DriverRegistrationReportModule { }
