import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AnalyticsRoutingModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ChartsModule,
  ]
})
export class AnalyticsModule { }
