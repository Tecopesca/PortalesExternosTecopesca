import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EspeciePageRoutingModule } from './especie-routing.module';

import { EspeciePage } from './especie.page';
import { ComponentsModule } from '../../components/components.module';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EspeciePageRoutingModule,
    ComponentsModule,
    NgSelect2Module,
    NgxDatatableModule,

  ],
  declarations: [EspeciePage]
})
export class EspeciePageModule {}
