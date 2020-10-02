import { Component, OnInit ,Input} from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from '../../servicios/login.service';
import {EncrDecrServiceService} from '../../servicios/encrdecrservice.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-nav3',
  templateUrl: './nav3.component.html',
  styleUrls: ['./nav3.component.scss'],
})

export class Nav3Component implements OnInit {

  @Input() titulo :string; 
  style : any = { };
  in: any = { };
  parts:Array<{ }> = [];

  Compras : any = { };
  Compras1 : any = { };
  Compras2 : any = { };
  Compras3 : any = { };
  Compras4 : any = { };
  Compras5 : any = { };
  Cargos : any = { };
  Armador : any = { };
  Administracion : any = { };

  public items: Array<{ style:any; texto:string;url:string }> = [];
    dis ="0";
  constructor(private encrdecr:EncrDecrServiceService,public popover: PopoverController, private loginService: LoginService,private sanitizer: DomSanitizer,private menuCtrl:MenuController,private router: Router) { }

  ngOnInit() {}


  inicio(){
    if(localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')){
      this.menuCtrl.enable(false);   
      localStorage.setItem('menu1','0');
  
      this.router.navigate(['inicio/colaboradores']);
    }
  }
  
  inicio2(rut){
    //console.log(rut)
    if(localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')){
      this.menuCtrl.enable(false);  

        localStorage.setItem('menu1','1');
        
  
   //   console.log(rut)
      this.router.navigate([rut]);
    }
  }
  
  onMenuOpen(){
    this.items=[];
    
    var guardado = localStorage.getItem('datos3');
    this.items= JSON.parse(guardado);
    
   // console.log(this.items);
    
          this.Compras = this.items.filter(number => number.texto==='Compras de Materia Prima');
         // this.factura={ 'texto':this.items.filter(number => number.texto===this.fil.anio) };
          this.Armador= this.items.filter(number => number.texto==='Armador Materia Prima');
         // this.Cargos = this.items.filter(number => number.texto==='Cargos Varios');
          this.Administracion= this.items.filter(number => number.texto==='Administración Documentos');

          this.Compras1=this.items.filter(number => number.url==='/colaboradores/compras_materia_prima');
          this.Compras2=this.items.filter(number => number.url==='/colaboradores/compras_materia_prima/ingreso');
          this.Compras3=this.items.filter(number => number.url==='/colaboradores/compras_materia_prima/requisitos');
          this.Compras4=this.items.filter(number => number.url==='/colaboradores/compras_materia_prima/especie');
          this.Compras5=this.items.filter(number => number.url==='/colaboradores/compras_materia_prima/precios');

           
           var splits = this.router.url.split("?");
           

          if(this.router.url =='/inicio/colaboradores') {
              this.in = this.sanitizer.bypassSecurityTrustStyle('color: #F7931E; border-bottom: #F7931E 3px solid;cursor: pointer');
           }else {
                        
               if(splits[0] =="/colaboradores/compras_materia_prima/ingreso" || splits[0] =="/colaboradores/compras_materia_prima"  || splits[0] =="/colaboradores/compras_materia_prima/especie" || splits[0]=='/colaboradores/compras_materia_prima/precios' || splits[0]=='/colaboradores/compras_materia_prima/requisitos' ){
                this.in = this.sanitizer.bypassSecurityTrustStyle('cursor: pointer');
                this.Compras[0].style= this.sanitizer.bypassSecurityTrustStyle('color: #F7931E; border-bottom: #F7931E 3px solid ') ;
              } else  if(this.router.url =="/colaboradores/armador_materia_prima" ){
               this.in = this.sanitizer.bypassSecurityTrustStyle('cursor: pointer');
               this.Armador[0].style= this.sanitizer.bypassSecurityTrustStyle('color: #F7931E; border-bottom: #F7931E 3px solid ') ;
             } else  if(this.router.url =="/colaboradores/administraccion_documento" ){
              this.in = this.sanitizer.bypassSecurityTrustStyle('cursor: pointer');
              this.Administracion[0].style= this.sanitizer.bypassSecurityTrustStyle('color: #F7931E; border-bottom: #F7931E 3px solid ') ;
            } 
              
            
         }

         this.mostrarOcultar('ocultable')
  }

  salir(){
  
    this.menuCtrl.enable(false);   
  
  }

  mostrarOcultar(id){
   // console.log('click')
    //let misAnimables = document.getElementsByClassName('esc') as HTMLCollectionOf<HTMLElement>;
 
    let elemento = document.getElementById(id) ;
    /// console.log(elemento)
    // console.log(elemento.style)
    // console.log(elemento.style.display);
     if(screen.width  < 900 ){      
        if(elemento.style.display !="none" &&  elemento.style.display !="inherit" ) {
          elemento.style.display = "none"
          
       } 
        if (elemento.style.display == "none") {
          elemento.style.display = "inherit";      
            
          } else if(elemento.style.display== "inherit"){
            elemento.style.display = "none"
            
           }   
       }
      
    }


}
