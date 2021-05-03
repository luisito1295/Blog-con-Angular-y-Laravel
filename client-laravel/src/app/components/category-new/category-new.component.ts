import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/Category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css'],
  providers:[UserService, CategoryService]
})
export class CategoryNewComponent implements OnInit {
  public title:string;
  public identity;
  public token;
  public category:Category;
  public status;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _categoryServices: CategoryService
  ) {
    this.title = 'Crear nueva categoria'
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.category = new Category(1,'');
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._categoryServices.crearCategoria(this.token, this.category).subscribe(
      res => {
          if(res.status == 'success'){
            this.category = res.category;
            this.status = 'success';

            this._router.navigate(['/inicio']);
          }else{
            this.status = 'erros';
          }
      },
      errors => {
        this.status = 'erros';
        console.log(<any>errors);
      }
    );
  }

}
