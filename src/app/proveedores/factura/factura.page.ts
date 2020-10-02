import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Options } from 'select2';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { ISoapMethodResponse } from 'ngx-soap';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.page.html',
  styleUrls: ['./factura.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacturaPage implements OnInit {
  elementos: any = {
    comFactura: ""
    ,comEstado: ""
    ,fechaInicio: ""
    ,fechaFin: ""
  };
  public configSelect: Options;
  public dataNFactura;
  public dataEstado = [{id:"Pendiente", text: "Pendiente"},{id:"Pagado", text: "Pagado"}];
  ColumnMode = ColumnMode;
  rows = [];
  myDate = '';
  id_proveedor;
  elementoRespaldo = {
    comFactura: ""
    ,comEstado: ""
    ,fechaInicio: ""
    ,fechaFin: ""
  };

  datePickerObj: any = {
    inputDate: new Date(),
    fromDate: null/* new Date('2016-12-08') */,
    toDate: null/* new Date('2018-12-28') */,
    showTodayButton: true,
    closeOnSelect: true,
    disableWeekDays: [],
    mondayFirst: true,
    setLabel: 'Seleccionar',
    todayLabel: 'Hoy',
    closeLabel: 'Cerrar',
    disabledDates: [],
    titleLabel: 'Seleccione una fecha',
    monthsList: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    weeksList: ["DO", "LU", "MA", "MI", "JU", "VI", "SA"],
    dateFormat: 'YYYY-MM-DD',
    clearButton: true,
    momentLocale: 'es',
    yearInAscending: false,
    btnCloseSetInReverse: true,
    btnProperties: {
      expand: 'block', // Default 'block'
      fill: '', // Default 'solid'
      size: '', // Default 'default'
      disabled: false, // Default false
      strong: false, // Default false
      // color: 'tertiary' // Default ''
      color: 'ninguna-clase' // Default ''
    },
    highlightedDates: []
    ,isSundayHighlighted : {
     fontColor: '#c3add4'
    }
  };
  public configcleave = {
    delimiters: ['-', '-']
    ,blocks: [3,3,9]
  };

  constructor(
    private proveedor: ProveedorService
    ,public toast: ToastController
    ,private encrdecr:EncrDecrServiceService
    ,public loadingController: LoadingController
  ) {
    this.configSelect = {
      language: {
        noResults: () => "Resultados no encontrados"
      }
      ,width: '100%'
    };
  }

  ngOnInit() {
    setTimeout(() => {
      this.consultarFacturas();
    },1000);
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  filtrar() {
    /* if(this.elementos.comFactura.trim() === "") {
      return this.presentToast("Escriba un número de factura");
    } */
    let numero = this.elementos.comFactura;
    let estado = this.elementos.comEstado;
    let fechai = this.elementos.fechaInicio;
    let fechaf = this.elementos.fechaFin;
    if (this.elementos.comFactura.trim() === "" && (this.elementos.comEstado === "" || this.elementos.comEstado === null) && this.elementos.fechaInicio === "" && this.elementos.fechaFin === "") {
      // return this.presentToast("Seleccione un parámetro de búsqueda");
      return this.consultarFacturas();
    }
    if(this.elementos.comFactura) {
      if(this.elementos.comFactura.trim() === "") {
        // this.elementos.comFactura = null;
        numero = null;
      }
    }else {
      // this.elementos.comFactura = null;
      numero = null;
    }
    if(this.elementos.comEstado === "") {
      // this.elementos.comEstado = null;
      estado = null;
    }
    if(this.elementos.fechaInicio === "") {
      // this.elementos.fechaInicio = '0001-01-01';
      fechai = '0001-01-01';
    }
    if(this.elementos.fechaFin === "") {
      // this.elementos.fechaFin = '0001-01-01';
      fechaf = '0001-01-01';
    }
    // this.traerFacturaNumeroEstadoFecha(this.elementos.comFactura,this.elementos.comEstado,this.elementos.fechaInicio,this.elementos.fechaFin);
    this.traerFacturaNumeroEstadoFecha(numero,estado,fechai,fechaf);
    /* if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado === "" && this.elementos.fechaInicio === "" && this.elementos.fechaFin === "") {
      return this.traerFacturaNumero(this.elementos.comFactura);
    }
    if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado !== "" && this.elementos.fechaInicio === "" && this.elementos.fechaFin === "") {
      return this.traerFacturaNumeroEstado(this.elementos.comFactura,this.elementos.comEstado);
    }
    if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado !== "" && this.elementos.fechaInicio !== "" && this.elementos.fechaFin !== "") {
      return this.traerFacturaNumeroEstadoFecha(this.elementos.comFactura,this.elementos.comEstado,this.elementos.fechaInicio,this.elementos.fechaFin);
    }else if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado !== "" && this.elementos.fechaInicio !== "" && this.elementos.fechaFin === "") {
      return this.presentToast("Seleccione una fecha final");
    }else if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado !== "" && this.elementos.fechaInicio === "" && this.elementos.fechaFin !== "") {
      return this.presentToast("Seleccione una fecha inicial");
    }else if(this.elementos.comFactura.trim() === "" && this.elementos.comEstado !== "" && this.elementos.fechaInicio !== "" && this.elementos.fechaFin !== "") {
      return this.presentToast("Ingrese un número de factura");
    }else if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado === "" && this.elementos.fechaInicio !== "" && this.elementos.fechaFin !== "") {
      return this.presentToast("Seleccione un estado");
    }else if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado === "" && this.elementos.fechaInicio === "" && this.elementos.fechaFin !== "") {
      return this.presentToast("Seleccione un estado y una fecha inicial");
    }else if(this.elementos.comFactura.trim() !== "" && this.elementos.comEstado === "" && this.elementos.fechaInicio !== "" && this.elementos.fechaFin === "") {
      return this.presentToast("Seleccione un estado y una fecha final");
    } */
  }

  async traerFacturaNumero(numeroFactura) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.elementoRespaldo.comFactura = this.elementos.comFactura;
    this.elementoRespaldo.comEstado = this.elementos.comEstado;
    this.elementoRespaldo.fechaInicio = this.elementos.fechaInicio;
    this.elementoRespaldo.fechaFin = this.elementos.fechaFin;
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    this.proveedor.body = {
      numero_factura: numeroFactura
      ,id_usuario: this.id_proveedor
    };
    this.proveedor.traerFacturaNumero().subscribe(
      async (res: ISoapMethodResponse) => {
        this.rows = [];
        this.rows = [...this.rows];
        if (res.result.Traer_Factura_PorNumeroResult) {
          let registros = res.result.Traer_Factura_PorNumeroResult.facturaCN;
          registros.forEach(ele => {
            this.rows.push({
              factura: ele.titulo
              ,estado: ele.estado
              ,fechaInicio: moment(ele.fecha_emision).format('YYYY-MM-DD')
              // ,fechaFin: moment(ele.fecha_emision).format('YYYY-MM-DD')
              ,ver: ele.id_factura
            });
          });
          this.rows = [...this.rows];
        }else {
          this.presentToast('No hay datos');
        }
        await loading.dismiss();
      }
      ,async (err) => {
        this.presentToast('Error de servidor');
        await loading.dismiss();
      }
    );
  }

  async traerFacturaNumeroEstado(numeroFactura,estado) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.elementoRespaldo.comFactura = this.elementos.comFactura;
    this.elementoRespaldo.comEstado = this.elementos.comEstado;
    this.elementoRespaldo.fechaInicio = this.elementos.fechaInicio;
    this.elementoRespaldo.fechaFin = this.elementos.fechaFin;
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    this.proveedor.body = {
      codigo_factura: numeroFactura
      ,estado: estado
      ,id_usuario: this.id_proveedor
    };
    this.proveedor.traerFacturaNumeroEstado().subscribe(
      async (res: ISoapMethodResponse) => {
        this.rows = [];
        this.rows = [...this.rows];
        if(res.result.Traer_Factura_PorNumero_EstadoResult) {
          let registros = res.result.Traer_Factura_PorNumero_EstadoResult.facturaCN;
          registros.forEach(ele => {
            this.rows.push({
              factura: ele.titulo
              ,estado: ele.estado
              ,fechaInicio: moment(ele.fecha_emision).format('YYYY-MM-DD')
              // ,fechaFin: moment(ele.fecha_emision).format('YYYY-MM-DD')
              ,ver: ele.id_factura
            });
          });
          this.rows = [...this.rows];
        }else {
          this.presentToast('No hay datos');
        }
        await loading.dismiss();
      }
      ,async (err) => {
        this.presentToast('Error de servidor');
        await loading.dismiss();
      }
    );
  }

  async traerFacturaNumeroEstadoFecha(numeroFactura,estado,fechaInicio,fechaFin) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.elementoRespaldo.comFactura = this.elementos.comFactura;
    this.elementoRespaldo.comEstado = this.elementos.comEstado;
    this.elementoRespaldo.fechaInicio = this.elementos.fechaInicio;
    this.elementoRespaldo.fechaFin = this.elementos.fechaFin;
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    this.proveedor.body = {
      codigo_factura: numeroFactura
      ,estado: estado
      ,fecha_inicio: moment(fechaInicio).format('YYYY-MM-DD')
      ,fecha_fin: moment(fechaFin).format('YYYY-MM-DD')
      ,id_usuario: this.id_proveedor
    };
    this.proveedor.traerFacturaNumeroEstadoFecha().subscribe(
      async (res: ISoapMethodResponse) => {
        // console.log(res)
        this.rows = [];
        this.rows = [...this.rows];
        // console.log(res)
        if(res.result.Traer_Factura_PorNumero_Estado_FechaResult) {
          // console.log(res);
          let registros = res.result.Traer_Factura_PorNumero_Estado_FechaResult.facturaCN;
          registros.forEach(ele => {
            this.rows.push({
              factura: ele.titulo
              ,estado: ele.estado
              ,fechaInicio: moment(ele.fecha_emision).format('YYYY-MM-DD')
              // ,fechaFin: moment(ele.fecha_emision).format('YYYY-MM-DD')
              ,ver: ele.id_factura
            });
          });
          this.rows = [...this.rows];
        }else {
          this.presentToast('No hay datos');
        }
        await loading.dismiss();
      }
      ,async (err) => {
        this.presentToast('Error de servidor');
        await loading.dismiss();
      }
    );
  }

  async VerFactura(idFactura) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    let idUsuario = this.id_proveedor;
    this.proveedor.body = {
      id_factura: idFactura
      ,id_usuario: idUsuario
    };
    this.proveedor.traerFactura().subscribe(
      async (res: ISoapMethodResponse) => {
        let dataUrl = 'data:application/octec-stream;charset=utf-8;base64,'+ res.result.Traer_facturaResult;
        fetch(dataUrl)
          .then(res => res.arrayBuffer())
          .then(buffer => {
            var file = new Blob([buffer], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          }
        );
        await loading.dismiss();
      },
      async (err) => {
        this.presentToast('No se puede mostrar archivo');
        await loading.dismiss();
      }
    );
  }

  valideKey(evt) {
    var code = (evt.which) ? evt.which : evt.keyCode;
    if (code == 8) {
      return true;
    }else if (code>=48 && code<=57) {
      return true;
    } else {
      return false;
    }
  }

  onPaste() {
    return false;
  }

  actualizarTabla() {
    if (this.elementoRespaldo.comFactura.trim() === "" && this.elementoRespaldo.comEstado === "" && this.elementoRespaldo.fechaInicio === "" && this.elementoRespaldo.fechaFin === "") {
      return true;
    }
    this.elementos.comFactura = null;
    this.elementos.comEstado = null;
    this.elementos.fechaInicio = null;
    this.elementos.fechaFin = null;
    this.consultarFacturas();
  }

  async consultarFacturas() {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.elementos.fechaInicio = moment().format('YYYY')+"-"+moment().format('MM')+"-01";
    this.elementos.fechaFin = moment().format('YYYY')+"-"+moment().format('MM')+"-30";

    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    let idPorveedor = this.id_proveedor;
    let mes = moment().format('MM');
    this.proveedor.body = {
      fecha: moment().format('YYYY'),
      id_usuario: idPorveedor
    };
    this.proveedor.traerFacturaAnio().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        this.rows = [];
        this.rows = [...this.rows];
        if (res.result.Traer_Factura_AnioResult) {
          let registros = res.result.Traer_Factura_AnioResult.facturaCN;
          registros.forEach(ele => {
            this.rows.push({
              factura: ele.titulo
              ,estado: ele.estado
              ,fechaInicio: moment(ele.fecha_emision).format('YYYY-MM-DD')
              // ,fechaFin: moment(ele.fecha_emision).format('YYYY-MM-DD')
              ,ver: ele.id_factura
            });
          });
          let filtroPorMes = _.filter(this.rows,ele => moment(ele.fecha_emision).format('MM') == mes);
          if (filtroPorMes.length === 0) {
            this.presentToast('No hay datos para este año y mes');
          }
          this.rows = filtroPorMes;
          this.rows = [...this.rows];
        }else {
          this.presentToast('No hay datos');
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