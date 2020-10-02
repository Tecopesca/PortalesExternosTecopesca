import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from '../../servicios/login.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = { };
  src: any = { };
  public items: Array<{ style:any; texto:string;url:string }> = [];

  constructor(private encrdecr:EncrDecrServiceService, public toast: ToastController,private loginService: LoginService,private sanitizer: DomSanitizer,private router: Router) { }

  ngOnInit() {
    this.src = this.sanitizer.bypassSecurityTrustUrl('assets/img/colaboradores/loginico2.png');   

  }

  login(user){
   
    if (user.user && user.pass) {
       
      this.loginService.body = {
        usuario: user.user, pass: user.pass,tipo_portal: 'Colaborador'
      };
  
      this.loginService.getlogincolaborador().subscribe(
        (res: ISoapMethodResponse) => {
          let logueo = res.result.autenticar_usuarioResult;
         // console.log(logueo);
          if ( logueo.id_usuario != 0) {
             

              this.presentToast('Inicio de sesión correcto');
            //  var encrypted = this.encrdecr.set('123456$#@$^@1ERF', logueo.id_cliente);
           //   var encrypted2 = this.encrdecr.set('123456$#@$^@1ERF', 'id_cliente');

             // localStorage.setItem(encrypted2,encrypted);
             // console.log(logueo.id_usuario);
              var encrypted5 = this.encrdecr.set('123456$#@$^@1ERF', logueo.id_usuario);
              var encrypted6 = this.encrdecr.set('123456$#@$^@1ERF', 'colaborador');
              localStorage.setItem(encrypted6,encrypted5);
              //console.log(encrypted6);
             this.menu();
            // localStorage.setItem('login2','proveedores'); 
             return this.router.navigate(['/inicio/colaboradores']);
                         
            
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

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  menu(){
    this.items=[];
    this.items.push({style: '0',texto: 'Compras de Materia Prima',url: '#',});
    this.items.push({style: '0',texto: 'Armador Materia Prima',url: '/colaboradores/armador_materia_prima',});
    this.items.push({style: '0',texto: 'Administración Documentos',url: '/colaboradores/administraccion_documento',});

    this.items.push({style: '0',texto: 'Consulta procesos',url: '/colaboradores/compras_materia_prima',});
    this.items.push({style: '0',texto: 'Ingreso de datos',url: '/colaboradores/compras_materia_prima/ingreso',});
    this.items.push({style: '0',texto: 'Requisitos compra',url: '/colaboradores/compras_materia_prima/requisitos',});
    this.items.push({style: '0',texto: 'Especie - Talla',url: '/colaboradores/compras_materia_prima/especie',});
    this.items.push({style: '0',texto: 'Precios - Condiciones',url: '/colaboradores/compras_materia_prima/precios',});

    localStorage.setItem('datos3', JSON.stringify(this.items));

    /*var decrypted2 = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('sFa184kaM29GTuKvbZvU+A=='))
    var decrypted3 = this.encrdecr.get('123456$#@$^@1ERF', 'sFa184kaM29GTuKvbZvU+A==')
   
   const body = { id_usuario:decrypted2, portal:decrypted3  };
   */
   /* this.loginService.getmenu(body).subscribe(
      (res: ISoapMethodResponse) => {
        this.items=[];

       //  var cont= 1;
        let menu =res.result.traer_menuResult.menuCN;
        menu.forEach(element => {
        let sty='0';
          this.items.push({
            style: sty,
            texto: element.texto,
            url: element.url,
            
          })
        });
        this.items=  this.items.reverse();

        localStorage.setItem('datos', JSON.stringify(this.items));
       
        
        
      }
      
    );*/
  }
}
