import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public url;

  constructor(
    private _http:HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  createPost(token, post):Observable<any>{
    let json = JSON.stringify(post);
		let params = "json="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									                 .set('Authorization', token);

		return this._http.post(this.url+'posts', params, {headers: headers});
  }

  getPosts():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'posts', {headers: headers});
  }

  getPost(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'posts/'+id, {headers: headers});
  }

  editPost(token, post, id):Observable<any>{
    let json = JSON.stringify(post);
		let params = "json="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									                 .set('Authorization', token);

		return this._http.put(this.url+'posts/'+id, params, {headers: headers});
  }

  deletePost(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									                 .set('Authorization', token);

		return this._http.delete(this.url+'posts/'+id, {headers: headers});
  }
}
