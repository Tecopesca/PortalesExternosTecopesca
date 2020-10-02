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
  selector: 'app-armadormp',
  templateUrl: './armadormp.page.html',
  styleUrls: ['./armadormp.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArmadormpPage implements OnInit {
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
  dataTodos = [
    { id: 'SI', text: 'SI' }
    ,{ id: 'NO', text: 'NO' }
  ];
  dataAsignacion = [
    { id: 'Monto', text: 'Monto' }
    ,{ id: '%', text: '%' }
  ];
  dataEspecie = [];
  dataTalla = [];
  dataTallaO = [];

  ngOnInit() {
    setTimeout(
      () => {
        this.especieTraer();
        this.traerTalla();
        this.compraTraerResumen();

        this.asignacionGasto2();
        this.cargosVariosTraer2();
        this.compraTraerResumen2();
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
    this.dataTalla = [];
    this.rows = [...this.rows];
    let fecha = moment(this.elementos.fecha).format('YYYY-MM-DD');
    this.colaborador.body = { fecha };
    this.colaborador.compraTraerResumen().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        // this.compraTraerResumen2();
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

  async traerEspecies() {
    if (this.elementos.nomCompra === null || this.elementos.nomCompra == "" || this.elementos.nomCompra === undefined) {
      this.rows = [];
      return false;
    }
    this.dinamico = [];
    this.dataTalla = [];
    this.rows = [...this.rows];
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaborador.body = { id_compra_mp: this.elementos.nomCompra };
    this.colaborador.especieTallaArmadorTraer().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        this.traerDetalleCompra2();
        this.rows = [];
        if (res) {
          if (res.result) {
            if (res.result.Especie_talla_armador_traerResult) {
              if (res.result.Especie_talla_armador_traerResult.resumen_especie_talla_armadorCN) {
                let datos = res.result.Especie_talla_armador_traerResult.resumen_especie_talla_armadorCN;
                let tempo = [];
                datos.forEach(el => {
                  let todos = 'NO';
                  if (el.todos) todos = 'SI';
                  tempo.push(
                    {
                      id_especie_talla_armador: el.id_especie_talla_armador
                      ,id_compra_mp: el.id_compra_mp
                      ,especie: { text: el.nombre_especie, neo: false, editando: false, textAlt: el.nombre_especie, idEspecie: el.id_especie }
                      ,tallaO: { text: el.nombre_talla, neo: false, editando: false, textAlt: el.nombre_talla, id_talla: el.id_talla }
                      ,talla: { text: el.agrupacion_talla, neo: false, editando: false, textAlt: el.agrupacion_talla }
                      ,todos: { text: todos, neo: false, editando: false, textAlt: todos }
                      ,valor: { text: el.valor, neo: false, editando: false, textAlt: el.valor }
                      ,asignacion: { text: el.asignacion, neo: false, editando: false, textAlt: el.asignacion }
                      ,observaciones: { text: el.observacion, neo: false, editando: false, textAlt: el.observacion }
                      ,eliminar: '-'
                      ,modificado: false
                    }
                  );
                  let temp = {};
                  temp['especie'] = el.id_especie;
                  temp['tallaO'] = el.id_talla;
                  temp['talla'] = el.agrupacion_talla;
                  temp['todos'] = el.todos ? 'SI' : 'NO';
                  temp['asignacion'] = el.asignacion;
                  this.dinamico.push(temp);
                  this.dataTalla.push([]);
                });
                this.rows = tempo;
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

  agregarFila() {
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra === undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    this.rows.unshift(
      {
        id_especie_talla_armador: 0
        ,id_compra_mp: this.elementos.nomCompra
        ,especie: { text: "", neo: true, editando: false, textAlt: "", idEspecie: null }
        ,tallaO: { text: "", neo: true, editando: false, textAlt: "", id_talla: null }
        ,talla: { text: "", neo: true, editando: false, textAlt: "" }
        ,todos: { text: "", neo: true, editando: false, textAlt: "" }
        ,valor: { text: "", neo: true, editando: false, textAlt: "" }
        ,asignacion: { text: "", neo: true, editando: false, textAlt: "" }
        ,observaciones: { text: "", neo: true, editando: false, textAlt: "" }
        ,eliminar: '-'
        ,modificado: true
      }
    );
    let temp = {};
    temp['especie'] = "";
    temp['tallaO'] = "";
    temp['talla'] = "";
    temp['todos'] = "";
    temp['asignacion'] = "";
    this.dinamico.unshift(temp);
    this.dataTalla.unshift([]);
    this.rows = [...this.rows];
  }

  habilitarEdicion(indiceFila,columna,esNuevo) {
    this.rows[indiceFila][columna].editando = true;
    this.rows = [...this.rows];
    if (!esNuevo) {
      if (!this.dataTalla[indiceFila].length) {
        let especieSeleccionada = this.rows[indiceFila].especie;
        this.agrupacionTallaTraer(especieSeleccionada.text,indiceFila);
      }
    }
  }

  actualizarValoresFila(event,indiceFila,columna) {
    let nuevoValor = event.target.value;
    if (nuevoValor === "" || nuevoValor === null || nuevoValor === undefined) nuevoValor = '';
    this.rows[indiceFila][columna].editando = false;
    this.rows[indiceFila][columna].text = nuevoValor;
    this.rows[indiceFila].modificado = true;
    if (columna === 'valor') {
      let todos = this.rows[indiceFila]['todos'].text;
      if (todos === 'SI') {
        this.rows[indiceFila][columna].text = '';
      }
    }
    this.rows = [...this.rows];
  }

  actualizarValoresFila2(indiceFila,columna) {
    let nuevoValor = this.dinamico[indiceFila][columna];
    if (nuevoValor === "" || nuevoValor === null || nuevoValor === undefined) nuevoValor = '';
    this.rows[indiceFila][columna].editando = false;
    this.rows[indiceFila][columna].text = nuevoValor;
    this.rows[indiceFila].modificado = true;
    if (nuevoValor !== '') {
      if (columna === 'especie') {
        this.rows[indiceFila][columna].idEspecie = nuevoValor === '' ? 0 : nuevoValor;
        let seleccionado = _.filter(this.dataEspecie, el => parseInt(el.id) === parseInt(nuevoValor));
        if (seleccionado !== null && seleccionado !== undefined && seleccionado !== "") {
          if (seleccionado.length) {
            this.rows[indiceFila][columna].textAlt = seleccionado[0].text;
            this.rows[indiceFila][columna].text = seleccionado[0].text;
            this.agrupacionTallaTraer(seleccionado[0].text,indiceFila);
            this.dinamico[indiceFila]['talla'] = '';
            this.rows[indiceFila]['talla'].text = '';
            this.rows[indiceFila]['talla'].textAlt = '';
          }
        }
      } else if (columna === 'talla') {
        let seleccionado = _.filter(this.dataTalla[indiceFila], el => parseInt(el.id) === parseInt(nuevoValor));
        if (seleccionado) {
          this.rows[indiceFila][columna].textAlt = seleccionado[0].text;
        }
        this.dinamico[indiceFila]['tallaO'] = '';
        this.rows[indiceFila]['tallaO'].text = '';
        this.rows[indiceFila]['tallaO'].textAlt = '';
      } else if (columna === 'tallaO') {
        let seleccionado = _.filter(this.dataTallaO, el => parseInt(el.id) === parseInt(nuevoValor));
        this.rows[indiceFila][columna].id_talla = nuevoValor === '' ? 0 : nuevoValor;
        if (seleccionado) {
          this.rows[indiceFila][columna].text = seleccionado[0].text;
          this.rows[indiceFila][columna].textAlt = seleccionado[0].text;
        }
        this.dinamico[indiceFila]['talla'] = '';
        this.rows[indiceFila]['talla'].text = '';
        this.rows[indiceFila]['talla'].textAlt = '';
      } else if (columna === 'asignacion') {
        let valorTodo = this.rows[indiceFila]['todos'].text;
        if (valorTodo === 'SI') {
          this.rows[indiceFila][columna].textAlt = '';
          this.rows[indiceFila][columna].text = '';
        }else {
          this.rows[indiceFila][columna].textAlt = nuevoValor;
          this.rows[indiceFila][columna].text = nuevoValor;
        }
      } else if (columna === 'todos') {
        if (nuevoValor === 'SI') {
          this.rows[indiceFila]['asignacion'].textAlt = '';
          this.rows[indiceFila]['asignacion'].text = '';
          this.rows[indiceFila]['valor'].textAlt = '';
          this.rows[indiceFila]['valor'].text = '';
        }
      }
    } else {
      this.rows[indiceFila][columna].textAlt = nuevoValor;
    }
    this.rows = [...this.rows];
  }

  especieTraer() {
    this.colaborador.body = {};
    this.colaborador.especieTraer().subscribe(
      (res: ISoapMethodResponse) => {
        if (res) {
          if (res.result) {
            if (res.result.Especie_traerResult) {
              if (res.result.Especie_traerResult.especieCN) {
                let data = res.result.Especie_traerResult.especieCN;
                data.forEach(el => {
                  this.dataEspecie.push(
                    {
                      id: el.id_especie
                      ,text: el.homologacionax
                    }
                  );
                });
              } else {
                this.presentToast('Sin Especies');
              }
            } else {
              this.presentToast('Sin Especies');
            }
          } else {
            this.presentToast('Sin Especies');
          }
        } else {
          this.presentToast('Sin Especies');
        }
      }
      ,err => err
    );
  }

  traerTalla() {
    this.colaborador.body = {};
    this.colaborador.tallaTraer().subscribe(
      (res: ISoapMethodResponse) => {
        if (res) {
          if (res.result) {
            if (res.result.Talla_traerResult) {
              if (res.result.Talla_traerResult.tallaCN) {
                let data = res.result.Talla_traerResult.tallaCN;
                let temp = [];
                data.forEach(el => {
                  temp.push(
                    {
                      id: el.id_talla
                      ,text: el.nombre
                    }
                  );
                });
                this.dataTallaO = temp;
              } else {}
            } else {}
          } else {}
        } else {}
      }
      ,err => err
    );
  }

  async agrupacionTallaTraer(especie,idrow) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaborador.body = {
      id_compra_mp:  this.elementos.nomCompra
      ,especie
    }
    this.colaborador.agrupacionTallaTraer().subscribe(
      async (res: ISoapMethodResponse) => {
        await loading.dismiss();
        if(res) {
          if (res.result) {
            if (res.result.Agrupacion_talla_traerResult) {
              if(res.result.Agrupacion_talla_traerResult.string) {
                let datos = res.result.Agrupacion_talla_traerResult.string;
                let temp = [];
                for (let i = 0; i < datos.length; i++) {
                  const valor = datos[i];
                  temp.push(
                    {
                      id: valor
                      ,text: valor
                    }
                  );
                }
                this.dataTalla[idrow] = temp;
              } else {
                this.presentToast('Sin Tallas');
              }
            } else {
              this.presentToast('Sin Tallas');
            }
          } else {
            this.presentToast('Sin Tallas');
          }
        } else {
          this.presentToast('Sin Tallas');
        }
      }
      ,async (err) => {
        await loading.dismiss();
        this.presentToast('Error de servidor');
      }
    )
  }

  async cancelarInsercionModificacion() {
    /* const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Desea cancelar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => { */
            let datosOriginales = _.filter(this.rows, ele => ele.especie.neo === false);
            this.rows = datosOriginales;
            this.dataTalla = [];
          /* }
        }
      ]
    });
    await alert.present(); */
  }

  async guardarArmadorMasivo() {
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra === undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    let id_usuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    let filasNuevas = _.filter(this.rows, el => el.modificado === true);
    if (!filasNuevas.length) {
      await loading.dismiss();
      return this.presentToast('No hay nada para modificar o insertar');
    }
    /* Validacion de todos los campos de cada fila */
      let banderaValidacion = 0;
      for (let i = 0; i < filasNuevas.length; i++) {
        let fila = filasNuevas[i];
        let especie = fila.especie.idEspecie;
        let todos = fila.todos.text;
        if (especie === '' || especie === null || especie === undefined || especie == 0 || especie === '-') {
          banderaValidacion = 1;
        }else if (todos === '' || todos === null || todos === undefined || todos == 0 || todos === '-') {
          banderaValidacion = 1;
        }else if (todos === 'NO') {
          let asignacion = fila.asignacion.text;
          let valor = fila.valor.text;
          if (asignacion === '' || asignacion === '-' || asignacion === null || asignacion === undefined) {
            banderaValidacion = 3;
          }else if (asignacion === 'Monto') {
            if (isNaN(valor)) {
              banderaValidacion = 6;
            }else if (parseFloat(valor) < 0) {
              banderaValidacion = 4;
            }
          }else if (asignacion === '%') {
            if (isNaN(valor)) {
              banderaValidacion = 6;
            }else if (parseFloat(valor) < 0 || parseFloat(valor) > 99) {
              banderaValidacion = 5;
            }
          }
        }else {
          // debe seleccionar una de dos o la talla o la agrupacion
          let talla = fila.tallaO.id_talla;
          let agrupacion = fila.talla.text;
          if ((talla === '' || talla === '-' || talla === null || talla === undefined || talla == 0) && (agrupacion === '' || agrupacion === '-' || agrupacion === null || agrupacion === undefined || agrupacion == 0)) {
            banderaValidacion = 2;
          }
        }
      }
      if (banderaValidacion >= 1) {
        await loading.dismiss();
      }
      if (banderaValidacion === 1) return this.presentToast('Debe de seleccionar una especie y la columna "Todos"');
      if (banderaValidacion === 2) return this.presentToast('Debe de seleccionar una talla o una agrupación de talla');
      if (banderaValidacion === 3) return this.presentToast('Cuando la columna "Todos" es "NO" debe seleccionar una asignación');
      if (banderaValidacion === 4) return this.presentToast('Debe de ingresar un monto correcto');
      if (banderaValidacion === 5) return this.presentToast('El porcentaje no puede ser mayor a 99 ni meno a 0');
      if (banderaValidacion === 6) return this.presentToast('El valor debe de ser numérico');
    /* Fin */
    let bandera = 0;
    let mensajesErr = [];
    let mensajesSuc = [];
    for (let i = 0; i < filasNuevas.length; i++) {
      const dato = filasNuevas[i];
      let peticion = await this.guardarArmadorUnitario(dato,id_usuario);
      // console.log(peticion);
      if (peticion[0] === false) {
        bandera = 1;
        if (peticion[1] !== false) {
          mensajesErr.push(peticion[1]);
        }
      } else {
        mensajesSuc.push(peticion[1]);
      }
    }
    if (bandera === 1) {
      if (mensajesErr.length) {
        this.presentToast(`${mensajesErr[0].Mensaje} - ${mensajesErr[0].Error}`);
      } else {
        this.presentToast('Algunos datos no se pudieron guardar o actualizar');
      }
    } else {
      this.presentToast(`Datos guardados con éxito`);
    }
    return await loading.dismiss();
  }

  guardarArmadorUnitario(datos, id_usuario) {
    return new Promise((resolve,eject) => {
      let agrupacion_talla = datos.talla.text;
      if (agrupacion_talla === '-' || agrupacion_talla === '' || agrupacion_talla === null || agrupacion_talla === undefined) agrupacion_talla = '';
      let asignacion = datos.asignacion.text;
      if (asignacion === '-' || asignacion === '' || asignacion === null || asignacion === undefined) asignacion = '';
      let id_talla = datos.tallaO.id_talla;
      if (id_talla === '-' || id_talla === '' || id_talla === null || id_talla === undefined) {id_talla = 0;} else {id_talla = parseInt(id_talla);}
      let nombre_talla = datos.tallaO.textAlt;
      if (nombre_talla === '-' || nombre_talla === '' || nombre_talla === null || nombre_talla === undefined) nombre_talla = '';
      let numeroMetodo = datos.especie.neo ? 16 : 17;
      console.log(datos.especie.neo);
      console.log(numeroMetodo);
      this.colaborador.body = {
        clase: {
          agrupacion_talla
          ,asignacion
          ,id_compra_mp: parseInt(datos.id_compra_mp)
          ,id_especie: parseInt(datos.especie.idEspecie)
          ,id_especie_talla_armador: parseInt(datos.id_especie_talla_armador)
          ,id_talla
          ,nombre_especie: datos.especie.textAlt
          ,nombre_talla
          ,observacion: datos.observaciones.text === '-' ? '' : datos.observaciones.text
          ,todos: datos.todos.text === 'SI' ? true : false
          ,valor: datos.valor.text === '' ? 0 : datos.valor.text
        }
        ,id_usuario
      };
      console.log(this.colaborador.body);
      this.colaborador.especieTallaArmadorInsertarModificar(numeroMetodo).subscribe(
        (res: ISoapMethodResponse) => {
          console.log(res);
          let response = numeroMetodo === 16 ? 'Especie_talla_armador_insertarResult' : 'Especie_talla_armador_modificarResult';
          if (res) {
            if (res.result) {
              if (res.result[response]) {
                resolve([res.result[response],res.header]);
              } else {
                resolve([false,res.header]);
              }
            } else {
              resolve([false,res.header]);
            }
          } else {
            resolve([false,false]);
          }
        }
        ,(err) => {
          eject([false,false]);
        }
      );
    });
  }

  async guardarArmador() {
    /* const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Está seguro de insertar o actualizar los datos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => { */
            this.guardarArmadorMasivo();
          /* }
        }
      ]
    });
    await alert.present(); */
  }

  async eliminarFila(indiceFila) {
    /* const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Está seguro de eliminar esta fila?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => { */
            const loading = await this.loadingController.create({ message: 'Cargando...' });
            await loading.present();
            let id_especie_talla_armador = this.rows[indiceFila].id_especie_talla_armador;
            this.colaborador.body = { id_especie_talla_armador };
            this.colaborador.especieTallaArmadorEliminar().subscribe(
              async (res: ISoapMethodResponse) => {
                await loading.dismiss();
                if (res) {
                  let eliminado = res.result.Especie_talla_armador_eliminarResult;
                  if (eliminado) {
                    this.presentToast(`${res.header.Mensaje} - ${res.header.Error} - Eliminado con éxito`);
                    this.traerEspecies();
                  } else {
                    this.presentToast(`${res.header.Mensaje} - ${res.header.Error}`);
                  }
                } else {
                  this.presentToast('No se eliminaron los datos');
                }
              }
              ,async err => {
                await loading.dismiss();
                return this.presentToast('Error de Servidor');
              }
            );
          /* }
        }
      ]
    });
    await alert.present(); */
  }

  elementos2: any = {
    nomCompra: ""
    ,fecha: moment().format('YYYY-MM-DD')
  };

  dinamico2 = [];
  dataNomCompra2 = [];
  dataAsignacion2 = [];
  dataServicio2 = [];
  filasInicialesRespaldadas2 = [];
  rows2 = [];

  async compraTraerResumen2() {
    if (this.elementos2.fecha === "" || this.elementos2.fecha === null || this.elementos2.fecha === undefined) {
      return false;
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.dinamico2 = [];
    this.rows2 = [...this.rows2];
    let fecha = moment(this.elementos2.fecha).format('YYYY-MM-DD');
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
                this.dataNomCompra2 = tempo;
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

  traerDetalleCompra2() {
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra == undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    this.colaborador.body = {
      id_compra_mp: this.elementos.nomCompra
    };
    this.colaborador.cargosVariosPagoPorCompra().subscribe(
      (res: ISoapMethodResponse) => {
        this.dinamico2 = [];
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
            let nombreServicio = _.filter(this.dataServicio2,ele => ele.id === el.id_agrupacion_cargos_varios);
            if (nombreServicio.length) {
              nombreServicio = nombreServicio[0].text;
            } else {
              nombreServicio = '-'
            }
            let nombreAsig = _.filter(this.dataAsignacion2,ele => parseInt(ele.id) === parseInt(el.asignacion_gasto));
            if (nombreAsig.length) {
              nombreAsig = nombreAsig[0].text;
            } else {
              nombreAsig = '-'
            }
            tempo.push({
              asignacion: { text: nombreAsig, id: el.asignacion_gasto, neo: false , editando: false }
              ,servicio: { text: nombreServicio, id: el.id_agrupacion_cargos_varios, neo: false , editando: false }
              ,valor: { text: el.valor, id: el.valor, neo: false , editando: false }
              ,observacion: { text: el.observacion, id: el.observacion, neo: false , editando: false }
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
            this.dinamico2.push(temp);
          });
          this.rows2 = tempo;
          this.filasInicialesRespaldadas2 = tempo;
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensajeAdicional}`);
      }
      ,(err) => {
        this.presentToast('Error de servidor');
      }
    );
  }

  asignacionGasto2() {
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
          this.dataAsignacion2 = tempo;
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
      }
      ,(err) => {
        this.presentToast('Error de servidor');
      }
    );
  }

  habilitarEdicion2(indiceFila,columna,esNuevo) {
    this.rows2[indiceFila][columna].editando = true;
    this.rows2 = [...this.rows2];
  }

  cargosVariosTraer2() {
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
          this.dataServicio2 = tempo;
        }
        this.presentToast(`${res.header.Mensaje} - ${res.header.Error}${mensaje}`);
      }
      ,(err) => {
        this.presentToast('Error de servidor');
      }
    );
  }

  actualizarValoresFila3(indiceFila,columna) {
    let nuevoValor = this.dinamico2[indiceFila][columna];
    if (nuevoValor === "" || nuevoValor === null || nuevoValor === undefined) nuevoValor = '';
    this.rows2[indiceFila][columna].editando = false;
    this.rows2[indiceFila].modificado = true;
    if (columna === 'asignacion') {
      let nombreAsignacion = _.filter(this.dataAsignacion2,ele => parseInt(ele.id) === parseInt(nuevoValor));
      if (nombreAsignacion.length) {
        nombreAsignacion = nombreAsignacion[0].text;
      } else {
        nombreAsignacion = ''
      }
      this.rows2[indiceFila][columna].id = nuevoValor;
      this.rows2[indiceFila][columna].text = nombreAsignacion;
    }else if (columna === 'servicio') {
      let nombreServicio = _.filter(this.dataServicio2,ele => parseInt(ele.id) === parseInt(nuevoValor))
      if (nombreServicio.length) {
        nombreServicio = nombreServicio[0].text;
      } else {
        nombreServicio = ''
      }
      this.rows2[indiceFila][columna].id = nuevoValor;
      this.rows2[indiceFila][columna].text = nombreServicio;
    }else {
      this.rows2[indiceFila][columna].id = nuevoValor;
      this.rows2[indiceFila][columna].text = nuevoValor;
    }
    this.rows2 = [...this.rows2];
  }

  agregarFila2() {
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra === undefined) {
      return this.presentToast('Seleccione un número de compra');
    }
    this.rows2.unshift(
      {
        asignacion: { text: '', id: 0, neo: true , editando: false }
        ,servicio: { text: '', id: 0, neo: true , editando: false }
        ,valor: { text: '', id: 0, neo: true , editando: false }
        ,observacion: { text: '', id: '', neo: true , editando: false }
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
    this.dinamico2.unshift(temp);
    this.rows2 = [...this.rows2];
  }

  cancelarInsercionModificacion2() {
    let temporal = _.filter(this.filasInicialesRespaldadas2,el => el.asignacion.neo === false);
    this.dinamico2 = [];
    this.rows2 = [];
    temporal.forEach(el => {
      let temp = {};
      temp['asignacion'] = el.asignacion.id;
      temp['servicio'] = el.servicio.id;
      temp['valor'] = el.valor.text;
      temp['observacion'] = el.observacion.text;
      this.dinamico2.push(temp);
    });
    this.rows2 = temporal;
  }

  guardarUnitario2(dato,id_usuario) {
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
      // console.log(this.colaborador.body);
      this.colaborador.cargosVariosInsertar().subscribe(
        (res: ISoapMethodResponse) => {
          let mensaje = `${res.header.Error} - ${res.header.Mensaje}`;
          resolve([mensaje,res.result.Cargos_varios_insertarResult]);
        }
        ,(err) => {
          eject(err);
        }
      );
    });

  }

  modificarUnitario2(dato,id_usuario) {
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
      // console.log(this.colaborador.body);
      this.colaborador.cargosVariosModificar().subscribe(
        (res: ISoapMethodResponse) => {
          let mensaje = `${res.header.Error} - ${res.header.Mensaje}`;
          resolve([mensaje,res.result.Cargos_varios_modificarResult]);
        }
        ,(err) => {
          eject(err);
        }
      );
    });
  }

  async guardarModificarMasivo2() {
    let filasActualizarGuardar = _.filter(this.rows2, el => el.modificado === true);
    if (!filasActualizarGuardar.length) {
      return this.presentToast('No hay datos para modificar');
    }
    if (this.elementos.nomCompra === '' || this.elementos.nomCompra === null || this.elementos.nomCompra === undefined) {
      return this.presentToast('Seleccione un numero de compra');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    let bandera = 0;
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
        promesa = await this.guardarUnitario2(datoEnviar,id_usuario);
      } else {
        promesa = await this.modificarUnitario2(datoEnviar,id_usuario);
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