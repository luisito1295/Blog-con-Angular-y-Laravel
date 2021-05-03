import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from '../../services/global';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers:[UserService, CategoryService]
})
export class HeaderComponent implements OnInit, DoCheck {
  public categorias;
  public identity;
  public token;
  public url;

  constructor(
    private _userService:UserService,
    private _categoryServices: CategoryService
  ) {    
    this.getDataUser();
    this.url=GLOBAL.url;
  }

  ngOnInit() {
    this.getCategories();
  }

  ngDoCheck(){
    this.getDataUser();
  }

  getDataUser(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getCategories(){
    this._categoryServices.getCategories().subscribe(
      res => {
        if(res.status == 'success'){
          this.categorias = res.categorias;
          // console.log(this.categorias);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
