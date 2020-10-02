import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { IonicModule } from '@ionic/angular';
import { FacturaPageRoutingModule } from './factura-routing.module';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

import { FacturaPage } from './factura.page';
import { ComponentsModule } from '../../components/components.module';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturaPageRoutingModule,
    ComponentsModule
    ,NgSelect2Module
    ,NgxDatatableModule
    ,Ionic4DatepickerModule
    ,NgxCleaveDirectiveModule
  ],
  declarations: [FacturaPage]
})
export class FacturaPageModule {}
