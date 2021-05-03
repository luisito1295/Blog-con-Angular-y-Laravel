import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/Post';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {
  public title:string;
  public identity;
  public token;
  public status:string;
  public post:Post;
  public url;
  public categorias;

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
      url: GLOBAL.url+'uploadImagePost',
      method:"POST",
      headers: {
        "Authorization" : this._userServices.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Sube tu avatar'
  };

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userServices:UserService,
    private _categoryServices:CategoryService,
    private _postServices:PostService
  ){
    this.title = 'Crear nuevo post';
    this.identity = this._userServices.getIdentity();
    this.token = this._userServices.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.getCategories();
    this.post = new Post(1,this.identity.sub,1,'','','','');
  }

  onSubmit(form){
    this._postServices.createPost(this.token, this.post).subscribe(
      res => {
        if(res.status == 'success'){
          this.post =res.post;
          this.status = 'sucess';
          this._router.navigate(['/inicio']);
        }else{
          this.status='error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  imageUpload(datos){
 
    let data =  JSON.parse(datos.response);
   
    this.post.image = data.image; 
  }

  getCategories(){
    this._categoryServices.getCategories().subscribe(
      res => {
        if(res.status == 'success'){
          this.categorias = res.categorias;
          console.log(this.categorias);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
