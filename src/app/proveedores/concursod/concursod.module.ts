import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConcursodPageRoutingModule } from './concursod-routing.module';

import { ConcursodPage } from './concursod.page';

import { ComponentsModule } from '../../components/components.module';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { PruComponent } from 'src/app/components/pru/pru.component';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  entryComponents:[
    PruComponent
      ], 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConcursodPageRoutingModule,
    ComponentsModule,
    NgxDatatableModule,
    NgSelect2Module,
    
  ],
  declarations: [ConcursodPage]
})
export class ConcursodPageModule {}
