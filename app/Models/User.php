<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    public function applications(){
        return $this->hasMany('App\Models\Application');
    }
    public function apptokens(){
        return $this->hasMany('App\Models\Token');
    }
}