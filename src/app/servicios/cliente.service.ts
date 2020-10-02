import { Injectable } from '@angular/core';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  client2: Client;
  constructor(private soap: NgxSoapService,private http: HttpClient) {
    this.soap.createClient(environment.clienteproceso)
    .then(client => {
      this.client2 = client;
      // console.log(this.client2);
    })
    .catch(err => err
      );
    }

  
  getTraerTodos_Pedidos_Contenededor_PorCliente(body) {
   return (<any>this.client2).TraerTodos_Pedidos_Contenededor_PorCliente(body);
  }

  getTraerTodos_Pedidos_Contenededor_PorCliente_PorAnio(body) {
    return (<any>this.client2).TraerTodos_Pedidos_Contenededor_PorCliente(body);
  }

  getTraerTodos_Tracking_PorIdPedido(body) {
    return (<any>this.client2).TraerTodos_Tracking_PorIdPedido(body);
  }

  detallesTraerTodosFacturasExportacionPorCliente(body) {
    
    return (<any>this.client2).TraerTodos_FacturasExportacion_PorCliente_ConDocumentacion(body);
  }
  
  detallesTraerTodosFacturasExportacionPorCliente2(body) {
    
    return (<any>this.client2).TraerTodos_FacturasExportacion_PorCliente(body);
  }

  detallesTraerTodosFacturasExportacionPorClientePorAnio(body) {
    return (<any>this.client2).TraerTodos_FacturasExportacion_PorCliente_PorAnio(body);
  }

  detallesTraerTodosDocumentosExportacionPorFactura(body) {
    return (<any>this.client2).TraerTodos_DocumentosExportacion_PorFactura(body);
  }
  
  detallesTraerArchivoPorIdDocumento(body) {
    return (<any>this.client2).Traer_Archivo_PorIdDocumento(body);
  }
}
