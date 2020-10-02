import { Component, OnInit ,Input} from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from '../../servicios/login.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() titulo :string; 
  style : any = { };
  in: any = { };
  parts:Array<{ }> = [];
  public items: Array<{ style:any; texto:string;url:string }> = [];

  constructor(private encrdecr:EncrDecrServiceService, private loginService: LoginService,private sanitizer: DomSanitizer,private menuCtrl:MenuController,private router: Router) { }
  ngOnInit() {

  }
 
inicio(){
  if(localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA==')){
    this.menuCtrl.enable(false);   
    localStorage.setItem('menu','0');

    this.router.navigate(['/inicio/'+localStorage.getItem('login')]);
  }
}

inicio2(rut){
  if(localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA==')){
    this.menuCtrl.enable(false);  
    if(rut=='clientes/tracking'){
      localStorage.setItem('menu','1');

    } else  if(rut=='clientes/detalle'){
      localStorage.setItem('menu','2');
   
    } else if(rut=='clientes/gestion'){
      localStorage.setItem('menu','3');

    } 
    this.router.navigate([rut]);
  }
}

onMenuOpen(){
  this.items=[];
   
  var guardado = localStorage.getItem('datos');
  this.items= JSON.parse(guardado);
  
  
        var cont = 0 ;
     

        if(this.router.url == '/inicio/clientes') {
            this.in = this.sanitizer.bypassSecurityTrustStyle('color: #29ABE2; border-bottom: #29ABE2 3px solid');
         }else {
         this.items.forEach(ele=>{
           
             if(this.router.url =="/"+ele.url){
              this.in = this.sanitizer.bypassSecurityTrustStyle('');

            this.items[cont].style= this.sanitizer.bypassSecurityTrustStyle('color: #29ABE2; border-bottom: #29ABE2 3px solid');;

             }
             cont++
         });
       }
}
salir(){

  this.menuCtrl.enable(false);   

}
}