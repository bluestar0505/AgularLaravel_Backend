<?php

namespace App\Http\Controllers;

use App\Models\App;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class FileUploadController extends BaseController
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function upload(Request $request)
    {
        if (!empty($_FILES)) {
            $tempPath = $_FILES['file']['tmp_name'];
            $uploadPath = $_FILES['file']['name'];

            move_uploaded_file('uploads' . DIRECTORY_SEPARATOR . $uploadPath, 'uploads' . DIRECTORY_SEPARATOR . $uploadPath);

            $answer = array('answer' => 'File transfer completed');
            $json = json_encode($answer);

            echo $json;

        } else {
            echo 'No files';
        }
        //Storage::put('/uploads/'.$_FILES[ 'file' ][ 'name' ], $_FILES[ 'file' ][ 'tmp_name' ]);
    }

}
