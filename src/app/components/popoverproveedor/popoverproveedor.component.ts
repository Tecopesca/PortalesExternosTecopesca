import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Options } from 'select2';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ISoapMethodResponse } from 'ngx-soap';
import { ColaboradorService } from '../../servicios/colaborador.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
@Component({
  selector: 'app-popoverproveedor',
  templateUrl: './popoverproveedor.component.html',
  styleUrls: ['./popoverproveedor.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PopoverproveedorComponent implements OnInit {
  public fil: any={};
  public options: Options;
 public items :Array<{  id:string; text:string   }>= [];
 public items2 :Array<{  id:string; text:string   }>= [];
 public items3 :Array<{  id:string; text:string   }>= [];

 firstFormGroup: FormGroup;
 public codigo_id:boolean=true;
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


    this.firstFormGroup = this.formBuilder.group({
      correo: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
     
    });

  }

  async search(){
    this.items=[];
    this.items=[...this.items]
    this.items.push({id:'R', text:'RUC' });
    this.items.push({id:'C', text:'Cédula' });
    this.items.push({id:'p', text:'Pasaporte' });
    this.items3=[];
    this.items3=[...this.items3]
    this.items3.push({id:'true', text:'LOCAL' });
    this.items3.push({id:'false', text:'IMPORTADA' });
     
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
              //     console.log(ele)
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
    this.firstFormGroup.reset();
  }

  async guardar(){

    //console.log(this.fil.identificacion);

    if(this.firstFormGroup.valid && this.fil.codigo_id && this.fil.identificacion && this.fil.razon &&  this.fil.pais && this.fil.provincia && this.fil.ciudad){
      console.log(this.firstFormGroup.value)
      const loading = await this.loadingController.create({ message: 'Cargando...' });
      await loading.present();
      this.colaboradoServicio.body={
        tipo_identificacion:this.fil.identificacion ,
        codigo_identificacion:this.fil.codigo_id ,
        razon_social:this.fil.razon,
        correo:this.firstFormGroup.value.correo,
        telefono:0,
        pais:this.fil.pais,
        provincia:this.fil.provincia,
        ciudad:this.fil.ciudad,
        nacional:this.fil.nacional,
        direccion:" ",
        id_usuario: this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')),
      };
     this.colaboradoServicio.Proveedor_guardar().subscribe(
      async (res: ISoapMethodResponse) => {
       
        if (res) {
          if(res.result) { 
           // console.log(res) 
            if (res.result.Proveedor_guardarResult) {
              if (res.result.Proveedor_guardarResult) {
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
    else if(!this.firstFormGroup.valid){
      this.presentToast('Correo Incorrecto');
    }else{
      this.presentToast('Campos vacios');

    }
  
  }

  prue(){
    this.codigo_id=false; 
  }
  prue2()  {
    this.codigo_id=true; 
  }
}
