import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasmpingresoPageRoutingModule } from './comprasmpingreso-routing.module';

import { ComprasmpingresoPage } from './comprasmpingreso.page';
import { ComponentsModule } from '../../components/components.module';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { PopoverbarcoComponent } from 'src/app/components/popoverbarco/popoverbarco.component';
import { PopoverproveedorComponent } from 'src/app/components/popoverproveedor/popoverproveedor.component';
import { PopoverelimiComponent } from 'src/app/components/popoverelimi/popoverelimi.component';
import { PopovernotifiComponent } from 'src/app/components/popovernotifi/popovernotifi.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  entryComponents:[
    PopoverproveedorComponent,
    PopoverbarcoComponent,
    PopoverelimiComponent,
    PopovernotifiComponent
      ], 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasmpingresoPageRoutingModule,
    NgSelect2Module,
    NgxDatatableModule,
    ComponentsModule, 
    ReactiveFormsModule
  ],
  declarations: [ComprasmpingresoPage]
})
export class ComprasmpingresoPageModule {}
