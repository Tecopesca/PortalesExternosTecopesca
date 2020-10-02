import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router   } from '@angular/router';
import { Observable } from 'rxjs';
import {EncrDecrServiceService} from '../servicios/encrdecrservice.service';


@Injectable({
  providedIn: 'root'
})
export class AuthproveedorGuard implements CanActivate {

  constructor(private encrdecr:EncrDecrServiceService,private router: Router){}

  canActivate() {

      if(localStorage.getItem('d9E6UvAYl+8SqB+sd+4IuA==')  ){
           
          return true; 
      }else{ 
        this.router.navigate(['/']);
        return false; 
      }
  }
  
}
