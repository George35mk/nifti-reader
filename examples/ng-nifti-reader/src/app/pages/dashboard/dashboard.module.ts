import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NiftiHeaderSectionComponent } from './nifti-header-section/nifti-header-section.component';
import { NiftiFileInfoComponent } from './nifti-file-info/nifti-file-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CanvasViewComponent } from './canvas-view/canvas-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SlicesGridComponent } from './slices-grid/slices-grid.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NiftiHeaderSectionComponent,
    NiftiFileInfoComponent,
    CanvasViewComponent,
    SlicesGridComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSliderModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    MatSidenavModule,
    DashboardRoutingModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
