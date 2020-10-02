import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Options, Select2OptionData } from 'select2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ISoapMethodResponse } from 'ngx-soap';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-factura-detalle',
  templateUrl: './factura-detalle.page.html',
  styleUrls: ['./factura-detalle.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacturaDetallePage implements OnInit {
  elementos = {
    formato: ""
    ,total: ""
    ,descripcion: ""
    ,area: ""
  };
  atributosBoton = {
    textoBoton: "SUBIR FACTURA"
    ,disabledBoton: false
  };
  public archivoCargado;
  public totalArchivoCargado = 0;
  public tamanioArchivoCargado = 0;
  public cmbArea: Array<Select2OptionData>;
  public configSelect: Options;
  public filtroAnio;
  public cmbAnio = [];
  ColumnMode = ColumnMode;
  rows = [];
  id_proveedor;
  public configcleave = {
    delimiters: ['-', '-']
    ,blocks: [3,3,9]
  };
  public ultimofiltro = "";
  public filtroMes = "";
  public cmbMeses = [
    { id: "01", text: "Enero" }
    ,{ id: "02", text: "Febrero" }
    ,{ id: "03", text: "Marzo" }
    ,{ id: "04", text: "Abril" }
    ,{ id: "05", text: "Mayo" }
    ,{ id: "06", text: "Junio" }
    ,{ id: "07", text: "Julio" }
    ,{ id: "08", text: "Agosto" }
    ,{ id: "09", text: "Septiembre" }
    ,{ id: "10", text: "Octubre" }
    ,{ id: "11", text: "Noviembre" }
    ,{ id: "12", text: "Diciembre" }
  ];
  public respaldoConsultaFactura = [];

  constructor(
    public toast: ToastController
    ,private proveedorServicio: ProveedorService
    ,private encrdecr:EncrDecrServiceService
    ,public alertController: AlertController
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
    try {
      setTimeout(() => {
        this.traerAreas();
        this.filtroAnio = moment().format('YYYY');
        this.filtroMes = moment().format('MM');
        this.consultarFacturaProveedorAnio();
      },1000);
    } catch (error) {
      return this.presentToast('Por favor vuelva a recargar la página');
    }
    this.generadorAnios();
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async subirFactura() {
    let extension = null;
    let tamanioEstandar = 2000000;
    if (this.elementos.formato == "") {
      return this.presentToast("Seleccione un archivo");
    }else {
      extension = this.getFileExtension(this.elementos.formato);
      if(extension !== "PDF" && extension !== "pdf") {
        return this.presentToast("Seleccione un archivo PDF");
      }else if(this.tamanioArchivoCargado > tamanioEstandar) {
        return this.presentToast("El archivo no puede exceder de los 2MB");
      }
    }
    if (this.elementos.total.trim() == "") {
      return this.presentToast("Ingrese el número de factura");
    }else if(this.elementos.total.length < 17) {
      return this.presentToast("El formato del número de factura no es correcto");
    }
    if (this.elementos.descripcion.trim() == "") {
      return this.presentToast("Ingrese una descripción");
    }
    if (this.elementos.area == "" || this.elementos.area == null) {
      return this.presentToast("Seleccione el Área de servicio");
    }

    const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Está seguro de subir la factura?',
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
          handler: async () => {
            const loading = await this.loadingController.create({ message: 'Cargando...' });
            await loading.present();
            this.atributosBoton.disabledBoton = true;
            this.atributosBoton.textoBoton = "Espere ..."
            let archivo = this.archivoCargado;
            let reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onload = () => {
              let archivoByte = reader.result;
              archivoByte = archivoByte.toString();
              archivoByte = archivoByte.slice(28,archivoByte.length);
              this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
              this.proveedorServicio.body = {
                archivo: archivoByte
                ,extension: ".pdf"
                ,numero_facura: this.elementos.total
                ,descripcion: this.elementos.descripcion
                ,codigo_departamento: this.elementos.area
                ,id_usuario: this.id_proveedor
              };
              this.proveedorServicio.guardarFactura().subscribe(
                async (res: ISoapMethodResponse) => {
                  this.atributosBoton.disabledBoton = false;
                  this.atributosBoton.textoBoton = "SUBIR FACTURA";
                  if(res) {
                    if(res.result) {
                      if(res.result.Insertar_factura_fisicaResult) {
                        this.presentToast(res.header.Mensaje+' - '+res.header.Error);
                        if(parseInt(res.result.Insertar_factura_fisicaResult) !== 0) {
                          this.elementos = {
                            formato: ""
                            ,total: ""
                            ,descripcion: ""
                            ,area: ""
                          };
                          this.archivoCargado = null;
                          this.totalArchivoCargado = 0;
                          this.tamanioArchivoCargado = 0;
                          this.filtroAnio = moment().format('YYYY');
                          this.filtroMes = moment().format('MM');
                          this.consultarFacturaProveedorAnio();
                        }
                      }else {
                        this.presentToast('Error de servidor');
                      }
                    }else {
                      this.presentToast('Error de servidor');
                    }
                  }else {
                    this.presentToast('Error de servidor');
                  }
                  await loading.dismiss();
                }
                ,async (err) => {
                  this.presentToast('Error de servidor');
                  this.atributosBoton.disabledBoton = false;
                  this.atributosBoton.textoBoton = "SUBIR FACTURA"
                  await loading.dismiss();
                }
              );
            };
          }
        }
      ]
    });
    await alert.present();
  }

  traerAreas() {
    this.proveedorServicio.traerAreas().subscribe(
      (res: ISoapMethodResponse) => {
        let areas = res.result.Traer_departamentosResult.departamentoCN;
        this.cmbArea = [];
        areas.forEach(ele => {
          this.cmbArea.push({id: ele.codigo, text: ele.nombre});
        });
      }
      ,err=> this.presentToast('Error de servidor')
    );
  }

  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  cargaArchivo(archivo) {
    this.archivoCargado = archivo[0];
    this.totalArchivoCargado = archivo.length;
    this.tamanioArchivoCargado = archivo[0].size;
  }

  consultarFacturaProveedorId(idFactura) {
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    let idPorveedor = this.id_proveedor;
    this.proveedorServicio.body = {
      id_factura: idFactura,
      id_usuario: idPorveedor
    };
    this.proveedorServicio.traerFactura().subscribe(
      (res: ISoapMethodResponse) => {
        console.log(res);
      }
      , err => this.presentToast('Error de servidor')
    );
  }

  async consultarFacturaProveedorAnio() {
    if (this.filtroAnio === undefined || this.filtroAnio === null) {
      return this.presentToast('Seleccione un Año');
    }else if (this.filtroAnio.trim() === "") {
      return this.presentToast('Seleccione un Año');
    }
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.ultimofiltro = this.filtroAnio;
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    let idPorveedor = this.id_proveedor;
    /* this.proveedorServicio.body = {
      fecha: this.filtroAnio,
      id_usuario: idPorveedor
    }; */
    let mes1 = "01-01";
    let mes2 = "12-31";
    if (this.filtroMes !== "" && this.filtroMes !== null) {
      mes1 = `${this.filtroMes}-01`;
      mes2 = `${this.filtroMes}-${moment(this.filtroAnio+'-'+this.filtroMes+'-01').endOf('month').format('DD')}`;
    }
    this.proveedorServicio.body = {
      codigo_factura: null
      ,estado: null
      ,fecha_inicio: moment(`${this.filtroAnio}-${mes1}`).format('YYYY-MM-DD')
      ,fecha_fin: moment(`${this.filtroAnio}-${mes2}`).format('YYYY-MM-DD')
      ,id_usuario: idPorveedor
    };
    // this.proveedorServicio.traerFacturaAnio().subscribe(
    this.proveedorServicio.traerFacturaNumeroEstadoFecha().subscribe(
      async (res: ISoapMethodResponse) => {
        this.rows = [];
        this.rows = [...this.rows];
        if (res) {
          // console.log(res);
          if(res.result) {
            if (res.result.Traer_Factura_PorNumero_Estado_FechaResult) {
              if (res.result.Traer_Factura_PorNumero_Estado_FechaResult.facturaCN) {
                let registros = res.result.Traer_Factura_PorNumero_Estado_FechaResult.facturaCN;
                registros.forEach(ele => {
                  this.rows.push({
                    fecha: moment(ele.fecha_emision).format('YYYY-MM-DD')
                    ,factura: ele.titulo
                    ,descripcion: ele.descripcion
                    ,total: ele.total
                    ,ver: ele.id_factura
                    ,mes: moment(ele.fecha_emision).format('MM')
                  });
                });
                /* if (this.filtroMes !== "" && this.filtroMes !== null) {
                  let filtroPorMes = _.filter(this.rows,ele => ele.mes == this.filtroMes);
                  if (filtroPorMes.length === 0) {
                    this.presentToast('No hay datos para este año y mes');
                  }
                  this.rows = filtroPorMes;
                } */
                this.rows = [...this.rows];
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

  async VerFactura(idFactura) {
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    let idUsuario = this.id_proveedor;
    this.proveedorServicio.body = {
      id_factura: idFactura
      ,id_usuario: idUsuario
    };
    this.proveedorServicio.traerFactura().subscribe(
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

  async eliminarFactura(idFactura) {
    const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: '¿Está seguro de eliminar la factura?',
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
          handler: async () => {
            const loading = await this.loadingController.create({ message: 'Cargando...' });
            await loading.present();
            this.id_proveedor =  this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
            let idUsuario = this.id_proveedor;
            this.proveedorServicio.body = {
              id_factura: idFactura
              ,id_usuario: idUsuario
            };
            this.proveedorServicio.eliminarFactura().subscribe(
              async (res: ISoapMethodResponse) => {
                if (res) {
                  if(res.header) {
                    if(res.header.Mensaje) {
                      this.presentToast(res.header.Mensaje+' - '+res.header.Error);
                      if(this.ultimofiltro !== "") {
                        this.filtroAnio = this.ultimofiltro;
                        this.consultarFacturaProveedorAnio();
                      }
                    }else {
                      this.presentToast('Error de Servidor');
                    }
                  }else {
                    this.presentToast('Error de Servidor');
                  }
                }else {
                  this.presentToast('Error de Servidor');
                }
                await loading.dismiss();
              },
              async (err) => {
                this.presentToast('No se puede eliminar archivo');
                await loading.dismiss();
              }
            );
          }
        }
      ]
    });
    await alert.present();
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
    let anio = this.ultimofiltro;
    if (this.ultimofiltro === "") {
      anio = moment().format('YYYY');
    }
    this.filtroAnio = anio;
    this.consultarFacturaProveedorAnio();
  }

  generadorAnios() {
    let desde = 2010;
    let hasta = parseInt(moment().format('YYYY'));
    for (let index = hasta; index >= desde; index--) {
      this.cmbAnio.push({id: index,text: index});
    }
  }
}