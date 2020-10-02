import { Component, OnInit } from '@angular/core';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';

import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ISoapMethodResponse } from 'ngx-soap';
import { LoginService } from '../../servicios/login.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = { };
  fondo: any = { };
  src: any = { };
  butt: any = { };
  public items: Array<{ style:any; texto:string;url:string }> = [];

  constructor(private encrdecr:EncrDecrServiceService,public toast: ToastController,private sanitizer: DomSanitizer,private router: Router,private menuCtrl:MenuController, private loginService: LoginService) {}
  
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
   
    this.menuCtrl.enable(false,'clientes');
    this.menuCtrl.enable(false,'proveedores');
    this.menuCtrl.enable(false,'colaboradores');

    this.style(localStorage.getItem('login'));
  }
  style(url){    
    this.src = this.sanitizer.bypassSecurityTrustUrl('assets/img/proveedores/loginico2.png');   
    this.butt = this.sanitizer.bypassSecurityTrustUrl('assets/img/proveedores/loginbutton.png');   
  }

  login(user){
   
  

    if (user.user && user.pass) {
      const body = { usuario: user.user, pass: user.pass,tipo_portal: 'Proveedor' };
      
      this.loginService.getloginproveedor(body).subscribe(
        (res: ISoapMethodResponse) => {
          let logueo = res.result.autenticar_usuarioResult;
          console.log(logueo);
          if (logueo.id_cliente != 0 && logueo.id_usuario != 0) {
            console.log('conso');
            if((logueo.id_cliente)   ){

              this.presentToast('Inicio de sesión correcto');
            //  var encrypted = this.encrdecr.set('123456$#@$^@1ERF', logueo.id_cliente);
           //   var encrypted2 = this.encrdecr.set('123456$#@$^@1ERF', 'id_cliente');

             // localStorage.setItem(encrypted2,encrypted);
              var d = new Date();
               var addTime = 2 * 86400; //Tiempo en segundos
               d.setSeconds(addTime); //Añado el tiempo
              var encrypted4 = this.encrdecr.set('123456$#@$^@1ERF', 'fec');
              var encrypted23 = this.encrdecr.set('123456$#@$^@1ERF', d);
              localStorage.setItem(encrypted4,encrypted23);
              console.log(logueo.id_usuario);
              var encrypted5 = this.encrdecr.set('123456$#@$^@1ERF', logueo.id_usuario);
              var encrypted6 = this.encrdecr.set('123456$#@$^@1ERF', 'proveedor');
             
              localStorage.setItem(encrypted6,encrypted5);
              console.log(encrypted6);
             this.menu();

             localStorage.setItem('login2','proveedores'); 

            return this.router.navigate(['inicio/proveedores']);
            } else{
              this.presentToast('Login incorrecto Su cuenta no pertenece a  '+localStorage.getItem('login'));

            }
          }else {
            return this.presentToast('Usuario o Contraseña incorrect@');
          }
        }
        ,(err) => { 
          return this.presentToast('Error de servidor');
        }
      );
    } else {
      this.presentToast('Escriba usuario y contraseña por favor');
    }
  }


  menu(){
    this.items=[];
    let sty='0';
   // this.items.push({  style: sty,texto: 'Concurso de Adquisiciones',url: 'proveedores/concurso'  });
   //this.items.push({  style: sty,texto: 'Datos del Proveedor ',url:'proveedores/datos'   });
   // this.items.push({  style: sty,texto: 'Facturas',url: 'proveedores/factura'   });
  
   // localStorage.setItem('datos2', JSON.stringify(this.items));
    var decrypted2 = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='))
     
   
   const body = { id_usuario:decrypted2, portal: 'Proveedor'};
 
    this.loginService.getmenuproveedor(body).subscribe(
      (res: ISoapMethodResponse) => {
       //  var cont= 1;
       this.items=[];

        let menu =res.result.traer_menuResult.menuCN;
       //console.log(menu)
        menu.forEach(element => {
        let sty='0';
          this.items.push({
            style: sty,
            texto: element.texto,
            url: element.url,
            
          })
        });
        this.items=  this.items.reverse();

        localStorage.setItem('datos2', JSON.stringify(this.items));
       
        
        
      }
      
    );


  }

}
