import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';

import { FacturaDetallePageRoutingModule } from './factura-detalle-routing.module';

import { FacturaDetallePage } from './factura-detalle.page';
import { ComponentsModule } from '../../components/components.module';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturaDetallePageRoutingModule
    ,ComponentsModule
    ,NgSelect2Module
    ,NgxDatatableModule
    ,ReactiveFormsModule
    ,NgxCleaveDirectiveModule
    ,SweetAlert2Module
  ],
  declarations: [FacturaDetallePage]
})
export class FacturaDetallePageModule {}
