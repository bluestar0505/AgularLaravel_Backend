<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    protected $table = 'apps';
    protected $casts = ['id'=>'string'];
    public $timestamps = false;

    public function ads(){
        return $this->hasMany('\App\Models\Ad');
    }
    public function user(){
        return $this->belongsTo('\App\Models\User');
    }
    public function tokens(){
        return $this->hasMany('\App\Models\Token');
    }
}