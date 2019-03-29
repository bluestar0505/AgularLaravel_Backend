<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $table = 'tokens';
    protected $casts = ['issuer'=>'string'];
    public $timestamps = false;

    public function app(){
        return $this->belongsTo('app\Models\App');
    }

    public function issuer(){
        return $this->belongsTo('app\Models\User');
    }
}