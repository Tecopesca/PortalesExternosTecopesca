import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { Options } from 'select2';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Router  ,ActivatedRoute} from '@angular/router';

import { ColaboradorService } from '../../servicios/colaborador.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
import { async } from '@angular/core/testing';
import { RSA_NO_PADDING } from 'constants';
@Component({
  selector: 'app-precios',
  templateUrl: './precios.page.html',
  styleUrls: ['./precios.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PreciosPage implements OnInit {
  items=[]
  public fil: any={};
  fecha :any;
  fecham :any;
  public options: Options;
  ColumnMode = ColumnMode;
  items2=[]
  items3=[]
  items4=[]
  items2cop=[]
  modi2 :any;
  editnu = {};
  estandar= {};
  Real= {};
   LIST=[]
  lista: any={
    precio_contratoCN: {}
  };
  public class :any;
  public campana:any={
    c:0,
    id:0,
    codi:0
  };
  tama: any;

  dataAsignacion = [
    { id: 'Monto', text: 'Monto' }
    ,{ id: '%', text: '%' }
  ];

  observacion= {};
  alFinalizarDescargarChecado = [
    { id: "Semana", text: "Semana" }
    ,{ id: "Día", text: "Día" }
  ];
  alFinalizarDescargarNoChecado = [
    { id: "Fecha", text: "Fecha" }
    ,{ id: "Semana", text: "Semana" }
  ];
  dataTipoPago = [];
  dataTipoTablaPrecio = [];
  constructor(
    public toast: ToastController  
    ,public loadingController: LoadingController
    ,private colaboradoServicio: ColaboradorService
    ,private encrdecr:EncrDecrServiceService
    ,private alertCtrl: AlertController
    ,private router: ActivatedRoute
    ) { 

      this.options = {
        language: {
          noResults: () => "Resultados no encontrados"     
        }
        ,width: '100%'
      }
  
    }
   
    ngOnInit() {
      this.router.queryParams.subscribe(params => {
        if(params['codigo_barco']){
            //console.log(params['id'])   
        // console.log(params['idcompra'])  
          //this.campana.c=1;
          //this.campana.codi=params['codigo_barco'];
          //this.campana.id=params['idcompra'];
           var data1 = new Date(params['fecha'])
          var date = moment(data1).format('YYYY-MM-DD');
           this.fecha=date;
           this.mydate1(this.fecha); 
          // this.Configuracion_pago_traer();
          console.log(this.items) 
           this.fil.compra =  params['idcompra'];
        }else{
          this.det(); 
        }
      });
      setTimeout(() => {
        this.tipoPagoTraer();
        this.tablaPrecioTraer();
      },1000);
    }
  
    det(){
      try {
        setTimeout(() => {
          var date = moment();
          this.fecha=date.format('YYYY-MM-DD');
          this.mydate1(this.fecha);   
           this.Configuracion_pago_traer();
        
        },1000);
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
  
  
    mydate1(v) {
   
      if(v){
        var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
         var splitted = v.split("-", 3); 
      
         this.Compra_mp_traer_resumen(v);
            var  p = +splitted[1];
         
           this.fecham=meses[p-1]+" del "+splitted[0];   
  
      }else{
        this.fecham=" " ;   
      }
      
     }

     async Compra_mp_traer_resumen(fe){
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      this.colaboradoServicio.body = {
        fecha: moment(fe).format('YYYY-MM-DD')
      };
  
      this.colaboradoServicio.Compra_mp_traer_resumen().subscribe(
        async (res: ISoapMethodResponse) => {
          this.items = [];
          this.items2 = [];
              let co;
          if (res) {
            if(res.result) { 
            // console.log(res.result)
  
              if (res.result.Compra_mp_traer_resumenResult) {
                if (res.result.Compra_mp_traer_resumenResult.resumen_compra_mpCN) {
                  //console.log(res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN)
                  let registros = res.result.Compra_mp_traer_resumenResult.resumen_compra_mpCN;
                  registros.forEach(ele=>{ 
                    // console.log(ele);
                     this.items.push({ 
                       id: ele.id_compra_mp,
                       text: `Cod. Compra: ${ele.codigo_compra_mp} - Barco: ${ele.nombre_barco} - Viaje: ${ele.numero_viaje}`
                    })
                  })              
                  this.items = [...this.items];
              
                }else {
                  this.presentToast('No hay datos para este año');
                }
              }else {
                this.presentToast('No hay datos para este año');
              }
              
            }else {
              this.presentToast('Error de servidor');
            }
          }else {
            this.presentToast('Error de servidor');
          }
          await loading.dismiss();
        }
         , async (err) => {
          this.presentToast('Error de servidor');
          await loading.dismiss();
        }
  
  
  
      );
  
    }

    async onTagChanged(data,bu){
      if(data ){
         console.log(data)
        const loading = await this.loadingController.create({ message: 'Cargando...' });
        await loading.present();
        this.colaboradoServicio.body = {
          id_compra_mp: data
        };

        this.colaboradoServicio.Tabla_precio_resumen_por_compra().subscribe(
          async (res: ISoapMethodResponse) => {
  
            if (res) {
              this.items2=[];
              this.items2=[...this.items2]
              if(res.result) { 
              
    
                if (res.result.Tabla_precio_resumen_por_compraResult) {
                    
                    let registros = res.result.Tabla_precio_resumen_por_compraResult.resumen_tabla_precioCN;
                        registros.forEach(element => {
                          let observacion = "-";
                          if (element.observacion.trim() !== "") observacion = element.observacion;

                            this.items2.push({
                              numeracion:element.numeracion,
                              nombre:element.nombre,
                              agrupacion_talla:element.agrupacion_talla,
                              estandar:{estandar:element.valor_precio_base,modi:element.precio_base},
                              Real:{Real:element.valor_modificado,modi:element.precio_base},
                              observacion: {observacion:element.observacion,modi:element.precio_base},
                              modi:false, 
                              id_precio_contrato:element.id_precio_contrato,
                              precio:element.precio,
                              id_compra_m:data,
                            });  
                            
                            
                        });
                        this.items2=[...this.items2]
                       
                        await loading.dismiss();

                }else {
                  this.presentToast('No hay datos para esta compra');
                  await loading.dismiss();

                } 
                
              }else {
                this.presentToast('Error de servidor');
                await loading.dismiss();

              }
            }else {
              this.presentToast('Error de servidor');
              await loading.dismiss();

            }
            await loading.dismiss();
          }
           , async (err) => {
            this.presentToast('Error de servidor');
            await loading.dismiss();
          }
        );
  
       if(bu==='si') this.Condicion_pago_por_compra(data);
        }
    }
 
    async alertguardarp(){
     
               if(this.items2.length >0){
                this.LIST=[]
                this.items2.forEach(ele=>{
                  if(ele.modi==true){
                       if (ele.Real.modi==true){
         /*             this.LIST.push({
                        precio_contratoCN:{
                          // id_agrupacion_precio_contrato: ,
                           id_compra_mp:ele.id_compra_m,
                          id_precio_contrato:ele.id_precio_contrato,
                          // numeracion:id.numeracion,
                           observacion: ele.observacion.observacion,
                           //precio:id.precio,
                           precio_base:ele.Real.modi,
                           //valor_modificado:ele.Real.Real,
                           valor_precio_base:ele.estandar.estandar,
                         }
                      })*/
                      //this.Precio_contrato_modificar(this.LIST[0]);
                      this.Precio_contrato_modificar(ele,true);
                       }else if(ele.Real.modi==false){
                    
                     /* this.LIST.push({
                        precio_contratoCN:{
                          id_compra_mp:ele.id_compra_m,
                          id_precio_contrato:ele.id_precio_contrato,
                          // numeracion:id.numeracion,
                           observacion: ele.observacion.observacion,
                           //precio:id.precio,
                           precio_base:ele.estandar.modi,
                          valor_modificado:ele.Real.Real,
                          //valor_precio_base:ele.estandar.estandar
                         }
                      })*/
                      this.Precio_contrato_modificar(ele,false);

                       }
                     }
                 }
                 
                );
               }else{
                 this.presentToast('No hay datos para moficicar')
               }
             
    }

    async  Precio_contrato_modificar(lista,mo){
 
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      if( lista.observacion.observacion =='-'){ lista.observacion.observacion=""}
        

       if(mo==false){  
      this.colaboradoServicio.body={
        lista:{
          precio_contratoCN:{
            id_compra_mp:lista.id_compra_m,
            id_precio_contrato:lista.id_precio_contrato,
            // numeracion:id.numeracion,
             observacion: lista.observacion.observacion,
             //precio:id.precio,
             precio_base:lista.estandar.modi,
            valor_modificado:lista.Real.Real,
            //valor_precio_base:ele.estandar.estandar
           }
        },
        id_compra_mp: lista.id_compra_m ,
        id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
      }
      } else if(mo==true){
        this.colaboradoServicio.body={
          lista:{
            precio_contratoCN:{
              id_compra_mp:lista.id_compra_m,
              id_precio_contrato:lista.id_precio_contrato,
              // numeracion:id.numeracion,
               observacion: lista.observacion.observacion,
               //precio:id.precio,
               precio_base:lista.estandar.modi,
              //valor_modificado:lista.Real.Real,
              valor_precio_base:lista.estandar.estandar
             }
          },
          id_compra_mp: lista.id_compra_m ,
          id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
        }
      }

      this.colaboradoServicio.Precio_contrato_modificar().subscribe(
        async  (res:ISoapMethodResponse)=>{
           
            if(res){
               
              if(res.result){
                     if(res.result.Precio_contrato_modificarResult==true){
                        this.presentToast('Modificado Correctamente')
                       if(this.fil.compra) this.onTagChanged(this.fil.compra,'no');
                     }else{
                      this.presentToast('Eror sl modificar los datos ')
                     }

              }else{
                this.presentToast('Eror en el servidor ')

              }
            }else{
              this.presentToast('Eror en el servidor ')
            }
            await loading.dismiss();
        }, async (err)=>{
          this.presentToast('Eror en el servidor ')
          await loading.dismiss();
        }
      );

    }

    cancelarp() {
      if(this.fil.compra) this.onTagChanged(this.fil.compra,'no');

    }

    async Condicion_pago_por_compra(data){

      if(data ){
        const loading = await this.loadingController.create({ message: 'Cargando...' });
        await loading.present();
        this.colaboradoServicio.body = {
          id_compra_mp: data
        };

        this.colaboradoServicio.Condicion_pago_por_compra().subscribe(
          async (res: ISoapMethodResponse) => {
            // console.log(res)

            if (res) {
              this.items4=[];
              this.items4=[...this.items4]
              if(res.result) { 
        //  console.log(res)
                if (res.result.Condicion_pago_por_compraResult) {
                    
                    let registros = res.result.Condicion_pago_por_compraResult.resumen_condicion_pagoCN;
                    // console.log(registros);
                    registros.forEach(element => {
                      let valorFecha = '-';
                      if (element.periodo_pago === 'Fecha') {
                        if (element.fecha !== null && element.fecha !== undefined && element.fecha !== '') {
                          valorFecha = moment(element.fecha).format('YYYY-MM-DD');
                        }
                      } else {
                        if (element.fecha !== null && element.fecha !== undefined && element.fecha !== '') {
                          valorFecha = element.valor_periodo_pago;
                        }
                      }
                      this.items4.push(/* {
                        numeracion:element.numeracion  ,
                        Pago: element.nombre_config_pago ,
                        Monto:element.valor ,
                        asignacion:element.asignacion_pago ,
                        accion: element.fin_descarga ,
                        observacion:element.observacion ,
                      } */
                      {
                        numeracion: { id: element.numeracion, text: element.numeracion, neo: false, editando: false }
                        ,pago: { id: element.id_tipo_pago, text: element.nombre_tipo_pago, neo: false, editando: false }
                        ,monto: { id: element.valor, text: element.valor, neo: false, editando: false }
                        ,asignacion: { id: element.asignacion_pago, text: element.asignacion_pago, neo: false, editando: false }
                        ,accion: { id: element.fin_descarga, text: '', neo: false, editando: false, idFechasPago: element.periodo_pago, textFechaPago: element.periodo_pago, idValorFecha: valorFecha, textValorFecha: valorFecha, editando2: false }
                        ,observacion: { id: element.observacion, text: element.observacion, neo: false, editando: false }
                        ,opcion: "-"
                        ,modificado: false
                        ,id: element.id_condicion_pago
                        ,id_config_pago: element.id_config_pago
                      }
                      );
                    });
                        this.items4=[...this.items4]
                }else {
                  this.presentToast('No hay Método de pago para esta compra');
                }
                
              }else {
                this.presentToast('Error de servidor');
              }
            }else {
              this.presentToast('Error de servidor');
            }
            await loading.dismiss();
          }
           , async (err) => {
            this.presentToast('Error de servidor');
            await loading.dismiss();
          }
        );
      }
    }


    async onTagChanged2(e) {
      if (this.fil.compra === null || this.fil.compra === '' || this.fil.compra === undefined) {
        return this.presentToast('Seleccione un número de compra');
      }
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      this.items4 = [];
      let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
      this.colaboradoServicio.body = {
        id_compra_mp: this.fil.compra
        ,id_config_pago: parseInt(e)
        ,id_usuario
      };
      this.colaboradoServicio.condicionPagoGenerar().subscribe(
        async (res: ISoapMethodResponse) => {
          console.log(res)
          await loading.dismiss();
          let resultado = false;
          if (res) {
            if (res.result) {
              if (res.result.Condicion_pago_generarResult) {
                resultado = res.result.Condicion_pago_generarResult;
              }
            }
          }
          let mensaje = resultado ? 'Finalizado con éxito.' : 'No se pudo realizar el proceso correctamente';
          this.presentToast(mensaje);
          this.Condicion_pago_por_compra(this.fil.compra);
        }
        ,async (err) => {
          await loading.dismiss();
          this.presentToast('Error de servidor');
        }
      );
    }

    async  Configuracion_pago_traer(){
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
  
       this.colaboradoServicio.Configuracion_pago_traer().subscribe(
        async (res:ISoapMethodResponse)=>{
          this.items3=[]
          if(res){
            if(res.result){
              console.log(res)
              let resp= res.result.Configuracion_pago_traerResult.config_pagoCN;
              resp.forEach(ele=>{
                this.items3.push({
                  id: ele.id_config_pago,
                  text: ele.nombre,
                });
              });

              this.items3=[...this.items3]
            }else{
              this.presentToast('Error en el servidor');  
  
            }
  
          }else{
            this.presentToast('Error en el servidor');  
          }
          await loading.dismiss();
        },async (err)=>{
          this.presentToast('Error en el servidor');
          await loading.dismiss();
        }
       );
    }
  

    updateValueest(event, cell, rowIndex) { 
      this.estandar[rowIndex + '-' + cell] = false;
      let nuevoValor = event.target.value;
      let valorAnterior = this.items2[rowIndex].estandar.estandar;
      //let idFila = this.items3[rowIndex].accion.id;
      if (nuevoValor !== valorAnterior && nuevoValor >0) {
        this.items2[rowIndex].estandar.estandar = nuevoValor;
        this.items2[rowIndex].modi=true;
        //this.lisop.push({modificar: this.items4[rowIndex]});
       // this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
        this.items2 = [...this.items2];
      }else if(nuevoValor <0) {
        this.presentToast('El precio tiene que ser mayor a 0')
      }
    }

    updateValuere(event, cell, rowIndex) { 
      this.Real[rowIndex + '-' + cell] = false;
      let nuevoValor = event.target.value;
      let valorAnterior = this.items2[rowIndex].Real.Real;
      //let idFila = this.items3[rowIndex].accion.id;
      if (nuevoValor !== valorAnterior && nuevoValor >0 ) {
        this.items2[rowIndex].Real.Real = nuevoValor;
        this.items2[rowIndex].modi=true;
        //this.lisop.push({modificar: this.items4[rowIndex]});
       // this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
        this.items2 = [...this.items2];
      }else if(nuevoValor <0) {
        this.presentToast('El precio tiene que ser mayor a 0')
      }
    }

    updateValueobservacion(event, cell, rowIndex) {
    
      this.observacion[rowIndex + '-' + cell] = false;
      let nuevoValor = event.target.value;
      let valorAnterior = this.items2[rowIndex].observacion.observacion;
      //let idFila = this.items3[rowIndex].accion.id;
      if (nuevoValor !== valorAnterior) {
        this.items2[rowIndex].observacion.observacion = nuevoValor;
        this.items2[rowIndex].modi=true;
      //  this.lisop.push({modificar: this.items4[rowIndex]});
       // this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
        this.items2 = [...this.items2];
      }
    }

    getCellClass({ row, column, value }): any {
      return {
        'is-female': value.modi === true
      };
    }

    getCellClass2({ row, column, value }): any {
      return {
        'is-female': value.modi === false
      };
    }

    aniadirMetodoPago() {
      if (this.fil.compra === null || this.fil.compra === '' || this.fil.compra === undefined) {
        return this.presentToast('Seleccione un número de compra');
      }
      if (this.fil.metodo === null || this.fil.metodo === '' || this.fil.metodo === undefined) {
        return this.presentToast('Seleccione un método de pago');
      }
      this.items4.unshift({
        numeracion: { id: '', text: '', neo: true, editando: false }
        ,pago: { id: '', text: '', neo: true, editando: false }
        ,monto: { id: '', text: '', neo: true, editando: false }
        ,asignacion: { id: 'Monto', text: 'Monto', neo: true, editando: false }
        ,accion: { id: false, text: '', neo: true, editando: false, idFechasPago: null, textFechaPago: '', idValorFecha: null, textValorFecha: '', editando2: false }
        ,observacion: { id: '', text: '', neo: true, editando: true }
        ,opcion: "-"
        ,modificado: true
        ,id: 0
        ,id_config_pago: 0
      });
      this.items4 = [...this.items4];
    }

    habilitarEdicion(fila,columna,nuevoElemento) {
      this.items4[fila][columna].editando = true;
      this.items4 = [...this.items4];
    }

    actualizarValoresFila(fila,columna) {
      let valorNuevo = this.items4[fila][columna].id;
      if (valorNuevo === '' || valorNuevo === null || valorNuevo === undefined) valorNuevo = '';
      this.items4[fila][columna].id = valorNuevo;
      this.items4[fila].modificado = true;
      if (columna === 'pago') {
        if (valorNuevo === '') {
          this.items4[fila][columna].text = valorNuevo;
        } else {
          let filtro = _.filter(this.dataTipoPago,ele => parseInt(ele.id) === parseInt(this.items4[fila][columna].id));
          if (filtro.length) {
            this.items4[fila][columna].text = filtro[0].text;
          }
        }
      } else if (columna === 'asignacion') {
        if (valorNuevo === '') {
          this.items4[fila][columna].text = valorNuevo;
        } else {
          let filtro = _.filter(this.dataAsignacion,ele => ele.id === this.items4[fila][columna].id);
          if (filtro.length) {
            this.items4[fila][columna].text = filtro[0].text;
          }
        }
      } else if (columna === 'accion') {
        this.items4[fila][columna].text = this.items4[fila][columna].id;
        this.items4[fila][columna].idFechasPago = null;
        this.items4[fila][columna].textFechaPago = '';
        this.items4[fila][columna].idValorFecha = null;
        this.items4[fila][columna].textValorFecha = '';
      } else {
        this.items4[fila][columna].text = this.items4[fila][columna].id;
      }
      this.items4[fila][columna].editando = false;
      this.items4 = [...this.items4];
    }
  
  eliminarMetodoPago(fila) {
    this.condicionPagoEliminar(fila);
  }
  
  guardarMetodoPago(fila) {
    let elementosFila = this.items4[fila];
    // if (elementosFila.numeracion.id === '-' || elementosFila.numeracion.id === '' || elementosFila.numeracion.id === null || elementosFila.numeracion.id === undefined) { return this.presentToast('Ingrese la numeración'); }
    if (elementosFila.pago.id === '-' || elementosFila.pago.id === '' || elementosFila.pago.id === null || elementosFila.pago.id === undefined) { return this.presentToast('Ingrese la numeración'); }
    if (elementosFila.monto.id === '-' || elementosFila.monto.id === '' || elementosFila.monto.id === null || elementosFila.monto.id === undefined) { return this.presentToast('Ingrese la numeración'); }
    if (elementosFila.asignacion.id === '-' || elementosFila.asignacion.id === '' || elementosFila.asignacion.id === null || elementosFila.asignacion.id === undefined) { return this.presentToast('Ingrese la numeración'); }
    if (elementosFila.accion.idFechasPago === '-' || elementosFila.accion.idFechasPago === null || elementosFila.accion.idFechasPago === '' || elementosFila.accion.idFechasPago === undefined) { return this.presentToast('Seleccione un periodo de pago y su valor'); }
    if (elementosFila.accion.idValorFecha === '-' || elementosFila.accion.idValorFecha === null || elementosFila.accion.idValorFecha === '' || elementosFila.accion.idValorFecha === undefined) { return this.presentToast('Seleccione un periodo de pago y su valor'); }
    if (typeof parseFloat(elementosFila.monto.id) !== 'number') {
      return this.presentToast('El valor del monto o porcentaje debe de ser un número');
    } else if (isNaN(parseFloat(elementosFila.monto.id))) {
      return this.presentToast('Ingrese un Monto correcto');
    }
    /* if (typeof parseFloat(elementosFila.numeracion.id) !== 'number') {
      return this.presentToast('Ingrese una numeración correcta');
    } else if (isNaN(parseFloat(elementosFila.numeracion.id))) {
      return this.presentToast('Ingrese una numeración correcta');
    } else if (parseFloat(elementosFila.numeracion.id) < 1) {
      return this.presentToast('Ingrese un número mayor a cero');
    } */
    if (elementosFila.asignacion.id === '%') {
      if (parseFloat(elementosFila.monto.id) > 100 || parseFloat(elementosFila.monto.id) < 0) {
        return this.presentToast('El porcentaje no puede ser superior a 100 ni inferior a 0');
      }
    } else if (elementosFila.asignacion.id === 'Monto') {
      if (parseFloat(elementosFila.monto.id) < 0) {
        return this.presentToast('El monto no puede ser inferior a 0');
      }
    }
    if (elementosFila.accion.idFechasPago !== 'Fecha') {
      if (typeof parseInt(elementosFila.accion.idValorFecha) !== 'number') {
        return this.presentToast('El valor de días o semanas debe de ser un número entero positivo');
      }else if (isNaN(parseInt(elementosFila.accion.idValorFecha))) {
        return this.presentToast('El día o la semana debe de ser un número válido');
      } else if (parseInt(elementosFila.accion.idValorFecha) < 1) {
        return this.presentToast('El día o la semana no puede ser inferior a cero');
      }
    }
    if (elementosFila.modificado && !elementosFila.accion.neo) {
      this.condicionPagoModificar(fila);
    } else if(elementosFila.modificado && elementosFila.accion.neo) {
      this.condicionPagoInsertar(fila);
    }
  }

  habilitarEdicion2(fila) {
    this.items4[fila].accion.editando = false;
    this.items4[fila].accion.editando2 = true;
    this.items4 = [...this.items4];
  }

  actualizarValoresFila2(fila,columna,campo) {
    if (campo === 'fechaPago') {
      let valorNuevo = this.items4[fila][columna].idFechasPago ? this.items4[fila][columna].idFechasPago : '';
      this.items4[fila][columna].textFechaPago = valorNuevo;
      this.items4[fila][columna].idValorFecha = null;
      this.items4[fila][columna].textValorFecha = '';
      this.items4[fila].accion.editando = false;
      this.items4[fila].accion.editando2 = false;
    } else if (campo === 'ValorFecha') {
      let valorNuevo = this.items4[fila][columna].idValorFecha;
      if (valorNuevo === null || valorNuevo === '' || valorNuevo === undefined) {
        valorNuevo = '';
      }
      this.items4[fila][columna].textValorFecha = valorNuevo;
      this.items4[fila].accion.editando = false;
      this.items4[fila].accion.editando2 = false;
    }
    this.items4[fila].modificado = true;
    this.items4 = [...this.items4];
  }
  
  tipoPagoTraer() {
    this.colaboradoServicio.body = {};
    this.colaboradoServicio.tipoPagoTraer().subscribe(
      (res: ISoapMethodResponse) => {
        if (res) {
          if (res.result) {
            if (res.result.Tipo_pago_traerResult) {
              if (res.result.Tipo_pago_traerResult.tipo_pagoCN) {
                let datos = res.result.Tipo_pago_traerResult.tipo_pagoCN;
                let tempo = [];
                datos.forEach(el => {
                  tempo.push(
                    {
                      id: el.id_tipo_pago
                      ,text: el.nombre
                    }
                  );
                });
                this.dataTipoPago = tempo;
              }
            }
          }
        }
      }
      ,(err) => {
        this.presentToast('Error de Servidor');
      }
    );
  }

  async condicionPagoModificar(fila) {
    let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    let nombreMetodoPago = '';
    let idMetodoPago = this.items4[fila].id_config_pago;
    let obj = _.filter(this.items3,el => parseInt(el.id) === parseInt(this.items4[fila].id_config_pago));
    if (obj.length) nombreMetodoPago = obj[0].text;
    let fechaX = '1900-01-01';
    let valorPeriodo = 0;
    if (this.items4[fila].accion.idFechasPago == 'Día' || this.items4[fila].accion.idFechasPago == 'Semana') {
      fechaX = '1900-01-01';
      valorPeriodo = this.items4[fila].accion.idValorFecha;
    } else {
      fechaX = moment(this.items4[fila].accion.idValorFecha).format('YYYY-MM-DD');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.body = {
      clase: {
        asignacion_pago: this.items4[fila].asignacion.id
        ,fecha: fechaX
        ,fin_descarga: this.items4[fila].accion.id
        ,id_compra_mp: this.fil.compra
        ,id_condicion_pago: this.items4[fila].id
        ,id_config_pago: idMetodoPago
        ,id_despues_pago: 0
        ,id_tipo_pago: this.items4[fila].pago.id
        ,nombre_config_pago: nombreMetodoPago
        ,nombre_tipo_pago: this.items4[fila].pago.text
        ,numeracion: this.items4[fila].numeracion.id
        ,numeracion_despues_pago: 0
        ,observacion: this.items4[fila].observacion.id
        ,periodo_pago: this.items4[fila].accion.idFechasPago
        ,valor: this.items4[fila].monto.id
        ,valor_periodo_pago: valorPeriodo
      }
      ,id_usuario
    };
    // console.log(this.colaboradoServicio.body);
    this.colaboradoServicio.condicionPagoModificar().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        let mensaje = '';
        if (res) {
          if(res.result) {
            if (res.result.Condicion_pago_modificarResult) {
              mensaje = ' - Condición actualizada con éxito';
            }
          }
        }
        // this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
        this.Condicion_pago_por_compra(this.fil.compra);
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de Servidor');
      }
    );
  }

  async condicionPagoInsertar(fila) {
    let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    let nombreMetodoPago = '';
    let idMetodoPago = this.fil.metodo;
    let obj = _.filter(this.items3,el => parseInt(el.id) === parseInt(idMetodoPago));
    if (obj.length) nombreMetodoPago = obj[0].text;
    let fechaX = '1900-01-01';
    let valorPeriodo = 0;
    if (this.items4[fila].accion.idFechasPago == 'Día' || this.items4[fila].accion.idFechasPago == 'Semana') {
      fechaX = '1900-01-01';
      valorPeriodo = this.items4[fila].accion.idValorFecha;
    } else {
      fechaX = moment(this.items4[fila].accion.idValorFecha).format('YYYY-MM-DD');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.body = {
      clase: {
        asignacion_pago: this.items4[fila].asignacion.id
        ,fecha: fechaX
        ,fin_descarga: this.items4[fila].accion.id
        ,id_compra_mp: this.fil.compra
        ,id_condicion_pago: this.items4[fila].id
        ,id_config_pago: idMetodoPago
        ,id_despues_pago: 0
        ,id_tipo_pago: this.items4[fila].pago.id
        ,nombre_config_pago: nombreMetodoPago
        ,nombre_tipo_pago: this.items4[fila].pago.text
        // ,numeracion: this.items4[fila].numeracion.id
        ,numeracion: 1
        ,numeracion_despues_pago: 0
        ,observacion: this.items4[fila].observacion.id
        ,periodo_pago: this.items4[fila].accion.idFechasPago
        ,valor: this.items4[fila].monto.id
        ,valor_periodo_pago: valorPeriodo
      }
      ,id_usuario
    };
    console.log(this.colaboradoServicio.body);
    this.colaboradoServicio.condicionPagoInsertar().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        let mensaje = '';
        if (res) {
          if(res.result) {
            if (res.result.Condicion_pago_insertarResult) {
              mensaje = ' - Condición insertada con éxito';
            }
          }
        }
        // this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
        this.Condicion_pago_por_compra(this.fil.compra);
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de Servidor');
      }
    );
  }

  async condicionPagoEliminar(fila) {
    if (this.items4[fila].id_config_pago === 0) {
      return this.presentToast('No se puede eliminar un registro no insertado previamente');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.body = {
      id_condicion_pago: this.items4[fila].id
    };
    // console.log(this.colaboradoServicio.body);
    this.colaboradoServicio.condicionPagoEliminar().subscribe(
      async (res: ISoapMethodResponse) => {
        // console.log(res);
        await loading.dismiss();
        let mensaje = '';
        if (res) {
          if(res.result) {
            if (res.result.Condicion_pago_eliminarResult) {
              mensaje = ' - Condición eliminada con éxito';
            }
          }
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
        this.Condicion_pago_por_compra(this.fil.compra);
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de Servidor');
      }
    );
  }

  actualizarTabla() {
    if (this.fil.compra === '' || this.fil.compra === null || this.fil.compra === undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    this.Condicion_pago_por_compra(this.fil.compra);
  }

  async tablaPrecioTraer() {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.tablaPrecioTraer().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        let datos = [];
        if (res) {
          if (res.result) {
            if (res.result.Tabla_precio_traerResult) {
              if (res.result.Tabla_precio_traerResult.tabla_precio_contratoCN) {
                datos = res.result.Tabla_precio_traerResult.tabla_precio_contratoCN;
              }
            }
          }
        }
        let temp = [];
        datos.forEach(el => {
          temp.push({
            id: el.id_tabla_precio_contrato
            ,text: el.descripcion
          });
        });
        this.dataTipoTablaPrecio = temp;
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }

  async tablaConfiguracion(e) {
    if (this.fil.compra === undefined || this.fil.compra === '' || this.fil.compra === null) {
      return this.presentToast('Seleccione número de compra');
    }
    if (e === '' || e === undefined || e === null) {
      return true;
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.body = {
      id_compra_mp: this.fil.compra
      ,id_tabla_precio: e
      ,id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
    };
    this.colaboradoServicio.tablaPrecioGenerarPorConfiguracion().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}`);
        if (res) {
          if (res.result) {
            if (res.result.Tabla_pecio_generar_por_configuracionResult) {
              this.onTagChanged(this.fil.compra,'si');
            }
          }
        }
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }
}