import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ClienteService } from 'src/app/servicios/cliente.service';

import { DomSanitizer } from '@angular/platform-browser';
import { isError } from 'util';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  fondo: any = { };
  public isError = false;
  public isError2 = false;
  public isError3 = false;

  fondo2: any = { };
  fondo3: any = { };

  constructor(private sanitizer: DomSanitizer , private c: ClienteService ,private menuCtrl:MenuController) {}

  ngOnInit() {
    this.menuCtrl.enable(false,'clientes');   
    this.menuCtrl.enable(false,'proveedores');   
    this.menuCtrl.enable(false,'colaboradores');   

    this.fondo = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/img/clientesvg/hometr.svg)   no-repeat;  ');
    this.fondo2 = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/img/clientesvg/homede.svg)   no-repeat;  ');
    this.fondo3 = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/img/clientesvg/homegestion.svg)   no-repeat;  ');
    localStorage.setItem('menu','0');
  }

  even(){
    if(screen.width>1000){
      this.isError = true;
   }
   console.log('event')
 }
 eveno(){
   this.isError = false;
   console.log('event')
 }
 even2(){
  if(screen.width>1000){
   this.isError2 = true;

 }
 console.log('event')
}
eveno2(){
 this.isError2 = false;
 console.log('event')
}
even3(){
  if(screen.width>1000){
   this.isError3= true;

 }
 console.log('event')
}
eveno3(){
 this.isError3 = false;
 console.log('event')
}
}
