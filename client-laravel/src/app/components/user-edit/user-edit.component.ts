import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
// import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [ UserService ]
})
export class UserEditComponent implements OnInit {
  
	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;
	public url;
  
  public resetVar = true;
  public options : Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };
 
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: GLOBAL.url+'uploadImageUser',
      method:"POST",
      headers: {
        "Authorization" : this._userService.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Sube tu avatar'
  };

  constructor(private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
  ) {
    this.title = 'Actualizar mis datos';
		this.user = new User(1,'','','ROLE_USER','','','','');
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    //Rellenar el objeto
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email,
      '',
      this.identity.description,
      this.identity.image
    );
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.updateUser(this.token, this.user).subscribe(
      res => {
				if(res.status=='error'){
					this.status = 'error';
				}else{
          console.log(res);
          if(res.changes.name){
            this.user.name = res.changes.name
          }
          if(res.changes.surname){
            this.user.surname = res.changes.surname
          }
          if(res.changes.email){
            this.user.email = res.changes.email
          }
          if(res.changes.description){
            this.user.description = res.changes.description
          }
          if(res.changes.image){
            this.user.image = res.changes.image
          }
					this.identity = this.user;
					localStorage.setItem('identity', JSON.stringify(this.user));
					this.status = 'success';

				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
    );
  }

  avatarUpload(datos){
 
    let data =  JSON.parse(datos.response);
   
    this.user.image = data.image; 
  }

}
