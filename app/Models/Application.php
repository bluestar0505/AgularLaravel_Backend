<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $table = 'applications';
    public $timestamps = false;

    public function user(){
        $this->belongsTo('App\Models\User');
    }
}