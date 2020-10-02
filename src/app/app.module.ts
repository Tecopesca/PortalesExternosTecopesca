import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { NgxSoapModule } from 'ngx-soap';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ComponentsModule } from './components/components.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgSelect2Module } from 'ng-select2';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

import { ClienteService } from 'src/app/servicios/cliente.service';
import { ProveedorService } from './servicios/proveedor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';
import { MenuComponent } from './components/menu/menu.component'


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    HttpClientModule,
    NgxSoapModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    NgSelect2Module, 
    Ionic4DatepickerModule,
    NgxDatatableModule,
    ServiceWorkerModule.register('ngsw-worker.js', 
    
    { 
      enabled: environment.production 
    }),
    ReactiveFormsModule
    ,NgxCleaveDirectiveModule
    
  ],
  providers: [
    ClienteService,
    ProveedorService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
