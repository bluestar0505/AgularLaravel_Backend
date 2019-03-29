<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $table = 'ads';
    protected $casts = ['id'=>'string'];
    public $timestamps = false;

    public function app(){
        return $this->belongsTo('\App\Models\App');
    }
}