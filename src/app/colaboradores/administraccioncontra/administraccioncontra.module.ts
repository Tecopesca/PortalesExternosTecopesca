import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { IonicModule } from '@ionic/angular';

import { AdministraccioncontraPageRoutingModule } from './administraccioncontra-routing.module';

import { AdministraccioncontraPage } from './administraccioncontra.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministraccioncontraPageRoutingModule,
    ComponentsModule
    ,NgxDatatableModule
  ],
  declarations: [AdministraccioncontraPage]
})
export class AdministraccioncontraPageModule {}
