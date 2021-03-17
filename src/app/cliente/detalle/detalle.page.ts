import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment.prod';

import { ClienteService } from '../../servicios/cliente.service';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import { Options } from 'select2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetallePage implements OnInit {
  public selectedDatas: any= 'ff ';

  ColumnMode = ColumnMode;
  proformas = [];
  anios: Array<number> = [];
  public fil: any={};
  public row2:  Array<{  id:string; text:string ;anio :string  }>= [];
  public row3:  Array<{   }>= [];
  public row21:  Array<{id:string; text:string ;anio :string }>= [];
  public row4:  Array<{id:string; text:string }>= [];
  public row41:  Array<{id:string; text:string }>= [];

  public options: Options;

  rows = [];

  casillas: Array<any> = [];
  client2: Client;


  constructor(
    private clienteService: ClienteService
    ,private encrdecr:EncrDecrServiceService
    ,public toast: ToastController,
    private soap: NgxSoapService

  ) {
    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"
      }
      ,width: "100%"
    };
    this.soap.createClient(environment.clienteproceso)
    .then(client => {
      this.client2 = client;
     
    this.consultarDetalles();
    this.consultaCasillas();
    })
    .catch(err => err
      );
  }

  ngOnInit() {
    localStorage.setItem('menu','2');

  }

  

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  consultarDetalles() {
    this.row21.push({id: '3', text:  'Todos',anio:' ' });
    this.row4.push({id: '3', text:  'Todos'});

    let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA=='));
    const body = { id_cliente: decrypted };
    this.clienteService.detallesTraerTodosFacturasExportacionPorCliente2(body).subscribe(
      (res: ISoapMethodResponse) => {
        let response = res.result.TraerTodos_FacturasExportacion_PorClienteResult.factura_exportacionCN;
        this.rows = [];
        this.rows = [...this.rows];
        response.forEach(ele => {
          
          var date = new Date(ele.fecha_emision);

           this.row21.push({id: ele.proforma, text:  ele.proforma,anio: ""+date.getFullYear()+""});
           this.row4.push({id: ""+date.getFullYear()+"", text:  ""+date.getFullYear()+""});
           this.rows.push({
            proforma: ele.proforma,
            pedido: ele.numero_factura,
            contenedores: ele.cantidad_contenedores,
            valor: ele.valor_factura,
            saldo: ele.saldo_factura,
            anio:""+date.getFullYear()+"",
            valorc: "$"+ele.valor_factura,
            saldoc: "$"+ele.saldo_factura,
          });
        });        
        this.rows = [...this.rows];
      this.row3= this.rows;
       this.row2=this.row21;
       this.filtercombos();
      }
      ,(err) => { 
        this.presentToast('Error de servidor');
      }
    );
  }


  realizarBusqueda2(){
    if(((this.fil.slcAnio) &&(this.fil.slcAnio !='3') ) &&  (this.fil.slcProforma=='3' ) ){
      this.row3 = this.rows.filter(number => number.anio===this.fil.slcAnio);
    }
    else if((this.fil.slcProforma) &&(this.fil.slcProforma !=3) &&  (this.fil.slcAnio=='3') ){
      this.row3 = this.rows.filter(number => number.proforma===this.fil.slcProforma);

    }else if(this.fil.proforma == '3' && this.fil.slcAnio ==='3'){
      this.row3 = this.rows;

    }
    else if(((this.fil.slcProforma) && (this.fil.slcAnio)) && (this.fil.slcAnio !='3' &&  this.fil.slcProforma !='3'  )  ){
      this.row3 = this.rows.filter(number => number.proforma===this.fil.slcProforma  && number.anio ===this.fil.slcAnio);
    }else if(((this.fil.slcProforma) && !(this.fil.slcAnio)) && this.fil.slcProforma !='3' ){
    this.row3 = this.rows.filter(number => number.proforma===this.fil.slcProforma);
  }else if(((this.fil.slcProforma) && !(this.fil.slcAnio))  && this.fil.slcProforma ==='3'){
      this.row3 = this.rows;
      }
    else if((!(this.fil.slcProforma) && (this.fil.slcAnio))  && this.fil.slcAnio !=3){
      this.row3 = this.rows.filter(number => number.anio===this.fil.slcAnio);
      }else if((!(this.fil.slcProforma) && (this.fil.slcAnio))  && this.fil.slcAnio ==='3'){
        this.row3 = this.rows;  
        }else if(this.fil.slcProforma=='3' && this.fil.slcAnio=='3'){
          this.row3 = this.rows;

        }
    if(this.row3.length==0){
      this.presentToast('Ninguna Proforma o Año coincide');
    }
    if((!(this.fil.slcProforma) && !(this.fil.slcAnio))){
      this.presentToast('Seleccione una Proforma o Año para realizar la busqueda');
    }

   
    
  }

  async consultaCasillas() {
    this.casillas=[];
    let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA=='));
    const body = { id_cliente: decrypted };
    let peticion = await this.clienteService.getTraerTodos_Pedidos_Contenededor_PorCliente(body).subscribe(
      (res: ISoapMethodResponse) => {
        if (res.result.TraerTodos_Pedidos_Contenededor_PorClienteResult) {
          let datos = res.result.TraerTodos_Pedidos_Contenededor_PorClienteResult.pedidos_contenedorCN;
          if (datos) {
            let proformasAprobadas = Object.keys(_.groupBy(datos,"proforma")).length;
            let contenedoresDespachados = _.filter(datos,obj => obj.estado_actual === "Despachado" ).length;
            let facturasEmitidas = Object.keys(_.groupBy(datos,"numero_factura")).length;
            let contenedoresPendientes = _.filter(datos,obj => obj.estado_actual === "" ).length;
            this.casillas.push({descripcion: "Proformas aprobadas",cantidad: proformasAprobadas});
            this.casillas.push({descripcion: "Contenedores despachados",cantidad: contenedoresDespachados});
            this.casillas.push({descripcion: "Facturas emitidas",cantidad: facturasEmitidas});
            this.casillas.push({descripcion: "Contenedores Pendientes",cantidad: contenedoresPendientes});
          }else {
            this.casillas.push({descripcion: "Proformas aprobadas",cantidad: 0});
            this.casillas.push({descripcion: "Contenedores despachados",cantidad: 0});
            this.casillas.push({descripcion: "Facturas emitidas",cantidad: 0});
            this.casillas.push({descripcion: "Contenedores Pendientes",cantidad: 0});
          }
        }else {
          this.casillas.push({descripcion: "Proformas aprobadas",cantidad: 0});
          this.casillas.push({descripcion: "Contenedores despachados",cantidad: 0});
          this.casillas.push({descripcion: "Facturas emitidas",cantidad: 0});
          this.casillas.push({descripcion: "Contenedores Pendientes",cantidad: 0});
        }
      }
      , err => err
    );
  }

  getRowClass(row) {
    return {
      'pintarfila': row.saldo != 0
    };
  }

  getCellClass({ row, column, value }): any {
    return {
      'pintarfila': value != 0
    };
  }

  
  filtercombos(){

    this.row2 =  this.row2.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.row4 =  this.row4.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
  }

  onTagChanged(data): void {
    if((data && data !='3' )  ){
   
      this.row2 = this.row21.filter(number => number.anio===data);
      this.row2.push({id: '3', text:  'Todos' ,anio:' ' });
      this.row2=  this.row2.reverse();
      this.filtercombos();
    } else if(data =='3'){
      
      this.row2=this.row21;
      this.filtercombos()
    }
  }
}
