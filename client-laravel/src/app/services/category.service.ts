import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public url;

  constructor(
    private _http:HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  crearCategoria(token, category): Observable<any>{
    let json = JSON.stringify(category);
    let params = "json="+json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);

    return this._http.post(this.url + 'category', params, {headers: headers});
  }

  getCategories(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'category', {headers: headers});
  }

  getCategoy(id): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'category/'+id, {headers: headers});
  }

  getPosts(id): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'categorys/'+id, {headers: headers});
  }

}
