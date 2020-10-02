import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import { ToastController } from '@ionic/angular';
import { ColumnMode } from '@swimlane/ngx-datatable';
import MsgReader from '@freiraum/msgreader';
import { PopoverController } from '@ionic/angular';
import { Options } from 'select2';
import { environment } from 'src/environments/environment.prod';

import { ClienteService } from '../../servicios/cliente.service';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionPage implements OnInit {
  public selectedDatas: any= 'ff ';
  client2: Client;

  ColumnMode = ColumnMode;
    
  public proformas:  Array<{  id:string; text:string }>= [];

  public facturas:  Array<{  id:string; text:string ,pro:string}>= [];
  public facturas1:  Array<{  id:string; text:string ,pro:string}>= [];

  public fil: any={};
  rows = [];
  public options: Options;

  constructor(
    private clienteService: ClienteService
    ,private encrdecr:EncrDecrServiceService
    ,public toast: ToastController
    ,public popoverController: PopoverController
    ,private soap: NgxSoapService
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
      this.consultarGestion();
    })
    .catch(err => err);
  }

  ngOnInit() {
    localStorage.setItem('menu','3');
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  consultarGestion() {
    this.proformas.push({id: '3', text:  'Todos'});

    let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA=='));
    const body = { id_cliente: decrypted };
    this.clienteService.detallesTraerTodosFacturasExportacionPorCliente(body).subscribe(
      (res: ISoapMethodResponse) => {
        //console.log(res)
        if (res.result.TraerTodos_FacturasExportacion_PorCliente_ConDocumentacionResult) {
          let response = res.result.TraerTodos_FacturasExportacion_PorCliente_ConDocumentacionResult.factura_exportacionCN;
          if (response) {
            response.forEach(ele => {

              this.facturas.push({
                id: ele.id_factura,
                text: ele.numero_factura,
                pro: ele.proforma
              });
              this.proformas.push({
                id: ele.proforma,
                text: ele.proforma
              });
            });
            this.facturas = [...this.facturas];
            this.proformas = [...this.proformas];
            this.facturas=  this.facturas.reverse();
            
            this.facturas1= this.facturas;
            this.proformas =  this.proformas.filter((valorActual, indiceActual, arreglo) => {   
              return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
            });
          }
        }
      }
      ,(err) => { 
        this.presentToast('Error de servidor');
      }
    );
  }

  realizarBusqueda() {
    var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

    let idFactura = this.fil.slcProforma;
    let idFactura2 = this.fil.slcFactura;
    let idFacturaEnviar = 0;
    if (idFactura2) {
      idFacturaEnviar = idFactura2;
    }else if(idFactura2) {
      idFacturaEnviar = idFactura;
    }else {
      return this.presentToast('Seleccione Factura para realizar la búsqueda');
    }
    let body = { id_factura: idFacturaEnviar };
    this.clienteService.detallesTraerTodosDocumentosExportacionPorFactura(body).subscribe(
      (res: ISoapMethodResponse) => {
        this.rows = [];
        this.rows = [...this.rows];
        if (res.result.TraerTodos_DocumentosExportacion_PorFacturaResult) {
          let datos = res.result.TraerTodos_DocumentosExportacion_PorFacturaResult.documentos_facturaCN;
          if (datos) {
            datos.forEach(ele => {
              var date = new Date(ele.fecha_entrega);

              this.rows.push({
                factura: ele.numero_factura,
                documento: ele.detalle,
                fecha: date.getDate()+" de "+meses[date.getMonth()]+","+date.getFullYear()+"" ,
                observacion: ele.observacion,
                accion: { id_archivo: ele.id_archivo, documento: ele.detalle, extension: ele.extension }
              });
            });
          }
          this.rows = [...this.rows];
        }else {
          this.presentToast('No hay documentos para mostrar');
        }
      }
      ,err => { this.presentToast('Error de servidor'); }
    );
  }

  onTagChanged(data): void {
    if((data && data !='3' )  ){
   
      this.facturas = this.facturas1.filter(number => number.pro===data);
      this.facturas=  this.facturas.reverse();
     
    } else if(data =='3'){

      this.facturas=this.facturas1;
    }
  }

  buscarDocumento(idDoc,nombreArchivo) {
    let body = { id_archivo: idDoc };
    this.clienteService.detallesTraerArchivoPorIdDocumento(body).subscribe(
      (res: ISoapMethodResponse) => {
        let dataUrl = 'data:application/octec-stream;charset=utf-8;base64,'+ res.result.Traer_Archivo_PorIdDocumentoResult.archivo;
        fetch(dataUrl)
          .then(res => res.arrayBuffer())
          .then(buffer => {
            var file = new Blob([buffer], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          }
        );
      },
      err => { this.presentToast('No se puede mostrar archivo'); }
    );
  }

  descargarDocumento(idDoc,nombreArchivo) {
    let body = { id_archivo: idDoc };
    this.clienteService.detallesTraerArchivoPorIdDocumento(body).subscribe(
      (res: ISoapMethodResponse) => {
        let fileURL = 'data:application/octec-stream;charset=utf-8;base64,'+ res.result.Traer_Archivo_PorIdDocumentoResult.archivo;
        let a = document.createElement("a");
        a.href = fileURL;
        a.target = "_blank";
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      err => { this.presentToast('No se pudo descargar archivo'); }
    );
  }


}
