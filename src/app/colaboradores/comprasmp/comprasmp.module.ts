import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasmpPageRoutingModule } from './comprasmp-routing.module';

import { ComprasmpPage } from './comprasmp.page';
import { ComponentsModule } from '../../components/components.module';
import { NgSelect2Module } from 'ng-select2';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { PopoverelimiComponent } from 'src/app/components/popoverelimi/popoverelimi.component';
import { PopovernotifiComponent } from 'src/app/components/popovernotifi/popovernotifi.component';
import { MenuComponent } from '../../components/menu/menu.component'
@NgModule({
  entryComponents:[
    PopoverelimiComponent,
    PopovernotifiComponent
      ], 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasmpPageRoutingModule,
    ComponentsModule,
    NgSelect2Module,
    NgxDatatableModule,
  ],
  declarations: [ComprasmpPage,MenuComponent]
})
export class ComprasmpPageModule {}
