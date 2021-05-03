<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Post;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    //Relacion uno a muchos
    public function post(){
        return $this->hasMany('App\Models\Post');
    }
}
