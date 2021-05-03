import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ UserService, PostService ]
})
export class ProfileComponent implements OnInit {
  public title:string;
  public url;
  public posts:Array<Post>;
  public status:string;
  public identity;
  public token;
  public user:User;

  constructor(
    private _postService: PostService,
    private _userService:UserService,
    private _route: ActivatedRoute,
		private _router: Router,
  ) {
    this.title = 'Perfil de usuario'
    this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile(){
    this._route.params.subscribe(params=>{
      let userId = +params['id'];
      this.getUser(userId);
      this.getPosts(userId);
    });
  }

  getUser(userId){
    this._userService.getUser(userId).subscribe(
      res=>{
        if(res.status == 'success'){
          this.user = res.user;
          console.log(this.user);
        }else{
          this.status = 'error';
        }
      }
    );
  }

  getPosts(userId){
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
        this.getProfile();
      },
      error => {
        console.log(<any>error);
        this.status='error'
      }
    );
  }

}
