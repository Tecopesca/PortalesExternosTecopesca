import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { Options } from 'select2';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';

import { ColaboradorService } from '../../servicios/colaborador.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
 
@Component({
  selector: 'app-especie',
  templateUrl: './especie.page.html',
  styleUrls: ['./especie.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EspeciePage implements OnInit {
  items=[]
  public fil: any={};
  fecha :any;
  fecham :any;
  public options: Options;
  ColumnMode = ColumnMode;
  items2=[]

  constructor(
    public toast: ToastController  
    ,public loadingController: LoadingController
    ,private colaboradoServicio: ColaboradorService
    ,private encrdecr:EncrDecrServiceService
    ,private alertCtrl: AlertController) { 

      this.options = {
        language: {
          noResults: () => "Resultados no encontrados"     
        }
        ,width: '100%'
      }
  
    }

  ngOnInit() {
    try {
      setTimeout(() => {
        var date = moment();
        this.fecha=date.format('YYYY-MM-DD');
        this.mydate1(this.fecha);   
        this.fil.codigo="s"    ;
  
      
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
    
       
          var  p = +splitted[1];
       
         this.fecham=meses[p-1]+" del "+splitted[0];   

    }else{
      this.fecham=" " ;   
    }
    
   }
}
