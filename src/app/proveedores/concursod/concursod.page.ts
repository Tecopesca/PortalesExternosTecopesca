import { Component, OnInit, ViewChild ,ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import { ToastController, IonSegment } from '@ionic/angular';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {ProveedorService} from '../../servicios/proveedor.service';
import {Observable} from 'rxjs';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { isError } from 'util';
import { Options } from 'select2';
import { ActivatedRoute } from '@angular/router';

import { PruComponent } from 'src/app/components/pru/pru.component';
import { IfStmt } from '@angular/compiler';

@Component({  
  selector: 'app-concursod',
  templateUrl: './concursod.page.html',
  styleUrls: ['./concursod.page.scss'],
  encapsulation: ViewEncapsulation.None

})

export class ConcursodPage implements OnInit {
 tico :string;
  pet:string;
  titulo :Observable<any>;
  client2: Client;
  ColumnMode = ColumnMode;
  public fil: any={};
  public isError = false;
  public temp: Array<object> = [];
  public options: Options;
  public res: any={};

  //public items: Array<{  }> = [];
  items = [];
  itemscop = [];
  items21 =[];
  items41 =[];
  items31 =[];
  public  items2 :Array<{  id:string; text:string ; a :string  }>= [];
  public  items3 :Array<{  id:string; text:string ;a:string;m:string}>= [];
  public  items4 :Array<{  id:string; text:string ;   }>= [];

  constructor(private rutaActiva: ActivatedRoute,private alertCtrl: AlertController,public popover: PopoverController, public prove:ProveedorService ,public toast: ToastController,private encrdecr:EncrDecrServiceService,private soap: NgxSoapService) {
    this.pet = this.rutaActiva.snapshot.params.parametro;

    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"
      }}
    this.soap.createClient(environment.proveedorproceso)
    .then(client => {
      this.client2 = client;
      console.log(this.rutaActiva.snapshot.params.parametro)
      localStorage.setItem('seg',this.rutaActiva.snapshot.params.parametro);
        
      if(this.rutaActiva.snapshot.params.parametro=='Solicitudes'){
        this.solicitudes();
        this.isError=false;
  
         } 
        else if(this.rutaActiva.snapshot.params.parametro=='Curso'){
            this.curso();
            this.isError=false;
       } 
        else  if(this.rutaActiva.snapshot.params.parametro=='Finalizados'){
         this.finalizados();
         this.isError=true;
      
      }
    })
    .catch(err => err);
  
  
  }

  ngOnInit( ){
    
  }


  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  
  segmentChanged(ev: any) {
    
       localStorage.setItem('seg',ev.detail.value);
         
    if(ev.detail.value=='Solicitudes'){
      this.solicitudes();
      this.isError=false;

       } 
      else if(ev.detail.value=='Curso'){
          this.curso();
          this.isError=false;
     } 
      else  if(ev.detail.value=='Finalizados'){
       this.finalizados();
       this.isError=true;
    
    }
     
   // this.items = this.items.filter(number => number.filtro===ev.detail.value);

  }


  async solicitudes(){
    this.items2=[]
    this.items3=[]
    this.items4=[] 
    this.items21=[]
    this.items31=[]
    this.items41=[] 
    this.itemscop=[]
    await  this.limpi();
     this.titulo=  await   this.prove.gettitulo('1');
     this.tico= "Ver";

    // console.log(localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
    const body = { id_usuario:decrypted };
    var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

    await (<any>this.client2).traer_solicitud_compra(body).subscribe(
      (res: ISoapMethodResponse) => {
        this.items2 = [...this.items2];
        this.items3 = [...this.items3];
        this.items4 = [...this.items4];
      
        if (res.result.traer_solicitud_compraResult) {
          let response = res.result.traer_solicitud_compraResult.solicitud_compraCN;
          if (response) {
            console.log(response);

              this.items2.push({id:"3",text:"Todos",a:""});
              this.items3.push({id:"3",text:"Todos",a:"",m:""});
              this.items4.push({id:"3",text:"Todos" });
            
            response.forEach(ele => {
              var date = new Date(ele.fecha_entrega);
              var date2 = new Date(ele.fecha_proceso_Activo);

              this.items2.push({id:meses[date.getMonth()],text:meses[date.getMonth()],a:""+date.getFullYear()});
              this.items3.push({id:ele.actividad,text:ele.actividad,a:""+date.getFullYear(),m:meses[date.getMonth()]});
              this.items4.push({id:""+date.getFullYear(),text:""+date.getFullYear() });
            
              this.items.push({
                filtro:'Solicitudes' ,
                anio:""+date.getFullYear()+"",
                mes:""+meses[date.getMonth()],
                referencia: ele.codigo_compra,
                actividad: ele.actividad,
                f_entrega: date.getDate()+" de "+meses[date.getMonth()]+" del "+date.getFullYear()+"" ,
                pro_activo: date2.getDate()+" de "+meses[date2.getMonth()]+" del "+date2.getFullYear()+"" ,
                ico: {detalles: ele.detalles_compra,id_usuario:body,actividad:ele.actividad,fecha: date.getDate()+" de "+meses[date.getMonth()]+","+date.getFullYear()+""} 
              });
             

             // this.items = [...this.items];
  
            });
            this.items = this.items.filter(number => number.filtro=== localStorage.getItem('seg'));
            this.items21=this.items2 ;
            this.items41=this.items4 ;
            this.items31=this.items3 ;
           
           this.filtercombos();
           this.filtercombos2();
           this.itemscop=this.items; 
           // this.items = this.items.filter(number => number.filtro===ev );
            }
        }else{
          this.presentToast('En Curso Sin Datos');

        }
      }
      ,(err) => { 
        console.log(err);
        this.presentToast('Error de servidor');
      }
    );

  }

  async    curso(){      
    this.items2=[]
    this.items3=[]
    this.items4=[] 
    this.items21=[]
    this.items31=[]
    this.items41=[] 
    this.itemscop=[]

    await  this.limpi();
      this.titulo=  await  this.prove.gettitulo('2');
      this.tico= "Acciones";

      let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
      const body = { id_usuario: decrypted };
     var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
 
     await (<any>this.client2).traer_en_concurso(body).subscribe(
      (res: ISoapMethodResponse) => {
       console.log(res);
        if (res.result.traer_en_concursoResult) {
            this.items2 = [...this.items2];
            this.items3 = [...this.items3];
            this.items4 = [...this.items4];

            let response = res.result.traer_en_concursoResult.solicitud_compraCN;
          if (response) {
            console.log(response);
            
            this.items2.push({id:"3",text:"Todos",a:""});
            this.items3.push({id:"3",text:"Todos",a:"",m:""});
            this.items4.push({id:"3",text:"Todos" });
            response.forEach(ele => {
              var date = new Date(ele.fecha_entrega);
              var date2 = new Date(ele.fecha_proceso_Activo);

              this.items2.push({id:meses[date.getMonth()],text:meses[date.getMonth()],a:""+date.getFullYear()});
              this.items3.push({id:ele.actividad,text:ele.actividad,a:""+date.getFullYear(),m:meses[date.getMonth()]});
              this.items4.push({id:""+date.getFullYear(),text:""+date.getFullYear() });
            
             
              this.items.push({
                filtro:'Curso' ,
                anio:""+date.getFullYear()+"",
                mes:""+meses[date.getMonth()],
                referencia: ele.codigo_compra,
                actividad: ele.actividad,
                f_proceso: date2.getDate()+" de "+meses[date2.getMonth()]+" del "+date2.getFullYear()+"",
                f_entrega: date.getDate()+" de "+meses[date.getMonth()]+" del "+date.getFullYear()+"" ,
                estado:   'En concurso',
                ico: {detalles: ele.detalles_compra , id_usuario:body,id_compra:ele.id_compra,metodo:1,actividad:ele.actividad,fecha: date.getDate()+" de "+meses[date.getMonth()]+","+date.getFullYear()+""} 
              }); 
             //    this.items = [...this.items];
            });
            this.items = this.items.filter(number => number.filtro=== localStorage.getItem('seg'));
            this.items21=this.items2 ;
            this.items41=this.items4 ;
            this.items31=this.items3 ;
           
           this.filtercombos();
           this.filtercombos2();
           this.itemscop=this.items ; 
           }
        }else{
          this.presentToast('En Curso Sin Datos');

        }
      }
      ,(err) => { 
        console.log(err);
        this.presentToast('Error de servidor');
      }
    );
  }

  async   finalizados(){   
    this.items2=[]
    this.items3=[]
    this.items4=[] 
    this.items21=[]
    this.items31=[]
    this.items41=[]
    this.itemscop=[]
    this.tico= "Acciones";

    await  this.limpi();
     this.titulo=  await   this.prove.gettitulo('3');
     let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));
     const body = { id_usuario: decrypted };
       var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
   
       await   (<any>this.client2).traer_solicitud_en_compromiso(body).subscribe(
      (res: ISoapMethodResponse) => {
       console.log(res);
        if (res.result.traer_solicitud_en_compromisoResult) {
          let response = res.result.traer_solicitud_en_compromisoResult.solicitud_compraCN;
          if (response) {
            console.log(response);

            this.items2 = [...this.items2];
            this.items3 = [...this.items3];
            this.items4 = [...this.items4];
            
            this.items2.push({id:"3",text:"Todos",a:""});
            this.items3.push({id:"3",text:"Todos",a:"",m:""});
            this.items4.push({id:"3",text:"Todos" });
            response.forEach(ele => {
              var date = new Date(ele.fecha_entrega);
              var date2 = new Date(ele.fecha_proceso_Activo);

             this.items2.push({id:meses[date.getMonth()],text:meses[date.getMonth()],a:""+date.getFullYear()});
             this.items3.push({id:ele.actividad,text:ele.actividad,a:""+date.getFullYear(),m:meses[date.getMonth()]});
             this.items4.push({id:""+date.getFullYear(),text:""+date.getFullYear() });
           
             this.items.push({
                filtro:'Finalizados',
                anio:""+date.getFullYear()+"",
                mes:""+meses[date.getMonth()],
                referencia: ele.codigo_compra,
                actividad: ele.actividad,
                f_entrega: date.getDate()+" de "+meses[date.getMonth()]+" del "+date.getFullYear()+"" ,
                estado: 'Verificado' ,
                ico: {detalles: ele.detalles_compra,id_compra:ele.id_compra,metodo:2,actividad:ele.actividad,fecha: date.getDate()+" de "+meses[date.getMonth()]+","+date.getFullYear()+""} 
              });
           
              
            });
      
            this.items2 = [...this.items2];
            this.items3 = [...this.items3];
            this.items4 = [...this.items4];
            this.items = this.items.filter(number => number.filtro=== localStorage.getItem('seg'));
          //  console.log( this.items);
            this.items21=this.items2 ;
            this.items41=this.items4 ;
            this.items31=this.items3 ;

           this.filtercombos();
           this.filtercombos2();
           this.itemscop=this.items ; 
          // console.log( this.items);
           }
        }else{
          this.presentToast('En Curso Sin Datos');

        }
      }
      ,(err) => { 
        console.log(err);
        this.presentToast('Error de servidor');
      }
    );
  }


    limpi(){
    this.items=[];
    this.titulo=null;
  }

  async ver(item,) {
    console.log(item);
    localStorage.setItem('provmo','false');


    if(item.detalles){ 
    const alert = await this.popover.create({
    component: PruComponent,
    mode:'ios',
    componentProps:{page:item},
    cssClass: 'pop-over-style2',
    });

    alert.onDidDismiss().then((dataReturned) => {
         

          if(localStorage.getItem('provmo') == 'true' ){
            console.log(this.pet);
            this.actualizar(this.pet);
          }
    });

        await alert.present();

   }else {
    this.presentToast('Sin Detalles ');
   }
    
  }

   eli(id){
     console.log(id);
     if(id.metodo==1){
      this.alert2(id);


     }else if(id.metodo==2){
          this.alert(id);
     }
   }

   elicotiz(body){
     console.log(body);
    (<any>this.client2).eliminar_cotizacion(body).subscribe(
      (res: ISoapMethodResponse) => {
       console.log(res);
       if(res.result.eliminar_cotizacionResult){
        this.presentToast('Eliminado Correcta');
        this.curso();
      }else{
        this.presentToast('Eliminacion No Completada');

      }
      }
      ,(err) => { 
        console.log(err);
        this.presentToast('Error de servidor');
      }
    );

   }

   async alert(id){
    console.log(id.detalles);
    const alert = await this.alertCtrl.create({
      header: 'Motivo por el que Cancela ',
      cssClass: 'btnalert',
     
      inputs: [
        
        {
        name: 'motivo',
        placeholder: 'Motivo' ,
        id :'ss',
        },
        ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'btnalert1',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar', 
          cssClass: 'btnalert1',
          handler: (data) => {
            console.log(data); 
            if (data.motivo!="") {
              // logged in!
              id.detalles.detalles_compraCN.forEach(element => {
                console.log(element.id_cotizacion);

                const body = { id_cotizacion: element.id_cotizacion , detalles_cancelacion:data.motivo };
                 this.elicompromiso(body);

              });
            } else {
              // invalid login
              this.presentToast('Campo vacio');
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }
  async alert2(id){
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
            let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));

             const body = {  id_compra:id.id_compra,id_usuario: decrypted };
    
             this.elicotiz(body);
          }
        }
      ]
    });

    

    await alert.present();
  }

   elicompromiso(body){
     
    (<any>this.client2).eliminar_compromiso(body).subscribe(
      (res: ISoapMethodResponse) => {
        console.log(res.result.eliminar_compromisoResult);
        if(res.result.eliminar_compromisoResult){
          this.finalizados();
          this.presentToast('Eliminacion correcta');

        }else{
          this.presentToast('Eliminacion No Completada');

        }
      }
      ,(err) => { 
        console.log(err);
        this.presentToast('Error de servidor');
      }
    );

   }

   updateFilter() {

    

      if((this.fil.referencia && !this.fil.fecha && !this.fil.actividad) || (this.fil.referencia && this.fil.fecha=='3' && this.fil.actividad=='3')   ){
        
        if(this.fil.referencia !='3'){
          this.filtro(this.fil.referencia,2);

        }else{
          this.items=this.itemscop

        }
      }
      else if((this.fil.actividad && !this.fil.referencia && !this.fil.fecha) || (this.fil.referencia=='3' && this.fil.fecha=='3' && this.fil.actividad)){
        if(this.fil.actividad !='3'){
          this.filtro(this.fil.actividad,4);
        }else{
          this.items=this.itemscop
        }

        }

      else if((this.fil.fecha && !this.fil.actividad && !this.fil.referencia) || (this.fil.referencia=='3' && this.fil.fecha && this.fil.actividad=='3')){
 
        if(this.fil.fecha !='3'){
          this.filtro(this.fil.fecha,1);
 
        }else{
          this.items=this.itemscop
 
        }
          
      }
        
      else if(!this.fil.fecha && this.fil.actividad && this.fil.referencia  || (this.fil.referencia && this.fil.fecha=='3' && this.fil.actividad) ){
          console.log(this.itemscop)
               if(this.fil.actividad !='3'  && this.fil.referencia !='3'  ){
                this.filtro2(this.fil.referencia,2,this.fil.actividad,4);
               } else if (this.fil.actividad !='3' && this.fil.referencia =='3'  ){
                this.filtro(this.fil.actividad,4);

               }
               else if (this.fil.actividad =='3' && this.fil.referencia !='3'  ){
                this.filtro(this.fil.referencia,2);

               } else {
                this.items=this.itemscop

               }

      }
      
      else if(this.fil.fecha && this.fil.actividad && !this.fil.referencia  || (this.fil.referencia=='3'  && this.fil.fecha && this.fil.actividad) ){
        console.log(this.itemscop)
        if(this.fil.actividad !='3'  && this.fil.fecha !='3'  ){
          this.filtro2(this.fil.fecha,1,this.fil.actividad,4);
        } else if (this.fil.actividad !='3' && this.fil.fecha =='3'  ){
         this.filtro(this.fil.actividad,4);

        }
        else if (this.fil.actividad =='3' && this.fil.fecha !='3'  ){
          this.filtro(this.fil.fecha,1);
     
        } else {
         this.items=this.itemscop

        }
      }
      
      
      else if(this.fil.fecha && !this.fil.actividad && this.fil.referencia || (this.fil.referencia  && this.fil.fecha && this.fil.actividad=='3') ){
         if(this.fil.referencia !='3'  && this.fil.fecha !='3'  ){
          this.filtro2(this.fil.fecha,1,this.fil.referencia,2);
        } else if (this.fil.referencia !='3' && this.fil.fecha =='3'  ){
         this.filtro(this.fil.referencia,2);

        }
        else if (this.fil.referencia =='3' && this.fil.fecha !='3'  ){
          this.filtro(this.fil.fecha,1);
     
        } else {
         this.items=this.itemscop

        }
      
      }
      
      else if(this.fil.fecha && this.fil.actividad && this.fil.referencia ){
        console.log(this.itemscop)

        this.filtro3(this.fil);
       }
      else if(!this.fil.fecha && !this.fil.actividad && !this.fil.referencia ){
        this.presentToast('Campos Vacios ');
       }


    
 

   
    
   if(this.items.length==0){this.presentToast('Sin resultado')}

   }


  filtro(val,int){
    const value = val;
    const keys = Object.keys(this.itemscop[0]);
    
    this.items = this.itemscop.filter(item => {
       
        if ( item[keys[int]] ===value   ) {
          
          return true;
        }
    });
  }
  filtro2(val,int,val2,int2){
    const value = val;
    const keys = Object.keys(this.itemscop[0]);
    
    this.items = this.itemscop.filter(item => {
        
        if ( item[keys[int]] ===value &&  item[keys[int2]] ===val2  ) {
          console.log('si');
          return true;
        }
    });
  }
  filtro3(val){
    const keys = Object.keys(this.items[0]);
    this.items = this.itemscop.filter(item => {
  
        if ( item[keys[1]] ===val.fecha && item[keys[2]] ===val.referencia && item[keys[4]] ===val.actividad) {
         
          return true;
        }
    });
  }

  actualizar(act){


    if(act=='Solicitudes'){

      this.solicitudes();

       } 
      else if(act=='Curso'){

          this.curso();
     } 
      else  if(act=='Finalizados'){
        this.finalizados();       
        this.fil.referencia=null;
        this.fil.actividad=null;
        this.fil.fecha=null;

    }
   
  }

  filtercombos(){
      
    this.items2 =  this.items2.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    
    this.items3 =  this.items3.filter((valorActual, indiceActual, arreglo) => {         
    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text )) === indiceActual
    });

    this.items4 =  this.items4.filter((valorActual, indiceActual, arreglo) => {         
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text )) === indiceActual
      });
  }

  filtercombos2(){      
    this.items =  this.items.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo ) === JSON.stringify(valorActual)) === indiceActual
    });
    
  }

  onTagChanged(data): void {
      
    if(data && data !='3'){   
      this.items2 = this.items21.filter(number => number.a===data||  number.a=="");
    //  console.log( this.items21);
      this.items3 = this.items31.filter(number => number.a===data ||  number.a=="");
      //this.items2=  this.items2.reverse();
     // console.log( this.items41);
      this.filtercombos();
    } else if(data ==='3'){
      this.items3 = this.items31;
     } 

  }

  
  onTagChanged2(data): void {
    if(data && data !='3'){
      this.items3 = this.items31.filter(number => number.m===data ||  number.m=="");
      //this.items2=  this.items2.reverse();
      console.log( this.items31);

      this.filtercombos();
     }else if(data ==='3'){
      this.items3 = this.items31;
     } 

  }

  

}