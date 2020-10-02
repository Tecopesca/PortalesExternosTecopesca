import { Injectable } from '@angular/core';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import { environment } from 'src/environments/environment.prod';
import { configColaborador } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  client: Client;
  client2 : Client;
  client3 : Client;
  body: any;

  constructor(private soap: NgxSoapService) {

    this.soap.createClient(configColaborador.LOGIN.URL).then(client3 => { this.client3 = client3;}).catch(err => err);

    this.soap.createClient(environment.proveedorlogin)
    .then(client => { this.client2 = client;
       })
    .catch(err => err);
    
    this.soap.createClient(environment.clienteLogin)
      .then(client => { this.client = client;
         })
      .catch(err => err);
  }

  getLogin(body) {
    return (<any>this.client).autenticar_usuario(body);
  };
  getmenu(body){
    return (<any>this.client).traer_menu(body);
  }

  getloginproveedor(body){

    return (<any>this.client2).autenticar_usuario(body);

  }
  getmenuproveedor(body){
    return (<any>this.client2).traer_menu(body);
  }


  getlogincolaborador(){
    return this.client.call(configColaborador.LOGIN.METODOS[0], this.body);
  }

}
