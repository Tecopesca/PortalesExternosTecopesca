import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router  } from '@angular/router';
import { Observable } from 'rxjs';
import {EncrDecrServiceService} from '../servicios/encrdecrservice.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private encrdecr:EncrDecrServiceService,private router: Router){}

  canActivate() {
    if(localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA==') && localStorage.getItem('menu') && localStorage.getItem('lBYtABt9wA/4DmX9Gti6Gg==') && localStorage.getItem('login') && localStorage.getItem('sFa184kaM29GTuKvbZvU+A==') ){
      //var decrypted = this.encrdecr.get('123456$#@$^@1ERF', localStorage.getItem('1NxlcgmCU3gYYI3cIMaGDA=='));
           //console.log(localStorage.key(0)) 
           console.log(localStorage.getItem('lBYtABt9wA/4DmX9Gti6Gg==')) ;
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
        return true;
      }
       
    }else if(localStorage.getItem('login')){
       return true; 
     }else{
      
      this.router.navigate(['/']);
      return false; 
    }
  
    }

}
