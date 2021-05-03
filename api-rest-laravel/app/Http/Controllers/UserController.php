<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Helpers\JwtAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request){
        //Recoger post
    	$json = $request->input('json', null);
    	$params = json_decode($json);

    	$email = (!is_null($json) && isset($params->email)) ? $params->email : null;
    	$name = (!is_null($json) && isset($params->name)) ? $params->name : null;
    	$surname = (!is_null($json) && isset($params->surname)) ? $params->surname : null;
    	$role = 'ROLE_USER';
    	$password = (!is_null($json) && isset($params->password)) ? $params->password : null;

    	if(!is_null($email) && !is_null($password) && !is_null($name)){

    		// Crear el usuario
    		$user = new User();
    		$user->email = $email;
    		$user->name = $name;
    		$user->surname = $surname;
    		$user->role = $role;

    		$pwd = hash('sha256', $password);
    		$user->password = $pwd;

    		// Comprobar usuario duplicado
    		$isset_user = User::where('email', '=', $email)->first();

    		if($isset_user == 0){
    			// Guardar el usuario
    			$user->save();

    			$data = array(
	    			'status' => 'success',
	    			'code' => 200,
	    			'message' => 'Usuario registrado correctamente!!'
	    		);
    		}else{
    			// No guardarlo porque ya existe
    			$data = array(
	    			'status' => 'error',
	    			'code' => 400,
	    			'message' => 'Usuario duplicado, no puede registrarse'
	    		);
    		}


    	}else{
    		$data = array(
    			'status' => 'error',
    			'code' => 400,
    			'message' => 'Usuario no creado'
    		);
    	}

    	return response()->json($data, 200);

    }

    public function login(Request $request)
    {
        $jwtAuth = new JwtAuth();

        //Recibir post
        $json = $request->input('json',null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        //Validar esos datos
        $validate = Validator::make($params_array, [
            'email'     => 'required|email',//Comprobar si el correo existe
            'password'  => 'required',
        ]);

        if($validate->fails()){
            $signup = array(
                'status'=>'error',
                'code'=>404,
                'message'=>'El usuario no se ha identificado',
                'errors'=>$validate->errors()
            );
        }else{
            //Cifrar la contraseña
            $pwd = hash('sha256', $params->password);
            //Devolver token o datos
            $signup = $jwtAuth->signup($params->email, $pwd);

            if(!empty($params->getToken)){
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }

        return response()->json($signup, 200);
    }

    public function updateUser(Request $request){
        //Comprobar si el usuario esta identificado
        $token = $request->header('Authorization');
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        //Actualizar el usuario
        $json = $request->input('json',null);
        $params_array = json_decode($json, true);

        if($checkToken && !empty($params_array)){

            //Sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);

            //Validar los datos
            $validate = Validator::make($params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required',
                'email'     => 'required|email|unique:users,'.$user->sub,//Comprobar si el correo existe
            ]);

            //Quitar los datos que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);

            //Actualizar los datos en la DB
            $userUpdate = User::where('id', $user->sub)->update($params_array);

            //Devolver el objeto o el arrar del usuario
            $data = array(
                'status'=>'success',
                'code'=>200,
                'user'=> $user,
                'changes'=>$params_array
            );
        }else{
            $data = array(
                'status'=>'error',
                'code'=>400,
                'message'=>'El usuario no se ha identificado',
            );
        }

        return response()->json($data, $data['code']);

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
            Storage::disk('users')->put($image_name, File::get($image));
            $data = array(
                'code' => 200,
                'status' => 'success',
                'image'=>$image_name
            );
        }
        
        return response()->json($data, $data['code']);
    }

    public function getImage($filename){
        $isset=Storage::disk('users')->exists($filename);
        if($isset){
            $file=Storage::disk('users')->get($filename);
            return new Response($file, 200);
        }else{
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message'=>'La imagen no existe'
            );
        }

        return response()->json($data, $data['code']);
        
    }

    public function profile($id){
        $user = User::find($id);
        if(is_object($user)){
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user'=> $user
            );
        }else{
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message'=>'El usuario no existe'
            );
        }

        return response()->json($data, $data['code']);
    }
    
}
