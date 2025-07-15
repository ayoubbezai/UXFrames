<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //

    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
        'price',
        'status',
        'logo_url',
        'figma_url',
        'docs_url',
        'live_url',
        'other_url',
    ];

    public function categories()
{
    return $this->hasMany(Category::class);
}

    public function screens(){
        return $this->hasMany(Screen::class);
    }
}
