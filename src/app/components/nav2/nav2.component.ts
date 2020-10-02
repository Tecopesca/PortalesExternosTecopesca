import { Component, OnInit ,Input} from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from '../../servicios/login.service';
import { ISoapMethodResponse } from 'ngx-soap';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { PopoverController } from '@ionic/angular';
import { TablaGeneradaComponent } from 'src/app/components/tabla-generada/tabla-generada.component';
 
@Component({
  selector: 'app-nav2',
  templateUrl: './nav2.component.html',
  styleUrls: ['./nav2.component.scss'],
})
export class Nav2Component implements OnInit {
  @Input() titulo :string; 
  style : any = { };
  in: any = { };
  parts:Array<{ }> = [];
  factura : any = { };
  concurso : any = { };
  datos : any = { };
  factura2 : any = { };
  factura3 : any = { };
  concurso1 : any = { };
  concurso2 : any = { };
  concurso3 : any = { };
  public items: Array<{ style:any; texto:string;url:string }> = [];
    dis ="0";
  constructor(private encrdecr:EncrDecrServiceService,public popover: PopoverController, private loginService: LoginService,private sanitizer: DomSanitizer,private menuCtrl:MenuController,private router: Router) { }


  ngOnInit() {}
  inicio(){
    if(localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA==')){
      this.menuCtrl.enable(false);   
      localStorage.setItem('menu1','0');
  
      this.router.navigate(['/inicio/proveedores']);
    }
  }
  
  inicio2(rut){
    if(localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA==')){
      this.menuCtrl.enable(false);  

        localStorage.setItem('menu1','1');
        
  
      console.log(rut)
      this.router.navigate([rut]);
    }
  }
  
  onMenuOpen(){
    this.items=[];
     
    var guardado = localStorage.getItem('datos2');
    this.items= JSON.parse(guardado);
    
        
    
          this.factura = this.items.filter(number => number.texto==='Facturas Servicios');
         // this.factura={ 'texto':this.items.filter(number => number.texto===this.fil.anio) };
          this.concurso= this.items.filter(number => number.texto==='Concurso de Adquisiciones');
       
          this.datos=this.items.filter(number => number.url==='/proveedores/datos');
        
          this.factura2=this.items.filter(number => number.url==='proveedores/factura');
          this.factura3=this.items.filter(number => number.url==='proveedores/factura/detalle');
        
          this.concurso1=this.items.filter(number => number.url==='/proveedores/concurso/Solicitudes');
          this.concurso2=this.items.filter(number => number.url==='/proveedores/concurso/Curso');
          this.concurso3=this.items.filter(number => number.url==='/proveedores/concurso/Finalizados');

          var cont = 0 ;
          if(this.router.url == '/inicio/proveedores') {
              this.in = this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid;cursor: pointer');
           }else {
                        
               if(this.router.url =="/proveedores/factura/detalle" || this.router.url =="/proveedores/factura"){
                this.in = this.sanitizer.bypassSecurityTrustStyle('cursor: pointer');
               //  this.factura2={ 'texto':this.items[0].texto ,  'url':this.items[0].url,'style': this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid')};
               this.factura[0].style= this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid ') ;
             // this.items[cont].style= this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid');;
               } else if(this.router.url == "/proveedores/datos"){
                this.in = this.sanitizer.bypassSecurityTrustStyle('cursor: pointer');
                 //this.datos= this.datos +{ 'style': this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid ;cursor: pointer') };
                 this.datos[0].style =  this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid ;cursor: pointer');
              //  console.log(this.datos)
              } else if(this.router.url == "/proveedores/concurso/Solicitudes" || this.router.url == "/proveedores/concurso/Curso" || this.router.url == "/proveedores/concurso/Finalizados" ){
                this.in = this.sanitizer.bypassSecurityTrustStyle('cursor: pointer');
              
                this.concurso[0].style= this.sanitizer.bypassSecurityTrustStyle('color: #662D91; border-bottom: #662D91 3px solid ') ;
            //  console.log(this.concurso)
              }
              
            
         }
         this.mostrarOcultar('ocultable')

  }
  salir(){
  
    this.menuCtrl.enable(false);   
  
  }

  
  

  mostrarOcultar(id){
    
    //let misAnimables = document.getElementsByClassName('esc') as HTMLCollectionOf<HTMLElement>;
 
    let elemento = document.getElementById(id) ;
    /// console.log(elemento)
    // console.log(elemento.style)
    // console.log(elemento.style.display);
     if(screen.width  < 900 ){      
        if(elemento.style.display !="none" &&  elemento.style.display !="inherit" ) {
          elemento.style.display = "none"
          console.log('c3')
       } 
        if (elemento.style.display == "none") {
          elemento.style.display = "inherit";      
          console.log('c4')     
          } else if(elemento.style.display== "inherit"){
            elemento.style.display = "none"
            console.log('c5')
           }   
       }
      
     }


     
}
