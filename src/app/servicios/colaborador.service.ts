import { Injectable } from '@angular/core';
import { environment, configProveedores } from 'src/environments/environment.prod';
import { NgxSoapService, Client } from 'ngx-soap';
import { configColaborador } from '../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  client: Client;
  body: any;
  constructor( private soap: NgxSoapService) {
    this.soap.createClient(configColaborador.COLABORADOR.URL).then(client => { this.client = client;}).catch(err => err);
 }

 Traer_resumen_compra_mes_anio() {
   return this.client.call(configColaborador.COLABORADOR.METODOS[0], this.body );
  }

  Traer_resumen_cabecera_mes_anio() { 
   return this.client.call(configColaborador.COLABORADOR.METODOS[1], this.body);
  }

  Compra_copiar_datos() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[2], this.body);
   }

   Confirmar_negociacion() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[3], this.body);
   }

   Compra_verificar_eliminar() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[4], this.body);
   }

   Compra_eliminar() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[5], this.body);
   }
   Compra_cancelar() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[6], this.body);
   }
   Verificar_imprimir_contrato() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[7], this.body);
   }
   Imprimir_contrato() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[8], this.body);
   }
   
   Traer_novedad_cancelar_compra() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[9], this.body);
   }
   Traer_requisitos() { 
    return this.client.call(configColaborador.COLABORADOR.METODOS[10], this.body);
   }

  TipoBarco() {
     return this.client.call(configColaborador.COLABORADOR.MetodosDoc[1],this.body);
   }

  BarcoTraerAx() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[2],this.body);
  }

  MercanteTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[3],this.body);
  }

  barcoTraerCompraDomus() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[4],this.body);
  }

  barcoModificar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[5],this.body);
  }

  compraNotificarObservaciones() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[6],this.body);
  }

  compraTraerDocumentos() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[7],this.body);
  }
   
   Notificar_bread_down(){
   return this.client.call(configColaborador.COLABORADOR.METODOS[11], this.body);
   }
   
   Traer_grupo_compra(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[12], this.body);
   }

   Tipo_tipo_compra_traer_porgrupo(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[13], this.body);  
   }

   Termino_compra_traer(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[14], this.body);  
   }

   Materia_prima_traer(){
   return this.client.call(configColaborador.COLABORADOR.METODOS[15], this.body);
   }

   Proveedor_ax_traer(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[16], this.body); 
   }
   Barco_traer_ax(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[17], this.body);
   }
   
   Compra_traer(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[18], this.body);
   }

   Compra_traer_por_cabecera(){
     console.log(this.body)
    return this.client.call(configColaborador.COLABORADOR.METODOS[19], this.body);
   }
   
   Bandera_traer(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[20], this.body);
   }
   Compra_traer_informacion(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[21], this.body);

   }
   Compra_Modificar(){
    console.log(this.body)
    console.log(configColaborador.COLABORADOR.METODOS[22]) 
    return this.client.call(configColaborador.COLABORADOR.METODOS[22], this.body);
   }
   Compra_Guardar(){
    console.log(this.body)
    return this.client.call(configColaborador.COLABORADOR.METODOS[23], this.body);
   }

   Cabecera_guardar(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[24], this.body);
   } 
   Cabecera_modificar(){
    
    return this.client.call(configColaborador.COLABORADOR.METODOS[25], this.body); 
   }

   Proveedor_guardar(){
    
    return this.client.call(configColaborador.COLABORADOR.METODOS[26], this.body); 
   }

   Organismo_pesca_traer_todos(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[27], this.body); 
   }
   Barco_crear(){
     
    return this.client.call(configColaborador.COLABORADOR.METODOS[28], this.body); 
   }
  adjuntarDocumento() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[8], this.body);
  }
  documentoTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[9], this.body);
  }
  documentoModificar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[10], this.body);
  }
  Barco_traer_por_codigo_domus(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[29], this.body); 
  }
  Barco_modificar(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[30], this.body); 
  }
  Organismo_pesca_resumen_por_compra(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[31], this.body); 
  }
  Organismo_pesca_eliminar(){
    console.log(this.body)
    return this.client.call(configColaborador.COLABORADOR.METODOS[32], this.body); 
  }
  Organismo_pesca_modificar(){
    
    return this.client.call(configColaborador.COLABORADOR.METODOS[33], this.body); 
  }
  Organismo_pesca_insertar(){
    
    return this.client.call(configColaborador.COLABORADOR.METODOS[34], this.body); 
  }
  Requisito_modificar(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[35], this.body); 
  }
  Status_embarcacion_traer_documento(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[36], this.body); 
  }
  Status_embarcacion_adjuntar_documento(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[37], this.body);
  }
  Compra_mp_traer_resumen(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[38], this.body);
  }
  Tabla_precio_resumen_por_compra(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[39], this.body);
  }
  Condicion_pago_por_compra(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[40], this.body);
  }

  Precio_contrato_modificar(){ 
    return this.client.call(configColaborador.COLABORADOR.METODOS[41], this.body);
  }
  
  Configuracion_pago_traer(){
    return this.client.call(configColaborador.COLABORADOR.METODOS[42], this.body);
  }

  compraTraerResumen() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[11], this.body);
  }

  especieTallaArmadorTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[12], this.body);
  }

  especieTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[13], this.body);
  }

  tallaTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[14], this.body);
  }

  agrupacionTallaTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[15], this.body);
  }

  especieTallaArmadorInsertarModificar(numeroMetodo) {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[numeroMetodo], this.body);
  }

  especieTallaArmadorEliminar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[18], this.body);
  }

  cargosVariosPagoPorCompra() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[19], this.body);
  }

  asignacionGastoTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[20], this.body);
  }

  agrupacionCargosVariosTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[21], this.body);
  }

  sincronizarDocumentos() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[22], this.body);
  }

  Tipo_barco_traer() {
    return this.client.call(configColaborador.COLABORADOR.METODOS[43], this.body);
  }

  tablaPrecioGenerarPorConfiguracion() {
    console.log(this.body)
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[23], this.body);
  }

  cargosVariosInsertar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[24], this.body);
  }

  cargosVariosModificar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[25], this.body);
  }

  tipoPagoTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[26], this.body);
  }

  condicionPagoModificar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[27], this.body);
  }

  condicionPagoInsertar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[28], this.body);
  }

  condicionPagoEliminar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[29], this.body);
  }

  tablaPrecioTraer() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[30], this.body);
  }

  condicionPagoGenerar() {
    return this.client.call(configColaborador.COLABORADOR.MetodosDoc[31], this.body);
  }

  Traer_informacion_cabecera(){
    console.log(configColaborador.COLABORADOR.METODOS[44])
    return this.client.call(configColaborador.COLABORADOR.METODOS[44], this.body);
  }

}
