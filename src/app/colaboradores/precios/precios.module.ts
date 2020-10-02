import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreciosPageRoutingModule } from './precios-routing.module';

import { PreciosPage } from './precios.page';
import { ComponentsModule } from '../../components/components.module';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreciosPageRoutingModule,
    ComponentsModule,
    NgSelect2Module,
    NgxDatatableModule,
  ],
  declarations: [PreciosPage]
})
export class PreciosPageModule {}
