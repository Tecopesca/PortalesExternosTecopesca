import { Component, OnInit,ViewEncapsulation,HostListener, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Options } from 'select2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { ISoapMethodResponse } from 'ngx-soap';
import { element } from 'protractor';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { PopoverController } from '@ionic/angular';

import { PopoverelimiComponent } from 'src/app/components/popoverelimi/popoverelimi.component';
import { PopovernotifiComponent } from 'src/app/components/popovernotifi/popovernotifi.component';
import { Router ,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-comprasmp',
  templateUrl: './comprasmp.page.html',
  styleUrls: ['./comprasmp.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ComprasmpPage implements OnInit {
  cont:any;
  fecha :any;
  fecham :any;
  public fil  = [];
  public options: Options;
  ColumnMode = ColumnMode;
  sel = [];
  ////table
  items = [];
  itemscop = [];
  rawEvent: any;
  contextmenuRow: any;
  contextmenuColumn: any;
  public contextmenu = false;
  public contextmenuX: any;
  public contextmenuY: any;
   public class :any;
   tama: any;
  ////////select 
  public  items2 :Array<{  id:string; text:string   }>= [];
  public  items3 :Array<{  id:string; text:string ,c:string  }>= [];
  public  items4 :Array<{  id:string; text:string ,c:string  }>= [];
  public  items5 :Array<{  id:string; text:string ,c:string  }>= [];
  public  items6 :Array<{  id:string; text:string ,c:string  }>= [];
  public  items7 :Array<{  id:string; text:string ,c:string  }>= [];
  public  items8 :Array<{  id:string; text:string ,c:string  }>= [];
  public  items9 :Array<{  id:string; text:string ,c:string  }>= [];
  
  public  items3cop  :Array<{  id:string; text:string ,c:string   }>= [];
  public  items4cop  :Array<{  id:string; text:string ,c:string  }>= [];
  public  items5cop  :Array<{  id:string; text:string ,c:string  }>= [];
  public  items6cop  :Array<{  id:string; text:string ,c:string  }>= [];
  public  items7cop  :Array<{  id:string; text:string ,c:string  }>= [];
  public  items8cop  :Array<{  id:string; text:string ,c:string  }>= [];
  public  items9cop  :Array<{  id:string; text:string ,c:string  }>= [];
   
  constructor(
     private alertCtrl: AlertController
     ,public toast: ToastController  
     ,public loadingController: LoadingController
     ,private colaboradoServicio: ColaboradorService
     ,private encrdecr:EncrDecrServiceService
     ,public popover: PopoverController
     ,private router: Router
     ,private router2: ActivatedRoute
      //,private el:ElementRef
    ) {  
    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"     
      }
      ,width: '100%'
    }
  }

  //@HostListener('ngx-datatable') onMouseEnter(){
  //  console.log(this.el.nativeElement);

  //  console.log('Alto-->' + this.el.nativeElement.offsetHeight);  
  //  console.log('Ancho-->' + this.el.nativeElement.offsetWidth);    
 // }

  ngOnInit() {
    this.router2.queryParams.subscribe(params => {
      if(params['fecha']){
        //  console.log(params['id'])   
    // console.log(params['idcompra'])  
        
     var data1 = new Date(params['fecha'])
        var date = moment(data1).format('YYYY-MM-DD');
        this.fecha=date;
        this.mydate1(this.fecha); 
        
      }else{
        this.det(); 
      }
    })


  }

  det(){
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

  mydate1( v) {
   // console.log(v)
    if(v){
      var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
       var splitted = v.split("-", 3); 
    //  console.log(splitted[1]);
      this.Traer_resumen_cabecera_mes_anio(v);
          var  p = +splitted[1];
       //   console.log(p); 
       //   console.log(meses[p]); 
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

    this.colaboradoServicio.Traer_resumen_compra_mes_anio().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items = [];
        this.items2 = [];
        this.items3 = [];
        this.items4 = [];
        this.items5 = [];
        this.items6 = [];
        this.items7 = [];
        this.items8 = [];
        this.items9 = [];
        
        this.itemscop = [];
        this.items = [...this.items];
        this.items2 = [...this.items2];
        this.items3 = [...this.items3];
        this.items4 = [...this.items4];
        this.items5 = [...this.items5];
        this.items6 = [...this.items6];
        this.items7 = [...this.items7];
        this.items8 = [...this.items8];
        this.items9 = [...this.items9];
          let co;
        if (res) {
          if(res.result) { 
           console.log(res.result)

            if (res.result.Traer_resumen_compra_mes_anioResult) {
              if (res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN) {
                //console.log(res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN)
                let registros = res.result.Traer_resumen_compra_mes_anioResult.informacion_compra_estadoCN;
  
                this.items2.push({id:"3",text:"Todos" });
                this.items3.push({id:"3",text:"Todos",c:""});
                this.items4.push({id:"3",text:"Todos",c:""});
                this.items5.push({id:"3",text:"Todos",c:""});
                this.items6.push({id:"3",text:"Todos",c:""});
                this.items7.push({id:"3",text:"Todos",c:""});
                this.items8.push({id:"3",text:"Todos",c:""});
                this.items9.push({id:"3",text:"Todos",c:""});

                registros.forEach(ele=>{
                 
                  this.items2.push({id:ele.informacion_compra_mp.codigo_compra_mp,text:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items3.push({id:ele.informacion_compra_mp.nombre_tipo_compra_mp,text:ele.informacion_compra_mp.nombre_tipo_compra_mp,c:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items4.push({id:ele.informacion_compra_mp.nombre_proveedor,text:ele.informacion_compra_mp.nombre_proveedor,c:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items5.push({id:ele.informacion_compra_mp.nombre_barco, text : ele.informacion_compra_mp.nombre_barco,c:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items6.push({id:moment(ele.informacion_compra_mp.fecha_llegada).format('YYYY-MM-DD') , text : moment(ele.informacion_compra_mp.fecha_llegada).format('YYYY-MM-DD'),c:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items7.push({id:ele.informacion_compra_mp.nombre_materia_prima , text : ele.informacion_compra_mp.nombre_materia_prima,c:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items8.push({id:ele.informacion_compra_mp.peso_estimado+""+ele.informacion_compra_mp.unidad_peso_estimado , text : ele.informacion_compra_mp.peso_estimado+""+ele.informacion_compra_mp.unidad_peso_estimado,c:ele.informacion_compra_mp.codigo_compra_mp});
                  this.items9.push({id:ele.informacion_compra_mp.numero_viaje , text : ele.informacion_compra_mp.numero_viaje,c:ele.informacion_compra_mp.codigo_compra_mp});

                  if( ele.informacion_compra_mp.color_grupo_compra_mp=='#ffcc5c') {
                    co="I"
                  }else if(ele.informacion_compra_mp.color_grupo_compra_mp=='#7BA7E1'){
                    co="L"
                  }
               //   console.log(ele);
                    let es=null
                    if(ele.detalle_estados){
                        es=ele.detalle_estados.resumen_estado_compra_mpCN
                    }
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
                   })
                })              
                this.items = [...this.items];
                this.itemscop = this.items;
                this.items3cop = this.items3;
                this.items4cop = this.items4;
                this.items5cop = this.items5;
                this.items6cop = this.items6;
                this.items7cop = this.items7;
                this.items8cop = this.items8;
                this.items9cop = this.items9;
                this.filtercombos();
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

  getCellClass({ row, column, value }): any {

    return {
      'negri': row.estado.pint == true
    };
  }

  filtercombos(){
    this.items2 =  this.items2.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.items3 =  this.items3.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });  
     this.items4 =  this.items4.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.items5 =  this.items5.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.items6 =  this.items6.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.items7 =  this.items7.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.items8 =  this.items8.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    this.items9 =  this.items9.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  onTagChanged(data): void {
      
    if(data && data !='3'){   
      this.items3 = this.items3cop.filter(number => number.c===data ||  number.c=="");
    //  console.log( this.items21);
      this.items4 = this.items4cop.filter(number => number.c===data ||  number.c=="");
      this.items5 = this.items5cop.filter(number => number.c===data ||  number.c=="");
      this.items6 = this.items6cop.filter(number => number.c===data ||  number.c=="");
      this.items7 = this.items7cop.filter(number => number.c===data ||  number.c=="");
      this.items8 = this.items8cop.filter(number => number.c===data ||  number.c=="");
      this.items9 = this.items9cop.filter(number => number.c===data ||  number.c=="");
      //this.items2=  this.items2.reverse();
     // console.log( this.items41);
      this.filtercombos();
    } else if(data ==='3'){
      this.items3 = this.items3cop;
      this.items4 = this.items4cop;
      this.items5 = this.items5cop;
      this.items6 = this.items6cop;
      this.items7 = this.items7cop;
      this.items8 = this.items8cop;
      this.items9 = this.items9cop;
      this.filtercombos();
     } 

  }

  updateFilter() {
    this.sel = [];
    let cont =0;
    let cont2 =0;  
  Object.keys(this.fil).forEach(element=>{
    
  if(this.fil[element] &&  this.fil[element]!='3'){
    this.sel.push({ 'value' :  this.fil[element],'keys': element });
    cont++ 
  }
    else if(this.fil[element]){
      cont2++ 
    }
  })
  if(cont==1){    
    this.filtro(this.sel[0].keys,this.sel[0].value);
  }else if(cont==2){
    this.filtro2(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value);
  }
  else if(cont==3){
    this.filtro3(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value,this.sel[2].keys,this.sel[2].value);
  }
  else if(cont==4){
    this.filtro4(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value,this.sel[2].keys,this.sel[2].value,this.sel[3].keys,this.sel[3].value);
  }
  else if(cont==5){
    this.filtro5(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value,this.sel[2].keys,this.sel[2].value,this.sel[3].keys,this.sel[3].value,this.sel[4].keys,this.sel[4].value);
  }
  else if(cont==6){
    this.filtro6(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value,this.sel[2].keys,this.sel[2].value,this.sel[3].keys,this.sel[3].value,this.sel[4].keys,this.sel[4].value,this.sel[5].keys,this.sel[5].value);
  }
  else if(cont==7){
    this.filtro7(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value,this.sel[2].keys,this.sel[2].value,this.sel[3].keys,this.sel[3].value,this.sel[4].keys,this.sel[4].value,this.sel[5].keys,this.sel[5].value,this.sel[6].keys,this.sel[6].value);
  }
  else if(cont==8){
    this.filtro8(this.sel[0].keys,this.sel[0].value,this.sel[1].keys,this.sel[1].value,this.sel[2].keys,this.sel[2].value,this.sel[3].keys,this.sel[3].value,this.sel[4].keys,this.sel[4].value,this.sel[5].keys,this.sel[5].value,this.sel[6].keys,this.sel[6].value,this.sel[7].keys,this.sel[7].value);
  }
  else if(cont==0 && cont2>0){
      this.items=this.itemscop;
  }
   
  if(this.items.length==0){this.presentToast('Sin resultado')}

  }

  filtro(int1,val){
    const keys = Object.keys(this.itemscop[0]);
       this.items = this.itemscop.filter(item => {  
        if ( item[keys[int1]] === val  ) {
          return true;
        }
      });
         
  }

  filtro2(int1,value1,int2,val2){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  ) { 
          return true;
        }
    });
  }
 
  filtro3(int1,value1,int2,val2,int3,val3){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  &&  item[keys[int3]] ===val3  ) {
          return true;
        }
    });
      
    
   

  }

  filtro4(int1,value1,int2,val2,int3,val3,int4,val4){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  &&  item[keys[int3]] ===val3 &&  item[keys[int4]] ===val4    ) {
          return true;
        }
    });
      
  }

  filtro5(int1,value1,int2,val2,int3,val3,int4,val4,int5,val5){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  &&  item[keys[int3]] ===val3 &&  item[keys[int4]] ===val4 &&  item[keys[int5]] ===val5   ) {
          return true;
        }
    });

      
  }

  filtro6(int1,value1,int2,val2,int3,val3,int4,val4,int5,val5,int6,val6){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  &&  item[keys[int3]] ===val3 &&  item[keys[int4]] ===val4 &&  item[keys[int5]] ===val5 &&  item[keys[int6]] ===val6   ) {
          return true;
        }
    });     
  }

  filtro7(int1,value1,int2,val2,int3,val3,int4,val4,int5,val5,int6,val6,int7,val7){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  &&  item[keys[int3]] ===val3 &&  item[keys[int4]] ===val4 &&  item[keys[int5]] ===val5 &&  item[keys[int6]] ===val6 &&  item[keys[int7]] ===val7   ) {
          return true;
        }
    });     
  }
  
  filtro8(int1,value1,int2,val2,int3,val3,int4,val4,int5,val5,int6,val6,int7,val7,int8,val8){
    const keys = Object.keys(this.itemscop[0]); 
      this.items = this.itemscop.filter(item => {   
        if ( item[keys[int1]] ===value1 &&  item[keys[int2]] ===val2  &&  item[keys[int3]] ===val3 &&  item[keys[int4]] ===val4 &&  item[keys[int5]] ===val5  &&  item[keys[int6]] ===val6 &&  item[keys[int7]] ===val7 &&  item[keys[int8]] ===val8   ) {
          return true;
        }
    });     
  }

  actualizar(){
        this.mydate1(this.fecha);       
     
        Object.keys(this.fil).forEach(element=>{
           
         this.fil[element] =null
        })
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
            this.actualizar();
             }else{
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
  
  async confirmar(id){
 
    const loading = await this.loadingController.create({ message: 'Cargando...' });
   await loading.present();
   let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='));
  // console.log(id);
  // console.log(decrypted)
   this.colaboradoServicio.body = {
     id_compra_mp: id,
     id_usuario:decrypted
   };
   
   this.colaboradoServicio.Confirmar_negociacion().subscribe(

     async   (res: ISoapMethodResponse) => { 
     // console.log(res)
       let resp = res.result.Confirmar_negociacionResult;//Compra_copiar_datosResult;
       
      // console.log(resp)

          if(resp){

           this.presentToast('Confirmar Realizada');

            }else{
             this.presentToast(res.header.Mensaje);
            }
          await loading.dismiss();
       }
     , async (err) => { 
      await loading.dismiss();
       this.presentToast('Error de servidor');
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
  const loading = await this.loadingController.create({ message: 'Cargando...' });
 await loading.present();
  this.colaboradoServicio.body = {
   id_compra_mp: id,
 };
 this.colaboradoServicio.Confirmar_negociacion().subscribe(
   async   (res: ISoapMethodResponse) => { 
  // console.log(res)
     let resp = res.result.Confirmar_negociacionResult;//Compra_copiar_datosResult;
  //  console.log(resp)
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
  //console.log(id)
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
           this.actualizar();
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
            this.actualizar();
           }
          });
           return await alert.present()
          
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
  const loading = await this.loadingController.create({ message: 'Cargando...' });
  await loading.present();
  this.colaboradoServicio.body = {
    id_compra_mp: id,
  };
  this.colaboradoServicio.Imprimir_contrato().subscribe(
    async   (res: ISoapMethodResponse) => { 
     //console.log(res)
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
          this.presentToast(' Contrato impreso con exito');
           }else{
            this.presentToast(res.header.Mensaje+"-"+res.header.Error);
           }
           await loading.dismiss();
      }
    , async (err) => { 
      this.presentToast('Error de servidor');
      await loading.dismiss();
    }
  );
 }

  
 async  poponoti(id){
   // console.log(id);
    
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

 /*onTableContextMenu(contextMenuEvent) {
  console.log(contextMenuEvent);

  this.contextmenuX = contextMenuEvent.event.pageX;
  this.contextmenuY = contextMenuEvent.event.pageY ;
  console.log(contextMenuEvent.event.path[22])
  this.contextmenu = true;
  contextMenuEvent.event.preventDefault();
  contextMenuEvent.event.stopPropagation();
  var ClientRect = contextMenuEvent.event.path[22].getBoundingClientRect();
  console.log(ClientRect)
} 
*/
@HostListener('document:click', ['$event'])
  clickedOutside($event) {
    if ($event.target.className !== 'fa fa-ellipsis-h') {
      let floorElements = document.getElementsByClassName("datatable-body") as HTMLCollectionOf<HTMLElement>;
      if (this.cont>0) {
      this.contextmenu = false;
      floorElements[0].style.height=this.cont+"px";
      this.cont=0;
      }else{
        floorElements[0].style.height="auto";
      }
    }
  }

  rut(url,val){
  console.log(val)

    this.router.navigate([url], { 
      queryParams: { 
           fecha   : val.noti.fecha_llegada, 
           id  :    val.noti.id_cabecera_compra_mp,
           idcompra:val.idcompra,
           codigo_barco: val.noti.codigo_barco
          } ,
      skipLocationChange: true
   });
  }

}
