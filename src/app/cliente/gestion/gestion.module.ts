import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

import { GestionPageRoutingModule } from './gestion-routing.module';
import { NgSelect2Module } from 'ng-select2';

import { GestionPage } from './gestion.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionPageRoutingModule,
    ComponentsModule,
    NgxDatatableModule,
    NgSelect2Module
  ],
  declarations: [GestionPage]
})
export class GestionPageModule {}
