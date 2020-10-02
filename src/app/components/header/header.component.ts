import { Component, OnInit,Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {Router  } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() titulo :string; 
  @Input() lug :string; 
  fondo: any = { };

  constructor(public location: Location,private router: Router,private sanitizer: DomSanitizer,private menuCtrl:MenuController) { }

  ngOnInit() 
{
  
  if(this.lug =="colaboradores"){

    this.fondo = this.sanitizer.bypassSecurityTrustStyle('--background: #F7931E;');
  }else{
    this.fondo = this.sanitizer.bypassSecurityTrustStyle('--background: url(/assets/img/'+this.lug+'/he.png) 0 0/100% 100% no-repeat;');

  }
       
}
  toggleMenu(){
    console.log(this.lug);
    this.menuCtrl.enable(true,this.lug);   
    this.menuCtrl.toggle(this.lug);
  }
  salir(){

    localStorage.clear();
    //this.router.navigate(['/']);this.router.url
    console.log(this.router.url)
    
      
      location.reload(true)
  }
  ini(){
    localStorage.setItem('menu','0');
    this.router.navigate(['/inicio/'+this.lug]);
  }
}
