<?php

namespace App\Http\Controllers;

use App\Models\App;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class LabelController extends BaseController
{
    public function getLabelPool(Request $request)
    {
        $composer = json_decode(file_get_contents(base_path('LabelPool.json')), true);
        return $composer;
    }
}
