import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from '../../servicios/cliente.service';
import { ISoapMethodResponse } from 'ngx-soap';
import { ToastController } from '@ionic/angular';
import { element } from 'protractor';

@Component({
  selector: 'app-popovercliente',
  templateUrl: './popovercliente.component.html',
  styleUrls: ['./popovercliente.component.scss'],
})
export class PopoverclienteComponent implements OnInit {
  page;
  page2;
  fondo: any = { };
  

  public items: Array<{fecham:string; fecha:Date;proceso:string }> = [];

  constructor( 
    private clienteService: ClienteService,
    private sanitizer: DomSanitizer,
    public toast: ToastController,
    private navParams: NavParams) { }

    async presentToast(message) {
      const toast = await this.toast.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }

  ngOnInit() {   
    

    this.page = this.navParams.get('page');
    this.page2 = this.navParams.get('page2');
    this.search();
    
  }


    search(){
      console.log(this.page);
      const body = { id_pedido: this.page };

  
      this.clienteService.getTraerTodos_Tracking_PorIdPedido(body).subscribe(
  
        (res: ISoapMethodResponse) => { 
       
         if(res.result.TraerTodos_Tracking_PorIdPedidoResult){ 
         let logueo = res.result.TraerTodos_Tracking_PorIdPedidoResult.tracking_pedidoCN;
            
          logueo.forEach(element => {
            console.log(element)
            var date = new Date(element.fecha_proceso);
            let v =date.getFullYear();
            if(v!=1){
              this.items.push({
                fecham: date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear(), 
                //fecha: date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear(),  
                fecha: date,
                proceso: element.proceso,
                
              })

            }
          
         
         });
          // this.fil();
          this.items=  this.items.reverse();
          console.log(this.page);
         
            this.style(this.items.length);
         
          
        }else{

          if(this.page=='1'){
            var date = new Date();

            this.style(1);
            this.items.push({
              fecham: date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear(), 
              //fecha: date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear(),  
              fecha: date,
              proceso: "Prduccion",
              
            })
            this.items=  this.items.reverse();
          }else{
            this.style(0);

          }
         

        }
     }
        ,(err) => { 
          this.presentToast('Error de servidor');
        }
      );
    }


    style(f){
      //alert("La resolución de tu pantalla es: " + screen.width + " x " + screen.height) 
      this.fondo = this.sanitizer.bypassSecurityTrustStyle('background: url(assets/fonpop/fondopop'+f+'.svg)  0 0/ 100% 100%  no-repeat;');
       }

    /*fil(){
      
      this.items.sort(function(a, b) {
        return b.fecha.getTime() - a.fecha.getTime();
      });
      console.log(this.items)
      var date = new Date('Mon Jan 01 1900 ');
      console.log(date);
      this.items = this.items.filter(number =>  {
        if(date.getTime() >= number.fecha.getTime()){
         console.log( number.fecha);
        }
      } );

      console.log(this.items);
    }*/
}
