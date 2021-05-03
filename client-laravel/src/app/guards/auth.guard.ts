import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router:Router,
    private _userService:UserService
  ){

  }
  canActivate(){
    let identity = this._userService.getIdentity();
    if(identity){
      return true;
    }else{
      this._router.navigate(['/login']);
      alert('Debe estar registrado para acceder a la siguiente ruta');
      return false;
    }
  }
  
}
