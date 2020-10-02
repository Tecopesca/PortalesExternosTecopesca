import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router   } from '@angular/router';
import { Observable } from 'rxjs';
import {EncrDecrServiceService} from '../servicios/encrdecrservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthcolaboradorGuard implements CanActivate {
  constructor(private encrdecr:EncrDecrServiceService,private router: Router){}

  canActivate() {

      if(localStorage.getItem('fhcj7xyAtI1KOpfzkHZLRA==')  ){
           
          return true; 
      }else{ 
        this.router.navigate(['/']);
        return false; 
      }
  }
}
