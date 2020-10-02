import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { isError } from 'util';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public isError = false;
  public isError2 = false;
  public isError3 = false;

  constructor(private sanitizer: DomSanitizer,private router: Router,private menuCtrl:MenuController) { }
  fondo: any = { };
  fondo2: any = { };
  fondo3: any = { };

  ngOnInit() {
    this.menuCtrl.enable(false,'clientes');
    this.menuCtrl.enable(false,'proveedores');
    this.menuCtrl.enable(false,'colaboradores');

    this.fondo = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/img/clientesvg/inicioprove.svg)  0 0 /100% 100% no-repeat;  ');
    this.fondo2 = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/img/clientesvg/iniciocli.svg)  0 0 /100% 100% no-repeat;  ');
    this.fondo3 = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/img/clientesvg/inicioicocol.svg)  0 0 /100% 100% no-repeat;  ');

    }


    on(re){
    if(!(re==null)){
    localStorage.setItem("login",re);
    this.router.navigate(['/login']);

    }

    }
    
}
