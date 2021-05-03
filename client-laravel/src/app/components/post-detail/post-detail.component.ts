import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [ PostService ]
})
export class PostDetailComponent implements OnInit {
  public post:Post;
  public url;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
  ) {
    this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    this._route.params.subscribe(params=>{
      let id = params['id'];
      this._postService.getPost(id).subscribe(
        res => {
          if(res.status='success'){
            this.post=res.post;
            console.log(this.post);
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

}
