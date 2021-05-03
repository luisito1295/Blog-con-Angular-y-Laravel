<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use App\Helpers\JwtAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('ApiAuth', ['except' => [
            'index',
            'show',
            'getImage',
            'getPostsByCategory',
            'getPostsByUser'
        ]]);
    }
    public function index()
    {
        $posts = Post::all();
        return response([
            'code'=>200,
            'status'=>'success',
            'posts'=>$posts
        ], 200);
    }

    public function store(Request $request)
    {
        //Recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {
            //Conseguir usuario identificado
            $user = $this->getIdentity($request);
            //Validar los datos
            $validate = Validator::make($params_array, [
                'title' => 'required',
                'content'=>'required',
                'category_id'=>'required',
                'image'=>'required'
            ]);

            //Guardar el post
            if ($validate->fails()) {
                $data = array(
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'No se ha aguardado el post'
                );
            } else {
                $post = new Post();
                $post->user_id=$user->sub;
                $post->category_id = $params_array['category_id'];
                $post->title=$params_array['title'];
                $post->content=$params_array['content'];
                $post->image=$params_array['image'];
                $post->save();
                $data = array(
                    'code' => 200,
                    'status' => 'success',
                    'post' => $post
                );
            }
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'Los datos son requeridos'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function show($id)
    {
        $post = Post::find($id)->load('category')->load('user');
        if (is_object($post)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'post' => $post
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'No existe el post'
            ];
        }
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request)
    {
        //Recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        $data = array(
            'code' => 200,
            'status' => 'success',
            'message' => 'Datos enviados incorrectos'
        );

        if (!empty($params_array)) {
            //Validar los datos
            $validate = Validator::make($params_array, [
                'title' => 'required',
                'content'=>'required',
                'category_id'=>'required',
            ]);

            if($validate->fails()){
                $data['errors']=$validate->errors();
                return response()->json($data, $data['code']);
            }

            //Eliminar lo que no se va actualizar
            unset($params_array['id']);
            unset($params_array['user_id']);
            unset($params_array['created_at']);
            unset($params_array['user']);

            //Conseguir el usuario identificado
            $user = $this->getIdentity($request);

            //Buscar y validar que el post pertenezca al usuario que lo posteo
            $post = Post::where('id', $id)
                        ->where('user_id', $user->sub)
                        ->first();

            if(!empty($post) && is_object($post)){
                //Actualizar
                $post->update($params_array);
                //Devoler la respuesta
                $data = array(
                    'code' => 200,
                    'status' => 'success',
                    'post'=> $post,
                    'changes' => $params_array
                );
            }
            /*$where=[
                'id'=>$id,
                'user_id'=>$user->sub
            ];
            $post = Post::updateOrCreate($where, $params_array);*/
            
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'Los datos son requeridos'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function destroy($id, Request $request)
    {
        //Conseguir el usuario identificado
        $user = $this->getIdentity($request);

        //Conseguir el post
        $post = Post::where('id', $id)->where('user_id', $user->sub)->first();

        if(!empty($post)){
            //Borrarlo
            $post->delete();//Devolver algo
            $data = array(
                'code' => 200,
                'status' => 'error',
                'post' => $post,
            );
        }else{
            //Devolver algo
            $data = array(
                'code' => 404,
                'status' => 'error',
                'post' => 'El post no existe'
            );
        }

        return  response()->json($data, $data['code']);
    }

    private function getIdentity($request){
        //Conseguir el usuario identificado
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);

        return $user;
    }

    public function upload(Request $request){
        //Recoger los datos
        $image=$request->file('file0');
        //Validacion de la imagen
        $validate = Validator::make($request->all(),[
            'file0'=>'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        //Subir y guardar la imagen
        if(!$image || $validate->fails()){
            //Devoler la imagen
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message'=>'Error al subir imagen'
            );
        }else{
            $image_name=time().$image->getClientOriginalName();
            Storage::disk('images')->put($image_name, File::get($image));
            $data = array(
                'code' => 200,
                'status' => 'success',
                'image'=>$image_name
            );
        }
        
        return response()->json($data, $data['code']);
    }

    public function getImage($filename){
        //Comprobar si la imagen existe
        $isset=Storage::disk('images')->exists($filename);
        if($isset){
            //Conseguir la imagen
            $file=Storage::disk('images')->get($filename);
            //Devolver la imagen
            return new Response($file, 200);
        }else{
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message'=>'La imagen no existe'
            );
        }

        //Devolver los datos
        return response()->json($data, $data['code']);
        
    }

    public function getPostsByCategory($id){
        $posts = Post::where('category_id', $id)->get();
        return response()->json([
            'status'=>'success',
            'posts'=>$posts
        ], 200);
    }

    public function getPostsByUser($id){
        $posts = Post::where('user_id', $id)->get();
        return response()->json([
            'status'=>'success',
            'posts'=>$posts
        ], 200);
    }
}
