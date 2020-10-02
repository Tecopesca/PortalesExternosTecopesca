import { Component, OnInit,ViewEncapsulation,HostListener } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Options } from 'select2';
import * as moment from 'moment';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverelimiComponent } from 'src/app/components/popoverelimi/popoverelimi.component';
import { PopovernotifiComponent } from 'src/app/components/popovernotifi/popovernotifi.component';
import { PopoverbarcoComponent } from 'src/app/components/popoverbarco/popoverbarco.component';
import { PopoverproveedorComponent } from 'src/app/components/popoverproveedor/popoverproveedor.component';
import { Router  ,ActivatedRoute} from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-comprasmpingreso',
  templateUrl: './comprasmpingreso.page.html',
  styleUrls: ['./comprasmpingreso.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ComprasmpingresoPage implements OnInit {
  cont:any;
  public fil: any={};
  public fil2: any={};
  public fil3: any={};
  public fil4: any={};
  tama: any;
  scroll3:any;
  fecha :any;
  public f : any;
  fecham :any;
  public options: Options;
  ColumnMode = ColumnMode;
  items = [];
  public id_comp: any;
  public class :any;
  
  public codigo_b:boolean;
  public campana:any={
    c:0,
    id:0,
    comp:'',
  };
  public lim:any={
    c:0,
    id:0,
  }
 // public exampleData: Array<Select2OptionData>;
  ///////filtros variables
  public  items2 :Array<{  id:string; text:string   }>= [];
  public  items3 :Array<{  id:string; text:string   }>= [];
  public  items4 :Array<{  id:string; text:string   }>= [];
  public  items5 :Array<{  id:string; text:string   }>= [];
  public  items6 :Array<{  id:string; text:string   }>= [];
  //public  items7 :Array<{  id:string; text:string   }>= [];
  public  items8 = [];
  public  items9  = [];
  items91 :Array<{  }>= [];
  public  items10 :Array<{  id:string; text:string   }>= [];
  public  items11 :Array<{  id:string; text:string   }>= [];
  public  items12 :Array<{  id:string; text:string   }>= [];
  public  items13 :Array<{  id:string; text:string   }>= [];
  public  items41 :Array<{  id:string; text:string   }>= [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fortyFormGroup: FormGroup;

  /////
  constructor(
    public toast: ToastController  
    ,private alertCtrl: AlertController
    ,private encrdecr:EncrDecrServiceService
    ,public loadingController: LoadingController
    ,private colaboradoServicio: ColaboradorService
    ,public popover: PopoverController
    ,private router: ActivatedRoute
    ,public formBuilder: FormBuilder
    ,private router2: Router
    ) {

    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"     
      }
      ,width: '100%'
    }

   }
  
  ngOnInit() {
    // this.firstFormGroup.get('grutipo').setValue(1)
    this.formu();
    this.codigo_b=false;
    this.router.queryParams.subscribe(params => {
      if(params['id']){
        console.log(params['id'])   
      // console.log(params['idcompra'])  
          this.campana.c=1;
          this.campana.id=params['idcompra'];
          this.campana.comp=params['id'];
         var data1 = new Date(params['fecha'])
          var date = moment(data1).format('YYYY-MM-DD');
        this.myFuncion(date,params['idcompra'])
       
      }else{
        this.det(); 
      }
    })
  }

  
  async  myFuncion (date,idc) {
    try {
      
          this.fecha=date;
          var result = await this.mydate1(this.fecha); 
          var result = await this.Traer_grupo_compra();   
          var result = await this.Termino_compra_traer();
          var result = await  this.Materia_prima_traer();
          var result = await  this.Barco_traer_ax();
          var result = await  this.peso();
          var result = await  this.Bandera_traer();      
          var result = await  this.Editar(idc);
    } catch(err) {
      console.log(err)
    }
  }

  formu(){
    this.firstFormGroup = this.formBuilder.group({
      compra: [''],
      grutipo: ['', Validators.required],
      tipo: ['', Validators.required],
      codigo_m: ['', Validators.required],
      termino: ['', Validators.required],
      materia: [''],
      fecha: ['', Validators.required],
    });
    
    this.secondFormGroup = this.formBuilder.group({
      proveedor: ['', Validators.required],
      barco: ['', Validators.required],
      bandera: ['', Validators.required],
      Materia: [''],
      peso: [''],
      unidad: [''],
      newb: [false],
    });
    this.thirdFormGroup = this.formBuilder.group({
      FIP: [false],
      FOS: [false],
      MSC: [false],
      UE: [false],
      OM: [false],
      FAD: [false],
      legal: [''],
    });

    this.fortyFormGroup = this.formBuilder.group({
      tipob:['', Validators.required],
      nombreb:['', Validators.required],
    });
  }
 
  det(){
    try {
      setTimeout(() => {    
        var date = moment();
        this.fecha=date.format('YYYY-MM-DD');
        this.mydate1(this.fecha); 
        this.Traer_grupo_compra();      
        this.Termino_compra_traer();
        this.Materia_prima_traer();
        this.Barco_traer_ax();
        this.peso();
        this.Bandera_traer();
      },1000);
    } catch (error) {
      return this.presentToast('Por favor vuelva a recargar la página');
    }
  }

  mydate1(v) {
   // console.log(v)
    if(v){
      var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
       var splitted = v.split("-", 3); 
       this.Traer_resumen_cabecera_mes_anio(v);
          var  p = +splitted[1];
         this.fecham=meses[p-1]+" del "+splitted[0];   
    }else{
      this.fecham=" " ;   
    }
    
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  async Traer_resumen_cabecera_mes_anio(fe){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.body = {
      fecha: fe,
    };

    this.colaboradoServicio.Traer_resumen_cabecera_mes_anio().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items2 = [];
        this.items2 = [...this.items2];
        this.items = [];
        this.items = [...this.items];
       // this.items7 = [];
      //  this.items7 = [...this.items7];
        if (res) {
          if(res.result) { 
            if (res.result.Traer_resumen_cabecera_mes_anioResult) {
              if (res.result.Traer_resumen_cabecera_mes_anioResult.cabecera_compra_mpCN) {
                let registros = res.result.Traer_resumen_cabecera_mes_anioResult.cabecera_compra_mpCN;
                registros.forEach(ele=>{
          //    console.log(ele)
                  this.items2.push({ id:ele.id_cabecera_compra_mp,text:ele.codigo_compra_mp})

                })
                this.items2 = [...this.items2];
                 console.log(this.campana)
                 console.log(this.campana.comp)
                     
              if(this.campana.comp !='0'){
                console.log('1')     
                await this.Compra_traer_por_cabecera(this.campana.comp);
                this.firstFormGroup.get('compra').setValue(this.campana.comp);
                this.campana.comp='0';
              } else if (this.lim.c==1){
                console.log('2')
                await this.Compra_traer_por_cabecera(this.lim.id);
                this.firstFormGroup.get('compra').setValue(this.lim.id);
                this.lim.c=0;
              }else{
                console.log('3')
                this.cancelar('si');
                this.items4=[];
                this.items4=[...this.items4];
              }
               
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

  async Traer_grupo_compra(){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Traer_grupo_compra().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items3 = [];
        this.items3 = [...this.items3];
        if (res) {
          if(res.result) { 
          //  console.log(res.result)
            if (res.result.Traer_grupo_compraResult) {
              if (res.result.Traer_grupo_compraResult.grupo_compra_mpCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Traer_grupo_compraResult.grupo_compra_mpCN;
                 registros.forEach(ele=>{
                  // console.log(ele)
                  this.items3.push({ id:ele.id_grupo_compra_mp,text:ele.nombre})
                 })
                this.items3 = [...this.items3];
              }else {
                this.presentToast('No hay grupo de compra');
              }
            }else {
              this.presentToast('No hay grupo de compra');
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

  async onTagChanged(data) {
 
    if(data){   
      
      console.log(data);
      this.Proveedor_ax_traer(data);
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      
      this.colaboradoServicio.body = {
        id_grupo_compra: data,
      };

      this.colaboradoServicio.Tipo_tipo_compra_traer_porgrupo().subscribe(
        async (res: ISoapMethodResponse) => {
          this.items4 = [];
          this.items4 = [...this.items4];
          if (res) {
            if(res.result) { 
              //console.log(res.result)
              if (res.result.Tipo_tipo_compra_traer_porgrupoResult) {
                if (res.result.Tipo_tipo_compra_traer_porgrupoResult.tipo_compra_mpCN) {
                //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                  let registros = res.result.Tipo_tipo_compra_traer_porgrupoResult.tipo_compra_mpCN;
                   registros.forEach(ele=>{
                    // console.log(ele)
                    this.items4.push({ id:ele.id_tipo_compra_mp,text:ele.nombre})
                   })
                  this.items4 = [...this.items4];
                }else {
                  this.presentToast('No hay tipo de compra');
                }
              }else {
                this.presentToast('No hay tipo de compra');
              }
              
            }else {
              this.presentToast('No hay tipo de compra');
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

  async Termino_compra_traer(){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Termino_compra_traer().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items5 = [];
        this.items5 = [...this.items5];
        if (res) {
          if(res.result) { 
          //  console.log(res.result)
            if (res.result.Termino_compra_traerResult) {
              if (res.result.Termino_compra_traerResult.termino_compraCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Termino_compra_traerResult.termino_compraCN;
                 registros.forEach(ele=>{
                   //console.log(ele)
                  this.items5.push({ id:ele.id_termino_compra,text:ele.nombre})
                 })
                this.items5 = [...this.items5];
              }else {
                this.presentToast('No hay grupo de compra');
              }
            }else {
              this.presentToast('No hay grupo de compra');
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

  async Materia_prima_traer(){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Materia_prima_traer().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items6 = [];
        this.items6 = [...this.items6];
        this.items10 = [];
        this.items10 = [...this.items10];
        if (res) {
          if(res.result) { 
           // console.log(res.result)
            if (res.result.Materia_prima_traerResult) {
              if (res.result.Materia_prima_traerResult.materia_primaCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Materia_prima_traerResult.materia_primaCN;
                 let m ='0';
                registros.forEach(ele=>{
                  //console.log(ele)
                  if(m=='0'){
                    m=ele.codigo+"-"+ele.nombre
                  }
                  this.items10.push({ id:ele.codigo+"-"+ele.nombre,text:ele.nombre})
                  this.items6.push({ id:ele.codigo+"-"+ele.nombre,text:ele.nombre})
                 })
                this.items10 = [...this.items10];
                this.items6 = [...this.items6];
               
                this.firstFormGroup.get('materia').setValue(m);
                this.secondFormGroup.get('Materia').setValue(m);
              }else {
                this.presentToast('No hay grupo de compra');
              }
            }else {
              this.presentToast('No hay grupo de compra');
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

  
  async Bandera_traer(){

    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Bandera_traer().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items12 = [];
        this.items12 = [...this.items12];
       
        if (res) {
          if(res.result) { 
            //console.log(res.result) 
            if (res.result.Bandera_traerResult) {
              if (res.result.Bandera_traerResult.banderaCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Bandera_traerResult.banderaCN;
                 registros.forEach(ele=>{
                   //console.log(ele)
                  this.items12.push({ id:ele.codigo,text:ele.nombre_corto})
                 })
                this.items12 = [...this.items12];
              }else {
                this.presentToast('No hay grupo de compra');
              }
            }else {
              this.presentToast('No hay grupo de compra');
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

  async Proveedor_ax_traer(data){

    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    
    this.colaboradoServicio.body = {
      id_grupo_compra: data,
    };

    this.colaboradoServicio.Proveedor_ax_traer().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items8 = [];
        this.items8 = [...this.items8];
        this.items8.push({id: '0', text: 'Codigo  -  Nombre',children:[]});
        if (res) {
          if(res.result) { 
            //console.log(res.result)
            if (res.result.Proveedor_ax_traerResult) {
              if (res.result.Proveedor_ax_traerResult.proveedor_axCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Proveedor_ax_traerResult.proveedor_axCN;
                 registros.forEach(ele=>{
                  // console.log(ele)
                  this.items8.push({ 
                    children:[{id:ele.codigo_proveedor,text:ele.codigo_proveedor+"  -  "+ele.razon_social}]})
                  })
                this.items8 = [...this.items8];
              }else {
                this.presentToast('No hay Proveedor');
              }
            }else {
              this.presentToast('No hay Proveedor');
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

  async Barco_traer_ax(){
   
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.Tipo_barco_traer();
    this.colaboradoServicio.Barco_traer_ax().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items9 = [];
        this.items9 = [...this.items9];
        this.items9.push({id: '0', text: 'Codigo  -  Nombre  -  No Viaje',children:[]});
        if (res) {
          if(res.result) { 
          //console.log(res.result)
            if (res.result.Barco_traer_axResult) {
              if (res.result.Barco_traer_axResult.barco_axCN) {
               //console.log( res.result.Barco_traer_axResult.barco_axCN)
                let registros = res.result.Barco_traer_axResult.barco_axCN;
                 registros.forEach(ele=>{
                  // console.log(ele)
                  this.items9.push({  
                    children:[{id:ele.codigo,text:ele.codigo+"  -  "+ele.nombre+"  -  "+ele.viaje,nombre:ele.nombre}]})
                 })
                this.items9 = [...this.items9];
              }else {
                this.presentToast('No hay Barco');
              }
            }else {
              this.presentToast('No hay Barco');
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

  peso(){
    this.items11 = [];
    this.items11 = [...this.items11];
    this.items11.push({id:"kg",text:"Kg"});
    this.items11.push({id:"tm",text:"tm"});
    this.items11 = [...this.items11];

    this.items13 = [];
    this.items13 = [...this.items13];
    this.items13.push({id:"true",text:"true"});
    this.items13.push({id:"false",text:"false"});
    this.items13 = [...this.items13];

    this.secondFormGroup.get('unidad').setValue('kg')

  }

  async Tipo_barco_traer(){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.colaboradoServicio.Tipo_barco_traer().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items41 = [];
        this.items41 = [...this.items41];
          
        if (res) {
          if(res.result) { 
          console.log(res.result)
            if (res.result.Tipo_barco_traerResult) {
              if (res.result.Tipo_barco_traerResult.tipo_barcoCN) {
               //console.log( res.result.Barco_traer_axResult.barco_axCN)
                let registros = res.result.Tipo_barco_traerResult.tipo_barcoCN;
                 registros.forEach(ele=>{
                  // console.log(ele)
                  this.items41.push({  
                   id:ele.id_tipo_barco,text:ele.nombre})
                 })
                this.items41 = [...this.items41];
              }else {
                this.presentToast('No hay grupo de compra');
              }
            }else {
              this.presentToast('No hay grupo de compra');
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
///////////////////////////////

  async Compra_traer_por_cabecera(data){    
    console.log(data)
    if(data){  
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();     
      this.colaboradoServicio.body = {
        id_cabecera_compra_mp: data,
      };
      this.colaboradoServicio.Compra_traer_por_cabecera().subscribe(
        async (res: ISoapMethodResponse) => {        
            if (res) {
            if(res.result) { 
              this.items = [];
              this.items = [...this.items];
              this.cancelar('no');
              let co;     
            /// console.log(res.result)
              if (res.result.Compra_traer_por_cabeceraResult) {           
                //  console.log( res.result.Compra_traer_por_cabeceraResult)
                    let registros = res.result.Compra_traer_por_cabeceraResult.informacion_compra_estadoCN;
                    registros.forEach(ele=>{
                      if( ele.informacion_compra_mp.color_grupo_compra_mp=='#ffcc5c'){
                        co="I"
                      }else if(ele.informacion_compra_mp.color_grupo_compra_mp=='#7BA7E1'){
                        co="L"
                      }
                      let es=null
                      if(ele.detalle_estados){
                        es=ele.detalle_estados.resumen_estado_compra_mpCN
                      }
                      let c =false;
                      
                      if(this.campana.c===1 && this.campana.id == ele.informacion_compra_mp.id_compra_mp ){
                         c=true;
                        this.campana.c=0;
                        
                      }
                     console.log(ele)
                      this.items.push({ 
                        fecha: moment(ele.informacion_compra_mp.fecha_llegada).format('YYYY-MM-DD'),
                        color: co,
                        codigo:ele.informacion_compra_mp.codigo_compra_mp ,
                        tipo: ele.informacion_compra_mp.nombre_tipo_compra_mp,
                        proveedor: ele.informacion_compra_mp.nombre_proveedor,
                        barco: ele.informacion_compra_mp.nombre_barco,
                        viaje: ele.informacion_compra_mp.numero_viaje,
                        materia: ele.informacion_compra_mp.nombre_materia_prima,
                        peso: ele.informacion_compra_mp.peso_estimado+""+ele.informacion_compra_mp.unidad_peso_estimado,
                        estado: {'estado':es},
                        estado2: ele.informacion_compra_mp.estado_compra_mp,
                        menu: {'idcompra':ele.informacion_compra_mp.id_compra_mp ,'noti':ele.informacion_compra_mp },
                        co:c,
                      });
                      //let informacionCompra = ele.informacion_compra_mp;
                     // let idGrupoCompra = informacionCompra.id_grupo_compra_mp;
                     // this.firstFormGroup.get('grutipo').setValue(parseInt(idGrupoCompra));
                    })
                    this.items = [...this.items];
                     // console.log(this.items)
                    if(this.items.length==1){                    
                        this.scroll3='si';
                     }else{
                      this.scroll3='';
                     }
                     
              }else {
               // this.presentToast('No hay datos de compra');
              }
              
            }else {
              this.presentToast('Error de servidor  en Compra_traer_por_cabecera ');
            }
          }else {
            this.presentToast('Error de servidor en  Compra_traer_por_cabecera ');
          }
          await loading.dismiss();
        }
         , async (err) => {
          this.presentToast('Error de servidor en Compra_traer_por_cabecera ');
          await loading.dismiss();
        }
        
       );


    }
   
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
  const loading = await this.loadingController.create({ message: 'Cargando...' });
 await loading.present();
  this.colaboradoServicio.body = {
   id_compra_mp: id,
  };
 this.colaboradoServicio.Confirmar_negociacion().subscribe(
   async   (res: ISoapMethodResponse) => { 
   console.log(res);
     let resp = res.result.Confirmar_negociacionResult;//Compra_copiar_datosResult;
        if(resp){
          await this.Compra_eliminar(id);
          }else{
            await loading.dismiss();
            await this.popoelimini(id);
          // this.presentToast(res.header.Mensaje);
          }
        await loading.dismiss();
     }
   ,async(err) => { 
    await loading.dismiss();
     this.presentToast('Error de servidor');
   }
 );
}

async Compra_eliminar(id){
  console.log(id)
 this.colaboradoServicio.body = {
   id_compra_mp: id,
 };
 this.colaboradoServicio.Compra_eliminar().subscribe(
   async   (res: ISoapMethodResponse) => { 
    console.log(res)
     let resp = res.result.Compra_eliminarResult;// 
     //console.log(resp
        if(resp){

         this.presentToast('Solicitud  Aceptada');

          }else{
           this.presentToast(res.header.Mensaje);
          }
        
     }
   ,(err) => { 
     this.presentToast('Error de servidor');
   }
 );
}

 async  popoelimini(id){

  const alert = await this.popover.create({
    component: PopoverelimiComponent,
    mode:'ios',
    componentProps:{page:id},
    cssClass: 'pop-over-style3',
    });

    alert.onDidDismiss().then((dataReturned) => {         
      //   console.log('s')
      console.log(dataReturned.data)
      if(dataReturned.data.actual=="si"){
        console.log(this.firstFormGroup.value.compra);
        if(this.firstFormGroup.value.compra){
          this.Compra_traer_por_cabecera(this.firstFormGroup.value.compra);
        }
        
       }
       });
        await alert.present()
 }

 async  poponoti(id){
  //console.log(id);
  
  const alert = await this.popover.create({
  component: PopovernotifiComponent,
  mode:'ios',
  componentProps:{page:id},
  cssClass: 'pop-over-style4',
  });
 /* alert.onDidDismiss().then((dataReturned) => {         
         console.log('s')
       });*/
      await alert.present()
 }


 async imprimir(id){

  this.colaboradoServicio.body = {
    id_compra_mp: id,
  };
  this.colaboradoServicio.Verificar_imprimir_contrato().subscribe(
    async   (res: ISoapMethodResponse) => { 
     console.log(res)
      let resp = res.result.Verificar_imprimir_contratoResult;//Compra_copiar_datosResult;
     // console.log(resp
         if(resp){
 
          this.Imprimir_contrato(id);
 
           }else{
            this.presentToast(res.header.Mensaje+"-"+res.header.Error);
           }
         
      }
    ,(err) => { 
      this.presentToast('Error de servidor');
    }
  );
 }

 async Imprimir_contrato(id){

  this.colaboradoServicio.body = {
    id_compra_mp: id,
  };
  this.colaboradoServicio.Imprimir_contrato().subscribe(
    async   (res: ISoapMethodResponse) => { 
     console.log(res)
      let resp = res.result.Imprimir_contratoResult;//Compra_copiar_datosResult;
     // console.log(resp
         if(resp){
          let fileURL = 'data:application/octec-stream;charset=utf-8;base64,'+ resp;
          fetch(fileURL)
          .then(res => res.arrayBuffer())
          .then(buffer => {
            var file = new Blob([buffer], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          }
        );
         /* let a = document.createElement("a");
          a.href = fileURL;
          a.target = "_blank";
          a.download = "Sintitulo";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);*/
          this.presentToast('Confirmar Realizada');
           }else{
            this.presentToast(res.header.Mensaje+"-"+res.header.Error);
           }
         
      }
    ,(err) => { 
      this.presentToast('Error de servidor');
    }
  );
 }

 actualizar(){
  this.mydate1(this.fecha);       

  Object.keys(this.fil).forEach(element=>{
     
   this.fil[element] =null
  })
 }

 async Editar(data){
   
  if(data){
     
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    this.items8=[];
    this.items4=[];
    this.pint(data);
    this.colaboradoServicio.body = {
      id_compra_mp: data,
    };

    this.colaboradoServicio.Compra_traer().subscribe(
      async (res: ISoapMethodResponse) => {
      
          if (res) {
          if(res.result) { 
            //console.log(res.result)
            if (res.result.Compra_traerResult) {
                  let registros = res.result.Compra_traerResult;
                  this.class=registros;
                  console.log( registros)                
                 // this.items13({id: registros.ue ,text:registros.ue  })
                 this.thirdFormGroup.get('UE').setValue(registros.ue)
                 this.thirdFormGroup.get('legal').setValue(registros.representante)
                 this.thirdFormGroup.get('FIP').setValue(registros.fip)
                 this.thirdFormGroup.get('FAD').setValue(registros.fad_free)
                 this.thirdFormGroup.get('FOS').setValue(registros.fos)
                 this.thirdFormGroup.get('MSC').setValue(registros.pesca_msc)
                 this.thirdFormGroup.get('OM').setValue(registros.om)
                
                  await  this.Traer_informacion_cabecera(registros.id_cabecera_compra_mp);
                  this.secondFormGroup.get('proveedor').setValue(registros.codigo_proveedor);
                  this.secondFormGroup.get('barco').setValue(registros.codigo_barco);
                  this.secondFormGroup.get('bandera').setValue(registros.codigo_bandera);
                  this.secondFormGroup.get('peso').setValue(registros.peso_estimado);
                 this.id_comp=data;
                  
            }else {
              this.presentToast('No hay datos de compra');
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

 async Traer_informacion_cabecera(data){
  //console.log(data)
  if(data){
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();
    
    this.colaboradoServicio.body = {
      id_cabecera_compra_mp: data,
    };
  
    this.colaboradoServicio.Traer_informacion_cabecera().subscribe(
      async (res: ISoapMethodResponse) => {
          console.log(res)
          if (res) {
          if(res.result) { 
          //  this.items13 = [];
           // this.items13 = [...this.items13];      
           // console.log(res.result)
            if (res.result.Traer_informacion_cabeceraResult) {        
                  let registros = res.result.Traer_informacion_cabeceraResult;
                 console.log( registros)
                   
                  this.firstFormGroup.get('grutipo').setValue(registros.id_grupo_compra_mp)
               //   console.log(registros.id_grupo_compra_mp)
             if(registros.id_grupo_compra_mp != 0){  
              console.log('d') 
              await   this.onTagChanged( this.firstFormGroup.value.grutipo);}
                  
                  this.firstFormGroup.get('tipo').setValue(registros.id_tipo_compra_mp)
             if(registros.id_tipo_compra_mp != 0){   await   this.onTagChanged3( registros.id_tipo_compra_mp);}     
                   
                  this.firstFormGroup.get('termino').setValue(registros.id_termino_compra)
                  this.firstFormGroup.get('fecha').setValue(moment(registros.fecha_llegada).format('YYYY-MM-DD'))
                  this.firstFormGroup.get('codigo_m').setValue(registros.codigo_mercante)
            }else {
              this.presentToast('No hay informacion   de compra');
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

 cancelar(data){
  this.limpi();
  this.codigo_b=false;
  this.id_comp=null;
  this.class=null;
   if(data != 'si'){
     console.log(data)
   }else{
    console.log(data)
       this.firstFormGroup.get('compra').reset();   
   }
   this.firstFormGroup.get('grutipo').reset();
   this.firstFormGroup.get('tipo').reset();
   this.firstFormGroup.get('codigo_m').reset();
   this.firstFormGroup.get('termino').reset();
   this.firstFormGroup.get('fecha').reset();
   this.secondFormGroup.get('proveedor').reset();
   this.secondFormGroup.get('barco').reset();
   this.secondFormGroup.get('bandera').reset();
   this.secondFormGroup.get('peso').reset();
   this.secondFormGroup.get('newb').reset();
   this.thirdlim();
 }

thirdlim(){

  this.thirdFormGroup.get('FIP').setValue(false)
  this.thirdFormGroup.get('FOS').setValue(false)
  this.thirdFormGroup.get('MSC').setValue(false)
  this.thirdFormGroup.get('UE').setValue(false)
  this.thirdFormGroup.get('OM').setValue(false)
  this.thirdFormGroup.get('FAD').setValue(false)
  this.thirdFormGroup.get('legal').setValue('')
}

 nuevo(){
   this.cancelar('si');
   this.items=[]
   this.items = [...this.items];
 }

pint(data){
  this.items=this.items.filter(x => {
     
    if(x.menu.idcompra==data){
         x.co=true;
      return x
    }else{
      x.co=false;
      return x
    }
  
  });
 
}

async guardar(){
  const loading = await this.loadingController.create({ message: 'Cargando...' });
  await loading.present();
  
  if(this.secondFormGroup.value.newb){
      
    if(this.fortyFormGroup.valid){
      await  this.Barco_crear(this.fortyFormGroup.value,this.secondFormGroup.value);
    }else{
      this.presentToast('Campos Vacios para crear  un  barco');
    }

  }
   
  if(this.firstFormGroup.valid && !this.firstFormGroup.value.compra){
    
   // this.firstFormGroup.reset()
   await this.Cabecera_guardar(this.firstFormGroup.value);
    await loading.dismiss();
  }
  else if(this.firstFormGroup.value.compra){
 
     if(this.secondFormGroup.valid && this.firstFormGroup.valid && (this.thirdFormGroup.value.OM==true ||this.thirdFormGroup.value.UE==true  ) ){
      
      
      if(!this.id_comp){
        await this.Compra_Guardar(this.firstFormGroup.value,this.secondFormGroup.value,this.thirdFormGroup.value);
       }else{
        await  this.Compra_Modificar(this.firstFormGroup.value,this.secondFormGroup.value,this.thirdFormGroup.value);
       }
      
    }else if(this.secondFormGroup.value.peso<0){
      this.presentToast('Peso Incorrecto');
    }else if(this.thirdFormGroup.value.OM==false && this.thirdFormGroup.value.UE==false  ){
      this.presentToast('Tiene que selecionar OM o UE ');
    }else{
      this.presentToast('Faltan Campos por llenar *');
    }
  await loading.dismiss();
  }
  else{
    this.presentToast('Faltan Campos por llenar *');
    await loading.dismiss();
  }


 }

 
 async  Cabecera_modificar(){

  this.colaboradoServicio.body ={
    clase:{
      fecha_llegada: this.firstFormGroup.value.fecha,
      id_cabecera_compra_mp:this.firstFormGroup.value.compra,
      id_termino_compra:this.firstFormGroup.value.termino,
      id_tipo_compra_mp:this.firstFormGroup.value.tipo,
    },
    id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
   
  };

    this.colaboradoServicio.Cabecera_modificar().subscribe(
              async (res: ISoapMethodResponse) => {
                console.log(res);
                  if (res) {
                 /* if(res.result) { 
                  //  this.items13 = [];
                   // this.items13 = [...this.items13];      
                //  console.log(res.result)
                    if (res.result.Cabecera_modificarResult) {   

                      //this.presentToast('Cabecera modificar correctamente');
                      //this.cancelar('no');
    
                    }else {
                          
                    }
                    
                  }else {
                    this.presentToast('Error al modificar la cabecera');
    
                  }*/
                }else {
                  this.presentToast('Error de servidor en  Cabecera_modificar');
                }
              }
               , async (err) => {
                this.presentToast('Error de servidor en Cabecera_modificar');
              }
              
             );

 }


 async nuproveedor(){

  const alert = await this.popover.create({
    component: PopoverproveedorComponent,
    mode:'ios',
    cssClass: 'pop-over-style4',
    });
   /* alert.onDidDismiss().then((dataReturned) => {         
           console.log('s')
         });*/
        await alert.present()
 }

 async nubarco(){

  const alert = await this.popover.create({
    component: PopoverbarcoComponent,
    mode:'ios',
    cssClass: 'pop-over-style4',
    });
   /* alert.onDidDismiss().then((dataReturned) => {         
           console.log('s')
         });*/
        await alert.present()
 }

  getCellClass({ row, column, value }): any {
  
  return {
    'is-female': row.co === true
  };
 }

 limpi(){
   
  this.items=this.items.filter(x => {
         x.co=false;
       return x
  });
 }

 onTagChanged3(even){
 //console.log(even)
   if(even && this.firstFormGroup.value.grutipo =='1'  && even=='3' ){
    this.codigo_b=true;   
   }else{
    this.codigo_b=false;
    this.firstFormGroup.get('codigo_m').setValue(' ')
   }

 }

 prueb(event){
  if(event.path){
   var ClientRect1 = event.path[11].getBoundingClientRect();
   var ClientRect5 = event.path[11].getBoundingClientRect();
 
   if(ClientRect1.height < 265){
     this.class=1;
     this.tama=ClientRect5.height-4;
     let floorElements = document.getElementsByClassName("datatable-body") as HTMLCollectionOf<HTMLElement>;
     floorElements[0].style.height="265px";
     this.cont=floorElements[0].style.height;
   }else{
     this.class=0;
     this.tama=255; 
   }
  }else{
   this.class=1;
   var input = document.getElementsByClassName('datatable-body');

   if(input[0].getClientRects()[0].height < 265){
     this.class=1;
     this.tama=input[0].getClientRects()[0].height-4;
     let floorElements = document.getElementsByClassName("datatable-body") as HTMLCollectionOf<HTMLElement>;
     floorElements[0].style.height="265px";
     this.cont=floorElements[0].style.height;
   }else{
     this.class=0;
     this.tama=255;
   }

  }

    
}

async Cabecera_guardar(data){
  const loading = await this.loadingController.create({ message: 'Guardando Cabecera...' });
  await loading.present();
  this.colaboradoServicio.body =

  {
    clase:{
     codigo_mercante: data.codigo_m,
   fecha_llegada:  data.fecha,
   id_termino_compra: data.termino,
   id_tipo_compra_mp: data.tipo,
         },
   id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),

 };

 this.colaboradoServicio.Cabecera_guardar().subscribe(
  async (res: ISoapMethodResponse) => {
   console.log(res);
      if (res) {
      if(res.result) { 
      //  this.items13 = [];
       // this.items13 = [...this.items13];      
        if (res.result.Cabecera_guardarResult && res.result.Cabecera_guardarResult !=0 ) {   
          this.presentToast('Cabecera nueva completada');
          this.Traer_resumen_cabecera_mes_anio(this.fecha);
          if(this.secondFormGroup.valid && this.firstFormGroup.valid && (this.thirdFormGroup.value.OM==true ||this.thirdFormGroup.value.UE==true  ) ){
             this.firstFormGroup.get('compra').setValue(res.result.Cabecera_guardarResult);
              this.Compra_Guardar(this.firstFormGroup.value,this.secondFormGroup.value,this.thirdFormGroup.value);
          }else if(this.secondFormGroup.value.peso<0){
            this.presentToast('Peso Incorrecto');
          }else if(this.thirdFormGroup.value.OM==false && this.thirdFormGroup.value.UE==false  ){
            this.presentToast('Tiene que selecionar OM o UE ');
          }else{
            this.lim.c=1;
          this.lim.id=res.result.Cabecera_guardarResult; 
          }
         // this.nuevo();
         await loading.dismiss();

        }else {
          this.presentToast('Error al crear  nueva  cabecera');    
//          this.presentToast(res.header.err);    
        await loading.dismiss();

        }
        
      }else {
        this.presentToast('Error al modificar la cabecera');
        await loading.dismiss();

      }
    }else {
      this.presentToast('Error de servidor');
      await loading.dismiss();

    }
  }
   , async (err) => {
    this.presentToast('Error de servidor');
    await loading.dismiss();

  }
  
 );


 }
 
 async Compra_Guardar(data,data1,data2){

  const loading = await this.loadingController.create({ message: 'Guardando Compra...' });
  await loading.present();
  //var splitted = data1.barco.replace(/ /g, "").split("-", 1); 
  var splitted2 = data.materia.split("-", 2); 
 
  this.colaboradoServicio.body = {
    clase:{
     // aprobado_con_observacion: this.class.aprobado_con_observacion,
      codigo_bandera:data1.bandera,//m
      codigo_barco:data1.barco,//m
     // codigo_bue:this.class.codigo_bue,
      codigo_materia_prima:splitted2[0],//m
      codigo_proveedor:data1.proveedor,//m
      //codigo_senae:this.class.codigo_senae,
     // detalle_aprobado_con_observacion:this.class.detalle_aprobado_con_observacion,
     // detalle_documento_aprobado_con_observacion:this.class.detalle_documento_aprobado_con_observacion,
     // documento_aprobado_con_observacion:this.class.documento_aprobado_con_observacion,
      estimado_fin_descarga:moment(data.fecha).format('YYYY-MM-DD'),
     // factor_estiba_cuba:this.class.factor_estiba_cuba,
      fad_free:data2.FAD,//m
      fip:data2.FIP,//m
      fos:data2.FOS,//m
      id_cabecera_compra_mp :data.compra,
      // id_compra_mp :this.class.id_compra_mp,
     //     id_estado_compra_mp:this.class.id_estado_compra_mp,
     //    id_novedad_proceso:this.class.id_novedad_proceso,
     //TTT id_proveedor:this.class.id_proveedor,//t
     // nombre_barco:splitted[1],
      nombre_materia_prima:splitted2[1],
     // numero_viaje:splitted[2],
     // observacion:this.class.observacion,
     //  observacion_novedad_compra_cancelada:this.class.observacion_novedad_compra_cancelada,
     om:data2.OM,//m
     //   orden_compra:this.class.orden_compra,
      pesca_msc:data2.MSC,//m
      peso_estimado:data1.peso,//m
      representante:data2.legal,//m
      ue:data2.UE,//m
      unidad_peso_estimado:data1.unidad,//m
    },
    info_barco:{
      codigo_bandera:data1.bandera,
      codigo_barco:data1.barco,
      },
      id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
  };

  this.colaboradoServicio.Compra_Guardar().subscribe(
    async (res: ISoapMethodResponse) => {
      console.log(res);
        if (res) {
        if(res.result) { 
        //  this.items13 = [];
         // this.items13 = [...this.items13];      
       // console.log(res.result)
          if (res.result.Compra_GuardarResult && res.result.Compra_GuardarResult!=0 ) {        
            this.presentToast('Compra guardada completada');
             // this.cancelar('no');
             // this.Cabecera_modificar();
             //await  this.Cabecera_modificar();
            await loading.dismiss();
            this.firstFormGroup.get('compra').setValue(data.compra)
            this.Compra_traer_por_cabecera(data.compra);

          }else {
            //this.Compra_traer_por_cabecera(data.compra);
            //await this.Compra_traer_por_cabecera(data.compra);
          // await  this.firstFormGroup.get('compra').setValue(data.compra)
            this.presentToast(res.header.Error+"-"+res.header.Mensaje);
            await loading.dismiss();
            
          }
          
        }else {
          this.presentToast('Error al guardada la compra');
          await loading.dismiss();

        }
      }else {
        this.presentToast('Error de servidor en Compra_Guardar');
      }
      await loading.dismiss();
    }
     , async (err) => {
      this.presentToast('Error de servidor en Compra_Guardar');
      await loading.dismiss();
    }
    
   );

 }

 async  Compra_Modificar(data,data1,data2){
  const loading = await this.loadingController.create({ message: 'Modificado Compra...' });
  await loading.present();
  //var splitted = data1.barco.replace(/ /g, "").split("-", 3); 
  var splitted2 = data.materia.split("-", 2); 

  this.colaboradoServicio.body = {
    clase:{
     // aprobado_con_observacion: this.class.aprobado_con_observacion,
     codigo_bandera:data1.bandera,//m
     codigo_barco:data1.barco,//m
     // codigo_bue:this.class.codigo_bue,
     codigo_materia_prima:splitted2[0],//m
     codigo_proveedor:data1.proveedor,//m
      //codigo_senae:this.class.codigo_senae,
     // detalle_aprobado_con_observacion:this.class.detalle_aprobado_con_observacion,
     // detalle_documento_aprobado_con_observacion:this.class.detalle_documento_aprobado_con_observacion,
     // documento_aprobado_con_observacion:this.class.documento_aprobado_con_observacion,
     estimado_fin_descarga:moment(data.fecha).format('YYYY-MM-DD'),
     // factor_estiba_cuba:this.class.factor_estiba_cuba,
      fad_free:data2.FAD,//m
      fip:data2.FIP,//m
      fos:data2.FOS,//m
      id_cabecera_compra_mp :data.compra,
      id_compra_mp :this.class.id_compra_mp,
     //     id_estado_compra_mp:this.class.id_estado_compra_mp,
     //    id_novedad_proceso:this.class.id_novedad_proceso,
     // id_proveedor:this.class.id_proveedor,
     //  nombre_barco:this.class.nombre_barco,
     // nombre_materia_prima:this.class.nombre_materia_prima,
     // numero_viaje:this.class.numero_viaje,
     // observacion:this.class.observacion,
     //  observacion_novedad_compra_cancelada:this.class.observacion_novedad_compra_cancelada,
        om:data2.OM,//m
     //   orden_compra:this.class.orden_compra,
      pesca_msc:data2.MSC,//m
      peso_estimado:data1.peso,//m
      representante:data2.legal,//m
      ue:data2.UE,//m
      unidad_peso_estimado:data1.unidad,//m
    },
    info_barco:{
      codigo_bandera:data1.bandera,
      codigo_barco:data1.barco,
      },
    id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
  };
  this.colaboradoServicio.Compra_Modificar().subscribe(
    async (res: ISoapMethodResponse) => {
      console.log(res);
        if (res) {
        if(res.result) { 
        //  this.items13 = [];
         // this.items13 = [...this.items13];      
      //   console.log(res.result)
          if (res.result.Compra_ModificarResult) {        
            this.presentToast('Modificar la completada');
            await  this.Cabecera_modificar();
            await loading.dismiss();
            this.Compra_traer_por_cabecera(this.firstFormGroup.value.compra);
            this.cancelar('no');

          }else {
            this.presentToast('Error:'+res.header.Mensaje+" "+ res.header.Error);
            await loading.dismiss();

          }
          
        }else {
          this.presentToast('Error al modificar la compra');
          await loading.dismiss();

        }
      }else {
        this.presentToast('Error de servidor en Compra_Modificar');
      }
      await loading.dismiss();
    }
     , async (err) => {
      this.presentToast('Error de servidor en Compra_Modificar');
      await loading.dismiss();
    }
    
   );
 }

 rut(url,val){
  console.log(val)

    this.router2.navigate([url], { 
      queryParams: { 
           fecha   : val.noti.fecha_llegada, 
           id  :    val.noti.id_cabecera_compra_mp,
           idcompra:val.idcompra,
           codigo_barco: val.noti.codigo_barco
          } ,
      skipLocationChange: true
   });
  }

  async copiar(id){
 
    const loading = await this.loadingController.create({ message: 'Cargando...' });
   await loading.present();
   let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
 
   this.colaboradoServicio.body = {
     id_compra_mp: id,
     id_usuario:decrypted
   };
   
   this.colaboradoServicio.Compra_copiar_datos().subscribe(

     async   (res: ISoapMethodResponse) => { 
      // console.log(res)

       let resp = res.result.Compra_copiar_datosResult;//Compra_copiar_datosResult;
       
         // console.log(resp)
          if(resp){

           this.presentToast('Copia Realizada');
           if(this.firstFormGroup.value.compra){
            this.Compra_traer_por_cabecera(this.firstFormGroup.value.compra);
          }
            }else{
              this.presentToast(res.header.Mensaje+"-"+res.header.Error);
            }
          await loading.dismiss();
       }
     ,async(err) => { 
       await loading.dismiss();
       this.presentToast('Error de servidor');

     }
   );
 }

 async Barco_crear(data1,data2){
  const loading = await this.loadingController.create({ message: 'Cargando...' });
  await loading.present();
  let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));

/*  let res  ;

  res= this.items9.filter(re=>{
    if(re.children[0]){
      if(re.children[0].id==data2.barco){
        return  re
      }
    }
  })*/

  this.colaboradoServicio.body = {
    tipo: data1.tipob,
    nombre: data1.nombreb,
    con_origen:this.thirdFormGroup.get('UE').value,
    id_usuario:decrypted
  };

  this.colaboradoServicio.Barco_crear().subscribe(
    async   (res: ISoapMethodResponse) => { 
         console.log(res)
         if(res){
 
            if(res.result.Barco_crearResult){
              this.presentToast("Barco Creado");
              this.Barco_traer_ax();
             }else{
              this.presentToast(res.header.Mensaje+" - "+res.header.Error);   
             }

           }else{
            this.presentToast(res.header.Mensaje+" - "+res.header.Error);
           }
         await loading.dismiss();
      }
    ,async(err) => { 
      await loading.dismiss();
      this.presentToast('Error de servidor');

    }
  );

 }

 @HostListener('document:click', ['$event'])
 clickedOutside($event) {
   if ($event.target.className !== 'fa fa-ellipsis-h') {
     let floorElements = document.getElementsByClassName("datatable-body") as HTMLCollectionOf<HTMLElement>;
     if (this.cont>0) {
     //this.contextmenu = false;
     floorElements[0].style.height=this.cont+"px";
     this.cont=0;
     }else{
       floorElements[0].style.height="auto";
     }
   }
 }
}
