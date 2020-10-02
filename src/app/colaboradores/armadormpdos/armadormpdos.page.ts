import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Options } from 'select2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ISoapMethodResponse } from 'ngx-soap';
import { ColaboradorService } from '../../servicios/colaborador.service'
import * as moment from 'moment';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-armadormpdos',
  templateUrl: './armadormpdos.page.html',
  styleUrls: ['./armadormpdos.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArmadormpdosPage implements OnInit {
  public configSelect: Options;
  ColumnMode = ColumnMode;
  rows = [];

  constructor(
    private colaborador: ColaboradorService
    ,public toast: ToastController
    ,public loadingController: LoadingController
    ,private encrdecr:EncrDecrServiceService
    ,public alertController: AlertController
  ) {
    this.configSelect = {
      language: {
        noResults: () => "Resultados no encontrados"
      }
      ,width: '100%'
    };
  }

  elementos: any = {
    nomCompra: ""
    ,fecha: moment().format('YYYY-MM-DD')
  };

  dinamico = [];
  dataNomCompra = [];
  dataAsignacion = [];
  dataServicio = [];
  filasInicialesRespaldadas = [];

  ngOnInit() {
    setTimeout(
      () => {
        this.asignacionGasto();
        this.cargosVariosTraer();
        this.compraTraerResumen();
      }
      ,1000
    );
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async compraTraerResumen() {
    if (this.elementos.fecha === "" || this.elementos.fecha === null || this.elementos.fecha === undefined) {
      return false;
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.dinamico = [];
    this.rows = [...this.rows];
    let fecha = moment(this.elementos.fecha).format('YYYY-MM-DD');
    this.colaborador.body = { fecha };
    this.colaborador.compraTraerResumen().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        if (res) {
          if (res.result) {
            if (res.result.Compra_mp_traer_resumenResult) {
              if (res.result.Compra_mp_traer_resumenResult.resumen_compra_mpCN.length) {
                let datos = res.result.Compra_mp_traer_resumenResult.resumen_compra_mpCN;
                let tempo = [];
                datos.forEach(el => {
                  tempo.push({
                    id: el.id_compra_mp
                    ,text: `Cod. compra: ${el.codigo_compra_mp} - Barco: ${el.nombre_barco} - Viaje: ${el.numero_viaje}`
                  });
                });
                this.dataNomCompra = tempo;
              } else {
                this.presentToast(`${res.header.Mensaje} - ${res.header.Error} - Sin datos`);
              }
            } else {
              this.presentToast(`${res.header.Mensaje} - ${res.header.Error} - Sin datos`);
            }
          } else {
            this.presentToast(`${res.header.Mensaje} - ${res.header.Error} - Sin datos`);
          }
        } else {
          this.presentToast(`${res.header.Mensaje} - ${res.header.Error} - Sin datos`);
        }
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }

  traerDetalleCompra() {
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra == undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    this.colaborador.body = {
      id_compra_mp: this.elementos.nomCompra
    };
    this.colaborador.cargosVariosPagoPorCompra().subscribe(
      (res: ISoapMethodResponse) => {
        console.log(res);
        this.dinamico = [];
        let datos = [];
        let mensajeAdicional = '';
        if (res) {
          if (res.result) {
            if (res.result.Cargos_varios_pago_por_compraResult) {
              if (res.result.Cargos_varios_pago_por_compraResult.resumen_cargos_variosCN) {
                datos = res.result.Cargos_varios_pago_por_compraResult.resumen_cargos_variosCN;
              }
            }
          }
        }
        if (!datos.length) {
          mensajeAdicional = ' - No hay datos';
        } else {
          let tempo = [];
          datos.forEach(el => {
            let nombreServicio = _.filter(this.dataServicio,ele => ele.id === el.id_agrupacion_cargos_varios);
            if (nombreServicio.length) {
              nombreServicio = nombreServicio[0].text;
            } else {
              nombreServicio = '-'
            }
            let nombreAsig = _.filter(this.dataAsignacion,ele => parseInt(ele.id) === parseInt(el.asignacion_gasto));
            if (nombreAsig.length) {
              nombreAsig = nombreAsig[0].text;
            } else {
              nombreAsig = '-'
            }
            tempo.push({
              asignacion: { text: nombreAsig, id: el.asignacion_gasto, neo: false , editando: false }
              ,servicio: { text: nombreServicio, id: el.id_agrupacion_cargos_varios, neo: false , editando: false }
              ,valor: { text: el.valor, id: el.valor, neo: false , editando: false }
              ,observacion: { text: el.observacion === '' ? '-' : el.observacion, id: el.observacion, neo: false , editando: false }
              ,modificado: false
              // ,id_agrupacion_cargos_varios: el.id_cargos_varios
              ,id_agrupacion_cargos_varios: el.id_agrupacion_cargos_varios
              ,id_cargos_varios: el.id_cargos_varios
            });
            let temp = {};
            temp['asignacion'] = el.asignacion_gasto;
            temp['servicio'] = el.id_agrupacion_cargos_varios;
            temp['valor'] = el.valor;
            temp['observacion'] = el.observacion;
            this.dinamico.push(temp);
          });
          this.rows = tempo;
          this.filasInicialesRespaldadas = tempo;
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensajeAdicional}`);
      }
      ,(err) => {
        this.presentToast('Error de servidor');
      }
    );
  }

  asignacionGasto() {
    this.colaborador.body = {};
    this.colaborador.asignacionGastoTraer().subscribe(
      (res: ISoapMethodResponse) => {
        let datos = [];
        if (res) {
          if (res.result) {
            if (res.result.Asignacion_gasto_traerResult) {
              if (res.result.Asignacion_gasto_traerResult.genericaCN) {
                datos = res.result.Asignacion_gasto_traerResult.genericaCN;
              }
            }
          }
        }
        let mensaje = '';
        if (!datos.length) {
          mensaje = ' - No hay datos';
        } else {
          let tempo = [];
          datos.forEach(el => {
            tempo.push(
              {
                id: el.codigo
                ,text: el.descripcion
              }
            );
          });
          this.dataAsignacion = tempo;
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
      }
      ,(err) => {
        this.presentToast('Error de servidor');
      }
    );
  }

  habilitarEdicion(indiceFila,columna,esNuevo) {
    this.rows[indiceFila][columna].editando = true;
    this.rows = [...this.rows];
    /* if (!esNuevo) {
      if (!this.dataTalla[indiceFila].length) {
        let especieSeleccionada = this.rows[indiceFila].especie;
        this.agrupacionTallaTraer(especieSeleccionada.text,indiceFila);
      }
    } */
  }

  cargosVariosTraer() {
    this.colaborador.body = {};
    this.colaborador.agrupacionCargosVariosTraer().subscribe(
      (res: ISoapMethodResponse) => {
        let datos = [];
        if (res) {
          if (res.result) {
            if (res.result.Agrupacion_cargos_varios_traerResult) {
              if (res.result.Agrupacion_cargos_varios_traerResult.agrupacion_cargos_variosCN) {
                datos = res.result.Agrupacion_cargos_varios_traerResult.agrupacion_cargos_variosCN;
              }
            }
          }
        }
        let mensaje = '';
        if (!datos.length) {
          mensaje = ' - No hay datos';
        } else {
          let tempo = [];
          datos.forEach(el => {
            tempo.push(
              {
                id: el.id_agrupacion_cargos_varios
                ,text: el.nombre
              }
            );
          });
          this.dataServicio = tempo;
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
      }
      ,(err) => {
        this.presentToast('Error de servidor');
      }
    );
  }

  actualizarValoresFila(indiceFila,columna) {
    let nuevoValor = this.dinamico[indiceFila][columna];
    if (nuevoValor === "" || nuevoValor === null || nuevoValor === undefined) nuevoValor = '-';
    this.rows[indiceFila][columna].editando = false;
    this.rows[indiceFila].modificado = true;
    if (columna === 'asignacion') {
      let nombreAsignacion = _.filter(this.dataAsignacion,ele => parseInt(ele.id) === parseInt(nuevoValor));
      if (nombreAsignacion.length) {
        nombreAsignacion = nombreAsignacion[0].text;
      } else {
        nombreAsignacion = '-'
      }
      this.rows[indiceFila][columna].id = nuevoValor;
      this.rows[indiceFila][columna].text = nombreAsignacion;
    }else if (columna === 'servicio') {
      let nombreServicio = _.filter(this.dataServicio,ele => parseInt(ele.id) === parseInt(nuevoValor))
      if (nombreServicio.length) {
        nombreServicio = nombreServicio[0].text;
      } else {
        nombreServicio = '-'
      }
      this.rows[indiceFila][columna].id = nuevoValor;
      this.rows[indiceFila][columna].text = nombreServicio;
    }else {
      this.rows[indiceFila][columna].id = nuevoValor;
      this.rows[indiceFila][columna].text = nuevoValor;
    }
    this.rows = [...this.rows];
  }

  agregarFila() {
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra === undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    this.rows.unshift(
      {
        asignacion: { text: '-', id: 0, neo: true , editando: false }
        ,servicio: { text: '-', id: 0, neo: true , editando: false }
        ,valor: { text: 0, id: 0, neo: true , editando: false }
        ,observacion: { text: '-', id: '-', neo: true , editando: false }
        ,modificado: true
        ,id_agrupacion_cargos_varios: null
        ,id_cargos_varios: 0
      }
    );
    let temp = {};
    temp['asignacion'] = '';
    temp['servicio'] = '';
    temp['valor'] = '';
    temp['observacion'] = '';
    this.dinamico.unshift(temp);
    this.rows = [...this.rows];
  }

  cancelarInsercionModificacion() {
    let temporal = _.filter(this.filasInicialesRespaldadas,el => el.asignacion.neo === false);
    this.dinamico = [];
    this.rows = [];
    temporal.forEach(el => {
      let temp = {};
      temp['asignacion'] = el.asignacion.id;
      temp['servicio'] = el.servicio.id;
      temp['valor'] = el.valor.text;
      temp['observacion'] = el.observacion.text;
      this.dinamico.push(temp);
    });
    this.rows = temporal;
  }

  guardarUnitario(dato,id_usuario) {
    return new Promise((resolve,eject) => {
      this.colaborador.body = {
        clase: {
          asignacion_gasto: dato.asignacion_gasto
          ,id_agrupacion_cargos_varios: dato.id_agrupacion_cargos_varios
          ,id_cargos_varios: dato.id_cargos_varios
          ,id_compra_mp: dato.id_compra_mp
          ,nombre_asignacion_gasto: dato.nombre_asignacion_gasto
          ,observacion: dato.observacion
          ,valor: dato.valor
        }
        ,id_usuario
      };
      console.log(this.colaborador.body);
      this.colaborador.cargosVariosInsertar().subscribe(
        (res: ISoapMethodResponse) => {
          console.log(res);
          let mensaje = `${res.header.Error} - ${res.header.Mensaje}`;
          resolve([mensaje,res.result.Cargos_varios_insertarResult]);
        }
        ,(err) => {
          eject(err);
        }
      );
    });

  }

  modificarUnitario(dato,id_usuario) {
    return new Promise((resolve,eject) => {
      this.colaborador.body = {
        clase: {
          asignacion_gasto: dato.asignacion_gasto
          ,id_agrupacion_cargos_varios: dato.id_agrupacion_cargos_varios
          ,id_cargos_varios: dato.id_cargos_varios
          ,id_compra_mp: dato.id_compra_mp
          ,nombre_asignacion_gasto: dato.nombre_asignacion_gasto
          ,observacion: dato.observacion
          ,valor: dato.valor
        }
        ,id_usuario
      };
      console.log(this.colaborador.body);
      this.colaborador.cargosVariosModificar().subscribe(
        (res: ISoapMethodResponse) => {
          console.log(res);
          let mensaje = `${res.header.Error} - ${res.header.Mensaje}`;
          resolve([mensaje,res.result.Cargos_varios_modificarResult]);
        }
        ,(err) => {
          eject(err);
        }
      );
    });
  }

  async guardarModificarMasivo() {
    let filasActualizarGuardar = _.filter(this.rows, el => el.modificado === true);
    if (!filasActualizarGuardar.length) {
      return this.presentToast('No hay datos para modificar');
    }
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra === undefined) {
      return this.presentToast('Seleccione un numero de compra');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    let bandera = 0;
    console.log(filasActualizarGuardar);
    for (let i = 0; i < filasActualizarGuardar.length; i++) {
      const el = filasActualizarGuardar[i];
      if (el.asignacion.id === null || el.asignacion.id === '' || el.asignacion.id === '-') {bandera = 1;}
      if (el.servicio.id === 0 || el.servicio.id === '' || el.servicio.id === '-') {bandera = 1;}
      if (el.valor.id < 0 || el.valor.id === '' || el.valor.id === '-') {bandera = 1;}
    }
    if (bandera === 1) {
      await loading.dismiss();
      return this.presentToast('Debe de escoger la asignación de gasto, el tipo de servicio y ubicar un valor en todas las filas que desea insertar o modificar');
    }
    let banderaAlgunosNo = 0;
    for (let i = 0; i < filasActualizarGuardar.length; i++) {
      const fila = filasActualizarGuardar[i];
      let esNuevo = fila.asignacion.neo;
      let promesa = null;
      let datoEnviar = {
        asignacion_gasto: fila.asignacion.id
        ,id_agrupacion_cargos_varios: !fila.id_agrupacion_cargos_varios ? fila.servicio.id : fila.id_agrupacion_cargos_varios
        ,id_cargos_varios: fila.id_cargos_varios
        ,id_compra_mp: this.elementos.nomCompra
        ,nombre_asignacion_gasto: fila.asignacion.text
        ,observacion: fila.observacion.id
        ,valor: fila.valor.id
      };
      let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
      if (esNuevo) {
        promesa = await this.guardarUnitario(datoEnviar,id_usuario);
      } else {
        promesa = await this.modificarUnitario(datoEnviar,id_usuario);
      }
      if (!promesa[1]) {
        banderaAlgunosNo = 1;
      }
      this.presentToast(promesa[0]);
    }
    await loading.dismiss();
    setTimeout(() => {
      if (banderaAlgunosNo === 1) {
        this.presentToast('Algunos registros no pudieron guardarse o actualizarse');
      }
    },1000);
  }
}
