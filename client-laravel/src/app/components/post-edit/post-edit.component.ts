import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/Post';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [UserService, PostService]
})
export class PostEditComponent implements OnInit {

  public title;
  public identity;
  public token;
  public status:string;
  public post:Post;
  public url;
  public categorias;
  public is_edit:boolean;

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
    attachPinText: 'Sube tu imagen'
  };

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userServices:UserService,
    private _categoryServices:CategoryService,
    private _postServices:PostService
  ){
    this.title = 'Editar post';
    this.identity = this._userServices.getIdentity();
    this.token = this._userServices.getToken();
    this.url = GLOBAL.url;
    this.is_edit = false;
  }

  ngOnInit() {
    this.getCategories();
    this.post = new Post(1,this.identity.sub,1,'','','','');
    this.getPost();
  }

  getPost(){
    this._route.params.subscribe(params=>{
      let id = params['id'];
      this._postServices.getPost(id).subscribe(
        res => {
          if(res.status='success'){
            this.post=res.post;
            console.log(this.post);
            if(this.post.user_id != this.identity.sub){
              this._router.navigate(['/inicio']);
            }
          }else{
            this._router.navigate(['/inicio']);
          }
        },
        error => {
          console.log(<any>error);
          this._router.navigate(['/inicio']);
        }
      );
    });
    
  }

  onSubmit(form){
    this._postServices.editPost(this.token, this.post, this.post.id).subscribe(
      res =>{
        if(res.status='success'){
          this.status='success';
          this.post=res.post;
          this._router.navigate(['/entrada', this.post.id]);
        }else{
          this.status='error';
        }
      },
      error => {
        this.status='error';
        console.log(<any>error);
        // this._router.navigate(['/inicio']);
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
