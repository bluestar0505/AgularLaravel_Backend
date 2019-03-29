<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        if (Schema::hasTable('users') == false) {
            Schema::create('users', function (Blueprint $table) {
                $table->increments('id');
                $table->string('username');
                $table->string('email')->unique();
                $table->string('password', 60);
                $table->string('firstname', 100)->nullable();;
                $table->string('lastname', 100)->nullable();
                $table->enum('role', ['admin', 'user']);
                $table->string('accessToken',60);
                //$table->rememberToken();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('apps') == false) {
            Schema::create('apps', function (Blueprint $table) {
                $table->increments('id');
                $table->string('user_id');
                $table->string('name');
                $table->enum('platform', ['ios','android','windows','web']);
                $table->text('description')->nullable();

            });
        }

        if (Schema::hasTable('ads') == false) {
            Schema::create('ads', function (Blueprint $table) {
                $table->increments('id');
                $table->string('app_id');
                $table->string('name');
                $table->enum('placement', ['top','right','bottom','left','popup','full'])->nullable();
                $table->integer('width');
                $table->integer('height');
                $table->enum('type', ['image','video','gif'])->nullable();
                $table->string('url')->nullable();
                $table->string('openLink')->nullable();
                $table->string('tags', 255)->nullable();

            });
        }

        if (Schema::hasTable('tokens') == false) {
            Schema::create('tokens', function (Blueprint $table) {
                $table->increments('id');
                $table->string('app_id');
                $table->string('name');
                $table->string('token');
                $table->integer('issuer_id');
            });
        }

        if (Schema::hasTable('events') == false) {
            Schema::create('events', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('app_id');
                $table->integer('ads_id');
                $table->string('appToken');
                $table->enum('event', ['view','open']);
                $table->timestamp('timestamp');
            });
        }

        $composer = json_decode(file_get_contents(base_path('LabelPool.json')), true);
        $_SESSION['_LabelConfig'] = $composer;
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
