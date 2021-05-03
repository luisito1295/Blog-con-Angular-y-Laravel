import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/Category';
import { GLOBAL } from '../../services/global';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [ CategoryService, UserService,PostService ]
})
export class CategoryDetailComponent implements OnInit {
  public title:string;
  public categoria:Category;
  public posts:any;
  public url:string;
  public identity;
  public token;
  public status:string;

  constructor(
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _userService:UserService,
    private _route: ActivatedRoute,
		private _router: Router,
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getPostByCategory();
    this.getPosts();
  }

  getPostByCategory(){
    this._route.params.subscribe(params => {
      let id = +params['id'];

      this._categoryService.getCategoy(id).subscribe(
        res =>{
          if(res.status == 'success'){
            this.categoria = res.categoria;
            console.log(this.categoria);
            this._categoryService.getPosts(id).subscribe(
              res => {
                if(res.status=='success'){
                  this.posts=res.posts;
                  console.log(this.posts);
                }else{

                }
              },
              error=>{
                console.log(<any>error);
              }
            );
          }else{
            this._router.navigate(['/inicio']);
          }
        },
        error=>{
          console.log(<any>error);
        }
      );

    })
  }
  getPosts(){
    this._postService.getPosts().subscribe(
      res => {
        // if(res.status == 'success'){
          this.posts = res.posts;
          console.log(this.posts);
        // }else{
          // this.status = 'error';
        // }
      },
      error => {
        console.log(<any>error);
        this.status='error'
      }
    );
  }
  deletePost(id){
    this._postService.deletePost(this.token, id).subscribe(
      res => {
        this.getPosts();
      },
      error => {
        console.log(<any>error);
        this.status='error'
      }
    );
  }

}
