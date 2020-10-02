import { Directive,Component, OnInit ,Input} from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { PopoverController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ISoapMethodResponse } from 'ngx-soap';
import {  ProveedorService } from '../../servicios/proveedor.service';
import { ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSoapService, Client } from 'ngx-soap';
import { configProveedores } from '../../../environments/environment';
import { isError } from 'util';
import { EncrDecrServiceService } from '../../servicios/encrdecrservice.service';

import { Options } from 'select2';

@Component({
  selector: 'app-pru',
  templateUrl: './pru.component.html',
  styleUrls: ['./pru.component.scss'],
})

export class PruComponent implements OnInit {
  ColumnMode = ColumnMode;
  public fil: any={};
  public page: any={};
   itemscop = [];
  precio = [];
  items = [];
  fecha = [];
  fecham = [];

  client: Client;
  public isError = false;

   date;
  imageData: any;
  sanitzedImageData: any;
  public options: Options;
  constructor(private encrdecr:EncrDecrServiceService,private soap: NgxSoapService,private sanitizer: DomSanitizer,public toast: ToastController,private proveedors: ProveedorService,private alertCtrl: AlertController, public popover: PopoverController, private navParams: NavParams) {

    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"
      }}
    }

  ngOnInit() {
    this.page = this.navParams.get('page');
      console.log(this.page.detalles.detalles_compraCN);
      this.search();
      if(this.page.id_usuario){
        this.isError = true;
        }
       }
  
  search(){
    var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    this.items=[]
    this.fecham=[]

    this.fecha=[]
    this.precio=[];
    let cont=0;    
    console.log(this.page);
    this.page.detalles.detalles_compraCN.forEach(element => {
      

         var pre ;
         var fe;
         if(this.page.id_usuario && (!this.page.metodo)){
            pre={signo:'$',precio:0.00};
            fe="";

         }else if(this.page.id_usuario && this.page.metodo){

          pre={signo:'$',precio:0.00};
         this.precio[cont]=element.precio;
         

          var  d=this.fecha_de_entrega(element.fecha_compromiso);
     
          console.log(d);
         this.fecha[cont]=d;
         //"2015-02-21";
         this.mydate1(d,cont);

         cont++;

         }
         else {
          var date = new Date(element.fecha_compromiso);
           pre="$"+element.precio;
           fe=date.getDate()+" de "+meses[date.getMonth()]+" del "+date.getFullYear()+"";

          }
         
        console.log(element);

        var date2 = new Date(element.fecha_compromiso);


        if(this.page.id_usuario && date2.getFullYear()!=1 && (!this.page.metodo)){

        }else{
          this.items.push({
        cantidad: element.cantidad,
        articulo:element.nombre_priducto,
        descripcion:element.especificaciones,
        precio:pre,
        compromiso: fe ,
        ico:{ id:element.id_detalle},
        actividad:this.page.actividad,
         });
        }
       });
       this.items = [...this.items];
      

  }

  async ver(id) {
     console.log(id);
     const body = { id_detalle: id };

     this.proveedors.getimg(body).subscribe(
      (res: ISoapMethodResponse) => {
        console.log(res);

        if(res.result!=null){
          let foto = res.result.traer_foto_detallesResult;
          this.imageData = 'data:image/png;base64,'+foto;
          console.log(  this.imageData );
          this.sanitzedImageData = this.sanitizer.bypassSecurityTrustUrl(this.imageData);
          this.foto(this.imageData);
        }else {
          return this.presentToast('Sin foto');
        }
        
        
      }
      ,(err) => { 
        return this.presentToast('Error de servidor');
      }
    );

    /**/
  }
  async foto(foto){
    const alert = await this.alertCtrl.create({
      header: 'Imagen',
      cssClass: 'alertimg',
     // <img src="'+foto+'" width="500" height="500" />
      message: '  <img src="'+foto+'"   />',
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  fixDecimals(value ,index ){
    if(value){
     // console.log(value); 
      var value2=value
      console.log(value);
      value = "" + value2;
      value2 = value2.trim();
      value2 = parseFloat(value2).toFixed(2);
      console.log(value2);
      this.precio[index]= value2;
      return value2;

    }
   
  } 

  


  actualizar(){
    this.search();

    console.log('actualizar');
    this.fil={};
  }

  guardar(){
    //console.log(this.fixDecimals(this.fil.precionew));
    //console.log(this.precio);
    console.log(this.fecha);
  
    if(this.precio.length >0 && this.fecha.length >0 ){
    console.log(this.precio);
    console.log(this.fecha);

    for(var i=0; i<this.items.length;i++) {
        let  fe=this.fecha_de_entrega(this.page.detalles.detalles_compraCN[i].fecha_entrega);
     
            if(this.fecha[i] &&this.precio[i]){
              //console.log(this.precio[i]);
              //console.log(this.fecha[i]);
              this.page.detalles.detalles_compraCN[i].precio=this.precio[i];
              this.page.detalles.detalles_compraCN[i].fecha_compromiso=this.fecha[i];
              this.page.detalles.detalles_compraCN[i].fecha_entrega=fe;
             // console.log(this.page.detalles.detalles_compraCN[i]);
                    this.post(i);
                    
            } 
       //this.post(i);
        }

      //  console.log('termino')
        //console.log(this.page.detalles.detalles_compraCN[0]);
    }else{
      this.presentToast('El Precio o Fecha Vacios');

    }
  
  } 

  post(i){

    let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA=='));

      //const body = { detalle_producto:  this.page.detalles.detalles_compraCN[0] ,id_usuario:340};
    console.log(this.page.detalles.detalles_compraCN[i]);
      this.proveedors.body2 = { 
        detalle_producto: {
          cantidad:this.page.detalles.detalles_compraCN[i].cantidad,
          especificaciones: this.page.detalles.detalles_compraCN[i].especificaciones,
          estado_compromiso:this.page.detalles.detalles_compraCN[i].estado_compromiso,    
          fecha_compromiso: this.page.detalles.detalles_compraCN[i].fecha_compromiso,
          fecha_entrega: this.page.detalles.detalles_compraCN[i].fecha_entrega , // "2011-05-03T10:53:06.8116407+02:00",
          foto: this.page.detalles.detalles_compraCN[i].foto,
          id_compra: this.page.detalles.detalles_compraCN[i].id_compra,
          id_cotizacion: this.page.detalles.detalles_compraCN[i].id_cotizacion ,
          id_detalle:this.page.detalles.detalles_compraCN[i].id_detalle ,
          nombre_priducto: this.page.detalles.detalles_compraCN[i].nombre_priducto,
          precio: this.page.detalles.detalles_compraCN[i].precio ,   
        },
        id_usuario: decrypted
        
      };

        this.proveedors.postcoti().subscribe(
          (res: ISoapMethodResponse) => {
          // console.log(res);
           
           if(res.header.Mensaje=='OK'){
            
            if(this.page.id_usuario && (!this.page.metodo)){
              this.presentToast('Ingresado Correctamente');
              localStorage.setItem('provmo','true');
            }else {
              this.presentToast('Modificado Correctamente');
              localStorage.setItem('provmo','true');
            }

          }
         if(this.page.id_usuario && (!this.page.metodo))
            {   this.actualizar();
             }
          }
          ,(err) => { 
            console.log(err.error);
            this.presentToast('Error de servidor');
          }
        );
    

  }

  fecha_de_entrega(fe){
    var date = new Date(fe);
    let di,mes;
    if((date.getMonth()+1)<10){
    mes=""+"0"+(date.getMonth()+1)+"";

    }else{
      mes=date.getMonth()+1;
    }
    if(date.getDate()<10){

      di=""+"0"+date.getDate()+"";
    }else{
      di=date.getDate();

    }
    let p =+""+date.getFullYear()+"-"+mes+"-"+di+"";

   return p
  }
 
   mydate1( v,rowIndex) {
    if(v){
      var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
       var splitted = v.split("-", 3); 
      console.log(splitted[1]);

          var  p = +splitted[1];
          console.log(p); 
          console.log(meses[p]); 

      this.fecham[rowIndex]=splitted[2]+" de " +meses[p-1]+" del "+splitted[0];   

    }else{
      this.fecham[rowIndex]=" " ;   
    }
    
  }

}
