import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ISoapMethodResponse } from 'ngx-soap';
import { ToastController } from '@ionic/angular';

import { ProveedorService } from '../../servicios/proveedor.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.page.html',
  styleUrls: ['./datos.page.scss'],
})
export class DatosPage implements OnInit {

  constructor(
    private location: Location
    ,private proveedorServicio: ProveedorService
    ,public toast: ToastController
  ) {}

  campo: any = {
    razonSocial: ""
    ,email: ""
    ,direccion: ""
    ,empresa: ""
    ,telefono: ""
    ,nota: ""
  };
  guardarIsDisabled:boolean=false;
  
  ngOnInit() {
    try {
      setTimeout(() => this.traerProveedor(),1000);
    } catch (error) {
      return this.presentToast('Por favor vuelva a recargar la página');
    }
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  
  logForm(){}
  traerProveedor() {
    this.proveedorServicio.body = { id_usuario: 340 };
    this.proveedorServicio.traerProveedor().subscribe(
      (res: ISoapMethodResponse) => {
        if (res.result) {
          if(res.result.traer_proveedorResult) {
            let datos = res.result.traer_proveedorResult;
            this.campo.razonSocial = datos.razon_social;
            this.campo.email = datos.correo;
            this.campo.direccion = datos.direccion;
            this.campo.empresa = datos.razon_social;
            this.campo.telefono = datos.telefono;
            this.campo.nota = datos.observacion;
          }else {
            this.presentToast('Datos no devueltos');
          }
        }else {
          this.presentToast('Datos no devueltos');
        }
      }
      ,err=> this.presentToast('Error de servidor') );
  }

  paginaAnterior() {
    this.location.back();
  }

  guardarCambios() {
    if(this.campo.razonSocial.trim() === '') {
      return this.presentToast('Ingrese Nombre y Apellidos');
    }else if(this.campo.email.trim() === '') {
      return this.presentToast('Ingrese correo electrónico');
    }
    if(this.validar_email(this.campo.email) === false) {
      return this.presentToast('Formato de correo electrónico incorrecto');
    }
    this.guardarIsDisabled=true;
    this.proveedorServicio.body = { 
      id_usuario: 340
      ,razon_social: this.campo.razonSocial.trim()
      ,correo: this.campo.email.trim()
      ,direccion: this.campo.direccion.trim()
      ,observacion: this.campo.nota.trim()
      ,telefono: this.campo.telefono.trim()
    };
    this.proveedorServicio.actualizarProveedor().subscribe(
      (res: ISoapMethodResponse) => {
        console.log(res);
        this.guardarIsDisabled=false;
        if(res.result) {
          this.presentToast('Datos actualizados con éxito');
        }else {
          this.presentToast('Sucedió algo inesperado');
        }
      }
      ,err=> { this.presentToast('Error de servidor'), this.guardarIsDisabled=false; } );
  }

  validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }
}
