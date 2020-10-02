import { Injectable } from '@angular/core';
import { NgxSoapService, Client } from 'ngx-soap';

import { configProveedores } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
   client: Client;
   client2: Client;
   body: any;

   body2: any;

   constructor(private http:HttpClient,private soap: NgxSoapService) {
      this.soap.createClient(configProveedores.PROVEEDOR.URL).then(client => { this.client = client;}).catch(err => err);
      this.soap.createClient(configProveedores.PROVEEDOR.URL2).then(client2 => { this.client2 = client2;}).catch(err => err);
   }


   traerProveedor() {
      return this.client.call(configProveedores.PROVEEDOR.METODOS[8], this.body);
   }

   actualizarProveedor() {
      return this.client.call(configProveedores.PROVEEDOR.METODOS[7], this.body);
   }
  
   gettitulo(rep){
      if(rep=='1'){
         return this.http.get('/assets/data/datos.json');
      }else if (rep=='2'){
         return this.http.get('/assets/data/datos_curso.json');
      }else if (rep=='3'){
         return this.http.get('/assets/data/datos_finalizadas.json');      
      }
   }

   getimg(body){
      return (<any>this.client).traer_foto_detalles(body);
   }

   postcoti(){
      console.log(this.client);
      console.log('envio');

       //return (<any>this.client).ingresar_cotizacion(body);
   return this.client.call(configProveedores.PROVEEDOR.METODOS[1], this.body2);
   }

   traerAreas() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[4],{});
   }

   guardarFactura() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[5],this.body);
   }

   traerFactura() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[7],this.body);
   }

   traerFacturaAnio() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[3],this.body);
   }

   traerFacturaNumero() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[0],this.body);
   }

   traerFacturaNumeroEstado() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[1],this.body);
   }

   traerFacturaNumeroEstadoFecha() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[2],this.body);
   }

   eliminarFactura() {
      return this.client2.call(configProveedores.PROVEEDOR.METODOS2[6],this.body);
   }
}
