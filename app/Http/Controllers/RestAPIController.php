<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\RestAPI;
use Illuminate\Http\Request;

class RestAPIController extends Controller
{
    //OK
    public function index()
    {
        return RestAPI::all();
    }

    //???
    public function create()
    {

    }

    //OK
    public function store(Request $request)
    {
        $rest_api_tb = new RestAPI();
        $rest_api_tb->title = $request->input('title');
        $rest_api_tb->content = $request->input('content');
        if ($rest_api_tb->save()) {
            return $rest_api_tb;
        } else {
            return false;
        }
    }

    //OK
    public function show($id)
    {
        return RestAPI::find($id);
    }

    //???
    public function edit($id)
    {

    }

    //OK
    public function update(Request $request, $id)
    {
        $rest_api_tb = RestAPI::find($id);
        $rest_api_tb->title = $request->input('title');
        $rest_api_tb->content = $request->input('content');
        if ($rest_api_tb->save()) {
            return $rest_api_tb; //RestAPI::all();
        } else {
            return false;
        }
    }

    //OK
    public function destroy($id)
    {
        RestAPI::destroy($id);
    }
}
