import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Options } from 'select2';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { element, error } from 'protractor';
import * as _ from 'lodash';
import { fail } from 'assert';
import { Router  ,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-comprasmprequisitos',
  templateUrl: './comprasmprequisitos.page.html',
  styleUrls: ['./comprasmprequisitos.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ComprasmprequisitosPage implements OnInit {
  editing = {};
  editlisr = {};
  editlisr2 = {};
  editlisr3 = {};
  fecha :any;
  fecham :any;
  public fil: any={};
  public fil2: any={};
  scroll3:any;
  items=[]
  itemsc=[]

  items3=[]
  items3cop=[]
  items4=[]
  lisop=[]
  lim :any;
  public options: Options;
  public  items2 :Array<{  id:string; text:string   }>= [];
  ColumnMode = ColumnMode;
  elementos: any={
    archivo: {}
  };
  public campana:any={
    c:0,
    id:0,
    codi:0
  };
  public totalArchivoCargado = {};
  public archivoCargado = {};
  public tamanioArchivoCargado = {};
  public extenciones = {};
  public idFilas = {};
  public idFiles = [];
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
    console.log(params['idcompra'])  
        this.campana.c=1;
        this.campana.codi=params['codigo_barco'];
        this.campana.id=params['idcompra'];
         var data1 = new Date(params['fecha'])
        var date = moment(data1).format('YYYY-MM-DD');
        this.fecha=date;
        this.det2(params['codigo_barco']+"-"+params['idcompra'])
        

      }else{
        this.det(); 
      }
    })
  }
  

  async det2(dt){

    try{
      await this.mydate1(this.fecha); 
      this.fil.compra = dt;
      
    }catch(err){
      console.log(err)
    }
  }
  det (){
    try {
      setTimeout(() => {
        var date = moment();
        this.fecha=date.format('YYYY-MM-DD');
        this.mydate1(this.fecha);           
       
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
       if(this.campana.c==1){

        this.campana.c=0; 
         }else{ 
         
           this.fil.compra=null;
         }
         this.items4=[]
     this.limpi();
       this.Traer_resumen_cabecera_mes_anio(v);
       this.Organismo_pesca_traer_todos();
          var  p = +splitted[1];
       
         this.fecham=meses[p-1]+" del "+splitted[0];   

    }else{
      this.fecham=" " ;   
    }
    
   }


   async Traer_resumen_cabecera_mes_anio(fe){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.body = {
      fecha: moment(fe).format('YYYY-MM-DD')
    };

    this.colaboradoServicio.Compra_mp_traer_resumen().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items = [];
        this.items = [...this.items];
            let co;
        if (res) {
          if(res.result) { 
        //   console.log(res.result)

            if (res.result.Compra_mp_traer_resumenResult) {
              if (res.result.Compra_mp_traer_resumenResult.resumen_compra_mpCN) {
                //console.log(res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN)
                let registros = res.result.Compra_mp_traer_resumenResult.resumen_compra_mpCN;
                registros.forEach(ele=>{ 
               console.log(ele);
                   this.items.push({
                     
                     
                     id: ele.codigo_barco+"-"+ele.id_compra_mp,
                     text: ele.codigo_compra_mp+" - "+ele.nombre_tipo_compra_mp+" - "+ele.nombre_barco+" - "+ele.numero_viaje ,
                     nombre:ele.nombre_barco,
                     id_comp:ele.id_compra_mp,
                   
                    })
                })              
                this.items = [...this.items];
                 this.itemsc=this.items

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


  async onTagChanged(data){
    

    if(data ){
      console.log(data)
      var str = new String(data);
      var splits = str.split("-");
  
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
     
      this.colaboradoServicio.body = {
        codigo: splits[0]
      };

      this.colaboradoServicio.Barco_traer_por_codigo_domus().subscribe(
        async (res: ISoapMethodResponse) => {
          console.log(res)
          if (res) {
            if(res.result) { 
              //console.log(res.result)
  
              if (res.result.Barco_traer_por_codigo_domusResult) {
                  //console.log(this.itemsc)
                  this.fil2  = this.itemsc.filter(number =>  number.id===data);
                 // console.log(this.fil2)
                  let registros = res.result.Barco_traer_por_codigo_domusResult;
                  this.fil.codigo=registros.codigo_barco;
                  this.fil.nombre=this.fil2[0].nombre;
                  this.fil.bandera=registros.codigo_bandera;
                  this.fil.internacional=registros.no_registro;
                  this.fil.IMO=registros.codigo_imo;
                  this.fil.Licencia=registros.no_licencia;
                  this.fil.SANCO=registros.codigo_sanco;
                  this.fil.fecha=moment(registros.venc_licencia).format('YYYY-MM-DD');
                  this.fil.id=registros.id_barco;
                  this.fil.id_com=this.fil2[0].id_comp
                  
                  if(this.fil.id_com){
                    this.Organismo_pesca_resumen_por_compra(this.fil.id_com);
                    this.Traer_requisitos(this.fil.id_com);
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
  }


  async guardar(){
      
    if(this.fil.internacional   && this.fil.fecha){
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
    
      this.colaboradoServicio.body = {
       
        barco:{
          codigo_bandera: this.fil.bandera,
          codigo_barco:this.fil.codigo ,
          codigo_imo: this.fil.IMO ,
          codigo_sanco: this.fil.SANCO ,
          id_barco:  this.fil.id ,
          no_licencia: this.fil.Licencia ,
          no_registro:   this.fil.internacional ,
          venc_licenci: moment(this.fil.fecha).format('YYYY-MM-DD') ,
        },

        id_compra_mp: this.fil.id_com,
        codigo_bue:'',
        codigo_senae:'',
        id_usuario:this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
      };


      this.colaboradoServicio.barcoModificar().subscribe(
        async (res: ISoapMethodResponse)=>{
        
          
          if(res){
            if(res.result.Barco_modificarResult){
              this.presentToast('Barco Modificado');
              this.onTagChanged(this.fil.compra)
              await loading.dismiss();
            }else{
              this.presentToast(res.header.Mensaje+"-"+res.header.Error);
              await loading.dismiss();
               console.log(this.fil.compra)
            }
            
          }else{
            this.presentToast(res.header.Mensaje+"-"+res.header.Error);
            await loading.dismiss();
   
          }
          
        }, async (err) => {
          this.presentToast('Error de servidor');
          await loading.dismiss();
        }

      );
    }else{
      this.presentToast('Campos Vacios');
    }
    

  }


  async Organismo_pesca_resumen_por_compra(data){
    if(data){   
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      this.colaboradoServicio.body = {
        id_compra: data
      };
      this.colaboradoServicio.Organismo_pesca_resumen_por_compra().subscribe(
        async (res:ISoapMethodResponse) =>{

                   if(res.result){
                      this.items3=[];
                          console.log(res);
                       if(res.result.Organismo_pesca_resumen_por_compraResult){
                       
                         let  resp =res.result.Organismo_pesca_resumen_por_compraResult.resumen_control_organismo_pescaCN;
                         resp.forEach(
                           element=>{
                             console.log(element)
                            this.items3.push({
                              codigo_organismo_pesca: element.codigo_organismo_pesca,
                              id_compra_mp: element.id_compra_mp,
                              id_control_organismo_pesca: element.id_control_organismo_pesca,
                              menu: {id_organismo_pesca:element.id_organismo_pesca,url:element.url,id_control_organismo_pesca: element.id_control_organismo_pesca},
                              url:element.url,
                              id_organismo_pesca:element.id_organismo_pesca
                             });
                           }
                         );

                         this.items3=[...this.items3]
                          
                          if(this.items3.length==1){                    
                           this.scroll3='si';
                           }else{
                           this.scroll3='';
                          }
                          
                        await loading.dismiss();
                      
                       }else{
                        
                        await loading.dismiss();
                        this.presentToast('No hay Organismo pesca');
                       
                      }
                   }
                   else{
                    this.presentToast('No hay Organismo pesca');
                    await loading.dismiss();
                   }
        }, async (err) => {
          this.presentToast('Error de servidor');
          await loading.dismiss();
        }

      );

    }
  }

  async Organismo_pesca_traer_todos(){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Organismo_pesca_traer_todos().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items3 = [];
        this.items3 = [...this.items3];
        
        this.items3cop = [];
         
        if (res) {
          if(res.result) { 
            //console.log(res.result) 
            if (res.result.Organismo_pesca_traer_todosResult) {
              if (res.result.Organismo_pesca_traer_todosResult.organismo_pescaCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Organismo_pesca_traer_todosResult.organismo_pescaCN;
                 registros.forEach(ele=>{
                 console.log(ele)
                 this.items3cop.push({
                  menu: {id_organismo_pesca:null,url:ele.url_consulta},
                  url:ele.url_consulta,
                  id_organismo_pesca:ele.id_organismo_pesca,
                  codigo_organismo_pesca:ele.codigo
                 });
                 })
                this.items3cop = [...this.items3cop];
               // this.items3cop = this.items3
                console.log(this.items3cop)
                if(this.items3.length==1){                    
                  this.scroll3='si';
                  }else{
                  this.scroll3='';
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

  async alert(id){
    
    const alert = await this.alertCtrl.create({
      header: '¿Seguro de eliminar?',
  
      cssClass: 'btnalert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'btnalert1',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        },
         {
          text: 'Aceptar', 
          cssClass: 'btnalert1',
          handler: (data) => {
            
             this.eliminar(id);
          }
        }
      ]
    });
  
    
  
    await alert.present();
   }

   async eliminar(id){
     console.log(id)
     if(id==null){
   
        this.presentToast('Selecione una Compra')
     }else{
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
       this.colaboradoServicio.body = {
         id_control_organismo_pesca: id,
         id_usuario:this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
       };
      this.colaboradoServicio.Organismo_pesca_eliminar().subscribe(
        async   (res: ISoapMethodResponse) => { 
        console.log(res)
          let resp = res.result.Organismo_pesca_eliminarResult;//Compra_copiar_datosResult;
         //console.log(resp)
             if(resp){
               this.presentToast('Eliminado Correctamente');
               if(this.fil.compra && this.fil.id_com){
                 this.Organismo_pesca_resumen_por_compra(this.fil.id_com);
                }else{
                 this.Organismo_pesca_traer_todos();
                }
               }else{
                 await loading.dismiss();
               this.presentToast(res.header.Mensaje);
               }
             await loading.dismiss();
          }
        ,async(err) => { 
         await loading.dismiss();
          this.presentToast('Error de servidor');
        }
      );
     }
    
  }



   async Organismo_pesca_modificar(data){
    console.log(data)
    const loading = await this.loadingController.create({ message: 'Cargando...' });
   await loading.present();
    this.colaboradoServicio.body = {
      oroc:{
       // codigo_organismo_pesca:data.codigo_organismo_pesca,
        id_compra_mp:data.id_compra_mp,
        id_control_organismo_pesca: data.id_control_organismo_pesca,
        id_organismo_pesca:data.modificar.id_organismo_pesca,
        //url:data.modificar.url
      },
      id_usuario:this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
    };

    this.colaboradoServicio.Organismo_pesca_modificar().subscribe(
      async  (res:ISoapMethodResponse)=>{
     console.log(res)
        if(res.result.Organismo_pesca_modificarResult){
          this.presentToast('Modificado Correctamente');
          this.lisop=[]
          this.Organismo_pesca_resumen_por_compra(this.fil.id_com);
          await loading.dismiss();

        }else{
          this.presentToast('Error de servidor');
          await loading.dismiss();

        }

      },async(err) => { 
      await loading.dismiss();
       this.presentToast('Error de servidor');
     }
    );


   }

   async alert3(){

    if(this.fil.compra){
      this.items3.unshift({
        codigo_organismo_pesca: "",
        id_compra_mp: "",
        id_control_organismo_pesca: 0,
        menu: {id_organismo_pesca:""},
        url:"",
        id_organismo_pesca:""
       });
       this.items3=[...this.items3]
  }else{
    this.presentToast('Seleccione un No compra');
    }
   }

   async  nuorganismo(url){
      
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();

       this.colaboradoServicio.body = {
        oroc:{
          id_compra_mp:this.fil.id_com,
          url:url.Organismo
        },
         id_usuario:this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
       };

      this.colaboradoServicio.Organismo_pesca_insertar().subscribe(
        async (res:ISoapMethodResponse)=>{
          
          if(res){
             if(res.result.Organismo_pesca_insertarResult)
              {this.presentToast('Guardado correctamente');
              await loading.dismiss();
            }
              else{
                this.presentToast('Error de servidor');
                await loading.dismiss();

              }
          } else{
         this.presentToast('Error de servidor');
         await loading.dismiss();

          }

      },async(err) => { 
        await loading.dismiss();
         this.presentToast('Error de servidor');
       }
      

      );

  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    
    var str = new String(event.target.value);
      var splits = str.split("-");
      let nuevoValor = splits[0];
    let valorAnterior = this.items3[rowIndex].id_organismo_pesca;

      
    //let idFila = this.items3[rowIndex].accion.id;
    if (nuevoValor !== valorAnterior && nuevoValor !== '') {
    
      this.items3[rowIndex].id_organismo_pesca = nuevoValor;
      this.items3[rowIndex].menu.id_organismo_pesca = nuevoValor;
      this.items3[rowIndex].url = splits[1];
      this.items3[rowIndex].codigo_organismo_pesca = splits[2]
      
      var res =this.items3[rowIndex].id_control_organismo_pesca;  
     this.lisop= this.lisop.filter(ele=>{
        if(ele.id_control_organismo_pesca!=res){
         return true
        }
      })
        this.lisop.push({modificar: this.items3[rowIndex].menu,id_control_organismo_pesca:this.items3[rowIndex].id_control_organismo_pesca,id_compra_mp:this.items3[rowIndex].id_compra_mp});
      this.items3 = [...this.items3];
    }
   
   
  }
  
  async guardarorp(){

             if(this.lisop.length >0){             
              this.lisop.forEach(ele=>{        
             if(ele.id_control_organismo_pesca==0){
              console.log(ele)
              this.Organismo_pesca_insertar(ele);
             }else{
              console.log(ele)
               this.Organismo_pesca_modificar(ele);
             }             
               }
              );         
             }else{
               this.presentToast('No hay datos para moficicar')
             }      
          
  }

  cancelarop(){
 
    this.lisop=[];
    this.presentToast('Modificacion Cancelada');
    if(this.fil.compra && this.fil.id_com){
     this.Organismo_pesca_resumen_por_compra(this.fil.id_com);
    }else{
     this.Organismo_pesca_traer_todos();
    }

  }

  actualizarop(){
    this.lisop=[];
    if(this.fil.compra && this.fil.id_com){
     this.Organismo_pesca_resumen_por_compra(this.fil.id_com);
    }else{
     this.Organismo_pesca_traer_todos();
    }

  }

  async Traer_requisitos(id){
   
    this.colaboradoServicio.body = {
      id_compra_mp:id
    };
    
    
    this.colaboradoServicio.Traer_requisitos().subscribe(
      async   (res: ISoapMethodResponse) => { 
      // console.log(res)
       
      
      //  console.log(resp);
        this.items4=[]
        this.items4=[...this.items4]        
            if(res.result.Traer_requisitosResult){    
              let resp = res.result.Traer_requisitosResult.resumen_requisitoCN;
            resp.forEach(element => {
           //console.log(element);
            let nombre = "-";
            let valor = "-";
            let observacion = "-";
            if (element.valor.trim() !== "") valor = element.valor;
            if (element.nombre.trim() !== "") nombre = element.nombre;
            if (element.observacion.trim() !== "") observacion = element.observacion;

            this.items4.push({
               nombre: nombre,
               valor: valor,
               documento_adjuntado:element.documento_adjuntado,
               id_status_embarcacion:element.id_status_embarcacion,
               observacion:element.observacion,
               modi:false,
               accion:{ id: element.id_status_embarcacion, idFile: 'idFila'+element.id_status_embarcacion}
            })
          
            });
            this.items4=[...this.items4]        
             }else {
              this.presentToast('Sin Requisitos');              
             }         
        }
      ,(err) => { 
        this.presentToast('Error de servidor');
      }
    );
  }
   
  updateValuenombre(event, cell, rowIndex) { 
    this.editlisr[rowIndex + '-' + cell] = false;
    let nuevoValor = event.target.value;
    let valorAnterior = this.items4[rowIndex].nombre;
    //let idFila = this.items3[rowIndex].accion.id;
    if (nuevoValor !== valorAnterior) {
      this.items4[rowIndex].nombre = nuevoValor;
      this.items4[rowIndex].modi=true;
      //this.lisop.push({modificar: this.items4[rowIndex]});
     // this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
      this.items4 = [...this.items4];
    }
  }
  
  updateValuevalor(event, cell, rowIndex) { 
    this.editlisr2[rowIndex + '-' + cell] = false;
    let nuevoValor = event.target.value;
    let valorAnterior = this.items4[rowIndex].valor;
    //let idFila = this.items3[rowIndex].accion.id;
    if (nuevoValor !== valorAnterior) {
      this.items4[rowIndex].valor = nuevoValor;
      this.items4[rowIndex].modi=true;
      //this.lisop.push({modificar: this.items4[rowIndex]});
     // this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
      this.items4 = [...this.items4];
    }
  }
  
  updateValueobservacion(event, cell, rowIndex) {
    
    this.editlisr3[rowIndex + '-' + cell] = false;
    let nuevoValor = event.target.value;
    let valorAnterior = this.items4[rowIndex].observacion;
    //let idFila = this.items3[rowIndex].accion.id;
    if (nuevoValor !== valorAnterior) {
      this.items4[rowIndex].observacion = nuevoValor;
      this.items4[rowIndex].modi=true;
    //  this.lisop.push({modificar: this.items4[rowIndex]});
     // this.idActualizablesRespaldo.push({ observacion: valorAnterior, indexFila: rowIndex });
      this.items4 = [...this.items4];
    }
  }

  async alertguardarlr(){
    const idUsuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
 
    if(this.items4.length>0){
      this.items4.forEach(ele =>{
       
        if(ele.modi==true){
      console.log(ele);
      this.Requisito_modificar(ele);
       }

      });

      for (let i = 0; i < this.idFiles.length; i++) {
        console.log(this.tamanioArchivoCargado[this.idFiles[i]] )
  
        if (this.tamanioArchivoCargado[this.idFiles[i]]>(4194304)){
          this.presentToast("El archivo no puede exceder de los 4MB");
          
        }else if(this.extenciones[this.idFiles[i]] =='pdf' || this.extenciones[this.idFiles[i]] =='PDF'   ){
        
        if(i+1==this.idFiles.length){
         
         this.lim=true;
        }
        await this.Status_embarcacion_adjuntar_documento(idUsuario,this.idFiles[i],this.idFilas[this.idFiles[i]]);

        }else{
          this.presentToast('Solo se permite archivos en pdf');   
        } 
      } 
      await loading.dismiss();
    }else{
      this.presentToast('Lista de requerimientos vacias');
      await loading.dismiss();
    }

     
  }

  cancelarlr(){
    if(this.fil.id_com){
      this.Traer_requisitos(this.fil.id_com);
      this.archivoCargado = {};
      this.totalArchivoCargado = {};
      this.tamanioArchivoCargado = {};
      this.idFilas = {};
      this.extenciones = {};
     this.idFiles = [];
    }
  }
  
  actualizarlr(){
    if(this.fil.id_com){
      this.archivoCargado = {};
      this.totalArchivoCargado = {};
      this.tamanioArchivoCargado = {};
      this.idFilas = {};
      this.extenciones = {};
     this.idFiles = [];
      this.Traer_requisitos(this.fil.id_com);
    }
  }

  Requisito_modificar(data){
        console.log(data)
        if( data.observacion =='-'){ data.observacion=""}
        if(data.valor=='-'){ data.valor=" "}
    this.colaboradoServicio.body={
      id_status_embarcacion: data.id_status_embarcacion ,
      observacion:  data.observacion ,
      valor:data.valor,
      id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
    }
    this.colaboradoServicio.Requisito_modificar().subscribe(
     (res:ISoapMethodResponse)=>{
    //  console.log(res);
      if(res.result.Requisito_modificarResult){
        this.presentToast('Modificado Correctamente')
      }else{
        this.presentToast('Error de servidor');
      }
     },(err) => { 
      this.presentToast('Error de servidor');
    }
    )
  }
  
  async Status_embarcacion_traer_documento(id){
    const idUsuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
   
    this.colaboradoServicio.body={
      id_status_embarcacion:id
    }
    this.colaboradoServicio.Status_embarcacion_traer_documento().subscribe(
      async (res:ISoapMethodResponse)=>{
       

        //console.log(res); 
        if(res){
    
          if(res.result){

            let dataUrl = 'data:application/octec-stream;charset=utf-8;base64,'+ res.result.Status_embarcacion_traer_documentoResult;
            fetch(dataUrl)
              .then(res => res.arrayBuffer())
              .then(buffer => {
                var file = new Blob([buffer], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);

              }
             

              );
              await loading.dismiss();
          }else{
            this.presentToast('Sin Documento');
            await loading.dismiss();
            
          }
        }else{
          this.presentToast('Error de servidor');
          await loading.dismiss();

        }


      }, async(err) => { 
        this.presentToast('Error de servidor');
        await loading.dismiss();

      })
  }

  cargaArchivo(archivo,idElement,id) {
     
    this.archivoCargado[idElement] = archivo[0];
    this.totalArchivoCargado[idElement] = archivo.length;
    this.tamanioArchivoCargado[idElement] = archivo[0].size;
    this.idFilas[idElement] = id;
    this.extenciones[idElement] = this.getFileExtension(this.elementos.archivo[idElement]);
    this.idFiles.push(idElement);
    
    var x = this.tamanioArchivoCargado[idElement]/1024;
     var y: number = +x.toFixed(0);
    console.log(1024*4);
    if(y > (1024*4)){
      this.archivoCargado[idElement]  =null;
      this.totalArchivoCargado[idElement] =0;
      this.tamanioArchivoCargado[idElement] =0;
      this.elementos.formato="";
      this.extenciones[idElement]="";
      return this.presentToast("El archivo no puede exceder de los 4MB");
      
    }
  }

  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  llamarFile(id) {
    document.getElementById(id).click();
  }

 async  Status_embarcacion_adjuntar_documento(id_usuario,claveDoc,id){
  const idUsuario = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
  const loading = await this.loadingController.create({ message: 'Cargando...' });
  await loading.present();

      let reader = new FileReader();
      reader.readAsDataURL(this.archivoCargado[claveDoc]);
      reader.onload = () => {
        let archivoByte = reader.result;
        archivoByte = archivoByte.toString();
        archivoByte = archivoByte.slice(28,archivoByte.length);
        
        this.colaboradoServicio.body={
          id_status_embarcacion:id,
          archivo: archivoByte,
         extencion: this.extenciones[claveDoc],
          id_usuari:id_usuario,
         }
    
        let datoFila = _.filter(this.items4,el => parseInt(el.accion.id) === parseInt(this.idFilas[claveDoc]));
        let documento = "";
        if (datoFila.length) documento=datoFila[0].nombre
        this.colaboradoServicio.Status_embarcacion_adjuntar_documento().subscribe(
          async (res : ISoapMethodResponse) => {
         //   console.log(res)
            this.presentToast(`${res.header.Mensaje} - ${res.header.Error}. "${documento}"`);
            if(this.lim){
            this.archivoCargado = {};
            this.totalArchivoCargado = {};
            this.tamanioArchivoCargado = {};
            this.idFilas = {};
            this.extenciones = {};
           this.idFiles = [];
            }
            await loading.dismiss();

          }
          ,async (err) => {
            this.presentToast('No se pudo guardar archivo para: "'+documento+'"');
            await loading.dismiss();

          }
        );
      }
   


  }

  async Organismo_pesca_insertar(data){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
     this.colaboradoServicio.body = {
       oroc:{
        // codigo_organismo_pesca:data.codigo_organismo_pesca,
         id_compra_mp:this.fil.id_com,
         //id_control_organismo_pesca: data.id_control_organismo_pesca,
         id_organismo_pesca:data.modificar.id_organismo_pesca,
         //url:data.modificar.url
       },
       id_usuario:this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
     };
 
     this.colaboradoServicio.Organismo_pesca_insertar().subscribe(
       async  (res:ISoapMethodResponse)=>{
      console.log(res)
         if(res.result.Organismo_pesca_insertarResult){
           this.presentToast('Ingresado  Correctamente');
           this.lisop=[]
           this.Organismo_pesca_resumen_por_compra(this.fil.id_com);
           await loading.dismiss();
 
         }else{
           this.presentToast('Error de servidor');
           await loading.dismiss();
 
         }
 
       },async(err) => { 
       await loading.dismiss();
        this.presentToast('Error de servidor');
      }
     );
  }

  limpi(){
    this.fil.codigo="";
    this.fil.nombre="";
    this.fil.bandera="";
    this.fil.internacional="";
    this.fil.IMO="";
    this.fil.Licencia="";
    this.fil.SANCO="";
    this.fil.fecha="";

  }
}
