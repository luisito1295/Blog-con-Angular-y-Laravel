import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],  
	providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public title;
  public user:User;
	public status;

	constructor(private _userService:UserService) {
		this.title = 'Registro';
		this.user = new User(1,'','','ROLE_USER','','','','');
	}

  ngOnInit(){
    
  }

  onSubmit(form:any){
		this._userService.register(this.user).subscribe(
			response => {
				if(response.status=="success"){
					//console.log(response.user);
					this.status = response.status;
					form.reset();
				}else{
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
				this.status = 'error';
			}
		);
	}

}
