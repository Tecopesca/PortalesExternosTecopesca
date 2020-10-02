import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasmprequisitosPageRoutingModule } from './comprasmprequisitos-routing.module';

import { ComprasmprequisitosPage } from './comprasmprequisitos.page';

import { NgSelect2Module } from 'ng-select2';
import { ComponentsModule } from '../../components/components.module';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasmprequisitosPageRoutingModule,
    NgSelect2Module,
    ComponentsModule,
    NgxDatatableModule,
  ],
  declarations: [ComprasmprequisitosPage]
})
export class ComprasmprequisitosPageModule {}
