<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function __construc(){
        $this->middleware('ApiAuth', ['only'=>['store', 'update', 'destroy']]);
    }
    
    public function index()
    {
        $categorias=Category::all();
        if($categorias){
            $data=array(
                'code'=>200,
                'status'=>'success',
                'categorias'=>$categorias
            );
        }else{
            $data=array(
                'code'=>400,
                'status'=>'error',
                'message'=>'No hay categorias'
            );
        }
        return response()->json($data, $data['code']);
    }


    public function store(Request $request)
    {
        //Recoger los datos por post
        $json = $request->input('json', null);
        $params=json_decode($json);
        $params_array=json_decode($json, true);

        if(!empty($params_array)){

            //Validar los datos
            $validate=Validator::make($params_array, [
                'name'=>'required',
            ]);

            //Guardar la categoria
            if($validate->fails()){
                $data=array(
                    'code'=>400,
                    'status'=>'error',
                    'message'=>'No se ha aguardado la categoria'
                );
            }else{
                $categoria= new Category();
                $categoria->name=$params->name;
                $categoria->save();
                $data=array(
                    'code'=>200,
                    'status'=>'success',
                    'category'=>$categoria
                );
            }
        }else{
            $data=array(
                'code'=>400,
                'status'=>'error',
                'message'=>'Los datos son requeridos'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function show($id)
    {
        $categoria=Category::find($id);
        if($categoria){
            $data=array(
                'code'=>200,
                'status'=>'success',
                'categoria'=>$categoria
            );
        }else{
            $data=array(
                'code'=>400,
                'status'=>'error',
                'message'=>'No existe la categoria'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function update(Request $request, $id)
    {
        //Recoger los datos por post
        $json = $request->input('json', null);
        $params_array=json_decode($json, true);

        if(!empty($params_array)){
            //Vaidar los datos
            $validate=Validator::make($params_array, [
                'name'=>'required'
            ]);
            //Quitar lo que no quiero actualizar
            // unset($parrams_array['id']);
            // unset($parrams_array['created_at']);
            //Actaulizar datos
            $categoria=Category::where('id', $id)->update($params_array);
            $data=array(
                'code'=>200,
                'status'=>'success',
                'categoria'=>$params_array
            );
        }else{
            $data=array(
                'code'=>400,
                'status'=>'error',
                'message'=>'No existe la categoria'
            );
        }
        return response()->json($data, $data['code']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
