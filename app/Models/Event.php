<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    protected $casts = ['app_d'=>'string','ads_id'=>'string'];
    public $timestamps = false;

   /* public function app(){
        return $this->belongsTo('\App\Models\App');
    }*/
}