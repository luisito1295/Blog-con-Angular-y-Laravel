<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\ApiAuthMiddleware;
use App\Http\Controllers\PostController;

Route::group(['middleware' => ['cors']], function () {
    //Rutas del usuario
    Route::post('register', 'App\Http\Controllers\UserController@register');
    Route::post('login', 'App\Http\Controllers\UserController@login');
    Route::put('userUpdate', 'App\Http\Controllers\UserController@updateUser');
    Route::post('uploadImageUser', 'App\Http\Controllers\UserController@upload')->middleware(ApiAuthMiddleware::class);
    Route::get('getUserAvatar/{filename}', 'App\Http\Controllers\UserController@getImage');
    Route::get('getPerfil/{id}', 'App\Http\Controllers\UserController@profile');

    //Rutas de categorias
    Route::resource('category', 'App\Http\Controllers\CategoryController');

    //Rutas de Post
    Route::resource('posts', 'App\Http\Controllers\PostController');
    Route::post('uploadImagePost', 'App\Http\Controllers\PostController@upload');
    Route::get('getImagePost/{filename}', 'App\Http\Controllers\PostController@getImage');
    Route::get('categorys/{id}', 'App\Http\Controllers\PostController@getPostsByCategory');
    Route::get('users/{id}', 'App\Http\Controllers\PostController@getPostsByUser');
});
