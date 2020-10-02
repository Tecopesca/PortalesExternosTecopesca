import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Options } from 'select2';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ISoapMethodResponse } from 'ngx-soap';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';

@Component({
  selector: 'app-popoverbarco',
  templateUrl: './popoverbarco.component.html',
  styleUrls: ['./popoverbarco.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PopoverbarcoComponent implements OnInit {
  public fil: any={};
  public options: Options;
 public items :Array<{  id:string; text:string   }>= [];
 public items2 :Array<{  id:string; text:string   }>= [];

  constructor(
    public toast: ToastController  
    ,public loadingController: LoadingController
    ,private colaboradoServicio: ColaboradorService
    ,public formBuilder: FormBuilder
    ,private encrdecr:EncrDecrServiceService
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
    this.search2(); 

  }

  async search(){
   
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Bandera_traer().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items2 = [];
        this.items2 = [...this.items2];
       
        if (res) {
          if(res.result) { 
            //console.log(res.result) 
            if (res.result.Bandera_traerResult) {
              if (res.result.Bandera_traerResult.banderaCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Bandera_traerResult.banderaCN;
                 registros.forEach(ele=>{
                  // console.log(ele)
                  this.items2.push({ id:ele.codigo,text:ele.nombre_corto})
                 })
                this.items2 = [...this.items2];
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
  async search2(){
   
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    this.colaboradoServicio.Organismo_pesca_traer_todos().subscribe(
      async (res: ISoapMethodResponse) => {
        this.items = [];
        this.items = [...this.items];
       
        if (res) {
          if(res.result) { 
            //console.log(res.result) 
            if (res.result.Organismo_pesca_traer_todosResult) {
              if (res.result.Organismo_pesca_traer_todosResult.organismo_pescaCN) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
                let registros = res.result.Organismo_pesca_traer_todosResult.organismo_pescaCN;
                 registros.forEach(ele=>{
                 //  console.log(ele)
                  this.items.push({ id:ele.id_organismo_pesca,text:ele.codigo})
                 })
                this.items = [...this.items];
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

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  limpiar(){
    Object.keys(this.fil).forEach(ele=>{
      this.fil[ele]=null;  
    });
  }

  async guardar(){

    //console.log(this.fil.identificacion);

    if( this.fil.nombre && this.fil.Licencia && this.fil.vencimiento && this.fil.codigo_id && this.fil.bandera && this.fil.metodo && this.fil.IMO && this.fil.SANCO){
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      this.colaboradoServicio.body={
        tipo:"" ,
        nombre:"" ,
        con_origen:"",
        id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
      };

     this.colaboradoServicio.Barco_crear().subscribe(
      async (res: ISoapMethodResponse) => {
       
        if (res) {
          if(res.result) { 
            console.log(res) 
            if (res.result.Barco_crearResult) {
              if (res.result.Barco_crearResult) {
              //  console.log( res.result.Traer_grupo_compraResult.grupo_compra_mpCN)
              this.presentToast('Guardado Correctamente');
              this.limpiar();

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
    else{
      this.presentToast('Campos vacios');

    }
  
  }
}
