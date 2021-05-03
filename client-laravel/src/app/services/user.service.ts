import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  	public url:string;
	public identity;
	public token;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(user): Observable<any>{
		let json = JSON.stringify(user);
		let params='json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'register', params, {headers:headers});
	}

	signup(user, getToken = null): Observable<any> {
		if (getToken != null) {
		  user.getToken = 'true';
		}
	 
		const json = JSON.stringify(user);
		const params = 'json='+json;
		const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	 
		return this._http.post(this.url + 'login', params, {headers});
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
	}

	updateUser(token, user):Observable<any>{
		let json = JSON.stringify(user);
		let params = "json="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization', token);

		return this._http.put(this.url+'userUpdate', params, {headers: headers});
	}

	getPosts(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.get(this.url + 'users'+id, {headers: headers});
  	}

	getUser(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.get(this.url + 'getPerfil/'+id, {headers: headers});
	}

	
}
