import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Nav2Component } from './nav2/nav2.component';
import { Nav3Component } from './nav3/nav3.component';

import {  PopoverclienteComponent} from './popovercliente/popovercliente.component';

 import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

import { CasillaDetalleComponent } from './casilla-detalle/casilla-detalle.component';
import { TablaGeneradaComponent } from './tabla-generada/tabla-generada.component';
import { ModalDocumentoComponent } from './modal-documento/modal-documento.component';
import { NgSelect2Module } from 'ng-select2';
import { ReactiveFormsModule } from '@angular/forms';

import {PruComponent} from './pru/pru.component';

import {PopoverelimiComponent} from './popoverelimi/popoverelimi.component';
import {PopovernotifiComponent} from './popovernotifi/popovernotifi.component';

import {PopoverproveedorComponent} from './popoverproveedor/popoverproveedor.component';
import {PopoverbarcoComponent} from './popoverbarco/popoverbarco.component';

@NgModule({
  
  declarations: [
    Nav2Component,
    NavComponent,
    HeaderComponent,
    PopoverclienteComponent,
    CasillaDetalleComponent,
    TablaGeneradaComponent,
    ModalDocumentoComponent,
    PruComponent,
    PopoverelimiComponent,
    PopovernotifiComponent,
    Nav3Component,
    PopoverproveedorComponent,
    PopoverbarcoComponent,
    
  ],
  exports:[
    Nav2Component,
    NavComponent,
    HeaderComponent,
    PopoverclienteComponent,
    CasillaDetalleComponent,
    TablaGeneradaComponent,
    ModalDocumentoComponent,
    PruComponent,
    PopoverelimiComponent,
    PopovernotifiComponent,
    Nav3Component,
    PopoverproveedorComponent,
    PopoverbarcoComponent,
    
   ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    NgxDatatableModule,
    NgSelect2Module,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ModalDocumentoComponent,
    TablaGeneradaComponent
  ],
  
})
export class ComponentsModule { }
