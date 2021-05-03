<?php

namespace App\Http\Middleware;

use Closure;
use App\Helpers\JwtAuth;
use Illuminate\Http\Request;

class ApiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        //Comprobar si el usuario esta identificado
        $token = $request->header('Authorization');
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        if($checkToken){
            return $next($request);
        }else{
            $data = array(
                'status'=>'error',
                'code'=>400,
                'message'=>'El usuario no se ha identificado',
            );
            return response()->json($data, $data['error']);
        }

    }
}
