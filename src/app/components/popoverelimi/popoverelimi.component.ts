import { Component, OnInit,ViewEncapsulation } from '@angular/core';
 import { Options } from 'select2';
 import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
 import { ISoapMethodResponse } from 'ngx-soap';
 import { ToastController, AlertController, LoadingController } from '@ionic/angular';
 import { ColaboradorService } from '../../servicios/colaborador.service';
 import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-popoverelimi',
  templateUrl: './popoverelimi.component.html',
  styleUrls: ['./popoverelimi.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PopoverelimiComponent implements OnInit {
  public options: Options;
  public fil:   any = { };
  public  items :Array<{  id:string; text:string   }>= [];

  constructor(
     public toast: ToastController  
    ,public loadingController: LoadingController
    ,private colaboradoServicio: ColaboradorService
    ,private encrdecr:EncrDecrServiceService
    ,private navParams: NavParams
    ,private popoverController: PopoverController
    ) {
    this.options = {
      language: {
        noResults: () => "Resultados no encontrados"     
      }
      ,width: '100%'
    }
   }

  ngOnInit() {
    this.search();
  }

  search(){

    this.colaboradoServicio.Traer_novedad_cancelar_compra().subscribe(
      async   (res: ISoapMethodResponse) => { 
       console.log(res)
        let resp = res.result.Traer_novedad_cancelar_compraResult.novedad_procesoCN;//Compra_copiar_datosResult;
       // console.log(resp\
           if(resp){
             this.items=[];
                   resp.forEach(element => {
                     console.log(element)
                       this.items.push({id: element.id_novedad_proceso, text: element.nombre});
                   });
             }else{
              this.presentToast('Error en novedad');
             }
           
        }
      ,(err) => { 
        this.presentToast('Error de servidor');
      }
    );

  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async Compra_cancelar(){

    if(this.fil.observacion && this.fil.id_nave  ){
      let id =this.navParams.get('page');
     
      this.colaboradoServicio.body = {
        id_compra_mp: id,
        id_novedad_proceso: this.fil.id_nave ,
        observacion: this.fil.observacion,
        id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA=='))
      };
     

      this.colaboradoServicio.Compra_cancelar().subscribe(
        async   (res: ISoapMethodResponse) => { 
      //   console.log(res)
          let resp = res.result.Compra_cancelarResult;//Compra_copiar_datosResult;
         // console.log(resp
             if(resp){
     
              this.presentToast('Compra  cancelada exitosa ');
              await this.popoverController.dismiss({
                actual:"si"
               });
               }else{
                this.presentToast(res.header.Mensaje);
               }
             
          }
        ,(err) => { 
          this.presentToast('Error de servidor');
        }
      );
    }else {
      this.presentToast('Campos  Vacios');

    }
    
     
    
   }

   async  cancelar(){
    await this.popoverController.dismiss({
       actual:"no"
    });
   }
}
