import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { PopoverController } from '@ionic/angular';
import { PopoverclienteComponent } from 'src/app/components/popovercliente/popovercliente.component';
import { ClienteService } from '../../servicios/cliente.service';
import { Options } from 'select2';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrackingPage implements OnInit {
  public items: Array<{ id_pedido:string; anio:string; style: string; proforma: string; pedido: string; proceso: string ;fecha:string}> = [];
  rows = [];
  public items2:  Array<{  id:string; text:string ,anio:string}>= [];
  public items21:  Array<{  id:string; text:string ,anio:string}>= [];
  public items3:  Array<{id:string; text:string,proforma :string }>= [];
  public items31:  Array<{id:string; text:string,proforma :string }>= [];
  public items4:  Array<{ }>= [];
  public fil: any={};
  public selectedDatas: any= 'ff ';
  public selectedDatas1: any= 'ff ';
  ColumnMode = ColumnMode;
  client2: Client;
  public options: Options;

  constructor(
    private clienteService: ClienteService,
    public popover: PopoverController,
    private router: Router
    ,public toast: ToastController,
    private soap: NgxSoapService
    ,private encrdecr:EncrDecrServiceService,
    
  ) {
    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"
      },width: "100%"
    };
    this.soap.createClient(environment.clienteproceso)
    .then(client => {
      this.client2 = client;
      this.search();
    })
    .catch(err => err
      );
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    localStorage.setItem('menu','1');
       
  }
  


  search(){
    this.items2.push({id: '3', text:  'Todos' ,anio:' ' });
    this.items3.push({id: '3', text:  'Todos',proforma:' ' });
    this.rows.push({ 
      id_pedido:'',
      anio:'',
      style: '',
      proforma: "1",
      pedido : ' ',
      proceso: ' ',
      fecha: "5 de Enero,2019" , 
      tracking: {id_pedido: '1', pedido: "PROF -001080"},});
      
    var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

    let decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA=='));
    const body = { id_cliente: decrypted };
    this.clienteService.getTraerTodos_Pedidos_Contenededor_PorCliente(body).subscribe(

      (res: ISoapMethodResponse) => { 
     
        let logueo = res.result.TraerTodos_Pedidos_Contenededor_PorClienteResult.pedidos_contenedorCN;
        var p: boolean = false;
          var sty;
        logueo.forEach(element => {

          
          if(p){ sty='true';  p=false;
          }else{ sty='';p=true;}

          var date = new Date(element.fecha_proceso);


          this.items2.push({id: element.proforma, text:  element.proforma ,anio: ""+date.getFullYear()+"" });
          this.items3.push({id: ""+date.getFullYear()+"", text:  ""+date.getFullYear()+"",proforma: element.proforma});

          this.rows.push({
            id_pedido:element.id_pedido,
            anio:""+date.getFullYear()+"",
            style: sty,
            proforma: element.proforma,
            pedido : element.codigo_pedido,
            proceso:element.estado_actual,
            fecha: date.getDate()+" de "+meses[date.getMonth()]+","+date.getFullYear()+"" , 
            tracking: {id_pedido: element.id_pedido, pedido: element.proforma},
            
          });
         
          });
           this.items21=this.items2;
           this.items31=this.items3;
           this.items4=this.rows;
          this.filtercombos()
            
   }
      ,(err) => { 
        this.presentToast('Error de servidor');
      }
    );
  }

  filtercombos(){
      
    this.items2 =  this.items2.filter((valorActual, indiceActual, arreglo) => {   
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text)) === indiceActual
    });
    
    this.items3 =  this.items3.filter((valorActual, indiceActual, arreglo) => {         
    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.text ) === JSON.stringify(valorActual.text )) === indiceActual
    });
  }

filter(){
 
if(((this.fil.anio) &&(this.fil.anio !='3') ) &&  (this.fil.proforma=='3' ) ){
  this.items4 = this.rows.filter(number => number.anio===this.fil.anio);
  
}
else if((this.fil.proforma) &&(this.fil.proforma !=3) &&  (this.fil.anio=='3') ){
  this.items4 = this.rows.filter(number => number.proforma===this.fil.proforma);
}else if(this.fil.proforma == '3' && this.fil.anio ==='3'){
  this.items4 = this.rows;
}
else if(((this.fil.proforma) && (this.fil.anio)) ){
  this.items4 = this.rows.filter(number => number.proforma===this.fil.proforma  && number.anio ===this.fil.anio);
}else if(((this.fil.proforma) && !(this.fil.anio)) && this.fil.proforma !='3' ){
this.items4 = this.rows.filter(number => number.proforma===this.fil.proforma);
}else if(((this.fil.proforma) && !(this.fil.anio))  && this.fil.proforma ==='3'){
  this.items4 = this.rows;
  }
else if((!(this.fil.proforma) && (this.fil.anio))  && this.fil.anio !=3){
  this.items4 = this.rows.filter(number => number.anio===this.fil.anio);
  }else if((!(this.fil.proforma) && (this.fil.anio))  && this.fil.anio ==='3'){
    this.items4 = this.rows;  
    }
if(this.items4.length==0){
  this.presentToast('Ninguna Proforma o Año coincide');
}
if((!(this.fil.proforma) && !(this.fil.anio))){
  this.presentToast('Seleccione una Proforma o Año para realizar la busqueda');
}
  
}


onTagChanged(data): void {
  if((data && data !='3' )  ){
 
    this.items2 = this.items21.filter(number => number.anio===data);
    this.items2.push({id: '3', text:  'Todos' ,anio:' ' });
    this.items2=  this.items2.reverse();
    this.filtercombos();
  } else if(data =='3'){
    
    this.items2=this.items21;
    this.filtercombos()
  }
}


async mod(item,item2) {
  const alert = await this.popover.create({
    component: PopoverclienteComponent,
    mode:'ios',
    componentProps:{page:item,page2:item2},
    cssClass: 'pop-over-style',
  });

  await alert.present();

}

}
