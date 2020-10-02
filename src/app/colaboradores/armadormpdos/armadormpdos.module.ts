import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

import { ArmadormpdosPageRoutingModule } from './armadormpdos-routing.module';

import { ArmadormpdosPage } from './armadormpdos.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArmadormpdosPageRoutingModule
    ,ComponentsModule
    ,NgSelect2Module
    ,NgxDatatableModule
  ],
  declarations: [ArmadormpdosPage]
})
export class ArmadormpdosPageModule {}
