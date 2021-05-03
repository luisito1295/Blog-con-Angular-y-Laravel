import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[ UserService ]
})
export class LoginComponent implements OnInit {
  public title;
  public user:User;
  public token;
  public identity;
  public status;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _route:ActivatedRoute
    ) {
    this.title = 'Registro';
		this.user = new User(1,'','','ROLE_USER','','','','');
  }

  ngOnInit(): void {
    this.logout();
  }

  onSubmit(form) {
    this._userService.signup(this.user).subscribe(
      res => {
        // token
        if (res.status != 'error') {
          this.status = 'success';
          this.token = res;
 
          // Objeto usuario identificado
          // this.getIdentity();
          this._userService.signup(this.user, true).subscribe(
            res => {
              this.identity = res;
              //Persistir datos del usuario identificado
              console.log(this.token);
              console.table(this.identity);
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              
              //redireccion a la pagina de inicio
              this._router.navigate(['/inicio']);
            },
            error => {
              this.status = 'error';
              console.log(<any> error);
            }
          );
 
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any> error);
      }
    );
  }

  getIdentity(){
    
  }

  logout(){
    this._route.params.subscribe(params => {
      let logout = params['sure'];

      if(logout==1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity=null;
        this.token=null;

        //redireccion a la pagina de inicio
        this._router.navigate(['inicio']);
      }
    });
  }

}
