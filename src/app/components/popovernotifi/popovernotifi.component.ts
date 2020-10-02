import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ToastController ,LoadingController} from '@ionic/angular';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { ISoapMethodResponse } from 'ngx-soap';
import { PopoverController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { truncate } from 'fs';
import { Options } from 'select2';

@Component({
  selector: 'app-popovernotifi',
  templateUrl: './popovernotifi.component.html',
  styleUrls: ['./popovernotifi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopovernotifiComponent implements OnInit {
  elementos = {
    formato: "",
    provedor:"",
    viaje:"",
    materia:"",
    fecha:"",
    peso:"",
    unidad:"",
    barco:"",
    observacion:""
     };
     public isError = false;
      items11 = [];
      public options: Options;

     public archivoCargado;
  public totalArchivoCargado = 0;
  public tamanioArchivoCargado = 0;

  constructor(
    private colaboradoServicio: ColaboradorService,
    public toast: ToastController
    ,public loadingController: LoadingController
    ,private navParams: NavParams
    ,private encrdecr:EncrDecrServiceService
    ,private popoverController: PopoverController

  ) {this.options = {
    language: {
      noResults: () => "Resultados no encontrados"     
    }
    ,width: '100%'
  }
}

  ngOnInit() {
    this.elementos.provedor= this.navParams.get('page').nombre_proveedor;
       this.elementos.barco= this.navParams.get('page').nombre_barco;
       this.elementos.viaje= this.navParams.get('page').numero_viaje;
       this.elementos.materia= this.navParams.get('page').nombre_materia_prima;
       this.elementos.fecha=  moment(this.navParams.get('page').fecha_llegada).format('YYYY-MM-DD');
       this.elementos.peso= this.navParams.get('page').peso_estimado;
       this.search();
       this.peso();
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  cargaArchivo(archivo) { 
    console.log(archivo)
    this.archivoCargado = archivo[0];
    console.log(this.archivoCargado)
    this.totalArchivoCargado = archivo.length;
    this.tamanioArchivoCargado = archivo[0].size/1024;
   // console.log(this.tamanioArchivoCargado)
    if(this.tamanioArchivoCargado >(1024*4)){
      this.archivoCargado =null;
      this.totalArchivoCargado=0;
      this.tamanioArchivoCargado=0;
      this.elementos.formato="";
      return this.presentToast("El archivo no puede exceder de los 4MB");
      
    }
  }

  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  async  notificar(){
    let extension = null;
      
 
    if (this.elementos.formato == "") {
      return this.presentToast("Seleccione un archivo");
    }else{
      extension = this.getFileExtension(this.elementos.formato);
      //console.log(extension)
      if((extension == "JPG" || extension == "jpg") || (extension == "PDF" || extension == "pdf") || (extension == "XLSX" || extension == "xlsx") || (extension == "PNG" || extension == "png")  || (extension == "DOCX" || extension == "docx")  || (extension == "PPTX" || extension == "pptx") || (extension == "JPEG " || extension == "jpeg" ))  {
        this.Notificar_bread_down(this.elementos,extension);
      }
      else if(this.tamanioArchivoCargado > (1024*4)) {
        return this.presentToast("El archivo no puede exceder de los 4MB");
      }else{
        return this.presentToast("Formato permitidos: PDF,PPTX,DOCX,JPEG,XLSX,PNG ");

      }

    } 


  }

  async search(){

 // console.log(this.navParams.get('page'))

    this.colaboradoServicio.body = {
      id_compra_mp:this.navParams.get('page').id_compra_mp
    };
    
    
    this.colaboradoServicio.Traer_requisitos().subscribe(
      async   (res: ISoapMethodResponse) => { 
       //console.log(res)
       // console.log(resp);
      
       let resp = res.result
  
        if(resp){
                 if(resp.Traer_requisitosResult.resumen_requisitoCN){
                  
                   
                //  if(this.isError){
                 //   this.notificar();
                //   }
                //     else{
                      this.presentToast('Completar los campos de observacion');
                //     }

                     this.isError=true;
                 }else{
                  this.presentToast('Sin observaciones');
                //  this.notificar();
                 }
                 
             }else {
              this.presentToast('Sin observaciones');
             // this.notificar();
             }
           
        }
      ,(err) => { 
        this.presentToast('Error de servidor');
      }
    );

  }

  async Notificar_bread_down(ele,ex){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
 await loading.present();
    let archivo = this.archivoCargado;
    console.log(archivo)
    let reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = () => {
      let archivoByte = reader.result;
      console.log(reader.result)

      archivoByte = archivoByte.toString();
     // archivoByte = archivoByte.slice(28,archivoByte.length);
       
     // console.log(archivoByte)
      var splits = archivoByte.split("base64,");
      console.log(splits)
      // archivoByte = archivoByte.replace(" ", "+");
     // var b= archivoByte.length%4;

   //   if(b!=0){

   //   for(var i=0; i < b; i++){
    //    archivoByte+="=";
   //     }

    //  }
//
      this.colaboradoServicio.body = {
        id_compra_mp:this.navParams.get('page').id_compra_mp,
        archivo: splits[1]
        ,extencion: "."+ex
        ,observacion: ele.observacion
        ,fecha_llegada:ele.fecha
        ,peso_estimado: ele.peso
        ,unidad_peso: ele.unidad
        //,aprobar_con_observacion: ''
        //,detalle_aprobar_con_observacion:''
        ,id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
      };

      this.colaboradoServicio.Notificar_bread_down().subscribe(
        async (res: ISoapMethodResponse) => {
          if(res) {
            //console.log(res)
            if(res.result) {
          //   console.log(res.result)
              if(res.result.Notificar_bread_downResult) {
                this.presentToast('Notificado correctamente');
                await this.popoverController.dismiss();
              }else {
                this.presentToast(res.header.Mensaje);
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
          await loading.dismiss();
          this.presentToast('Error de servidor');
         
        }
      );
    };

     

  }

  peso(){
    this.items11 = [];
    this.items11 = [...this.items11];
    this.items11.push({id:"kg",text:"Kg"});
    this.items11.push({id:"tm",text:"tm"});
    this.items11 = [...this.items11];
    this.elementos.unidad= this.navParams.get('page').unidad_peso_estimado;


  }
  
}
