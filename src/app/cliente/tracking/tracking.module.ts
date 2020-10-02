import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackingPageRoutingModule } from './tracking-routing.module';

import { TrackingPage } from './tracking.page';

import { ComponentsModule } from '../../components/components.module';
import { PopoverclienteComponent } from 'src/app/components/popovercliente/popovercliente.component';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { NgSelect2Module } from 'ng-select2';
import{ClienteService } from 'src/app/servicios/cliente.service'
@NgModule({
  entryComponents:[
PopoverclienteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackingPageRoutingModule,
    ComponentsModule,
    NgxDatatableModule,
    NgSelect2Module,
    

  ],
  declarations: [TrackingPage]
})
export class TrackingPageModule {}
