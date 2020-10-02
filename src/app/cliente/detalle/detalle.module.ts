import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

import { DetallePageRoutingModule } from './detalle-routing.module';

import { DetallePage } from './detalle.page';

import { ComponentsModule } from '../../components/components.module';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePageRoutingModule,
    ComponentsModule,
    NgxDatatableModule,
    NgSelect2Module
  ],
  declarations: [DetallePage]
})
export class DetallePageModule {}
