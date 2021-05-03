import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ PostService, UserService ]
})
export class HomeComponent implements OnInit {

  public url;
  public posts:Array<Post>;
  public status:string;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService:UserService,
  ) {
    this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getPosts();
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
