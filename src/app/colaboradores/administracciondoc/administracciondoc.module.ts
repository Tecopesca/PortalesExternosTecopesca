import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { IonicModule } from '@ionic/angular';
import { NgSelect2Module } from 'ng-select2';

import { AdministracciondocPageRoutingModule } from './administracciondoc-routing.module';

import { AdministracciondocPage } from './administracciondoc.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracciondocPageRoutingModule,
    ComponentsModule
    ,NgxDatatableModule
    ,NgSelect2Module
  ],
  declarations: [AdministracciondocPage]
})
export class AdministracciondocPageModule {}
