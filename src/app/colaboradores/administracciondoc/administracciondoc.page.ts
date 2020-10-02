import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Options } from 'select2';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ISoapMethodResponse } from 'ngx-soap';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-administracciondoc',
  templateUrl: './administracciondoc.page.html',
  styleUrls: ['./administracciondoc.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdministracciondocPage implements OnInit {

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

  ColumnMode = ColumnMode;
  editing = {};
  rows = [];
  public configSelect: Options;
  elementos: any = {
    mes: moment().format('YYYY-MM-DD')
    ,numeroFactura: ''
    ,codigoBarco: ''
    ,nombreBarco: ''
    ,banderaBarco: ''
    ,numeroRegistroInternacional: ''
    ,codigoImo: ''
    ,codigoLicencia: ''
    ,codigoSanco: ''
    ,fechaVenceLicencia: ''
    ,codigoSenae: ''
    ,codigoBue: ''
    ,id_barco: ''
    ,archivo: {}
  };
  dataTipoBarco = [];
  dataNumeroFactura = [];
  arregloGeneral = [];
  public archivoCargado = {};
  public totalArchivoCargado = {};
  public tamanioArchivoCargado = {};
  public extenciones = {};
  public idFilas = {};
  public idFiles = [];
  public idActualizables = [];
  public idActualizablesRespaldo = [];

  ngOnInit() {
    setTimeout(() => {
      this.traerResumenCompra();
    },1000);
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async traerResumenCompra() {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    if (this.elementos.mes === "" || this.elementos.mes === null || this.elementos.mes === undefined) {
      await loading.dismiss();
      return this.presentToast('Seleccione fecha');
    }
    this.colaborador.body = {
      fecha: moment(this.elementos.mes).format('YYYY-MM-DD')
    };
    this.colaborador.Traer_resumen_compra_mes_anio().subscribe(
      async (res: ISoapMethodResponse) => {
        // traer Resumen Compra
        console.log(res);
        this.dataNumeroFactura = [];
        this.arregloGeneral = [];
        if (res) {
          if (res.result) {
            if (res.result.Traer_resumen_compra_mes_anioResult) {
              if(res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN) {
                let datos = await res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN;
                this.arregloGeneral = datos;
                let tempo = [];
                datos.forEach(ele => {
                  tempo.push(
                    { 
                      id: ele.informacion_compra_mp.id_compra_mp
                      ,text: `Cod. compra: ${ele.informacion_compra_mp.codigo_compra_mp} - Barco: ${ele.informacion_compra_mp.nombre_barco} - Viaje: ${ele.informacion_compra_mp.numero_viaje}`
                      // ,text: ele.informacion_compra_mp.id_compra_mp
                    }
                  );
                });
                this.dataNumeroFactura = tempo;
              } else {
                this.presentToast('No hay datos');
              }
            } else {
              this.presentToast('No hay datos');
            }
          } else {
            this.presentToast('No hay datos');
          }
        } else {
          this.presentToast('No hay datos');
        }
        await loading.dismiss();
      },async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    )
  }

  async datosCompra() {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    if (this.elementos.numeroFactura === null || this.elementos.numeroFactura === "" || this.elementos.numeroFactura === undefined) {
      this.elementos.codigoBarco = "";
      this.elementos.nombreBarco = "";
      this.elementos.banderaBarco = "";
      this.elementos.numeroRegistroInternacional = "";
      this.elementos.codigoImo = "";
      this.elementos.codigoLicencia = "";
      this.elementos.codigoSanco = "";
      this.elementos.fechaVenceLicencia = "";
      this.elementos.codigoSenae = "";
      this.elementos.codigoBue = "";
      this.elementos.id_barco = "";
      this.rows = [];
      await loading.dismiss();
      return false;
    }
    let bandera = 0;
    this.colaborador.body = {
      id_compra_mp: this.elementos.numeroFactura
    };
    this.colaborador.barcoTraerCompraDomus().subscribe(
      async (res: ISoapMethodResponse) => {
        this.compraTraer(this.elementos.numeroFactura);
        if (res) {
          if (res.result) {
            if (res.result.Barco_traer_por_compra_domusResult) {
              let datos = res.result.Barco_traer_por_compra_domusResult;
              this.elementos.codigoBarco = datos.codigo_barco;
              let filtro = _.filter(this.arregloGeneral, ele => parseInt(ele.informacion_compra_mp.id_compra_mp) === parseInt(this.elementos.numeroFactura));
              if (filtro.length) {
                this.elementos.nombreBarco = filtro[0].informacion_compra_mp.nombre_barco;
              }else {
                this.elementos.nombreBarco = "";
              }
              this.elementos.banderaBarco = datos.codigo_bandera;
              this.elementos.numeroRegistroInternacional = datos.no_registro;
              this.elementos.codigoImo = datos.codigo_imo;
              this.elementos.codigoLicencia = datos.no_licencia;
              this.elementos.codigoSanco = datos.codigo_sanco;
              if (datos.venc_licencia) {
                if (moment(datos.venc_licencia).format('YYYY-MM-DD') === '1753-01-01') {
                  this.elementos.fechaVenceLicencia = "";
                }else {
                  this.elementos.fechaVenceLicencia = moment(datos.venc_licencia).format('YYYY-MM-DD');
                }
              } else {
                this.elementos.fechaVenceLicencia = "";
              }
              this.elementos.codigoSenae = "";
              this.elementos.codigoBue = "";
              this.elementos.id_barco = datos.id_barco;
            } else {
              bandera = 1;
              this.presentToast('No hay datos');
            }
          } else {
            bandera = 1;
            this.presentToast('No hay datos');
          }
        } else {
          bandera = 1;
          this.presentToast('No hay datos');
        }
        if (bandera === 1) {
          this.elementos.codigoBarco = "";
          this.elementos.nombreBarco = "";
          this.elementos.banderaBarco = "";
          this.elementos.numeroRegistroInternacional = "";
          this.elementos.codigoImo = "";
          this.elementos.codigoLicencia = "";
          this.elementos.codigoSanco = "";
          this.elementos.fechaVenceLicencia = "";
          this.elementos.codigoSenae = "";
          this.elementos.codigoBue = "";
          this.elementos.id_barco = "";
        }
        await loading.dismiss();
        this.compraTraerDocumentos();
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }

  async modificarBarco() {
    if (this.elementos.numeroRegistroInternacional === null || this.elementos.numeroRegistroInternacional === "" || this.elementos.numeroRegistroInternacional === undefined) {
      return this.presentToast('Ingrese el número de registro internacional');
    }
    if (this.elementos.codigoImo === null || this.elementos.codigoImo === "" || this.elementos.codigoImo === undefined) {
      return this.presentToast('Ingrese el código IMO');
    }
    if (this.elementos.codigoLicencia === null || this.elementos.codigoLicencia === "" || this.elementos.codigoLicencia === undefined) {
      return this.presentToast('Ingrese la licencia');
    }
    if (this.elementos.codigoSanco === null || this.elementos.codigoSanco === "" || this.elementos.codigoSanco === undefined) {
      return this.presentToast('Ingrese el código SANCO');
    }
    if (this.elementos.fechaVenceLicencia === null || this.elementos.fechaVenceLicencia === "" || this.elementos.fechaVenceLicencia === undefined) {
      return this.presentToast('Ingrese la fecha de vencimiento de la licencia');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    let barco = {
      codigo_bandera: this.elementos.banderaBarco
      ,codigo_barco: this.elementos.codigoBarco
      ,codigo_imo: this.elementos.codigoImo
      ,codigo_sanco: this.elementos.codigoSanco
      ,id_barco: this.elementos.id_barco
      ,no_licencia: this.elementos.codigoLicencia
      ,no_registro: this.elementos.numeroRegistroInternacional
      ,venc_licencia: this.elementos.fechaVenceLicencia
    };
    this.colaborador.body = {
      barco
      ,id_compra_mp: this.elementos.numeroFactura
      ,codigo_bue: this.elementos.codigoBue
      ,codigo_senae: this.elementos.codigoSenae
      ,id_usuario
    };
    this.colaborador.barcoModificar().subscribe(
      async (res: ISoapMethodResponse) => {
        if (res) {
          if (res.header) {
            let mensaje = res.header.Mensaje;
            let status = res.header.Error;
            this.presentToast(`${status} - ${mensaje}`);
          } else {
            this.presentToast('No se pudo actualizar');
          }
        } else {
          this.presentToast('No se pudo actualizar');
        }
        await loading.dismiss();
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }

  async notificarCompra() {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    // let correos =  JSON.stringify(["cjama@tecopesca.com","jamacarmen@outlook.com"]);
    let correos =  JSON.stringify([]);
    this.colaborador.body = {
      id_compra_mp: this.elementos.numeroFactura
      ,notificacion_observaciones: true
      ,id_usuario
      ,ls_correo_adicional: correos
    };
    this.colaborador.compraNotificarObservaciones().subscribe(
      async (res: ISoapMethodResponse) => {
        console.log(res);
        if (res) {
          if (res.header) {
            let mensaje = res.header.Mensaje;
            let status = res.header.Error;
            this.presentToast(`${status} - ${mensaje}`);
          } else {
            this.presentToast('No se pudo notificar');
          }
        } else {
          this.presentToast('No se pudo notificar');
        }
        await loading.dismiss();
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }

  async compraTraerDocumentos() {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.rows = [];
    this.colaborador.compraTraerDocumentos().subscribe(
      async (res: ISoapMethodResponse) => {
        if (res) {
          if (res.result) {
            if (res.result.Compra_taer_documentosResult) {
              if (res.result.Compra_taer_documentosResult.resumen_documento_mpCN) {
                let data = res.result.Compra_taer_documentosResult.resumen_documento_mpCN;
                let tempo = [];
                data.forEach(elemento => {
                  let obs = "sd";
                  if (elemento.observacion.trim() !== "") obs = elemento.observacion;
                  tempo.push(
                    {
                      estado: { estado: elemento.estado, color: elemento.color_etiqueta }
                      ,nomenclatura: elemento.nomenclatura
                      ,nombre: elemento.nombre
                      ,observacion: obs
                      ,accion: { id: elemento.id_det_doc_compra_mp, idFile: 'idFila'+elemento.id_det_doc_compra_mp }
                    }
                  );
                });
                this.rows = tempo;
              } else {
                this.presentToast('No hay datos');
              }
            } else {
              this.presentToast('No hay datos');
            }
          } else {
            this.presentToast('No hay datos');
          }
        } else {
          this.presentToast('No hay datos');
        }
        await loading.dismiss();
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor al traer datos de la tabla');
      }
    );
  }

  llamarFile(id) {
    document.getElementById(id).click();
  }

  cargaArchivo(archivo,idElement,id) {
    this.archivoCargado[idElement] = archivo[0];
    this.totalArchivoCargado[idElement] = archivo.length;
    this.tamanioArchivoCargado[idElement] = archivo[0].size;
    this.idFilas[idElement] = id;
    this.extenciones[idElement] = this.getFileExtension(this.elementos.archivo[idElement]);
    this.idFiles.push(idElement);
  }

  async sincronizarDoc() {
    let bandera = 0;
    let bandera2 = 0;
    const tamanioEstandar  = 2000000;
    for (let extension in this.extenciones) {
      let extencionObjeto = this.extenciones[extension];
      if (extencionObjeto !== 'pdf' && extencionObjeto !== 'PDF') {
        bandera = 1;
      }
      let tamanio = this.tamanioArchivoCargado[extension];
      if (tamanio > (tamanioEstandar)) {
        bandera2 = 1;
      }
    }
    if (bandera === 1) {
      return this.presentToast('Todos los archivos seleccionados deben de ser pdf');
    }else if (bandera2 === 1) {
      return this.presentToast('Todos los archivos seleccionados deben tener 2MB o menos');
    }
    const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Está seguro de sincronizar todos los documentos?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {}
        }, {
          text: 'Aceptar',
          handler: () => {
            this.subirDocumentosMasivo();
          }
        }
      ]
    });
    await alert.present();
  }

  async subirDocumentosMasivo() {
    const idUsuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    for (let i = 0; i < this.idFiles.length; i++) {
      let peticion = await this.adjuntarDocumentos(idUsuario,this.idFiles[i]);
      this.presentToast(peticion);
    }
    this.presentToast('Transacción finalizada');
    this.datosCompra();
    this.archivoCargado = {};
    this.totalArchivoCargado = {};
    this.tamanioArchivoCargado = {};
    this.idFilas = {};
    this.extenciones = {};
    this.idFiles = [];
    return await loading.dismiss();
  }

  adjuntarDocumentos(id_usuario,claveDoc) {
    return new Promise((resolve, eject) => {
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoCargado[claveDoc]);
      reader.onload = () => {
        let archivoByte = reader.result;
        archivoByte = archivoByte.toString();
        archivoByte = archivoByte.slice(28,archivoByte.length);
        this.colaborador.body = {
          id_det_documento: this.idFilas[claveDoc]
          ,archivo: archivoByte
          ,extencion: this.extenciones[claveDoc]
          ,id_usuario
        };
        let datoFila = _.filter(this.rows,el => parseInt(el.accion.id) === parseInt(this.idFilas[claveDoc]));
        let documento = "";
        if (datoFila.length) documento=datoFila[0].nombre
        this.colaborador.adjuntarDocumento().subscribe(
          (res : ISoapMethodResponse) => {
            // console.log(res);
            resolve(`${res.header.Mensaje} - ${res.header.Error}. "${documento}"`);
          }
          ,(err) => {
            eject('No se pudo guardar archivo para: "'+documento+'"');
          }
        );
      }
    });
  }

  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  async documentoTraer(id_det_documento) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaborador.body = {
      id_det_documento
    };
    this.colaborador.documentoTraer().subscribe(
      async (res: ISoapMethodResponse) => {
        // console.log(res);
        if (res.result.Documento_traerResult.extencion === 'pdf' || res.result.Documento_traerResult.extencion === '.pdf' || res.result.Documento_traerResult.extencion === '.PDF' || res.result.Documento_traerResult.extencion === 'PDF') {
          let dataUrl = 'data:application/octec-stream;charset=utf-8;base64,'+ res.result.Documento_traerResult.archivo;
          fetch(dataUrl)
            .then(res => res.arrayBuffer())
            .then(buffer => {
              var file = new Blob([buffer], { type: 'application/pdf' });
              var fileURL = URL.createObjectURL(file);
              window.open(fileURL);
            }
          );
        } else if (res.result.Documento_traerResult.extencion === '') {
          this.presentToast(`${res.header.Error} - ${res.header.Mensaje} - No hay archivo en el sistema`);
        }
        await loading.dismiss();
      },
      async (err) => {
        this.presentToast('No se puede mostrar archivo');
        await loading.dismiss();
      }
    );
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    let nuevoValor = event.target.value;
    let valorAnterior = this.rows[rowIndex].observacion;
    let idFila = this.rows[rowIndex].accion.id;
    if (nuevoValor !== valorAnterior) {
      this.rows[rowIndex].observacion = nuevoValor;
      this.idActualizables.push({ id: idFila, observacion: nuevoValor });
      this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
      this.rows = [...this.rows];
    }
  }

  modificarDocumento(id_usuario,idDoc,observacion) {
    return new Promise((resolve, eject) => {
      this.colaborador.body = {
        id_det_doc_compra_mp: idDoc
        ,observacion
        ,id_usuario
      };
      this.colaborador.documentoModificar().subscribe(
        (res : ISoapMethodResponse) => {
          resolve(`${res.header.Mensaje} - ${res.header.Error}`);
        }
        ,(err) => {
          eject('Error de servicio');
        }
      );
    });
  }

  async modificarDocMasivo() {
    const idUsuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    for (let i = 0; i < this.idActualizables.length; i++) {
      let peticion = await this.modificarDocumento(idUsuario,this.idActualizables[i].id,this.idActualizables[i].observacion);
      this.presentToast(peticion);
    }
    this.presentToast('Transacción finalizada');
    this.idActualizables = [];
    await loading.dismiss();
    this.subirDocumentosMasivo();
    this.actualizarTabla();
  }

  async confirmarModDocumento() {
    /* const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Está seguro de actualizar todos los documentos?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {}
        }, {
          text: 'Aceptar',
          handler: () => { */
            let bandera = 0;
            let bandera2 = 0;
            const tamanioEstandar  = 2000000;
            for (let extension in this.extenciones) {
              let extencionObjeto = this.extenciones[extension];
              if (extencionObjeto !== 'pdf' && extencionObjeto !== 'PDF') {
                bandera = 1;
              }
              let tamanio = this.tamanioArchivoCargado[extension];
              if (tamanio > (tamanioEstandar)) {
                bandera2 = 1;
              }
            }
            if (bandera === 1) {
              return this.presentToast('Todos los archivos seleccionados deben de ser pdf');
            }else if (bandera2 === 1) {
              return this.presentToast('Todos los archivos seleccionados deben tener 2MB o menos');
            }
            this.modificarDocMasivo();
          /* }
        }
      ]
    });
    await alert.present(); */
  }

  actualizarTabla() {
    if (this.elementos.numeroFactura === '' || this.elementos.numeroFactura === null || this.elementos.numeroFactura === undefined) {
      return this.presentToast('Seleccione número de compra');
    }
    this.colaborador.body = { id_compra_mp: this.elementos.numeroFactura };
    return this.compraTraerDocumentos();
  }

  cancelarEdicion() {
    if (this.idActualizablesRespaldo.length) {
      for (let i = 0; i < this.idActualizablesRespaldo.length; i++) {
        this.rows[this.idActualizablesRespaldo[i].indexFila].observacion = this.idActualizablesRespaldo[i].observacion;
      }
      this.rows = [...this.rows];
      this.idActualizablesRespaldo = [];
    }
    let inputsArchivos = document.querySelectorAll('[type="file"]');
    for (let i = 0; i < inputsArchivos.length; i++) {
      inputsArchivos[i]["value"] = "";
    }
    this.archivoCargado = {};
    this.totalArchivoCargado = {};
    this.tamanioArchivoCargado = {};
    this.extenciones = {};
    this.idFiles = [];
  }

  compraTraer(id_compra_mp) {
    this.colaborador.body = { id_compra_mp };
    this.colaborador.Compra_traer().subscribe(
      (res : ISoapMethodResponse) => {
        if (res) {
          if (res.result) {
            if (res.result.Compra_traerResult) {
              this.elementos.codigoBue = res.result.Compra_traerResult.codigo_bue;
              this.elementos.codigoSenae = res.result.Compra_traerResult.codigo_senae;
            }
          }
        }
      }
      ,err => err
    );
  }

  getCellClass(obj): any {
    let color = obj.row.estado.color;
    let classCelda = ' celdaColor-'+obj.row.accion.id;
    let classCelda2 = 'celdaColor-'+obj.row.accion.id;
    let celdaObjeto = document.getElementsByClassName(classCelda2);
    setTimeout(() => {
      if (celdaObjeto.length) {
        for (let i = 0; i < celdaObjeto.length; i++) {
          let celda = celdaObjeto[i];
          celda['style'].backgroundColor = color;
        }
      }
    },500);
    return classCelda;
  }

  async sincronizar2c() {
    let noCompra = this.elementos.numeroFactura;
    if (noCompra === '' || noCompra === null || noCompra === undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    const idUsuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    this.colaborador.body = {
      id_compra_mp: noCompra
      ,id_usuario: idUsuario
    };
    this.colaborador.sincronizarDocumentos().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        this.presentToast(`${res.header.Error} - ${res.header.Mensaje}`);
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    );
  }
}
