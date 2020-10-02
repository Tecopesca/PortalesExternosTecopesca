import { Injectable } from '@angular/core';
import { CanActivate,Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {EncrDecrServiceService} from '../servicios/encrdecrservice.service';

@Injectable({
  providedIn: 'root'
})
export class SeguriGuard implements CanActivate {
  constructor(private encrdecr:EncrDecrServiceService,private router: Router){}

  canActivate() {
    if(localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA==')  ){
      //var decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA=='));
           //console.log(localStorage.key(0)) 
      var decrypted2 = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('lBYtABt9wA/4DmX9Gti6Gg=='));
      var date = new Date(decrypted2);
      var date2 = new Date();
      if(date>date2){
        var addTime = 2 * 86400; //Tiempo en segundos
        date2.setSeconds(addTime); //Añado el tiempo
        var encrypted22 = this.encrdecr.set('123456$#@$^@1ERF', date2);
        localStorage.setItem('lBYtABt9wA/4DmX9Gti6Gg==',encrypted22);
        this.router.navigate(['/inicio/clientes']);
        return false;
      }else{
         localStorage.clear();
         this.router.navigate(['/']);
        return false;
      }
       
    } else{
      
      this.router.navigate(['/']);
      return false; 
    }
  
    }
}
