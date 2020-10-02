import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

import { ArmadormpPageRoutingModule } from './armadormp-routing.module';

import { ArmadormpPage } from './armadormp.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArmadormpPageRoutingModule,
    ComponentsModule
    ,NgSelect2Module
    ,NgxDatatableModule
  ],
  declarations: [ArmadormpPage]
})
export class ArmadormpPageModule {}
